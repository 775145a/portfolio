const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');
const { auth, roles } = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.get('/', roles('admin','manager'), (req, res) => {
    try {
        const d = db.getDb();
        const users = d.exec("SELECT id, username, display_name, role, branch_id, active, last_login, created_at FROM users ORDER BY id");
        const cols = users[0] ? users[0].columns : [];
        const list = users[0] ? users[0].values.map(v => { const o = {}; cols.forEach((c,i) => o[c]=v[i]); return o; }) : [];
        res.json(list);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/', roles('admin'), (req, res) => {
    try {
        const { username, password, display_name, role, branch_id } = req.body;
        if (!username || !password || !display_name) return res.status(400).json({ error: 'Validation', message: 'جميع الحقول مطلوبة' });
        const d = db.getDb();
        const check = d.exec("SELECT id FROM users WHERE username = ?", [username]);
        if (check.length > 0 && check[0].values.length > 0) return res.status(409).json({ error: 'Duplicate', message: 'اسم المستخدم موجود' });
        const hash = bcrypt.hashSync(password, 10);
        d.run("INSERT INTO users (username, password_hash, display_name, role, branch_id) VALUES (?,?,?,?,?)", [username, hash, display_name, role||'cashier', branch_id||1]);
        db.saveDb();
        db.log(req.user.id, 'create_user', 'user', null, `إنشاء مستخدم: ${username}`);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/:id', roles('admin'), (req, res) => {
    try {
        const { display_name, role, active, branch_id, password } = req.body;
        const d = db.getDb();
        const sets = [];
        const binds = [];
        if (display_name !== undefined) { sets.push("display_name = ?"); binds.push(display_name); }
        if (role !== undefined) { sets.push("role = ?"); binds.push(role); }
        if (active !== undefined) { sets.push("active = ?"); binds.push(active ? 1 : 0); }
        if (branch_id !== undefined) { sets.push("branch_id = ?"); binds.push(branch_id); }
        if (password) { sets.push("password_hash = ?"); binds.push(bcrypt.hashSync(password, 10)); }
        if (sets.length === 0) return res.status(400).json({ error: 'No changes' });
        binds.push(req.params.id);
        d.run(`UPDATE users SET ${sets.join(',')} WHERE id = ?`, binds);
        db.saveDb();
        db.log(req.user.id, 'update_user', 'user', parseInt(req.params.id), `تحديث مستخدم`);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/:id', roles('admin'), (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (id === 1) return res.status(400).json({ error: 'Cannot delete admin' });
        const d = db.getDb();
        d.run("UPDATE users SET active = 0 WHERE id = ?", [id]);
        db.saveDb();
        db.log(req.user.id, 'deactivate_user', 'user', id, 'تعطيل مستخدم');
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
