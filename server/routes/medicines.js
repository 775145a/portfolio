const express = require('express');
const db = require('../db');
const { auth, roles } = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.get('/', (req, res) => {
    try {
        const d = db.getDb();
        const { category, search, status } = req.query;
        let sql = "SELECT m.*, s.name as supplier_name FROM medicines m LEFT JOIN suppliers s ON m.supplier_id = s.id WHERE m.active = 1";
        const binds = [];
        if (category && category !== 'الكل') { sql += " AND m.category = ?"; binds.push(category); }
        if (search) { sql += " AND (m.name LIKE ? OR m.scientific_name LIKE ? OR m.barcode LIKE ? OR m.sku LIKE ?)"; const s = `%${search}%`; binds.push(s,s,s,s); }
        if (status === 'low') sql += " AND m.qty > 0 AND m.qty <= m.min_qty";
        else if (status === 'out') sql += " AND m.qty <= 0";
        sql += " ORDER BY m.name";
        const result = d.exec(sql, binds);
        const cols = result[0] ? result[0].columns : [];
        const list = result[0] ? result[0].values.map(v => { const o = {}; cols.forEach((c,i) => o[c]=v[i]); return o; }) : [];
        res.json(list);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/categories', (req, res) => {
    try {
        const d = db.getDb();
        const result = d.exec("SELECT DISTINCT category FROM medicines WHERE active = 1 AND category != '' ORDER BY category");
        const cats = result[0] ? result[0].values.map(v => v[0]) : [];
        res.json(cats);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/low-stock', (req, res) => {
    try {
        const d = db.getDb();
        const r = d.exec("SELECT * FROM medicines WHERE active = 1 AND qty > 0 AND qty <= min_qty ORDER BY qty ASC LIMIT 20");
        const cols = r[0] ? r[0].columns : [];
        const list = r[0] ? r[0].values.map(v => { const o = {}; cols.forEach((c,i) => o[c]=v[i]); return o; }) : [];
        res.json(list);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/expiring', (req, res) => {
    try {
        const d = db.getDb();
        const r = d.exec("SELECT * FROM medicines WHERE active = 1 AND expiry_date != '' AND date(expiry_date) <= date('now','+30 days') AND date(expiry_date) >= date('now') ORDER BY expiry_date ASC");
        const cols = r[0] ? r[0].columns : [];
        const list = r[0] ? r[0].values.map(v => { const o = {}; cols.forEach((c,i) => o[c]=v[i]); return o; }) : [];
        res.json(list);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/:id', (req, res) => {
    try {
        const d = db.getDb();
        const r = d.exec("SELECT m.*, s.name as supplier_name FROM medicines m LEFT JOIN suppliers s ON m.supplier_id = s.id WHERE m.id = ?", [parseInt(req.params.id)]);
        if (!r[0]) return res.status(404).json({ error: 'Not found' });
        const cols = r[0].columns;
        const vals = r[0].values[0];
        const o = {}; cols.forEach((c,i) => o[c]=vals[i]);
        res.json(o);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/', roles('admin','manager','accountant'), (req, res) => {
    try {
        const { name, scientific_name, category, sku, barcode, supplier_id, buy_price, sell_price, qty, min_qty, expiry_date, batch_number, rx } = req.body;
        if (!name) return res.status(400).json({ error: 'Validation', message: 'اسم الدواء مطلوب' });
        const d = db.getDb();
        d.run("INSERT INTO medicines (name, scientific_name, category, sku, barcode, supplier_id, buy_price, sell_price, qty, min_qty, expiry_date, batch_number, rx) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)",
            [name, scientific_name||'', category||'', sku||'', barcode||'', supplier_id||null, buy_price||0, sell_price||0, qty||0, min_qty||10, expiry_date||'', batch_number||'', rx||0]);
        db.saveDb();
        db.log(req.user.id, 'create_medicine', 'medicine', null, `إضافة دواء: ${name}`);
        res.json({ success: true, id: d.exec("SELECT last_insert_rowid() as id")[0].values[0][0] });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/:id', roles('admin','manager','accountant'), (req, res) => {
    try {
        const fields = ['name','scientific_name','category','sku','barcode','supplier_id','buy_price','sell_price','qty','min_qty','expiry_date','batch_number','rx','active'];
        const sets = []; const binds = [];
        req.body.updated_at = new Date().toISOString();
        fields.forEach(f => { if (req.body[f] !== undefined) { sets.push(`${f} = ?`); binds.push(req.body[f]); } });
        if (sets.length === 0) return res.status(400).json({ error: 'No changes' });
        binds.push(parseInt(req.params.id));
        const d = db.getDb();
        d.run(`UPDATE medicines SET ${sets.join(',')} WHERE id = ?`, binds);
        db.saveDb();
        db.log(req.user.id, 'update_medicine', 'medicine', parseInt(req.params.id), 'تحديث دواء');
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/:id', roles('admin','manager'), (req, res) => {
    try {
        const d = db.getDb();
        d.run("UPDATE medicines SET active = 0 WHERE id = ?", [parseInt(req.params.id)]);
        db.saveDb();
        db.log(req.user.id, 'delete_medicine', 'medicine', parseInt(req.params.id), 'حذف دواء');
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/:id/stock-adjust', roles('admin','manager','accountant'), (req, res) => {
    try {
        const { qty_change, notes } = req.body;
        if (!qty_change) return res.status(400).json({ error: 'Validation', message: 'الكمية مطلوبة' });
        const id = parseInt(req.params.id);
        const d = db.getDb();
        const old = d.exec("SELECT qty FROM medicines WHERE id = ?", [id]);
        if (!old[0] || !old[0].values[0]) return res.status(404).json({ error: 'Not found' });
        const oldQty = old[0].values[0][0];
        const newQty = oldQty + parseInt(qty_change);
        d.run("UPDATE medicines SET qty = ?, updated_at = datetime('now') WHERE id = ?", [Math.max(0, newQty), id]);
        d.run("INSERT INTO inventory_movements (medicine_id, type, qty, reference, user_id, notes) VALUES (?,?,?,?,?,?)",
            [id, qty_change > 0 ? 'in' : 'out', Math.abs(parseInt(qty_change)), 'manual', req.user.id, notes||'تعديل يدوي']);
        db.saveDb();
        db.log(req.user.id, 'stock_adjust', 'medicine', id, `تعديل مخزون: ${oldQty} → ${Math.max(0,newQty)}`);
        res.json({ success: true, new_qty: Math.max(0, newQty) });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
