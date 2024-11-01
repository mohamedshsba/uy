
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./codes.db');

function generateRandomCode(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let code = '';
    for (let i = 0; i < length; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS codes (id INTEGER PRIMARY KEY, code TEXT)');

    const stmt = db.prepare('INSERT INTO codes (code) VALUES (?)');
    for (let i = 0; i < 200; i++) {
        stmt.run(generateRandomCode(16));
    }
    stmt.finalize();
});

db.close();