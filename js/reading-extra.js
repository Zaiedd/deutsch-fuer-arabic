// محتوى قراءة إضافي (A1→B2) — يُحمّل بعد js/data.js
(function () {
  if (typeof READING === 'undefined') return;

  READING.A1 = READING.A1 || [];
  READING.A1.push(
    {
      "title": "في المدرسة (In der Schule)",
      "paragraphs": [
        {"de": "Ahmed geht jeden Tag zur Schule. Er hat drei Fächer: Mathematik, Deutsch und Sport.", "ar": "أحمد بيراي للمدرسة كل يوم. عنده ثلاث مواد: رياضيات، ألماني، ورياضة."},
        {"de": "Seine Lehrerin heißt Frau Müller. Sie ist nett und hilft den Schülern.", "ar": "معلمته اسمها Frau Müller. هي لطيفة وتساعد الطلاب."},
        {"de": "In der Pause spielt Ahmed mit seinen Freunden Fußball.", "ar": "في الاستراحة بيلعب أحمد مع أصحابه كرة."}
      ]
    },
    {
      "title": "في المطار (Am Flughafen)",
      "paragraphs": [
        {"de": "Ich fliege heute nach Berlin. Mein Flug geht um acht Uhr morgens.", "ar": "أنا بنيت لبرلين النهاردة. رحلتي الساعة ثمنة صباحاً."},
        {"de": "Ich habe einen Koffer und einen Rucksack. Ich gebe den Koffer am Schalter ab.", "ar": "عندي حقيبة وشنطة. بسلم الحقيبة على الكاونتر."},
        {"de": "Im Flugzeug sitze ich am Fenster und sehe die Wolken.", "ar": "في الطائرة بجلس على النافذة وبشوف السحب."}
      ]
    }
  );

  READING.A2 = READING.A2 || [];
  READING.A2.push(
    {
      "title": "رحلة إلى ميونخ (Eine Reise nach München)",
      "paragraphs": [
        {"de": "Letztes Wochenende bin ich mit dem Zug nach München gefahren. Die Fahrt dauerte drei Stunden.", "ar": "الويكند اللي فات سافرت بالقطار إلى ميونخ. الرحلة استغرقت ثلاث ساعات."},
        {"de": "In München habe ich das Deutsche Museum besucht. Es war sehr interessant.", "ar": "في ميونخ زرت المتحف الألماني. كان مثير جداً."},
        {"de": "Am Abend habe ich in einem Restaurant bayerisches Essen gegessen.", "ar": "في المسا أكلت طعام بافاري في مطعم."}
      ]
    },
    {
      "title": "العمل في المكتب (Arbeit im Büro)",
      "paragraphs": [
        {"de": "Ich arbeite in einem großen Büro in der Stadt. Jeden Morgen beginne ich um acht Uhr.", "ar": "بشتغل في مكتب كبير في المدينة. كل صباح ببدأ الساعة ثمنة."},
        {"de": "Meine Kollegen sind freundlich. Wir trinken zusammen Kaffee in der Pause.", "ar": "زملائي لطيفين. بنشرب قهوة مع بعض في الاستراحة."},
        {"de": "Nach der Arbeit gehe ich oft ins Fitnessstudio.", "ar": "بعد الشغل براي غالباً إلى صالة الرياضة."}
      ]
    }
  );

  READING.B1 = READING.B1 || [];
  READING.B1.push(
    {
      "title": "العيش في ألمانيا (Leben in Deutschland)",
      "paragraphs": [
        {"de": "Viele Menschen ziehen nach Deutschland, um zu studieren oder zu arbeiten. Die deutsche Kultur ist vielfältig und interessant.", "ar": "الكثير من الناس ينتقلون إلى ألمانيا للدراسة أو العمل. الثقافة الألمانية متنوعة ومثيرة."},
        {"de": "Obwohl die Sprache am Anfang schwierig ist, kann man mit Übung schnell Fortschritte machen.", "ar": "رغم أن اللغة في البداية صعبة، يمكن تقدم بسرعة مع التدريب."},
        {"de": "Ich finde es wichtig, die lokale Kultur kennenzulernen und neue Freunde zu finden.", "ar": "أعتقد من المهم تعرف الثقافة المحلية وتجد أصحاب جدد."}
      ]
    }
  );

  READING.B2 = READING.B2 || [];
  READING.B2.push(
    {
      "title": "الذكاء الاصطناعي في التعليم (Künstliche Intelligenz in der Bildung)",
      "paragraphs": [
        {"de": "Künstliche Intelligenz verändert die Art, wie wir lernen und unterrichten. Viele Schulen nutzen bereits digitale Tools.", "ar": "الذكاء الاصطناعي يغير طريقة تعلمنا وتعليمها.多くの المدارس بستفيد من أدوات رقمية بالفعل."},
        {"de": "Einerseits bieten diese Technologien personalisierte Lernmöglichkeiten, andererseits gibt es Bedenken bezüglich Datenschutz.", "ar": "من جهة، هذه التقنيات بتوفر خيارات تعلم شخصية، ومن جهة أخرى هناك مخاوف حول حماية البيانات."},
        {"de": "Experten betonen, dass Technologie den Lehrer nicht ersetzen, sondern unterstützen sollte.", "ar": "الخبراء يؤكدون أن التقنية لا يجب أن تحل محل المعلم، بل بدعمه."}
      ]
    }
  );
})();
