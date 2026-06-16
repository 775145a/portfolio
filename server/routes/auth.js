const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/auth');
const db = require('../db');

const router = express.Router();

router.post('/login', (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) return res.status(400).json({ error: 'Validation', message: 'يرجى إدخال اسم المستخدم وكلمة المرور' });
        const d = db.getDb();
        const users = d.exec("SELECT * FROM users WHERE username = ? AND active = 1", [username]);
        if (users.length === 0 || users[0].values.length === 0) {
            return res.status(401).json({ error: 'Auth', message: 'اسم المستخدم أو كلمة المرور غير صحيحة' });
        }
        const cols = users[0].columns;
        const vals = users[0].values[0];
        const u = {};
        cols.forEach((c, i) => u[c] = vals[i]);
        const valid = bcrypt.compareSync(password, u.password_hash);
        if (!valid) return res.status(401).json({ error: 'Auth', message: 'اسم المستخدم أو كلمة المرور غير صحيحة' });
        const token = jwt.sign({ id: u.id, username: u.username, role: u.role, display_name: u.display_name, branch_id: u.branch_id }, JWT_SECRET, { expiresIn: '24h' });
        d.run("UPDATE users SET last_login = datetime('now') WHERE id = ?", [u.id]);
        db.saveDb();
        db.log(u.id, 'login', 'user', u.id, 'تسجيل دخول');
        res.json({
            token,
            user: { id: u.id, username: u.username, role: u.role, display_name: u.display_name, branch_id: u.branch_id }
        });
    } catch (e) {
        console.error('Login error:', e);
        res.status(500).json({ error: 'Server', message: 'خطأ في الخادم' });
    }
});

router.post('/register', (req, res) => {
    try {
        const { username, password, display_name, role, branch_id, admin_password } = req.body;
        if (!username || !password || !display_name) return res.status(400).json({ error: 'Validation', message: 'جميع الحقول مطلوبة' });
        const d = db.getDb();
        const check = d.exec("SELECT id FROM users WHERE username = ?", [username]);
        if (check.length > 0 && check[0].values.length > 0) {
            return res.status(409).json({ error: 'Conflict', message: 'اسم المستخدم موجود بالفعل' });
        }
        let userRole = 'cashier';
        if (role && role !== 'cashier') {
            if (!admin_password) return res.status(403).json({ error: 'Auth', message: 'كلمة مرور المدير مطلوبة لإنشاء هذا النوع من المستخدمين' });
            const adminUsers = d.exec("SELECT password_hash FROM users WHERE role = 'admin' AND active = 1 LIMIT 1");
            if (adminUsers.length > 0 && adminUsers[0].values.length > 0) {
                const adminHash = adminUsers[0].values[0][0];
                if (!bcrypt.compareSync(admin_password, adminHash)) {
                    return res.status(403).json({ error: 'Auth', message: 'كلمة مرور المدير غير صحيحة' });
                }
            }
            userRole = role;
        }
        const hash = bcrypt.hashSync(password, 10);
        d.run("INSERT INTO users (username, password_hash, display_name, role, branch_id) VALUES (?,?,?,?,?)",
            [username, hash, display_name, userRole, branch_id || 1]);
        db.saveDb();
        res.json({ success: true, message: 'تم إنشاء المستخدم بنجاح' });
    } catch (e) {
        console.error('Register error:', e);
        res.status(500).json({ error: 'Server', message: 'خطأ في الخادم' });
    }
});

router.get('/me', require('../middleware/auth').auth, (req, res) => {
    res.json({ user: req.user });
});

module.exports = router;
