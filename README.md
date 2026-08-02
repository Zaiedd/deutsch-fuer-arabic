# تشغيل موقع Deutsch für Araber مع المساعد الذكي — ببلاش بالكامل 🎉

الموقع دلوقتي بيكلم باك-إند بسيط (`/functions/api/chat.js`) بدل ما يكلم الـ AI مباشرة من المتصفح، عشان مفتاح الـ API يفضل مخبّي وآمن. اتبع الخطوات دي بالترتيب:

## 1) خد مفتاح Gemini المجاني (من غير فيزا)
1. روح على: https://aistudio.google.com/apikey
2. سجّل دخول بحساب Google عادي.
3. دوس **Create API key** وانسخ المفتاح.

## 2) اعمل حساب Cloudflare (مجاني)
1. روح على: https://dash.cloudflare.com/sign-up
2. سجّل حساب مجاني (مش محتاج فيزا).

## 3) انشر الموقع على Cloudflare Pages
1. من لوحة Cloudflare، روح **Workers & Pages** → **Create** → **Pages** → **Upload assets** (أو اربط حساب GitHub لو الموقع فيه).
2. ارفع مجلد `deutsch-fuer-araber` كامل (فيه `index.html` و`css` و`js` و`functions`).
3. Cloudflare هيكتشف مجلد `functions` تلقائي ويشغّله كـ Serverless Function.

## 4) خزّن مفتاح Gemini كـ "Environment Variable" سري
1. من صفحة المشروع في Cloudflare Pages، روح **Settings** → **Environment variables**.
2. دوس **Add variable**:
   - **Variable name:** `GEMINI_API_KEY`
   - **Value:** المفتاح اللي نسخته من الخطوة 1
   - اختار **Encrypt** لو متاحة (يخليه سري تماماً).
3. احفظ، وبعدين اعمل **Redeploy** للمشروع عشان المتغيّر يشتغل.

## 5) خلاص! جرّب الموقع
هتاخد رابط زي `https://your-project.pages.dev` — افتحه، جرّب المساعد الذكي (زرار 🤖) وهيرد عليك عادي.

---

### ملاحظات
- Free tier بتاع Cloudflare Pages وGemini API كافيين جداً لموقع تعليمي شخصي أو حتى مئات الزوار يومياً من غير ما تدفع أي حاجة.
- لو حبيت دومين خاص بيك (زي `deutsch-fuer-araber.com`) تقدر تربطه بمشروع Cloudflare Pages من **Custom domains** — الاستضافة نفسها هتفضل ببلاش، وهتدفع بس تمن الدومين لو مش عندك واحد أصلاً.
- لو غيّرت أي حاجة في الملفات وعايز تحدّث الموقع، ارفع نفس المجلد تاني من نفس الصفحة (Cloudflare هيعمل نسخة جديدة تلقائي).
