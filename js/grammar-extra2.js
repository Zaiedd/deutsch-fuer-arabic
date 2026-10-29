// محتوى قواعد إضافي 2 (A1→C2) — يُحمّل بعد js/data.js
(function () {
  if (typeof GRAMMAR === 'undefined') return;

  GRAMMAR.A1 = GRAMMAR.A1 || [];
  GRAMMAR.A1.push(
    {
      "title": "الجمع (Plural): كيف نشكل Mehrzahl",
      "explanation": "الجمع في الألمانية ما عنده قاعدة واحدة. الأنواع الرئيسية: +e (der Tisch→die Tische)، +er (das Kind→die Kinder)، +en (die Frau→die Frauen)، +s (das Auto→die Autos). الأداة في الجمع دايماً die.",
      "table": {"headers": ["المفرد", "الجمع", "النوع"], "rows": [["der Tisch", "die Tische", "+e"], ["das Kind", "die Kinder", "+er (Umlaut)"], ["die Frau", "die Frauen", "+en"], ["das Auto", "die Autos", "+s"], ["der Apfel", "die Äpfel", "Umlaut"]] },
      "examples": [{"de": "Die Kinder spielen im Park.", "ar": "الأطفال بيلعبون في الحديقة."}, {"de": "Ich kaufe drei Äpfel.", "ar": "بشتري ثلاث تفاحات."}]
    },
    {
      "title": "ضمائر الإشارة (Demonstrativpronomen): dieser, diese, dieses",
      "explanation": "ضمائر الإشارة بياخذون جنس الاسم (der→dieser، die→diese، das→dieses) وتصرف حسب الحالة (Nominativ/Akkusativ/Dativ).",
      "table": {"headers": ["الجنس", "Nominativ", "Akkusativ"], "rows": [["مذكر", "dieser", "diesen"], ["مؤنث", "diese", "diese"], ["محايد", "dieses", "dieses"], ["جمع", "diese", "diese"]] },
      "examples": [{"de": "Dieser Mann ist mein Lehrer.", "ar": "هذا الرجل معلمي."}, {"de": "Diese Frau ist sehr nett.", "ar": "هذه المرأة لطيفة جداً."}]
    }
  );

  GRAMMAR.A2 = GRAMMAR.A2 || [];
  GRAMMAR.A2.push(
    {
      "title": "الحروف الجر مع Dativ: mit, nach, bei, von, zu, aus, seit",
      "explanation": "هذه الحروف بياخذون Dativ دوماً. mit (مع)، nach (إلى/بعد)، bei (عند)، von (من)، zu (إلى)، aus (من)، seit (منذ).",
      "table": {"headers": ["الحرف", "المعنى", "مثال"], "rows": [["mit", "مع", "Ich fahre mit dem Bus."], ["nach", "إلى/بعد", "Ich fliege nach Berlin."], ["bei", "عند", "Ich arbeite bei einer Firma."], ["von", "من", "Das Geschenk ist von meiner Mutter."], ["zu", "إلى", "Ich gehe zu meinem Freund."], ["aus", "من", "Er kommt aus Ägypten."], ["seit", "منذ", "Ich lerne seit zwei Jahren Deutsch."]] },
      "examples": [{"de": "Ich wohne bei meinen Eltern.", "ar": "أنا ساكن عند والدي."}, {"de": "Seit wann lernst du Deutsch?", "ar": "منذ متى بتعلم ألماني؟"}]
    },
    {
      "title": "الأفعال المركبة (Trennbare Verben)",
      "explanation": "أفعال مثل anrufen، aufstehen، mitkommen βτι تنقسم: الصدر (Präfix) بياخذ المكان الأخير في جملة توكيدية، والتصريف في المكان الثاني.",
      "table": {"headers": ["التصريف", "الصدر", "مثال"], "rows": [["rufe ... an", "an", "Ich rufe meine Mutter an."], ["stehe ... auf", "auf", "Ich stehe um 7 Uhr auf."], ["komme ... mit", "mit", "Kommst du mit?"]] },
      "examples": [{"de": "Er ruft seine Freundin an.", "ar": "هو يتصل بصاحبته."}, {"de": "Wir fangen um acht an.", "ar": "بنابدأ الساعة ثمنة."}]
    }
  );

  GRAMMAR.B1 = GRAMMAR.B1 || [];
  GRAMMAR.B1.push(
    {
      "title": "المبني للمجهول (Vorgangspassiv): werden + Partizip II",
      "explanation": "Passiv يركز على الفعل (ما حدث) وليس على الفاعل. يتكون من werden (تصريف) + Partizip II في نهاية الجملة.",
      "table": {"headers": ["الزمن", "الصيغة", "مثال"], "rows": [["Präsens", "wird + P.II", "Das Haus wird gebaut."], ["Präteritum", "wurde + P.II", "Das Haus wurde gebaut."], ["Perfekt", "ist + worden", "Das Haus ist gebaut worden."]] },
      "examples": [{"de": "Hier wird Deutsch gesprochen.", "ar": "هنا بيتكلمون ألماني."}, {"de": "Der Brief wurde gestern geschrieben.", "ar": "الرسالة كتبت إمبارح."}]
    },
    {
      "title": "الجمل النسبية (Relativsätze)",
      "explanation": "الجملة النسبية بياخذ Relativpronomen (der, die, das, die) حسب جنس الموصوف، وتصرف حسب دورها في الجملة الفرعية. الفعل في نهاية الجملة الفرعية.",
      "table": {"headers": ["الموصوف", "Nominativ", "Akkusativ", "Dativ"], "rows": [["der Mann", "der", "den", "dem"], ["die Frau", "die", "die", "der"], ["das Kind", "das", "das", "dem"], ["die Kinder", "die", "die", "denen"]] },
      "examples": [{"de": "Der Mann, der dort steht, ist mein Lehrer.", "ar": "الرجل اللي يقف هناك هو معلمي."}, {"de": "Das Buch, das ich lese, ist interessant.", "ar": "الكتاب اللي أقرأه مثير."}]
    }
  );

  GRAMMAR.B2 = GRAMMAR.B2 || [];
  GRAMMAR.B2.push(
    {
      "title": "Konjunktiv II: الرغبة وال假設 (würde, hätte, wäre)",
      "explanation": "Konjunktiv II للرغبات، ال假設 (إذا)، والنصيحة. الأفعال (sein, haben, werden) عندها صيغ خاصة (wäre, hätte, würde). بقية الأفعال: würde + Infinitiv.",
      "table": {"headers": ["الصيغة", "الاستخدام", "مثال"], "rows": [["wäre", "假設 (sein)", "Wenn ich reich wäre, würde ich reisen."], ["hätte", "假設 (haben)", "Wenn ich Zeit hätte, käme ich."], ["würde + Inf.", "假設 (أفعال)", "Ich würde gerne kommen."]] },
      "examples": [{"de": "Ich würde gerne nach Deutschland reisen.", "ar": "حابب أسافر إلى ألمانيا."}, {"de": "Wenn ich du wäre, würde ich das nicht tun.", "ar": "إذا كنت مكانك، ما سويته."}]
    },
    {
      "title": "المبني للمجهول (Zustandspassiv): sein + Partizip II",
      "explanation": "Zustandspassiv يركز على النتيجة/الحالة (وليس الفعل). يتكون من sein (تصريف) + Partizip II. (مثلاً: الباب مغلق = er ist geschlossen).",
      "table": {"headers": ["Vorgangspassiv", "Zustandspassiv", "الفرق"], "rows": [["Das Fenster wird geöffnet.", "Das Fenster ist geöffnet.", "فعل vs حالة"], ["Die Tür wird geschlossen.", "Die Tür ist geschlossen.", "فعل vs حالة"]] },
      "examples": [{"de": "Die Tür ist geschlossen.", "ar": "الباب مغلق. (حالة)"}, {"de": "Das Essen ist fertig.", "ar": "الأكل جاهز."}]
    }
  );

  GRAMMAR.C1 = GRAMMAR.C1 || [];
  GRAMMAR.C1.push(
    {
      "title": "صفات مشتقة من أفعال (Partizipialattribute)",
      "explanation": "Partizip I (فعل + -d) و Partizip II (تصريف ثالث) بياخذون صفة (Adjektiv) قبل الاسم، وتصرف حسب الأداة والجنس والحالة.",
      "table": {"headers": ["النوع", "الصيغة", "مثال"], "rows": [["Partizip I", "laufend", "der laufende Mann"], ["Partizip II", "gelesen", "das gelesene Buch"], ["مع الأداة", "-e/-en", "ein laufender Mann"]] },
      "examples": [{"de": "Das lesende Mädchen ist meine Tochter.", "ar": "البنت اللي تقرأ هي بنتي."}, {"de": "Der geschriebene Brief liegt auf dem Tisch.", "ar": "الرسالة المكتوبة على الطاولة."}]
    },
    {
      "title": "تراكيب Nomen-Verb (Nomen-Verb-Verbindungen)",
      "explanation": "بعض الأفعال بياخذون اسماً محدداً (كائن) ليعبروا عن مفهوم (zur Verfügung stehen = متاح، in Frage kommen = ممكن).",
      "table": {"headers": ["التراكيب", "المعنى", "مثال"], "rows": [["zur Verfügung stehen", "متاح", "Ich stehe Ihnen zur Verfügung."], ["in Frage kommen", "ممكن", "Das kommt nicht in Frage."], ["Bescheid wissen", "أعلم", "Ich weiß Bescheid."]] },
      "examples": [{"de": "Das kommt nicht in Frage.", "ar": "هذا غير ممكن."}, {"de": "Ich stehe Ihnen zur Verfügung.", "ar": "أنا في خدمتك."}]
    }
  );

  GRAMMAR.C2 = GRAMMAR.C2 || [];
  GRAMMAR.C2.push(
    {
      "title": "Konjunktiv I: الاقتباس (Indirekte Rede)",
      "explanation": "Konjunktiv I بياخذ في الاقتباس (نقل كلام شخص). الأفعال (sein, haben, werden) عندها صيغ خاصة. بقية الأفعال: جذع + -e.",
      "table": {"headers": ["الضمير", "sein (K.I)", "haben (K.I)"], "rows": [["er/sie", "sei", "habe"], ["sie (جمع)", "seien", "haben"], ["ich", "sei", "habe"]] },
      "examples": [{"de": "Er sagt, er sei krank.", "ar": "يقول إن he is sick. (نقل كلام)"}, {"de": "Sie meint, sie habe recht.", "ar": "تعتقد إن she is right."}]
    },
    {
      "title": "الاسماء المجردة (Nominalisierung)",
      "explanation": "Nominalisierung يحول الأفعال/الصفات إلى أسماء (laufen → das Laufen). يُستخدم في الأسلوب الأكاديمي/الرسمي.",
      "table": {"headers": ["الفعل/الصفة", "الاسم", "مثال"], "rows": [["laufen", "das Laufen", "Das Laufen ist gesund."], ["schön", "die Schönheit", "die Schönheit der Natur"], ["arbeiten", "die Arbeit", "die Arbeit beginnt"]] },
      "examples": [{"de": "Das Lesen von Büchern bildet.", "ar": "قراءة الكتب تثقف."}, {"de": "Die Schönheit der Natur ist beeindruckend.", "ar": "جمال الطبيعة مثير للإعجاب."}]
    }
  );
})();
