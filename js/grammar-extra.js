// محتوى قواعد إضافي (A1→B1) — يُحمّل بعد js/data.js
(function () {
  if (typeof GRAMMAR === 'undefined') return;

  GRAMMAR.A1 = GRAMMAR.A1 || [];
  GRAMMAR.A1.push(
    {
      "title": "الأفعال الناقصة (Modalverben): können, wollen, müssen",
      "explanation": "الأفعال الناقصة (können=أكدر، wollen=أريد، müssen=لازم، dürfen=مسموح، sollen=يجب، mögen=أحب) βτι تغير معنى الفعل الرئيسي. الفعل الناقص بتصريف حسب الضمير، والفعل الرئيسي يبقى في صيغة المصدر (Infinitiv) في نهاية الجملة.",
      "table": {"headers": ["الضمير", "können", "wollen", "müssen"], "rows": [["ich", "kann", "will", "muss"], ["du", "kannst", "willst", "musst"], ["er/sie/es", "kann", "will", "muss"], ["wir", "können", "wollen", "müssen"], ["ihr", "könnt", "wollt", "müsst"], ["sie/Sie", "können", "wollen", "müssen"]]},
      "examples": [{"de": "Ich kann Deutsch sprechen.", "ar": "بأكدر أتكلم ألماني."}, {"de": "Wir müssen jetzt gehen.", "ar": "لازم نبيح الحين."}, {"de": "Darf ich hereinkommen?", "ar": "ممكن أدخل؟"}]
    },
    {
      "title": "ترتيب الكلمات: الفعل في المكان الثاني (V2)",
      "explanation": "في كل جملة ألمانية توكيدية، الفعل (التصريف) بياخذ المكان الثاني (Position 2) دوماً. ما يهم ماذا في المكان الأول — ضمير، ظرف، أو كائن.",
      "table": {"headers": ["المكان 1", "المكان 2 (الفعل)", "الباقي"], "rows": [["Ich", "lerne", "Deutsch."], ["Heute", "lerne", "ich Deutsch."], ["Deutsch", "lerne", "ich heute."], ["In Berlin", "wohne", "ich."]]},
      "examples": [{"de": "Morgen fahre ich nach Hause.", "ar": "بكرة بنيت للبيت."}, {"de": "Leider kann ich nicht kommen.", "ar": "للاسف مش أكدر آتي."}]
    },
    {
      "title": "النفي: nicht و kein",
      "explanation": "nicht ننفي الأفعال والصفات والظروف (وليس الأسماء). kein ننفي الأسماء (بلا أداة أو بـ ein/eine). مؤنث/جمع: keine.",
      "table": {"headers": ["النوع", "الاستخدام", "مثال"], "rows": [["nicht", "نفي فعل/صفة/ظرف", "Ich lerne nicht."], ["kein", "نفي اسم (مذكر/محايد)", "Ich habe kein Auto."], ["keine", "نفي اسم (مؤنث/جمع)", "Ich habe keine Zeit."]]},
      "examples": [{"de": "Ich verstehe das nicht.", "ar": "أنا مش فاهم ده."}, {"de": "Er hat keinen Bruder.", "ar": "هو ما عنده أخ."}]
    }
  );

  GRAMMAR.A2 = GRAMMAR.A2 || [];
  GRAMMAR.A2.push(
    {
      "title": "زمن الماضي: Perfekt",
      "explanation": "Perfekt هو الزمن اللي نستخدمه في الكلام اليومي للماضي. يتكون من فعل مساعد (haben أو sein) + Partizip II (تصريف ثالث) في نهاية الجملة. sein بـ أفعال الحركة/التغيير (gehen, fahren, werden).",
      "table": {"headers": ["الفاعل", "haben/sein", "Partizip II", "مثال"], "rows": [["ich", "habe", "gelernt", "Ich habe Deutsch gelernt."], ["er", "ist", "gegangen", "Er ist nach Hause gegangen."], ["wir", "haben", "gegessen", "Wir haben Pizza gegessen."]]},
      "examples": [{"de": "Ich habe gestern einen Film gesehen.", "ar": "أنا شاهدت فيلم إمبارح."}, {"de": "Sie ist nach Berlin geflogen.", "ar": "هي طارت إلى برلين."}]
    },
    {
      "title": "الضمائر في حالتها المفعول به (Akkusativ)",
      "explanation": "بعد أفعال مثل sehen, haben, lieben، نستخدم صيغة Akkusativ للضمير. ich→mich، du→dich، er→ihn، sie→sie، es→es، wir→uns، ihr→euch، sie/Sie→sie/Sie.",
      "table": {"headers": ["Nominativ", "Akkusativ", "مثال"], "rows": [["ich", "mich", "Er sieht mich."], ["du", "dich", "Ich kenne dich."], ["er", "ihn", "Ich liebe ihn."], ["sie", "sie", "Wir besuchen sie."], ["es", "es", "Ich habe es."], ["wir", "uns", "Er hilft uns."], ["ihr", "euch", "Ich grüße euch."], ["sie/Sie", "sie/Sie", "Ich sehe Sie."]]},
      "examples": [{"de": "Kannst du mich hören?", "ar": "تسمعني؟"}, {"de": "Ich habe ihn gestern getroffen.", "ar": "قابله إمبارح."}]
    }
  );

  GRAMMAR.B1 = GRAMMAR.B1 || [];
  GRAMMAR.B1.push(
    {
      "title": "الجمل الفرعية (Nebensätze): weil, dass, wenn",
      "explanation": "في الجملة الفرعية (Nebensatz)، الفعل (التصريف) بياخذ المكان الأخير (Ende). الجملة الفرعية تبدأ بروابط zoals weil (لأن)، dass (أن)، wenn (إذا/متى)، obwohl (رغم أن).",
      "table": {"headers": ["الرابط", "المعنى", "مثال"], "rows": [["weil", "لأن", "Ich lerne Deutsch, weil ich in Deutschland studieren will."], ["dass", "أن", "Ich glaube, dass er kommt."], ["wenn", "إذا/متى", "Wenn es regnet, bleibe ich zu Hause."], ["obwohl", "رغم أن", "Obwohl er krank ist, arbeitet er."]]},
      "examples": [{"de": "Ich bin müde, weil ich spät geschlafen habe.", "ar": "أنا تعبان لأنني نمت متأخر."}, {"de": "Ich hoffe, dass du kommst.", "ar": "آمل أنك آتي."}]
    },
    {
      "title": "الحروف الجر المزدوجة (Wechselpräpositionen)",
      "explanation": "هذه الحروف (in, auf, an, über, unter, vor, hinter, neben, zwischen) بياخذون Akkusativ when expressing movement (Wohin? إلى أين؟) و Dativ when expressing location (Wo? أين؟).",
      "table": {"headers": ["الحرف", "Akkusativ (Wohin?)", "Dativ (Wo?)"], "rows": [["in", "in den Park", "im Park"], ["auf", "auf den Tisch", "auf dem Tisch"], ["an", "an die Wand", "an der Wand"], ["über", "über die Brücke", "über der Brücke"]]},
      "examples": [{"de": "Ich gehe in die Schule.", "ar": "براي للمدرسة. (حركة)"}, {"de": "Ich bin in der Schule.", "ar": "أنا في المدرسة. (موقع)"}]
    },
    {
      "title": "حالة الملكية (Genitiv)",
      "explanation": "Genitiv expressing possession/ownership. الأداة تصبح des (مذكر/محايد) أو der (مؤنث/جمع)، والاسم المذكر/المحايد بياخذ -s/-es في النهاية.",
      "table": {"headers": ["الجنس", "الأداة", "مثال"], "rows": [["مذكر", "des Mannes", "Das Auto des Mannes."], ["محايد", "des Kindes", "Das Spielzeug des Kindes."], ["مؤنث", "der Frau", "Das Haus der Frau."], ["جمع", "der Kinder", "Die Schule der Kinder."]]},
      "examples": [{"de": "Das ist das Buch des Lehrers.", "ar": "ده كتاب المعلم."}, {"de": "Die Farbe der Blume ist schön.", "ar": "لون الزهرة جميل."}]
    }
  );
})();
