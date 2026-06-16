const express = require('express');
const db = require('../db');
const { auth, roles } = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.get('/', (req, res) => {
    try {
        const d = db.getDb();
        if (req.user.role !== 'admin') {
            const r = d.exec("SELECT * FROM branches WHERE id = ?", [req.user.branch_id || 1]);
            const cols = r[0] ? r[0].columns : [];
            const list = r[0] ? r[0].values.map(v => { const o = {}; cols.forEach((c,i) => o[c]=v[i]); return o; }) : [];
            return res.json(list);
        }
        const r = d.exec("SELECT * FROM branches ORDER BY name");
        const cols = r[0] ? r[0].columns : [];
        const list = r[0] ? r[0].values.map(v => { const o = {}; cols.forEach((c,i) => o[c]=v[i]); return o; }) : [];
        res.json(list);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/', roles('admin'), (req, res) => {
    try {
        const { name, address, phone } = req.body;
        if (!name) return res.status(400).json({ error: 'Validation' });
        const d = db.getDb();
        d.run("INSERT INTO branches (name, address, phone) VALUES (?,?,?)", [name, address||'', phone||'']);
        db.saveDb();
        res.json({ success: true, id: d.exec("SELECT last_insert_rowid() as id")[0].values[0][0] });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/:id', roles('admin'), (req, res) => {
    try {
        const fields = ['name','address','phone','active'];
        const sets = []; const binds = [];
        fields.forEach(f => { if (req.body[f] !== undefined) { sets.push(`${f} = ?`); binds.push(req.body[f]); } });
        if (sets.length === 0) return res.status(400).json({ error: 'No changes' });
        binds.push(parseInt(req.params.id));
        const d = db.getDb();
        d.run(`UPDATE branches SET ${sets.join(',')} WHERE id = ?`, binds);
        db.saveDb();
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
