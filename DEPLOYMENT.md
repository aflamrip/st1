# دليل نشر التحديثات

## المشكلة الحالية
التحديثات موجودة في بيئة التطوير (Bolt) ولكنها لم تُنشر على الموقع المباشر بعد.

## الحل

### الطريقة 1: نشر مجلد dist مباشرة
1. احذف جميع ملفات الموقع الحالي على Cloudflare Pages
2. ارفع جميع محتويات مجلد `dist/` إلى Cloudflare Pages
3. تأكد من رفع جميع المجلدات الفرعية:
   - `_astro/`
   - `anime/`
   - `movies/`
   - `shows/`
   - `search/`
   - `uploads/`

### الطريقة 2: ربط المشروع مع Git
1. قم بإنشاء repository جديد على GitHub
2. ارفع المشروع الكامل إلى GitHub:
```bash
git init
git add .
git commit -m "Update with new slider and improvements"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```
3. اربط Cloudflare Pages مع GitHub repository
4. سيتم نشر التحديثات تلقائياً عند كل push

### الطريقة 3: استخدام Cloudflare CLI
```bash
npm install -g wrangler
wrangler pages deploy dist --project-name=your-project-name
```

## التحديثات المُضافة
✅ سلايدر أوتوماتيكي لأحدث الإضافات مع:
  - تحريك تلقائي كل 5 ثوانٍ
  - أزرار تنقل يسار/يمين
  - نقاط مؤشر في الأسفل
  - سحب بالماوس واللمس

✅ تحسينات الأداء:
  - مقاسات صور محسّنة (200-220px بدلاً من 150-180px)
  - width & height attributes للتحميل الأسرع
  - lazy loading

✅ جميع السلايدرات قابلة للتمرير:
  - سحب بالماوس
  - سحب باللمس
  - scrollbar مرئي

✅ Dark Mode:
  - زر تبديل في الهيدر
  - حفظ الاختيار في localStorage
  - متوافق مع إعدادات النظام

## ملاحظات مهمة
- مجلد `dist/` يحتوي على الملفات الجاهزة للنشر
- تأكد من رفع مجلد `uploads/` مع الصور
- بعد النشر، امسح cache المتصفح (Ctrl+Shift+R)
