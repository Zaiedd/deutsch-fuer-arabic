// محتوى استماع إضافي (A1→B1) — يُحمّل بعد js/data.js
(function () {
  if (typeof LISTENING === 'undefined') return;

  LISTENING.A1 = LISTENING.A1 || [];
  LISTENING.A1.push(
    {"de": "Ich wohne in einem kleinen Haus.", "ar": "أنا ساكن في بيت صغير."},
    {"de": "Meine Schwester ist Lehrerin.", "ar": "أختي معلمة."},
    {"de": "Wir essen heute Pizza zum Abendessen.", "ar": "النهاردة بناكل بيتزا للمسا."}
  );

  LISTENING.A2 = LISTENING.A2 || [];
  LISTENING.A2.push(
    {"de": "Ich habe gestern einen langen Spaziergang gemacht.", "ar": "أنا مشيت نزهة طويلة إمبارح."},
    {"de": "Mein Auto ist in der Werkstatt.", "ar": "سيارتي في الورشة."},
    {"de": "Wir fahren nächsten Monat in den Urlaub.", "ar": "الشهر اللي بيا بنسافر في عطلة."}
  );

  LISTENING.B1 = LISTENING.B1 || [];
  LISTENING.B1.push(
    {"de": "Ich finde, dass Reisen die beste Bildung ist.", "ar": "أعتقد إن السفر أفضل تعليم."},
    {"de": "Obwohl ich müde bin, gehe ich joggen.", "ar": "رغم إنني تعبان، براي أركض."},
    {"de": "Wenn ich Zeit habe, besuche ich meine Großeltern.", "ar": "لما بيكون عندي وقت، بزور أجدادي."}
  );
})();
