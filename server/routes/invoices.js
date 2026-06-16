const express = require('express');
const db = require('../db');
const { auth, roles } = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.get('/', (req, res) => {
    try {
        const d = db.getDb();
        const { start_date, end_date, user_id, customer_id, status, limit } = req.query;
        let sql = "SELECT i.*, u.display_name as user_name, c.name as customer_name FROM invoices i LEFT JOIN users u ON i.user_id = u.id LEFT JOIN customers c ON i.customer_id = c.id WHERE 1=1";
        const binds = [];
        if (start_date) { sql += " AND i.created_at >= ?"; binds.push(start_date); }
        if (end_date) { sql += " AND i.created_at <= ?"; binds.push(end_date); }
        if (user_id) { sql += " AND i.user_id = ?"; binds.push(parseInt(user_id)); }
        if (customer_id) { sql += " AND i.customer_id = ?"; binds.push(parseInt(customer_id)); }
        if (status) { sql += " AND i.status = ?"; binds.push(status); }
        sql += " ORDER BY i.created_at DESC";
        if (limit) sql += ` LIMIT ${parseInt(limit)}`;
        const r = d.exec(sql, binds);
        const cols = r[0] ? r[0].columns : [];
        const list = r[0] ? r[0].values.map(v => { const o = {}; cols.forEach((c,i) => o[c]=v[i]); return o; }) : [];
        for (const inv of list) {
            const items = d.exec("SELECT * FROM invoice_items WHERE invoice_id = ?", [inv.id]);
            const icols = items[0] ? items[0].columns : [];
            inv.items = items[0] ? items[0].values.map(v => { const o = {}; icols.forEach((c,i) => o[c]=v[i]); return o; }) : [];
        }
        res.json(list);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/:id', (req, res) => {
    try {
        const d = db.getDb();
        const r = d.exec("SELECT i.*, u.display_name as user_name, c.name as customer_name FROM invoices i LEFT JOIN users u ON i.user_id = u.id LEFT JOIN customers c ON i.customer_id = c.id WHERE i.id = ?", [parseInt(req.params.id)]);
        if (!r[0]) return res.status(404).json({ error: 'Not found' });
        const cols = r[0].columns;
        const vals = r[0].values[0];
        const inv = {}; cols.forEach((c,i) => inv[c]=vals[i]);
        const items = d.exec("SELECT * FROM invoice_items WHERE invoice_id = ?", [inv.id]);
        const icols = items[0] ? items[0].columns : [];
        inv.items = items[0] ? items[0].values.map(v => { const o = {}; icols.forEach((c,i) => o[c]=v[i]); return o; }) : [];
        res.json(inv);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/', (req, res) => {
    try {
        const { customer_id, items, discount: discountVal, tax_rate, paid: paidVal, payment_method, notes } = req.body;
        if (!items || items.length === 0) return res.status(400).json({ error: 'Validation', message: 'الفاتورة فارغة' });
        const d = db.getDb();
        const invNum = 'INV-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
        let subtotal = 0;
        const tRate = tax_rate !== undefined ? parseFloat(tax_rate) : 14;
        for (const item of items) {
            const med = d.exec("SELECT * FROM medicines WHERE id = ? AND active = 1", [item.medicine_id]);
            if (!med[0] || !med[0].values[0]) return res.status(400).json({ error: `الدواء رقم ${item.medicine_id} غير موجود` });
            const mcols = med[0].columns;
            const mvals = med[0].values[0];
            const medData = {}; mcols.forEach((c,i) => medData[c]=mvals[i]);
            const qty = parseInt(item.qty) || 1;
            if (medData.qty < qty) return res.status(400).json({ error: `الكمية غير متوفرة لـ ${medData.name}` });
            const total = (parseFloat(item.price || medData.sell_price) * qty);
            subtotal += total;
        }
        const disc = parseFloat(discountVal) || 0;
        const netAfterDiscount = Math.max(0, subtotal - disc);
        const tax = netAfterDiscount * (tRate / 100);
        const net = netAfterDiscount + tax;
        const paid = parseFloat(paidVal) || net;
        const change = Math.max(0, paid - net);
        d.run("INSERT INTO invoices (invoice_number, customer_id, user_id, branch_id, subtotal, discount, tax, net, paid, change_amount, payment_method, notes) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
            [invNum, customer_id || null, req.user.id, req.user.branch_id || 1, subtotal, discount, tax, net, paid, change, payment_method || 'cash', notes || '']);
        const invId = d.exec("SELECT last_insert_rowid() as id")[0].values[0][0];
        for (const item of items) {
            const med = d.exec("SELECT * FROM medicines WHERE id = ?", [item.medicine_id])[0];
            const mcols = med.columns; const mvals = med.values[0];
            const medData = {}; mcols.forEach((c,i) => medData[c]=mvals[i]);
            const qty = parseInt(item.qty) || 1;
            const price = parseFloat(item.price || medData.sell_price);
            const total = price * qty;
            d.run("INSERT INTO invoice_items (invoice_id, medicine_id, name, price, qty, total) VALUES (?,?,?,?,?,?)",
                [invId, item.medicine_id, medData.name, price, qty, total]);
            d.run("UPDATE medicines SET qty = qty - ?, updated_at = datetime('now') WHERE id = ?", [qty, item.medicine_id]);
            d.run("INSERT INTO inventory_movements (medicine_id, type, qty, reference, user_id) VALUES (?,?,?,?,?)",
                [item.medicine_id, 'out', qty, `فاتورة #${invId}`, req.user.id]);
        }
        if (customer_id) {
            d.run("UPDATE customers SET total_spent = total_spent + ?, last_purchase = datetime('now'), points = points + ? WHERE id = ?",
                [net, Math.floor(net / 10), customer_id]);
        }
        db.saveDb();
        db.log(req.user.id, 'create_invoice', 'invoice', invId, `فاتورة مبيعات #${invId} بقيمة ${net}`);
        res.json({ success: true, id: invId, invoice_number: invNum, net, change });
    } catch (e) { console.error('Invoice error:', e); res.status(500).json({ error: e.message }); }
});

router.post('/:id/cancel', roles('admin','manager'), (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { reason } = req.body;
        const d = db.getDb();
        const inv = d.exec("SELECT * FROM invoices WHERE id = ?", [id]);
        if (!inv[0]) return res.status(404).json({ error: 'Not found' });
        if (inv[0].values[0][inv[0].columns.indexOf('status')] !== 'completed') return res.status(400).json({ error: 'الفاتورة ملغية بالفعل' });
        const items = d.exec("SELECT * FROM invoice_items WHERE invoice_id = ?", [id]);
        if (items[0]) {
            const icols = items[0].columns;
            items[0].values.forEach(v => {
                const item = {}; icols.forEach((c,i) => item[c]=v[i]);
                d.run("UPDATE medicines SET qty = qty + ? WHERE id = ?", [item.qty, item.medicine_id]);
                d.run("INSERT INTO inventory_movements (medicine_id, type, qty, reference, user_id) VALUES (?,?,?,?,?)",
                    [item.medicine_id, 'return', item.qty, `إلغاء فاتورة #${id}`, req.user.id]);
            });
        }
        d.run("UPDATE invoices SET status = 'cancelled', cancel_reason = ? WHERE id = ?", [reason || 'إلغاء يدوي', id]);
        db.saveDb();
        db.log(req.user.id, 'cancel_invoice', 'invoice', id, `إلغاء فاتورة #${id}: ${reason||''}`);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/:id/return', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { items, reason } = req.body;
        const d = db.getDb();
        const inv = d.exec("SELECT * FROM invoices WHERE id = ?", [id]);
        if (!inv[0]) return res.status(404).json({ error: 'Not found' });
        const returnNum = 'RET-' + Date.now();
        d.run("INSERT INTO returns (return_number, invoice_id, user_id, reason) VALUES (?,?,?,?)", [returnNum, id, req.user.id, reason||'']);
        const returnId = d.exec("SELECT last_insert_rowid() as id")[0].values[0][0];
        let totalReturn = 0;
        const existingItems = d.exec("SELECT * FROM invoice_items WHERE invoice_id = ?", [id]);
        const eicols = existingItems[0] ? existingItems[0].columns : [];
        const existingMap = {};
        if (existingItems[0]) {
            existingItems[0].values.forEach(v => {
                const item = {}; eicols.forEach((c,i) => item[c]=v[i]);
                existingMap[item.medicine_id] = item;
            });
        }
        const returnItems = items || (existingItems[0] ? existingItems[0].values.map(v => {
            const item = {}; eicols.forEach((c,i) => item[c]=v[i]);
            return { medicine_id: item.medicine_id, qty: item.qty, price: item.price };
        }) : []);
        for (const ri of returnItems) {
            const qty = parseInt(ri.qty) || 1;
            const price = parseFloat(ri.price) || 0;
            const total = price * qty;
            totalReturn += total;
            const med = d.exec("SELECT name FROM medicines WHERE id = ?", [ri.medicine_id]);
            const name = med[0] ? med[0].values[0][0] : 'غير معروف';
            d.run("INSERT INTO return_items (return_id, medicine_id, name, qty, price, total) VALUES (?,?,?,?,?,?)",
                [returnId, ri.medicine_id, name, qty, price, total]);
            d.run("UPDATE medicines SET qty = qty + ? WHERE id = ?", [qty, ri.medicine_id]);
            d.run("INSERT INTO inventory_movements (medicine_id, type, qty, reference, user_id) VALUES (?,?,?,?,?)",
                [ri.medicine_id, 'return', qty, `مرتجع فاتورة #${id}`, req.user.id]);
        }
        d.run("UPDATE invoices SET status = 'returned' WHERE id = ?", [id]);
        d.run("UPDATE returns SET total = ? WHERE id = ?", [totalReturn, returnId]);
        db.saveDb();
        db.log(req.user.id, 'return_invoice', 'invoice', id, `مرتجع فاتورة #${id} بقيمة ${totalReturn}`);
        res.json({ success: true, return_id: returnId, total: totalReturn });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
