const express = require('express');
const db = require('../db');
const { auth, roles } = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.get('/', (req, res) => {
    try {
        const d = db.getDb();
        const { search } = req.query;
        let sql = "SELECT * FROM customers WHERE 1=1";
        const binds = [];
        if (search) { sql += " AND (name LIKE ? OR phone LIKE ?)"; const s = `%${search}%`; binds.push(s, s); }
        sql += " ORDER BY name";
        const r = d.exec(sql, binds);
        const cols = r[0] ? r[0].columns : [];
        const list = r[0] ? r[0].values.map(v => { const o = {}; cols.forEach((c,i) => o[c]=v[i]); return o; }) : [];
        res.json(list);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/:id', (req, res) => {
    try {
        const d = db.getDb();
        const r = d.exec("SELECT * FROM customers WHERE id = ?", [parseInt(req.params.id)]);
        if (!r[0]) return res.status(404).json({ error: 'Not found' });
        const cols = r[0].columns;
        const vals = r[0].values[0];
        const o = {}; cols.forEach((c,i) => o[c]=vals[i]);
        const invoices = d.exec("SELECT i.*, u.display_name as user_name FROM invoices i LEFT JOIN users u ON i.user_id = u.id WHERE i.customer_id = ? ORDER BY i.created_at DESC", [o.id]);
        const icols = invoices[0] ? invoices[0].columns : [];
        o.invoices = invoices[0] ? invoices[0].values.map(v => { const iv = {}; icols.forEach((c,i) => iv[c]=v[i]); return iv; }) : [];
        res.json(o);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/', (req, res) => {
    try {
        const { name, phone, email, address, notes } = req.body;
        if (!name) return res.status(400).json({ error: 'Validation', message: 'اسم العميل مطلوب' });
        const d = db.getDb();
        d.run("INSERT INTO customers (name, phone, email, address, notes) VALUES (?,?,?,?,?)",
            [name, phone||'', email||'', address||'', notes||'']);
        db.saveDb();
        db.log(req.user.id, 'create_customer', 'customer', null, `إضافة عميل: ${name}`);
        res.json({ success: true, id: d.exec("SELECT last_insert_rowid() as id")[0].values[0][0] });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/:id', (req, res) => {
    try {
        const fields = ['name','phone','email','address','notes','points','debt'];
        const sets = []; const binds = [];
        fields.forEach(f => {
            if (req.body[f] !== undefined) { sets.push(`${f} = ?`); binds.push(req.body[f]); }
        });
        if (sets.length === 0) return res.status(400).json({ error: 'No changes' });
        binds.push(parseInt(req.params.id));
        const d = db.getDb();
        d.run(`UPDATE customers SET ${sets.join(',')} WHERE id = ?`, binds);
        db.saveDb();
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/:id', roles('admin','manager'), (req, res) => {
    try {
        const d = db.getDb();
        d.run("DELETE FROM customers WHERE id = ?", [parseInt(req.params.id)]);
        db.saveDb();
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/:id/payment', (req, res) => {
    try {
        const { amount, type, notes } = req.body;
        if (!amount || amount <= 0) return res.status(400).json({ error: 'Validation', message: 'المبلغ مطلوب' });
        const id = parseInt(req.params.id);
        const d = db.getDb();
        const payType = type || 'payment';
        d.run("INSERT INTO customer_payments (customer_id, amount, type, user_id, notes) VALUES (?,?,?,?,?)",
            [id, amount, payType, req.user.id, notes||'']);
        if (payType === 'payment') {
            d.run("UPDATE customers SET debt = MAX(0, debt - ?) WHERE id = ?", [amount, id]);
        } else {
            d.run("UPDATE customers SET debt = debt + ? WHERE id = ?", [amount, id]);
        }
        db.saveDb();
        db.log(req.user.id, 'customer_payment', 'customer', id, `دفعة عميل: ${amount} ${payType}`);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/:id/statement', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const d = db.getDb();
        const invoices = d.exec("SELECT id, invoice_number, net, created_at, status FROM invoices WHERE customer_id = ? ORDER BY created_at DESC", [id]);
        const icols = invoices[0] ? invoices[0].columns : [];
        const invList = invoices[0] ? invoices[0].values.map(v => { const o = {}; icols.forEach((c,i) => o[c]=v[i]); return o; }) : [];
        const payments = d.exec("SELECT * FROM customer_payments WHERE customer_id = ? ORDER BY created_at DESC", [id]);
        const pcols = payments[0] ? payments[0].columns : [];
        const payList = payments[0] ? payments[0].values.map(v => { const o = {}; pcols.forEach((c,i) => o[c]=v[i]); return o; }) : [];
        res.json({ invoices: invList, payments: payList });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
