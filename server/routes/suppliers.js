const express = require('express');
const db = require('../db');
const { auth, roles } = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.get('/', (req, res) => {
    try {
        const d = db.getDb();
        const r = d.exec("SELECT s.*, (SELECT COUNT(*) FROM medicines WHERE supplier_id = s.id AND active = 1) as medicine_count FROM suppliers s ORDER BY s.name");
        const cols = r[0] ? r[0].columns : [];
        const list = r[0] ? r[0].values.map(v => { const o = {}; cols.forEach((c,i) => o[c]=v[i]); return o; }) : [];
        res.json(list);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/:id', (req, res) => {
    try {
        const d = db.getDb();
        const r = d.exec("SELECT s.*, (SELECT COUNT(*) FROM medicines WHERE supplier_id = s.id AND active = 1) as medicine_count FROM suppliers s WHERE s.id = ?", [parseInt(req.params.id)]);
        if (!r[0]) return res.status(404).json({ error: 'Not found' });
        const cols = r[0].columns; const vals = r[0].values[0];
        const o = {}; cols.forEach((c,i) => o[c]=vals[i]);
        const meds = d.exec("SELECT id, name, buy_price, sell_price, qty FROM medicines WHERE supplier_id = ? AND active = 1", [o.id]);
        const mcols = meds[0] ? meds[0].columns : [];
        o.medicines = meds[0] ? meds[0].values.map(v => { const m = {}; mcols.forEach((c,i) => m[c]=v[i]); return m; }) : [];
        const purchases = d.exec("SELECT * FROM purchases WHERE supplier_id = ? ORDER BY created_at DESC LIMIT 20", [o.id]);
        const pcols = purchases[0] ? purchases[0].columns : [];
        o.purchases = purchases[0] ? purchases[0].values.map(v => { const p = {}; pcols.forEach((c,i) => p[c]=v[i]); return p; }) : [];
        res.json(o);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/', roles('admin','manager','accountant'), (req, res) => {
    try {
        const { name, phone, email, address, notes } = req.body;
        if (!name) return res.status(400).json({ error: 'Validation', message: 'اسم المورد مطلوب' });
        const d = db.getDb();
        d.run("INSERT INTO suppliers (name, phone, email, address, notes) VALUES (?,?,?,?,?)",
            [name, phone||'', email||'', address||'', notes||'']);
        db.saveDb();
        res.json({ success: true, id: d.exec("SELECT last_insert_rowid() as id")[0].values[0][0] });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/:id', roles('admin','manager','accountant'), (req, res) => {
    try {
        const fields = ['name','phone','email','address','notes','rating','active'];
        const sets = []; const binds = [];
        fields.forEach(f => { if (req.body[f] !== undefined) { sets.push(`${f} = ?`); binds.push(req.body[f]); } });
        if (sets.length === 0) return res.status(400).json({ error: 'No changes' });
        binds.push(parseInt(req.params.id));
        const d = db.getDb();
        d.run(`UPDATE suppliers SET ${sets.join(',')} WHERE id = ?`, binds);
        db.saveDb();
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/:id', roles('admin'), (req, res) => {
    try {
        const d = db.getDb();
        d.run("UPDATE suppliers SET active = 0 WHERE id = ?", [parseInt(req.params.id)]);
        db.saveDb();
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
