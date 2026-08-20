// هذا الملف بيشتغل تلقائي على Cloudflare Pages Functions (مجاني)
// وهو المسؤول عن كلام الذكاء الاصطناعي بدل ما يحصل من المتصفح مباشرة،
// عشان مفتاح الـ API (GEMINI_API_KEY) يفضل مخبّي وآمن على السيرفر.

const SYSTEM_PROMPT =
  'إنت مساعد ذكي تعليمي اسمه "Bat"، جوه موقع "Deutsch للعرب" لتعليم الألمانية للناطقين بالعربي. ' +
  'لو حد سأل عن اسمك، قول إنك "Bat". ' +
  'مهمتك تساعد المستخدم في تعلم الألماني بطرق مختلفة:\n\n' +
  '1. شرح: اشرح أي كلمة أو قاعدة نحوية بالعربي بوضوح وبأمثلة عملية.\n' +
  '2. تصحيح: لو المستخدم كتب جملة بالألماني، صححها واكتب الغلط والشرح.\n' +
  '3. محادثة: لو المستخدم حب يتدرب على المحادثة، ابدأ سيناريو بسيط (مطعم، تسوق، شغل).\n' +
  '4. تدريب: ولّد أسئلة تدريبية مناسبة لمستوى المستخدم.\n\n' +
  'ردودك لازم تكون بالعربي (لهجة مصرية بسيطة وودودة) وواضحة ومختصرة، ' +
  'واكتب أي كلمة أو جملة ألمانية بوضوح.\n\n' +
  'قواعد مهمة:\n' +
  '- لو المستخدم كتب جملة ألمانية، اعتبرها طلب تصحيح.\n' +
  '- لو المستخدم سأل "اشرحلي" أو "إيه معنى"، ابدأ الشرح.\n' +
  '- لو المستخدم قال "خلينا نتكلم" أو "تدرب معايا"، ابدأ محادثة.\n' +
  '- لو المستخدم سأل عن حاجة برة موضوع اللغة، رجعه بلطف لموضوع الموقع.';

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
