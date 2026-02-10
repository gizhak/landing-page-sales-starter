# התחלה מהירה 🚀

## הרצת הפרויקט

### אופציה 1: עם VS Code Live Server (מומלץ)
1. פתח את התיקייה ב-VS Code
2. התקן את התוסף "Live Server"
3. לחץ ימני על `index.html` → "Open with Live Server"

### אופציה 2: עם Python
```bash
python -m http.server 8000
```
ואז פתח: http://localhost:8000

### אופציה 3: עם npx
```bash
npx serve
```

## קבצים חשובים

- **index.html** - דף הנחיתה הראשי
- **admin.html** - דף ניהול תוכן (CRUD)
- **data.json** - נתוני ברירת מחדל

## ארכיטקטורה

```
js/
├── services/
│   ├── util.service.js      # פונקציות עזר
│   ├── storage.service.js   # CRUD על localStorage
│   └── data.service.js      # Model - ניהול נתונים
├── app.controller.js        # Controller - דף ראשי
└── admin.controller.js      # Controller - דף Admin
```

## תכונות

✅ **MVC Architecture** - Model-View-Controller  
✅ **Services Pattern** - שירותים מודולריים  
✅ **CRUD מלא** - יצירה, קריאה, עדכון, מחיקה  
✅ **localStorage** - שמירה מקומית  
✅ **Admin Panel** - ניהול תוכן מלא  

## עריכת תוכן

### דרך Admin Panel (מומלץ)
פתח את `admin.html` וערוך:
- פרטי משתמש
- מוצרים (הוסף/ערוך/מחק)
- המלצות (הוסף/ערוך/מחק)

### דרך data.json
ערוך את `data.json` ורענן את הדפדפן.

## פריסה ל-Vercel

```bash
# התקן Vercel CLI
npm install -g vercel

# פרוס
vercel
```

או העלה ל-GitHub וחבר ב-Vercel.com

## פתרון בעיות

**הנתונים לא נטענים?**
- ודא שאתה משתמש בשרת (לא file://)
- בדוק Console לשגיאות

**השינויים לא נשמרים?**
- localStorage עשוי להיות מלא - נקה אותו
- DevTools → Application → Local Storage → מחק

**WhatsApp לא נפתח?**
- בדוק שמספר הטלפון ב-data.json תקין

## תמיכה

קרא את [README.md](README.md) למדריך מלא.

---

**Made with ❤️ using MVC + Services**
