const express = require('express');
const db = require('../db');
const { auth, roles } = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.get('/sales/today', (req, res) => {
    try {
        const d = db.getDb();
        const r = d.exec("SELECT COALESCE(SUM(net),0) as total, COUNT(*) as count FROM invoices WHERE date(created_at) = date('now') AND status = 'completed'");
        res.json({ total: r[0].values[0][0], count: r[0].values[0][1] });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/sales/week', (req, res) => {
    try {
        const d = db.getDb();
        const r = d.exec("SELECT date(created_at) as day, COALESCE(SUM(net),0) as total, COUNT(*) as count FROM invoices WHERE created_at >= datetime('now','-7 days') AND status = 'completed' GROUP BY date(created_at) ORDER BY day");
        const cols = r[0] ? r[0].columns : [];
        const list = r[0] ? r[0].values.map(v => { const o = {}; cols.forEach((c,i) => o[c]=v[i]); return o; }) : [];
        res.json(list);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/sales/month', (req, res) => {
    try {
        const d = db.getDb();
        const r = d.exec("SELECT COALESCE(SUM(net),0) as total, COUNT(*) as count FROM invoices WHERE strftime('%Y-%m', created_at) = strftime('%Y-%m', 'now') AND status = 'completed'");
        res.json({ total: r[0].values[0][0], count: r[0].values[0][1] });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/sales/range', (req, res) => {
    try {
        const { start, end } = req.query;
        if (!start || !end) return res.status(400).json({ error: 'start and end required' });
        const d = db.getDb();
        const r = d.exec("SELECT COALESCE(SUM(net),0) as total, COUNT(*) as count FROM invoices WHERE date(created_at) >= ? AND date(created_at) <= ? AND status = 'completed'", [start, end]);
        const items = d.exec("SELECT ii.name, SUM(ii.qty) as total_qty, SUM(ii.total) as total_revenue FROM invoices i JOIN invoice_items ii ON i.id = ii.invoice_id WHERE date(i.created_at) >= ? AND date(i.created_at) <= ? AND i.status = 'completed' GROUP BY ii.name ORDER BY total_revenue DESC LIMIT 20", [start, end]);
        const icols = items[0] ? items[0].columns : [];
        const itemList = items[0] ? items[0].values.map(v => { const o = {}; icols.forEach((c,i) => o[c]=v[i]); return o; }) : [];
        res.json({ summary: { total: r[0].values[0][0], count: r[0].values[0][1] }, items: itemList });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/top-medicines', (req, res) => {
    try {
        const d = db.getDb();
        const r = d.exec("SELECT ii.medicine_id, ii.name, SUM(ii.qty) as total_qty, SUM(ii.total) as total_revenue FROM invoices i JOIN invoice_items ii ON i.id = ii.invoice_id WHERE i.status = 'completed' GROUP BY ii.medicine_id ORDER BY total_qty DESC LIMIT 10");
        const cols = r[0] ? r[0].columns : [];
        const list = r[0] ? r[0].values.map(v => { const o = {}; cols.forEach((c,i) => o[c]=v[i]); return o; }) : [];
        res.json(list);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/bottom-medicines', (req, res) => {
    try {
        const d = db.getDb();
        const r = d.exec("SELECT ii.medicine_id, ii.name, COALESCE(SUM(ii.qty),0) as total_qty, COALESCE(SUM(ii.total),0) as total_revenue FROM medicines m LEFT JOIN invoice_items ii ON m.id = ii.medicine_id LEFT JOIN invoices i ON ii.invoice_id = i.id AND i.status = 'completed' WHERE m.active = 1 GROUP BY m.id ORDER BY total_qty ASC LIMIT 10");
        const cols = r[0] ? r[0].columns : [];
        const list = r[0] ? r[0].values.map(v => { const o = {}; cols.forEach((c,i) => o[c]=v[i]); return o; }) : [];
        res.json(list);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/profits', (req, res) => {
    try {
        const { start, end } = req.query;
        const d = db.getDb();
        let sql = "SELECT COALESCE(SUM(ii.total - (ii.qty * COALESCE(m.buy_price,0))),0) as profit FROM invoices i JOIN invoice_items ii ON i.id = ii.invoice_id LEFT JOIN medicines m ON ii.medicine_id = m.id WHERE i.status = 'completed'";
        const binds = [];
        if (start) { sql += " AND date(i.created_at) >= ?"; binds.push(start); }
        if (end) { sql += " AND date(i.created_at) <= ?"; binds.push(end); }
        const r = d.exec(sql, binds);
        res.json({ profit: r[0].values[0][0] });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/dashboard', (req, res) => {
    try {
        const d = db.getDb();
        const todaySales = d.exec("SELECT COALESCE(SUM(net),0) as total, COUNT(*) as count FROM invoices WHERE date(created_at) = date('now') AND status = 'completed'");
        const monthSales = d.exec("SELECT COALESCE(SUM(net),0) as total, COUNT(*) as count FROM invoices WHERE strftime('%Y-%m', created_at) = strftime('%Y-%m', 'now') AND status = 'completed'");
        const medCount = d.exec("SELECT COUNT(*) as c FROM medicines WHERE active = 1")[0].values[0][0];
        const lowStock = d.exec("SELECT COUNT(*) as c FROM medicines WHERE active = 1 AND qty > 0 AND qty <= min_qty")[0].values[0][0];
        const outStock = d.exec("SELECT COUNT(*) as c FROM medicines WHERE active = 1 AND qty <= 0")[0].values[0][0];
        const expiring = d.exec("SELECT COUNT(*) as c FROM medicines WHERE active = 1 AND expiry_date != '' AND date(expiry_date) <= date('now','+30 days') AND date(expiry_date) >= date('now')")[0].values[0][0];
        const totalSales = d.exec("SELECT COALESCE(SUM(net),0) as total FROM invoices WHERE status = 'completed'")[0].values[0][0];
        const recentInvoices = d.exec("SELECT i.*, u.display_name as user_name FROM invoices i LEFT JOIN users u ON i.user_id = u.id ORDER BY i.created_at DESC LIMIT 10");
        const icols = recentInvoices[0] ? recentInvoices[0].columns : [];
        const recentList = recentInvoices[0] ? recentInvoices[0].values.map(v => { const o = {}; icols.forEach((c,i) => o[c]=v[i]); return o; }) : [];
        res.json({
            today_sales: todaySales[0].values[0][0],
            today_count: todaySales[0].values[0][1],
            month_sales: monthSales[0].values[0][0],
            month_count: monthSales[0].values[0][1],
            total_sales: totalSales,
            medicine_count: medCount,
            low_stock: lowStock,
            out_of_stock: outStock,
            expiring: expiring,
            recent_invoices: recentList
        });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/top-customers', (req, res) => {
    try {
        const d = db.getDb();
        const r = d.exec("SELECT id, name, total_spent, points FROM customers ORDER BY total_spent DESC LIMIT 10");
        const cols = r[0] ? r[0].columns : [];
        const list = r[0] ? r[0].values.map(v => { const o = {}; cols.forEach((c,i) => o[c]=v[i]); return o; }) : [];
        res.json(list);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/top-employees', (req, res) => {
    try {
        const d = db.getDb();
        const r = d.exec("SELECT u.id, u.display_name, COUNT(i.id) as invoice_count, COALESCE(SUM(i.net),0) as total_sales FROM users u LEFT JOIN invoices i ON u.id = i.user_id AND i.status = 'completed' AND strftime('%Y-%m', i.created_at) = strftime('%Y-%m', 'now') GROUP BY u.id ORDER BY total_sales DESC");
        const cols = r[0] ? r[0].columns : [];
        const list = r[0] ? r[0].values.map(v => { const o = {}; cols.forEach((c,i) => o[c]=v[i]); return o; }) : [];
        res.json(list);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/inventory-value', (req, res) => {
    try {
        const d = db.getDb();
        const r = d.exec("SELECT COALESCE(SUM(qty * buy_price),0) as cost_value, COALESCE(SUM(qty * sell_price),0) as sell_value FROM medicines WHERE active = 1");
        res.json({ cost_value: r[0].values[0][0], sell_value: r[0].values[0][1] });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/stock-movements', (req, res) => {
    try {
        const d = db.getDb();
        const r = d.exec("SELECT im.*, m.name as medicine_name, u.display_name as user_name FROM inventory_movements im LEFT JOIN medicines m ON im.medicine_id = m.id LEFT JOIN users u ON im.user_id = u.id ORDER BY im.created_at DESC LIMIT 50");
        const cols = r[0] ? r[0].columns : [];
        const list = r[0] ? r[0].values.map(v => { const o = {}; cols.forEach((c,i) => o[c]=v[i]); return o; }) : [];
        res.json(list);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/tax-report', (req, res) => {
    try {
        const { start, end } = req.query;
        const d = db.getDb();
        let sql = "SELECT date(created_at) as day, COALESCE(SUM(subtotal),0) as subtotal, COALESCE(SUM(discount),0) as discount, COALESCE(SUM(tax),0) as tax, COALESCE(SUM(net),0) as net FROM invoices WHERE status = 'completed'";
        const binds = [];
        if (start) { sql += " AND date(created_at) >= ?"; binds.push(start); }
        if (end) { sql += " AND date(created_at) <= ?"; binds.push(end); }
        sql += " GROUP BY date(created_at) ORDER BY day";
        const r = d.exec(sql, binds);
        const cols = r[0] ? r[0].columns : [];
        const list = r[0] ? r[0].values.map(v => { const o = {}; cols.forEach((c,i) => o[c]=v[i]); return o; }) : [];
        const totals = d.exec("SELECT COALESCE(SUM(subtotal),0) as subtotal, COALESCE(SUM(discount),0) as discount, COALESCE(SUM(tax),0) as tax, COALESCE(SUM(net),0) as net FROM invoices WHERE status = 'completed'" + (start && end ? " AND date(created_at) >= ? AND date(created_at) <= ?" : ""), (start && end) ? [start, end] : []);
        res.json({ daily: list, totals: { subtotal: totals[0].values[0][0], discount: totals[0].values[0][1], tax: totals[0].values[0][2], net: totals[0].values[0][3] } });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/debt-report', (req, res) => {
    try {
        const d = db.getDb();
        const r = d.exec("SELECT id, name, phone, debt, total_spent FROM customers WHERE debt > 0 ORDER BY debt DESC");
        const cols = r[0] ? r[0].columns : [];
        const list = r[0] ? r[0].values.map(v => { const o = {}; cols.forEach((c,i) => o[c]=v[i]); return o; }) : [];
        const total = d.exec("SELECT COALESCE(SUM(debt),0) as total FROM customers")[0].values[0][0];
        res.json({ customers: list, total_debt: total });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/returns', (req, res) => {
    try {
        const d = db.getDb();
        const r = d.exec("SELECT r.*, u.display_name as user_name, i.invoice_number FROM returns r LEFT JOIN users u ON r.user_id = u.id LEFT JOIN invoices i ON r.invoice_id = i.id ORDER BY r.created_at DESC LIMIT 50");
        const cols = r[0] ? r[0].columns : [];
        const list = r[0] ? r[0].values.map(v => { const o = {}; cols.forEach((c,i) => o[c]=v[i]); return o; }) : [];
        res.json(list);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
