const express = require('express');
const db = require('../db');
const { auth, roles } = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.get('/', (req, res) => {
    try {
        const d = db.getDb();
        const { start_date, end_date, supplier_id } = req.query;
        let sql = "SELECT p.*, s.name as supplier_name, u.display_name as user_name FROM purchases p LEFT JOIN suppliers s ON p.supplier_id = s.id LEFT JOIN users u ON p.user_id = u.id WHERE 1=1";
        const binds = [];
        if (start_date) { sql += " AND p.created_at >= ?"; binds.push(start_date); }
        if (end_date) { sql += " AND p.created_at <= ?"; binds.push(end_date); }
        if (supplier_id) { sql += " AND p.supplier_id = ?"; binds.push(parseInt(supplier_id)); }
        sql += " ORDER BY p.created_at DESC";
        const r = d.exec(sql, binds);
        const cols = r[0] ? r[0].columns : [];
        const list = r[0] ? r[0].values.map(v => { const o = {}; cols.forEach((c,i) => o[c]=v[i]); return o; }) : [];
        for (const p of list) {
            const items = d.exec("SELECT * FROM purchase_items WHERE purchase_id = ?", [p.id]);
            const icols = items[0] ? items[0].columns : [];
            p.items = items[0] ? items[0].values.map(v => { const o = {}; icols.forEach((c,i) => o[c]=v[i]); return o; }) : [];
        }
        res.json(list);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/', roles('admin','manager','accountant'), (req, res) => {
    try {
        const { supplier_id, items, discount: discountVal, tax_rate, notes } = req.body;
        if (!items || items.length === 0) return res.status(400).json({ error: 'Validation', message: 'فاتورة الشراء فارغة' });
        const d = db.getDb();
        const poNum = 'PO-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
        let subtotal = 0;
        const tRate = tax_rate !== undefined ? parseFloat(tax_rate) : 14;
        for (const item of items) {
            const qty = parseInt(item.qty) || 1;
            const price = parseFloat(item.buy_price) || 0;
            subtotal += price * qty;
        }
        const disc = parseFloat(discountVal) || 0;
        const netAfterDiscount = Math.max(0, subtotal - disc);
        const tax = netAfterDiscount * (tRate / 100);
        const net = netAfterDiscount + tax;
        d.run("INSERT INTO purchases (purchase_number, supplier_id, user_id, branch_id, subtotal, discount, tax, net, notes) VALUES (?,?,?,?,?,?,?,?,?)",
            [poNum, supplier_id || null, req.user.id, req.user.branch_id || 1, subtotal, discount, tax, net, notes || '']);
        const poId = d.exec("SELECT last_insert_rowid() as id")[0].values[0][0];
        for (const item of items) {
            const qty = parseInt(item.qty) || 1;
            const price = parseFloat(item.buy_price) || 0;
            const total = price * qty;
            d.run("INSERT INTO purchase_items (purchase_id, medicine_id, name, buy_price, qty, total, expiry_date, batch_number) VALUES (?,?,?,?,?,?,?,?)",
                [poId, item.medicine_id || null, item.name || '', price, qty, total, item.expiry_date || '', item.batch_number || '']);
            if (item.medicine_id) {
                const existing = d.exec("SELECT id FROM medicines WHERE id = ?", [item.medicine_id]);
                if (existing[0]) {
                    d.run("UPDATE medicines SET qty = qty + ?, buy_price = CASE WHEN ? > 0 THEN ? ELSE buy_price END, updated_at = datetime('now') WHERE id = ?",
                        [qty, price, price, item.medicine_id]);
                    if (item.expiry_date) d.run("UPDATE medicines SET expiry_date = ? WHERE id = ?", [item.expiry_date, item.medicine_id]);
                    if (item.batch_number) d.run("UPDATE medicines SET batch_number = ? WHERE id = ?", [item.batch_number, item.medicine_id]);
                }
            } else if (item.name) {
                d.run("INSERT INTO medicines (name, buy_price, sell_price, qty, expiry_date, batch_number) VALUES (?,?,?,?,?,?)",
                    [item.name, price, price * 1.3, qty, item.expiry_date || '', item.batch_number || '']);
            }
            d.run("INSERT INTO inventory_movements (medicine_id, type, qty, reference, user_id) VALUES (?,?,?,?,?)",
                [item.medicine_id || null, 'in', qty, `فاتورة شراء #${poId}`, req.user.id]);
        }
        db.saveDb();
        db.log(req.user.id, 'create_purchase', 'purchase', poId, `فاتورة شراء #${poId} بقيمة ${net}`);
        res.json({ success: true, id: poId, purchase_number: poNum, net });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/:id/cancel', roles('admin','manager'), (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const d = db.getDb();
        const po = d.exec("SELECT * FROM purchases WHERE id = ?", [id]);
        if (!po[0]) return res.status(404).json({ error: 'Not found' });
        const items = d.exec("SELECT * FROM purchase_items WHERE purchase_id = ?", [id]);
        if (items[0]) {
            const icols = items[0].columns;
            items[0].values.forEach(v => {
                const item = {}; icols.forEach((c,i) => item[c]=v[i]);
                if (item.medicine_id) d.run("UPDATE medicines SET qty = MAX(0, qty - ?) WHERE id = ?", [item.qty, item.medicine_id]);
            });
        }
        d.run("UPDATE purchases SET status = 'cancelled' WHERE id = ?", [id]);
        db.saveDb();
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
