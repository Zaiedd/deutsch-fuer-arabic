// Cloudflare Pages Function: AI Chat Proxy
// Keeps GEMINI_API_KEY hidden server-side

var SYSTEM_PROMPTS = {
  explain: 'أنت معلم ألماني متميز اسمه "Bat". مهمتك تشرح أي كلمة أو قاعدة نحوية بالعربي بوضوح وبأمثلة عملية. استخدم لهجة مصرية بسيطة وودودة. اكتب الكلمات الألمانية بوضوح.',
  correct: 'أنت مصحح لغوي اسمه "Bat". مهمتك تصحح أخطاء المستخدم في الألمانية. اكتب الجملة الصحيحة وابقش الأخطاء واشرحها بالعربي.',
  practice: 'أنت ممارس تدريبي اسمه "Bat". أعط المستخدم تدريبات عملية مناسبة لمستواه. ولّد أسئلة واكتب الإجابات الصحيحة.',
  chat: 'أنت صديق ألماني اسمه "Bat". تحدث مع المستخدم بالألمانية البسيطة مع ترجمة عربية للجمل. ابدأ محادثة في سياق يومي (مطعم، تسوق، شغل).',
  grammar: 'أنت خبير في قواعد اللغة الألمانية اسمه "Bat". اشرح القواعد بالعربي مع أمثلة واضحة وجداول.',
  vocabulary: 'أنت معلم مفردات اسمه "Bat". علّم المستخدم كلمات جديدة مع أمثلة ونطق.'
};

var GENERAL_SYSTEM =
  'إنت مساعد ذكي تعليمي اسمه "Bat"، جوه موقع "Deutsch fuer Araber" لتعليم الألمانية للناطقين بالعربي. ' +
  'ردودك بالعربي (لهجة مصرية بسيطة) وواضحة ومختصرة. ' +
  'لو المستخدم سأل عن حاجة برة موضوع اللغة، رجعه بلطف لموضوع الموقع.';

export async function onRequestPost(context) {
  try {
    var request = context.request;
    var env = context.env;
    var body = await request.json();
    var message = body.message || '';
    var mode = body.mode || 'explain';
    var history = Array.isArray(body.history) ? body.history : [];

    if (!message) {
      return jsonResponse({ error: 'مفيش رسالة اتبعتت.' }, 400);
    }

    var apiKey = env.GEMINI_API_KEY;
    if (!apiKey) {
      return jsonResponse(
        { error: 'مفتاح الـ AI مش متظبط على السيرفر. راجع خطوات النشر.' },
        500
      );
    }

    // Build system prompt
    var systemPrompt = GENERAL_SYSTEM + '\n\n' + (SYSTEM_PROMPTS[mode] || SYSTEM_PROMPTS.explain);

    // Build contents from history + current message
    var contents = [];
    history.forEach(function(m) {
      contents.push({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: String(m.content || '') }]
      });
    });
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    var geminiUrl =
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=' + apiKey;

    var geminiRes = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: contents,
        systemInstruction: { parts: [{ text: systemPrompt }] },
        generationConfig: { maxOutputTokens: 1000 }
      })
    });

    if (!geminiRes.ok) {
      var errText = await geminiRes.text().catch(function() { return ''; });
      console.error('Gemini API error:', geminiRes.status, errText);
      return jsonResponse(
        { error: 'حصل خطأ في التواصل مع خدمة الذكاء الاصطناعي (كود ' + geminiRes.status + ').' },
        502
      );
    }

    var data = await geminiRes.json();
    var reply =
      (data && data.candidates && data.candidates[0] && data.candidates[0].content &&
       data.candidates[0].content.parts && data.candidates[0].content.parts.map(function(p) { return p.text || ''; }).join('')) ||
      'معلش، مقدرتش أرد دلوقتي. جرّب تاني.';

    return jsonResponse({ reply: reply });
  } catch (e) {
    return jsonResponse({ error: 'حصل خطأ في السيرفر.' }, 500);
  }
}

function jsonResponse(obj, status) {
  status = status || 200;
  return new Response(JSON.stringify(obj), {
    status: status,
    headers: { 'Content-Type': 'application/json' }
  });
}
