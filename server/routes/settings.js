const express = require('express');
const db = require('../db');
const { auth, roles } = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.get('/', (req, res) => {
    try {
        const d = db.getDb();
        const r = d.exec("SELECT key, value FROM settings");
        const obj = {};
        if (r[0]) r[0].values.forEach(v => { obj[v[0]] = v[1]; });
        res.json(obj);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/', roles('admin','manager'), (req, res) => {
    try {
        const d = db.getDb();
        const allowed = ['pharmacy_name','address','phone','tax_rate','currency','receipt_footer','logo_url'];
        for (const key of Object.keys(req.body)) {
            if (allowed.includes(key)) {
                const exists = d.exec("SELECT id FROM settings WHERE key = ?", [key]);
                if (exists[0]) {
                    d.run("UPDATE settings SET value = ? WHERE key = ?", [String(req.body[key]), key]);
                } else {
                    d.run("INSERT INTO settings (key, value) VALUES (?,?)", [key, String(req.body[key])]);
                }
            }
        }
        db.saveDb();
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
