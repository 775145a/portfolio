const express = require('express');
const db = require('../db');
const { auth, roles } = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.get('/', roles('admin','manager'), (req, res) => {
    try {
        const d = db.getDb();
        const { entity_type, user_id, start_date, end_date, limit } = req.query;
        let sql = "SELECT l.*, u.display_name as user_name FROM activity_logs l LEFT JOIN users u ON l.user_id = u.id WHERE 1=1";
        const binds = [];
        if (entity_type) { sql += " AND l.entity_type = ?"; binds.push(entity_type); }
        if (user_id) { sql += " AND l.user_id = ?"; binds.push(parseInt(user_id)); }
        if (start_date) { sql += " AND l.created_at >= ?"; binds.push(start_date); }
        if (end_date) { sql += " AND l.created_at <= ?"; binds.push(end_date); }
        sql += " ORDER BY l.created_at DESC";
        if (limit) sql += ` LIMIT ${parseInt(limit)}`; else sql += " LIMIT 100";
        const r = d.exec(sql, binds);
        const cols = r[0] ? r[0].columns : [];
        const list = r[0] ? r[0].values.map(v => { const o = {}; cols.forEach((c,i) => o[c]=v[i]); return o; }) : [];
        res.json(list);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
