// ============================================
// Deutsch fuer Araber - Courses
// Recommended free German learning courses
// ============================================

const COURSES = [
  {
    "id": "vhs-lernportal",
    "name": "VHS-Lernportal",
    "provider": "الاتحاد الألماني لتعليم الكبار (بتمويل من وزارة التعليم الألمانية)",
    "level": "A1 - C1",
    "description": "كورس مجاني بالكامل من الحكومة الألمانية، معترف بيه رسمياً من هيئة الهجرة الألمانية (BAMF) كوسيلة تعليمية معتمدة. بيغطي القراءة والكتابة والاستماع والمحادثة بشكل متدرج.",
    "badge": "معتمد رسمياً",
    "url": "https://www.vhs-lernportal.de"
  },
  {
    "id": "goethe-institut",
    "name": "Goethe-Institut",
    "provider": "المعهد الثقافي الألماني الرسمي",
    "level": "A1 - C2",
    "description": "المعهد الرسمي للغة الألمانية حول العالم. بيقدم موارد تعلم مجانية، وشهاداته (Goethe-Zertifikat) هي المعيار العالمي المعترف بيه في الجامعات وطلبات الفيزا.",
    "badge": "معهد رسمي",
    "url": "https://www.goethe.de/en/spr.html"
  },
  {
    "id": "dw-nicos-weg",
    "name": "Nicos Weg",
    "provider": "دويتشه فيله (DW) - الإذاعة الألمانية الرسمية",
    "level": "A1 - B1",
    "description": "كورس فيديو تفاعلي مجاني بالكامل من الإذاعة الألمانية الرسمية، بيتابع قصة نيكو وهو بيتعلم الألماني. من أشهر وأقوى الكورسات المجانية عالمياً.",
    "badge": "شائع جداً",
    "url": "https://learngerman.dw.com/en/nicos-weg/c-36519789"
  },
  {
    "id": "dw-deutsch-interaktiv",
    "name": "Deutsch Interaktiv",
    "provider": "دويتشه فيله (DW)",
    "level": "A1 - B1",
    "description": "كورس تفاعلي شامل من DW بيغطي المفردات والقواعد والاستماع، مع تمارين ومحتوى وسائط متعددة.",
    "badge": "مجاني",
    "url": "https://learngerman.dw.com/en/deutsch-interaktiv/s-9455"
  },
  {
    "id": "dw-warum-nicht",
    "name": "Deutsch Warum Nicht",
    "provider": "دويتشه فيله (DW)",
    "level": "A1 - A2",
    "description": "كورس صوتي/قصصي كلاسيكي شهير للمبتدئين، بيعلم الألماني من خلال قصة إذاعية ممتعة.",
    "badge": "كلاسيكي",
    "url": "https://learngerman.dw.com/en/deutsch-warum-nicht/s-2548"
  }
];

function renderCourses() {
  const area = document.getElementById('coursesArea');
  if (!area) return;

  const cards = COURSES.map(function(c, i) {
    return `
      <a class="course-card" href="${c.url}" target="_blank" rel="noopener nofollow" style="animation-delay:${i * 0.07}s">
        <div class="course-top">
          <span class="course-badge">${c.badge}</span>
          <span class="course-level">${c.level}</span>
        </div>
        <h3 class="course-name">${c.name}</h3>
        <p class="course-provider">${c.provider}</p>
        <p class="course-desc">${c.description}</p>
        <div class="course-action">
          <span>ابدأ الكورس</span>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg>
        </div>
      </a>
    `;
  }).join('');

  area.innerHTML = `
    <div class="courses-intro">
      <p>هذه أفضل الكورسات المجانية لتعلّم الألمانية — كلها معتمدة وموثوقة. افتح الكورس اللي يناسب مستواك وابدأ فوراً.</p>
    </div>
    <div class="courses-grid">${cards}</div>
  `;
}