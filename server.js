const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// إعداد قاعدة البيانات
const db = new sqlite3.Database('./codes.db');

// إعدادات Express
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// الصفحة الرئيسية تعرض الصور والزر Host
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// معالجة طلبات الصور (Physics وChemistry)
app.get('/physics', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'physics.html'));
});

app.get('/chemistry', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'chemistry.html'));
});

// التحقق من الكود
app.post('/verify-code', (req, res) => {
    const inputCode = req.body.code;
    db.get('SELECT id FROM codes WHERE code = ?', [inputCode], (err, row) => {
        if (err) {
            return res.send('Error occurred');
        }
        if (row) {
            db.run('DELETE FROM codes WHERE id = ?', [row.id], (err) => {
                if (err) {
                    return res.send('Error deleting code');
                }
                res.send('تم التسجيل والصورة متاحة!');
            });
        } else {
            res.send('خطأ في الكود!');
        }
    });
});

// عرض الأكواد وإضافة كود جديد من زر Host
app.get('/host', (req, res) => {
    db.all('SELECT code FROM codes', (err, rows) => {
        if (err) {
            return res.send('Error fetching codes');
        }
        res.send(rows.map(row => row.code).join('<br>') + '<br><button onclick="addCode()">Add Code</button>');
    });
});

// إضافة كود جديد
app.get('/add-code', (req, res) => {
    const newCode = generateRandomCode(16);
    db.run('INSERT INTO codes (code) VALUES (?)', [newCode], (err) => {
        if (err) {
            return res.send('Error adding code');
        }
        res.send('Code added: ' + newCode);
    });
});

function generateRandomCode(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let code = '';
    for (let i = 0; i < length; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

// بدء تشغيل الخادم
app.listen(PORT, () => {
    console.log('Server is running on port ${PORT}');
});