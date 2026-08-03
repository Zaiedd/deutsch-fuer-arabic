// هذا الملف بيشتغل تلقائي على Cloudflare Pages Functions (مجاني)
// وهو المسؤول عن كلام الذكاء الاصطناعي بدل ما يحصل من المتصفح مباشرة،
// عشان مفتاح الـ API (GEMINI_API_KEY) يفضل مخبّي وآمن على السيرفر.

const SYSTEM_PROMPT =
  'إنت مساعد ذكي اسمه "Bat"، جوه موقع "Deutsch للعرب" لتعليم الألمانية للناطقين بالعربي. ' +
  'لو حد سأل عن اسمك، قول إنك "Bat". ' +
  'مهمتك تساعد المستخدم في أي حاجة متعلقة بتعلم الألماني: شرح كلمات، قواعد نحوية، ' +
  'ترجمة جمل من وإلى الألماني، تصحيح جمل ألمانية كتبها المستخدم، أمثلة عملية، ونصايح للنطق. ' +
  'ردودك لازم تكون بالعربي (لهجة مصرية بسيطة وودودة) وواضحة ومختصرة، ' +
  'واكتب أي كلمة أو جملة ألمانية بوضوح. لو حد سأل عن حاجة برة موضوع تعلم اللغة الألمانية، رجعه بلطف لموضوع الموقع.';

export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const body = await request.json();
    const messages = Array.isArray(body.messages) ? body.messages : [];

    if (messages.length === 0) {
      return jsonResponse({ error: 'مفيش رسالة اتبعتت.' }, 400);
    }

    const apiKey = env.GEMINI_API_KEY;
    if (!apiKey) {
      return jsonResponse(
        { error: 'مفتاح الـ AI مش متظبط على السيرفر. راجع خطوات النشر.' },
        500
      );
    }

    // تحويل شكل الرسائل (role: user/assistant) لشكل Gemini (role: user/model)
    const contents = messages.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: String(m.content || '') }]
    }));

    const geminiUrl =
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=' +
      apiKey;

    const geminiRes = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        generationConfig: { maxOutputTokens: 800 }
      })
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text().catch(() => '');
      console.error('Gemini API error:', geminiRes.status, errText);
      return jsonResponse(
        { error: 'حصل خطأ في التواصل مع خدمة الذكاء الاصطناعي (كود ' + geminiRes.status + ').' },
        502
      );
    }

    const data = await geminiRes.json();
    const reply =
      data?.candidates?.[0]?.content?.parts?.map((p) => p.text || '').join('') ||
      'معلش، مقدرتش أرد دلوقتي. جرّب تاني.';

    return jsonResponse({ reply });
  } catch (e) {
    return jsonResponse({ error: 'حصل خطأ في السيرفر.' }, 500);
  }
}

function jsonResponse(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}
