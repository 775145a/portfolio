const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'valopos-dev-secret-change-in-production';

function auth(req, res, next) {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized', message: 'لم يتم تسجيل الدخول' });
    }
    try {
        const token = header.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (e) {
        return res.status(401).json({ error: 'Unauthorized', message: 'الجلسة منتهية، يرجى تسجيل الدخول مرة أخرى' });
    }
}

function roles(...allowed) {
    return (req, res, next) => {
        if (!req.user) return res.status(401).json({ error: 'Unauthorized', message: 'لم يتم تسجيل الدخول' });
        if (allowed.includes(req.user.role)) return next();
        return res.status(403).json({ error: 'Forbidden', message: 'ليس لديك صلاحية للوصول إلى هذه الميزة' });
    };
}

module.exports = { auth, roles, JWT_SECRET };
