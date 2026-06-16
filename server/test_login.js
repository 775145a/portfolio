const db = require('./db');
const bcrypt = require('bcryptjs');

async function main() {
    await db.initDb();
    const d = db.getDb();
    const r = d.exec("SELECT username, password_hash FROM users WHERE username = 'admin'");
    if (r.length > 0) {
        const hash = r[0].values[0][1];
        console.log('Stored hash:', hash);
        console.log('Hash length:', hash.length);
        const valid = bcrypt.compareSync('admin123', hash);
        console.log('Password valid:', valid);
        
        // Test freshly created hash
        const newHash = bcrypt.hashSync('admin123', 10);
        console.log('New hash:', newHash);
        const valid2 = bcrypt.compareSync('admin123', newHash);
        console.log('New hash valid:', valid2);
    }
    process.exit();
}
main().catch(e => { console.error(e); process.exit(1); });
