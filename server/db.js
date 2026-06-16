const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_PATH = path.join(__dirname, '..', 'data', 'valopos.db');

let SQL = null;
let db = null;

function getDb() {
    if (db) return db;
    throw new Error('Database not initialized. Call initDb() first.');
}

async function openDb() {
    SQL = await initSqlJs();
    if (fs.existsSync(DB_PATH)) {
        const buffer = fs.readFileSync(DB_PATH);
        db = new SQL.Database(buffer);
    } else {
        const dir = path.dirname(DB_PATH);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        db = new SQL.Database();
    }
    db.run('PRAGMA journal_mode=WAL');
    db.run('PRAGMA foreign_keys=ON');
    return db;
}

function saveDb() {
    if (!db) return;
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_PATH, buffer);
}

function persist(method, ...args) {
    const result = method(...args);
    saveDb();
    return result;
}

async function initDb() {
    const d = await openDb();
    d.run(`
        CREATE TABLE IF NOT EXISTS branches (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            address TEXT DEFAULT '',
            phone TEXT DEFAULT '',
            active INTEGER DEFAULT 1,
            created_at TEXT DEFAULT (datetime('now'))
        )
    `);
    d.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            display_name TEXT NOT NULL,
            role TEXT NOT NULL DEFAULT 'cashier' CHECK(role IN ('admin','manager','cashier','accountant')),
            branch_id INTEGER REFERENCES branches(id),
            active INTEGER DEFAULT 1,
            last_login TEXT,
            created_at TEXT DEFAULT (datetime('now'))
        )
    `);
    d.run(`
        CREATE TABLE IF NOT EXISTS settings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            key TEXT UNIQUE NOT NULL,
            value TEXT NOT NULL
        )
    `);
    d.run(`
        CREATE TABLE IF NOT EXISTS suppliers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            phone TEXT DEFAULT '',
            email TEXT DEFAULT '',
            address TEXT DEFAULT '',
            notes TEXT DEFAULT '',
            rating INTEGER DEFAULT 3,
            active INTEGER DEFAULT 1,
            created_at TEXT DEFAULT (datetime('now'))
        )
    `);
    d.run(`
        CREATE TABLE IF NOT EXISTS medicines (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            scientific_name TEXT DEFAULT '',
            category TEXT DEFAULT '',
            sku TEXT DEFAULT '',
            barcode TEXT DEFAULT '',
            supplier_id INTEGER REFERENCES suppliers(id),
            buy_price REAL DEFAULT 0,
            sell_price REAL DEFAULT 0,
            qty INTEGER DEFAULT 0,
            min_qty INTEGER DEFAULT 10,
            expiry_date TEXT DEFAULT '',
            batch_number TEXT DEFAULT '',
            rx INTEGER DEFAULT 0,
            active INTEGER DEFAULT 1,
            created_at TEXT DEFAULT (datetime('now')),
            updated_at TEXT DEFAULT (datetime('now'))
        )
    `);
    d.run(`
        CREATE TABLE IF NOT EXISTS customers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            phone TEXT DEFAULT '',
            email TEXT DEFAULT '',
            address TEXT DEFAULT '',
            notes TEXT DEFAULT '',
            points INTEGER DEFAULT 0,
            total_spent REAL DEFAULT 0,
            debt REAL DEFAULT 0,
            last_purchase TEXT,
            created_at TEXT DEFAULT (datetime('now'))
        )
    `);
    d.run(`
        CREATE TABLE IF NOT EXISTS invoices (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            invoice_number TEXT NOT NULL,
            customer_id INTEGER REFERENCES customers(id),
            user_id INTEGER REFERENCES users(id),
            branch_id INTEGER REFERENCES branches(id),
            subtotal REAL DEFAULT 0,
            discount REAL DEFAULT 0,
            tax REAL DEFAULT 0,
            net REAL DEFAULT 0,
            paid REAL DEFAULT 0,
            change_amount REAL DEFAULT 0,
            payment_method TEXT DEFAULT 'cash' CHECK(payment_method IN ('cash','card','partial','wallet')),
            status TEXT DEFAULT 'completed' CHECK(status IN ('completed','cancelled','returned')),
            cancel_reason TEXT DEFAULT '',
            notes TEXT DEFAULT '',
            created_at TEXT DEFAULT (datetime('now'))
        )
    `);
    d.run(`
        CREATE TABLE IF NOT EXISTS invoice_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            invoice_id INTEGER NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
            medicine_id INTEGER REFERENCES medicines(id),
            name TEXT NOT NULL,
            price REAL DEFAULT 0,
            qty INTEGER DEFAULT 1,
            total REAL DEFAULT 0
        )
    `);
    d.run(`
        CREATE TABLE IF NOT EXISTS purchases (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            purchase_number TEXT NOT NULL,
            supplier_id INTEGER REFERENCES suppliers(id),
            user_id INTEGER REFERENCES users(id),
            branch_id INTEGER REFERENCES branches(id),
            subtotal REAL DEFAULT 0,
            discount REAL DEFAULT 0,
            tax REAL DEFAULT 0,
            net REAL DEFAULT 0,
            status TEXT DEFAULT 'completed' CHECK(status IN ('completed','cancelled','returned')),
            notes TEXT DEFAULT '',
            created_at TEXT DEFAULT (datetime('now'))
        )
    `);
    d.run(`
        CREATE TABLE IF NOT EXISTS purchase_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            purchase_id INTEGER NOT NULL REFERENCES purchases(id) ON DELETE CASCADE,
            medicine_id INTEGER REFERENCES medicines(id),
            name TEXT NOT NULL,
            buy_price REAL DEFAULT 0,
            qty INTEGER DEFAULT 1,
            total REAL DEFAULT 0,
            expiry_date TEXT DEFAULT '',
            batch_number TEXT DEFAULT ''
        )
    `);
    d.run(`
        CREATE TABLE IF NOT EXISTS returns (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            return_number TEXT NOT NULL,
            invoice_id INTEGER REFERENCES invoices(id),
            user_id INTEGER REFERENCES users(id),
            reason TEXT DEFAULT '',
            total REAL DEFAULT 0,
            created_at TEXT DEFAULT (datetime('now'))
        )
    `);
    d.run(`
        CREATE TABLE IF NOT EXISTS return_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            return_id INTEGER NOT NULL REFERENCES returns(id) ON DELETE CASCADE,
            medicine_id INTEGER REFERENCES medicines(id),
            name TEXT NOT NULL,
            qty INTEGER DEFAULT 1,
            price REAL DEFAULT 0,
            total REAL DEFAULT 0
        )
    `);
    d.run(`
        CREATE TABLE IF NOT EXISTS customer_payments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            customer_id INTEGER REFERENCES customers(id),
            amount REAL DEFAULT 0,
            type TEXT NOT NULL CHECK(type IN ('payment','debt')),
            reference TEXT DEFAULT '',
            user_id INTEGER REFERENCES users(id),
            notes TEXT DEFAULT '',
            created_at TEXT DEFAULT (datetime('now'))
        )
    `);
    d.run(`
        CREATE TABLE IF NOT EXISTS inventory_movements (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            medicine_id INTEGER REFERENCES medicines(id),
            type TEXT NOT NULL CHECK(type IN ('in','out','adjustment','return')),
            qty INTEGER DEFAULT 0,
            reference TEXT DEFAULT '',
            user_id INTEGER REFERENCES users(id),
            notes TEXT DEFAULT '',
            created_at TEXT DEFAULT (datetime('now'))
        )
    `);
    d.run(`
        CREATE TABLE IF NOT EXISTS activity_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER REFERENCES users(id),
            action TEXT NOT NULL,
            entity_type TEXT DEFAULT '',
            entity_id INTEGER,
            details TEXT DEFAULT '',
            ip_address TEXT DEFAULT '',
            created_at TEXT DEFAULT (datetime('now'))
        )
    `);
    d.run(`CREATE INDEX IF NOT EXISTS idx_invoices_date ON invoices(created_at)`);
    d.run(`CREATE INDEX IF NOT EXISTS idx_invoices_user ON invoices(user_id)`);
    d.run(`CREATE INDEX IF NOT EXISTS idx_invoices_customer ON invoices(customer_id)`);
    d.run(`CREATE INDEX IF NOT EXISTS idx_medicines_category ON medicines(category)`);
    d.run(`CREATE INDEX IF NOT EXISTS idx_inventory_movements_med ON inventory_movements(medicine_id)`);
    d.run(`CREATE INDEX IF NOT EXISTS idx_activity_logs_user ON activity_logs(user_id)`);
    d.run(`CREATE INDEX IF NOT EXISTS idx_activity_logs_created ON activity_logs(created_at)`);

    const count = d.exec("SELECT COUNT(*) as c FROM users");
    if (count.length === 0 || count[0].values[0][0] === 0) {
        const hash = bcrypt.hashSync('admin123', 10);
        d.run("INSERT INTO branches (name, address, phone) VALUES (?,?,?)", ['الفرع الرئيسي', 'مصر', '01003677165']);
        d.run("INSERT INTO users (username, password_hash, display_name, role, branch_id) VALUES (?,?,?,?,?)", ['admin', hash, 'مدير النظام', 'admin', 1]);
        d.run("INSERT INTO settings (key, value) VALUES ('pharmacy_name','ValoPOS'),('address',''),('phone',''),('tax_rate','14'),('currency','ج.م'),('receipt_footer','شكراً لتسوقكم معنا')");
    }
    saveDb();
    return d;
}

function log(userId, action, entityType, entityId, details, ip) {
    try {
        const d = db;
        d.run("INSERT INTO activity_logs (user_id, action, entity_type, entity_id, details, ip_address) VALUES (?,?,?,?,?,?)",
            [userId || null, action, entityType || '', entityId || null, details || '', ip || '']);
        saveDb();
    } catch (e) { /* silent */ }
}

const api = { getDb, openDb, initDb, saveDb, persist, log };
module.exports = api;
