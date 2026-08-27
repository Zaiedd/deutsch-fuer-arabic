// منطق الموقع: التنقل بين الصفحات، عرض المحتوى، والمساعد الذكي

// ============ ICONS (SVG موحّد بدل الإيموجي) ============
const ICONS = {
  target: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="0.8" fill="currentColor"/></svg>',
  tag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12.6 3.5h5.9a2 2 0 0 1 2 2v5.9a2 2 0 0 1-.59 1.41l-8 8a2 2 0 0 1-2.82 0l-5.9-5.9a2 2 0 0 1 0-2.82l8-8a2 2 0 0 1 1.41-.59z"/><circle cx="15.5" cy="8.5" r="1.2" fill="currentColor" stroke="none"/></svg>',
  chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5.5h16v10.5H9l-4 3.5v-3.5H4z"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.5"/><path d="M8.2 12.3l2.6 2.6 5-5.4"/></svg>',
  bookOpen: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 5.2c2.3-.8 5-.6 8.5 1.3 3.5-1.9 6.2-2.1 8.5-1.3v13.2c-2.3-.8-5-.6-8.5 1.3-3.5-1.9-6.2-2.1-8.5-1.3z"/><path d="M12 6.5v13.2"/></svg>',
  headphones: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="3" y="14" width="4.5" height="6" rx="1.5"/><rect x="16.5" y="14" width="4.5" height="6" rx="1.5"/></svg>',
  library: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="4" width="5" height="16" rx="1"/><rect x="10" y="6.5" width="5" height="13.5" rx="1"/><path d="M16.5 6.7l3.6 1-3 12.6-3.6-1z"/></svg>',
  pen: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20l.9-4.2L16 4.7a1.8 1.8 0 0 1 2.6 0l.7.7a1.8 1.8 0 0 1 0 2.6L8.2 19.1z"/><path d="M14 6.8l3.2 3.2"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M20 20l-4.8-4.8"/></svg>',
  hourglass: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3.5h12M6 20.5h12M7 3.5v3.2a5 5 0 0 0 2 4l1.5 1.3-1.5 1.3a5 5 0 0 0-2 4v3.2M17 3.5v3.2a5 5 0 0 1-2 4l-1.5 1.3 1.5 1.3a5 5 0 0 1 2 4v3.2"/></svg>',
  sparkles: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 3l1.6 4.7L18.3 9l-4.7 1.6L12 15.3l-1.6-4.7L5.7 9l4.7-1.3z"/><path d="M18.5 14.5l.8 2.3 2.3.8-2.3.8-.8 2.3-.8-2.3-2.3-.8 2.3-.8z"/></svg>',
  play: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M8 5.5v13l11-6.5z"/></svg>',
  pause: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect x="6.5" y="5.5" width="4" height="13" rx="1"/><rect x="13.5" y="5.5" width="4" height="13" rx="1"/></svg>',
  chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>',
  refresh: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12a8 8 0 0 1 13.7-5.7L20 8.5M20 4v4.5h-4.5"/><path d="M20 12a8 8 0 0 1-13.7 5.7L4 15.5M4 20v-4.5h4.5"/></svg>',
  checkSmall: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4l2.4 5.3 5.7.6-4.3 3.9 1.2 5.7L12 16.6l-5 2.9 1.2-5.7-4.3-3.9 5.7-.6z"/></svg>',
  eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="2.8"/></svg>'
};

// ============ MOBILE MENU ============
function toggleMobileMenu() {
  document.getElementById('navLinks').classList.toggle('open');
  document.getElementById('navOverlay').classList.toggle('open');
  document.getElementById('navBurger').classList.toggle('open');
  document.body.classList.toggle('no-scroll');
}
function closeMobileMenu() {
  document.getElementById('navLinks').classList.remove('open');
  document.getElementById('navOverlay').classList.remove('open');
  document.getElementById('navBurger').classList.remove('open');
  document.body.classList.remove('no-scroll');
}
// إغلاق القائمة عند الضغط في أي مكان برّاها (بدل الاعتماد على طبقة شفافة قابلة للضغط،
// اللي ممكن تحجب أزرار القائمة نفسها حسب ترتيب الطبقات في بعض المتصفحات)
document.addEventListener('click', function (e) {
  const navLinks = document.getElementById('navLinks');
  const navBurger = document.getElementById('navBurger');
  if (!navLinks || !navLinks.classList.contains('open')) return;
  if (navLinks.contains(e.target) || (navBurger && navBurger.contains(e.target))) return;
  closeMobileMenu();
});

// ============ PAGE SWITCHING ============
function switchPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + name).classList.add('active');
  document.querySelectorAll('.nav-links button').forEach(b => b.classList.remove('active'));
  document.getElementById('navBtn-' + name).classList.add('active');
  closeMobileMenu();
  window.scrollTo({top:0, behavior:'smooth'});
  if (name === 'grammar' && !gramInit) { renderGrammar(); gramInit = true; }
  if (name === 'listening' && !listenInit) { renderListening(); listenInit = true; }
  if (name === 'reading' && !readInit) { renderReading(); readInit = true; }
  if (name === 'blog' && !blogInit) { renderBlog(); blogInit = true; }
  if (name === 'quiz' && !quizInit) { quizInit = true; }
  if (name === 'flashcards' && !flashcardInit) { flashcardInit = true; }
  if (name === 'mywords' && !mywordsInit) { renderMyWords(); mywordsInit = true; }
  if (name === 'dashboard' && !dashInit) { Dashboard.render('dashboardArea'); dashInit = true; }
  if (name === 'path' && !pathInit) { LearningPath.render('learningPathArea'); pathInit = true; }
}
let gramInit=false, listenInit=false, readInit=false, blogInit=false;
let quizInit=false, flashcardInit=false, mywordsInit=false, dashInit=false, pathInit=false;

// ============ VOCAB PAGE (existing) ============
function speakGerman(text) {
  if (!text || !text.trim()) return;
  text = text.trim();

  if (!('speechSynthesis' in window)) {
    alert('متصفحك مش بيدعم النطق. استخدم Chrome أو Edge.');
    return;
  }

  window.speechSynthesis.cancel();

  var u = new SpeechSynthesisUtterance(text);
  u.lang = 'de-DE';
  u.rate = 0.85;
  u.pitch = 1;
  u.volume = 1;

  var voices = window.speechSynthesis.getVoices();
  if (!voices.length) {
    setTimeout(function() { voices = window.speechSynthesis.getVoices(); }, 100);
  }
  var deVoice = voices.find(function(v) { return v.lang === 'de-DE'; }) ||
                voices.find(function(v) { return v.lang === 'de-AT'; }) ||
                voices.find(function(v) { return v.lang === 'de-CH'; }) ||
                voices.find(function(v) { return (v.lang || '').indexOf('de') === 0; });

  if (deVoice) {
    u.voice = deVoice;
  }

  window.speechSynthesis.speak(u);

  // Chrome bug: restart speech every 10s so it doesn't stop
  var _ttsRestart = setInterval(function() {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
      window.speechSynthesis.resume();
    } else {
      clearInterval(_ttsRestart);
    }
  }, 10000);
}

if ('speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = function() {
    window.speechSynthesis.getVoices();
  };
  window.speechSynthesis.getVoices();
}

let currentLevel = 'A1';
let currentCat = null;
let learnedWords = {};
try { learnedWords = JSON.parse(localStorage.getItem('dfa_learned') || '{}'); } catch(e){}

function setVocabLevel(level, btn) {
  currentLevel = level;
  currentCat = null;
  document.querySelectorAll('#vocabLevelTabs .level-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('searchInput').value = '';
  renderCats();
  renderWords();
  updateProgress();
}

function renderCats() {
  const cats = Object.keys(DATA[currentLevel].categories);
  const grid = document.getElementById('catGrid');
  grid.innerHTML = '';
  cats.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'cat-btn' + (currentCat === cat ? ' active' : '');
    const icon = [...cat].find(c => c.codePointAt(0) > 127 && !/[\u0600-\u06FF]/.test(c)) || '📁';
    const label = cat.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g,'').replace(/[^\u0600-\u06FF\s]/g,'').trim() || cat;
    btn.innerHTML = '<span class="cat-icon">' + icon + '</span>' + label;
    btn.onclick = () => {
      currentCat = currentCat === cat ? null : cat;
      document.getElementById('searchInput').value = '';
      renderCats();
      renderWords();
    };
    grid.appendChild(btn);
  });
}

function getWords() {
  const cats = DATA[currentLevel].categories;
  let words = [];
  if (currentCat && cats[currentCat]) {
    words = cats[currentCat];
  } else {
    Object.values(cats).forEach(arr => words.push(...arr));
  }
  const q = document.getElementById('searchInput').value.trim().toLowerCase();
  if (q) words = words.filter(w => w.de.toLowerCase().includes(q) || (w.ar||'').includes(q));
  return words;
}

function toggleLearned(key, btn) {
  learnedWords[key] = !learnedWords[key];
  try { localStorage.setItem('dfa_learned', JSON.stringify(learnedWords)); } catch(e){}
  btn.innerHTML = '<span class="btn-icon">' + (learnedWords[key] ? ICONS.checkSmall : ICONS.star) + '</span> ' + (learnedWords[key] ? 'حفظتها' : 'حفظتها؟');
  btn.classList.toggle('learned', !!learnedWords[key]);
  updateProgress();
}

function updateProgress() {
  const cats = DATA[currentLevel].categories;
  const allWords = Object.values(cats).flat();
  const learned = allWords.filter(w => learnedWords[currentLevel + '_' + w.de]).length;
  const pct = allWords.length ? Math.round(learned / allWords.length * 100) : 0;
  document.getElementById('progressFill').style.width = pct + '%';
  document.getElementById('progressLabel').textContent = 'تقدمك في المستوى ' + currentLevel + ': ' + learned + ' / ' + allWords.length + ' كلمة (' + pct + '%)';
}

function flipCard(id) {
  document.getElementById(id).classList.toggle('flipped');
}

function renderWords() {
  const words = getWords();
  const grid = document.getElementById('wordsGrid');
  document.getElementById('wordsCount').textContent = words.length + ' كلمة';

  if (!words.length) {
    grid.innerHTML = '<div class="empty-state"><div class="empty-icon">' + ICONS.search + '</div><h3>لا توجد نتائج</h3><p>جرّب كلمة بحث مختلفة</p></div>';
    return;
  }

  grid.innerHTML = words.map((w, i) => {
    const key = currentLevel + '_' + w.de;
    const isLearned = !!learnedWords[key];
    const artClass = ['der','die','das'].includes(w.article) ? w.article : 'none';
    const artLabel = w.article && w.article !== 'none' ? w.article : '';
    const cardId = 'card_' + i + '_' + Date.now();
    const hasEx = w.example && w.example.trim();
    return '<div class="word-card" id="' + cardId + '">' +
      '<div class="card-front" onclick="flipCard(\'' + cardId + '\')">' +
        '<div class="card-de">' + w.de + ' <button class="speak-btn" onclick="event.stopPropagation();speakGerman(this.getAttribute(\'data-text\'))" data-text="' + w.de.replace(/"/g, '&quot;') + '" title="اسمع النطق">🔊</button></div>' +
        (artLabel ? '<span class="card-article ' + artClass + '">' + artLabel + '</span>' : '') +
        '<div class="card-ar">' + (w.ar || '') + '</div>' +
        '<div class="card-ex">' + (hasEx ? '<span class="ex-de">' + w.example + ' <button class="speak-btn speak-btn-sm" onclick="event.stopPropagation();speakGerman(this.getAttribute(\'data-text\'))" data-text="' + w.example.replace(/"/g, '&quot;') + '" title="اسمع الجملة">🔊</button></span>' : '<span class="no-example">لا يوجد مثال</span>') + '</div>' +
        '<div class="card-actions">' +
          '<button class="card-btn" onclick="event.stopPropagation();flipCard(\'' + cardId + '\')"><span class="btn-icon">' + ICONS.refresh + '</span> اقلب</button>' +
          '<button class="card-btn ' + (isLearned ? 'learned' : '') + '" onclick="event.stopPropagation();toggleLearned(\'' + key + '\',this)"><span class="btn-icon">' + (isLearned ? ICONS.checkSmall : ICONS.star) + '</span> ' + (isLearned ? 'حفظتها' : 'حفظتها؟') + '</button>' +
        '</div>' +
      '</div>' +
      '<div class="card-back" onclick="flipCard(\'' + cardId + '\')">' +
        '<div class="card-de-big">' + w.de + '</div>' +
        (w.phonetic ? '<div class="card-phonetic">/' + w.phonetic + '/</div>' : '') +
        '<div class="card-ar-big">' + (w.ar || '') + '</div>' +
        (hasEx ? '<div class="card-example"><strong>' + w.example + '</strong>' + (w.ex_ar ? '<br><span style="color:#9E9D97">' + w.ex_ar + '</span>' : '') + '</div>' : '') +
        '<div class="flip-hint">اضغط للعودة</div>' +
      '</div>' +
    '</div>';
  }).join('');
}

// ============ GRAMMAR PAGE ============
let gramLevel = 'A1';
function setGramLevel(level, btn) {
  gramLevel = level;
  document.querySelectorAll('#gramLevelTabs .level-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderGrammar();
}
function toggleGram(id) {
  const body = document.getElementById('gbody_' + id);
  const arrow = document.getElementById('garrow_' + id);
  const open = body.classList.contains('open');
  body.classList.toggle('open', !open);
  arrow.classList.toggle('open', !open);
}
function renderGrammar() {
  const items = GRAMMAR[gramLevel] || [];
  const wrap = document.getElementById('gramContent');
  if (!items.length) {
    wrap.innerHTML = '<div class="empty-state"><div class="empty-icon">' + ICONS.hourglass + '</div><h3>قريباً</h3><p>محتوى هذا المستوى قيد الإعداد</p></div>';
    return;
  }
  wrap.innerHTML = items.map((item, i) => {
    const tableHtml = item.table ? (
      '<table class="gram-table"><tr>' +
      item.table.headers.map(h => '<th>' + h + '</th>').join('') +
      '</tr>' +
      item.table.rows.map(row => '<tr>' + row.map(c => '<td>' + c + '</td>').join('') + '</tr>').join('') +
      '</table>'
    ) : '';
    const examplesHtml = item.examples ? (
      '<div class="gram-examples">' +
      item.examples.map(ex => '<div class="gram-ex-item"><span class="de">' + ex.de + '</span><span class="ar">— ' + ex.ar + '</span></div>').join('') +
      '</div>'
    ) : '';
    return '<div class="gram-card">' +
      '<div class="gram-head" onclick="toggleGram(' + i + ')">' +
        '<div class="gram-num">' + (i+1) + '</div>' +
        '<div class="gram-title">' + item.title + '</div>' +
        '<div class="gram-arrow" id="garrow_' + i + '">' + ICONS.chevron + '</div>' +
      '</div>' +
      '<div class="gram-body" id="gbody_' + i + '">' +
        '<div class="gram-explain">' + item.explanation + '</div>' +
        tableHtml + examplesHtml +
      '</div>' +
    '</div>';
  }).join('');
}

// ============ LISTENING PAGE ============
let listenLevel = 'A1';
function setListenLevel(level, btn) {
  listenLevel = level;
  document.querySelectorAll('#listenLevelTabs .level-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderListening();
}
function speakGerman(text, btnId) {
  const btn = document.getElementById(btnId);
  if (!('speechSynthesis' in window)) {
    alert('متصفحك مش بيدعم خاصية النطق. جرّب Chrome.');
    return;
  }
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'de-DE';
  utter.rate = 0.85;
  btn.classList.add('playing');
  btn.innerHTML = ICONS.pause;
  utter.onend = () => { btn.classList.remove('playing'); btn.innerHTML = ICONS.play; };
  utter.onerror = () => { btn.classList.remove('playing'); btn.innerHTML = ICONS.play; };
  window.speechSynthesis.speak(utter);
}
function toggleListenAr(id) {
  document.getElementById('lar_' + id).classList.toggle('shown');
}
function renderListening() {
  const items = LISTENING[listenLevel] || [];
  const wrap = document.getElementById('listenList');
  if (!items.length) {
    wrap.innerHTML = '<div class="empty-state"><div class="empty-icon">' + ICONS.hourglass + '</div><h3>قريباً</h3><p>محتوى هذا المستوى قيد الإعداد</p></div>';
    return;
  }
  wrap.innerHTML = items.map((item, i) => {
    const btnId = 'lbtn_' + i;
    return '<div class="listen-card">' +
      '<button class="listen-btn" id="' + btnId + '" onclick="speakGerman(\'' + item.de.replace(/'/g,"\\'") + '\',\'' + btnId + '\')">' + ICONS.play + '</button>' +
      '<div class="listen-text">' +
        '<div class="listen-de">' + item.de + '</div>' +
        '<div class="listen-ar" id="lar_' + i + '">' + item.ar + '</div>' +
      '</div>' +
      '<button class="listen-toggle" onclick="toggleListenAr(' + i + ')"><span class="btn-icon">' + ICONS.eye + '</span> الترجمة</button>' +
    '</div>';
  }).join('');
}

// ============ READING PAGE ============
let readLevel = 'A1';
function setReadLevel(level, btn) {
  readLevel = level;
  document.querySelectorAll('#readLevelTabs .level-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderReading();
}
function renderReading() {
  const items = READING[readLevel] || [];
  const wrap = document.getElementById('readContent');
  if (!items.length) {
    wrap.innerHTML = '<div class="empty-state"><div class="empty-icon">' + ICONS.hourglass + '</div><h3>قريباً</h3><p>محتوى هذا المستوى قيد الإعداد</p></div>';
    return;
  }
  wrap.innerHTML = items.map(story => {
    const paras = story.paragraphs.map(p =>
      '<div class="read-para"><div class="read-de">' + p.de + '</div><div class="read-ar">' + p.ar + '</div></div>'
    ).join('');
    return '<div class="read-card"><div class="read-title">' + ICONS.bookOpen + ' ' + story.title + '</div>' + paras + '</div>';
  }).join('');
}

// ============ BLOG PAGE ============
function toggleBlog(id) {
  const body = document.getElementById('bbody_' + id);
  const arrow = document.getElementById('barrow_' + id);
  const open = body.classList.contains('open');
  body.classList.toggle('open', !open);
  arrow.classList.toggle('open', !open);
}
function renderBlog() {
  const wrap = document.getElementById('blogContent');
  wrap.innerHTML = BLOG.map((post, i) => {
    const paras = post.content.map(p => '<p>' + p + '</p>').join('');
    return '<div class="blog-card">' +
      '<div class="blog-head" onclick="toggleBlog(' + i + ')">' +
        '<div class="blog-icon">' + ICONS.pen + '</div>' +
        '<div class="blog-info"><div class="blog-title">' + post.title + '</div><div class="blog-summary">' + post.summary + '</div></div>' +
        '<div class="blog-arrow" id="barrow_' + i + '">' + ICONS.chevron + '</div>' +
      '</div>' +
      '<div class="blog-body" id="bbody_' + i + '">' + paras + '</div>' +
    '</div>';
  }).join('');
}


// ============ AI ASSISTANT ============
let aiHistory = [];
let aiOpen = false;
function toggleAIChat() {
  aiOpen = !aiOpen;
  document.getElementById('aiPanel').classList.toggle('open', aiOpen);
  if (aiOpen) document.getElementById('aiInput').focus();
}
function addAIMessage(text, cls) {
  const msgs = document.getElementById('aiMessages');
  const div = document.createElement('div');
  div.className = 'ai-msg ' + cls;
  div.textContent = text;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
  return div;
}
async function sendAIMessage() {
  const input = document.getElementById('aiInput');
  const text = input.value.trim();
  if (!text) return;
  const sendBtn = document.getElementById('aiSendBtn');

  addAIMessage(text, 'user');
  input.value = '';
  sendBtn.disabled = true;

  const loadingEl = addAIMessage('بيكتب...', 'bot loading');

  // Add mode context as system message if this is the first message
  if (aiHistory.length === 0 && currentAIMode !== 'auto' && AIModePrompts[currentAIMode]) {
    aiHistory.push({ role: 'system', content: 'أنت معلم ألماني محترف. ' + AIModePrompts[currentAIMode] });
  }
  aiHistory.push({ role: 'user', content: text });

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: aiHistory })
    });
    const data = await response.json();
    if (data && data.reply) {
      loadingEl.textContent = data.reply;
      loadingEl.classList.remove('loading');
      aiHistory.push({ role: 'assistant', content: data.reply });
    } else {
      loadingEl.textContent = (data && data.error) || 'حصل خطأ، جرّب تاني بعد شوية.';
      loadingEl.classList.remove('loading');
    }
  } catch (e) {
    loadingEl.textContent = 'حصل خطأ في الاتصال، جرّب تاني.';
    loadingEl.classList.remove('loading');
  }
  sendBtn.disabled = false;
}

// ============ QUIZ PAGE ============
let quizLevel = 'A1';
function setQuizLevel(level, btn) {
  quizLevel = level;
  document.querySelectorAll('#quizLevelTabs .level-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}
function startQuizFromSetup(type) {
  const count = parseInt(document.getElementById('quizCount').value) || 10;
  document.getElementById('quizSetup').style.display = 'none';
  QuizEngine.startQuiz(quizLevel, type, count);
  QuizEngine.renderQuizUI(document.getElementById('quizArea'), 0);
}

// ============ MY WORDS PAGE ============
function renderMyWords() {
  const area = document.getElementById('myWordsArea');
  const progress = Progress.load();
  const learned = Object.values(progress.wordsLearned || {});
  const mastered = Object.keys(progress.wordsMastered || {});

  if (learned.length === 0) {
    area.innerHTML = '<div class="empty-state"><div class="empty-icon">' + ICONS.search + '</div><h3>لسه ما اتعلمتอะไร</h3><p>ابدأ تعلم كلمات جديدة وهيظهر هنا</p></div>';
    return;
  }

  const allWords = [];
  ['A1','A2','B1','B2','C1','C2'].forEach(level => {
    if (!DATA[level]) return;
    Object.values(DATA[level].categories).forEach(words => {
      words.forEach(w => {
        const key = level + '_' + w.de;
        const learnedData = progress.wordsLearned[key];
        const isMastered = !!progress.wordsMastered[key];
        if (learnedData) {
          allWords.push({ ...w, level, key, learnedData, isMastered });
        }
      });
    });
  });

  let html = '<div class="mywords-header">';
  html += '<div class="mywords-stats">';
  html += '<div class="mywords-stat"><strong>' + allWords.length + '</strong><span>كلمة متعلمة</span></div>';
  html += '<div class="mywords-stat"><strong>' + mastered.length + '</strong><span>كلمة متقنة</span></div>';
  html += '</div>';
  html += '<div class="search-box"><input type="text" id="myWordsSearch" placeholder="ابحث في كلماتك..." oninput="filterMyWords()"></div>';
  html += '</div>';

  html += '<div class="mywords-tabs">';
  html += '<button class="mywords-tab active" onclick="filterMyWordsTab(\'all\',this)">الكل</button>';
  html += '<button class="mywords-tab" onclick="filterMyWordsTab(\'learning\',this)">بتعلمها</button>';
  html += '<button class="mywords-tab" onclick="filterMyWordsTab(\'mastered\',this)">متقنتها</button>';
  html += '<button class="mywords-tab" onclick="filterMyWordsTab(\'review\',this)">محتاجة مراجعة</button>';
  html += '</div>';

  html += '<div class="words-grid" id="myWordsGrid">';
  html += allWords.map(w => {
    const artClass = ['der','die','das'].includes(w.article) ? w.article : 'none';
    const artLabel = w.article && w.article !== 'none' ? w.article : '';
    const status = w.isMastered ? 'mastered' : (w.learnedData.reviewCount < 2 ? 'new' : 'learning');
    const statusLabel = w.isMastered ? 'متقنة' : (w.learnedData.reviewCount < 2 ? 'جديدة' : 'بتعلمها');
    const statusClass = w.isMastered ? 'status-mastered' : (w.learnedData.reviewCount < 2 ? 'status-new' : 'status-learning');
    return '<div class="word-card" data-status="' + status + '" data-level="' + w.level + '">' +
      '<div class="card-front">' +
        '<div class="card-de">' + w.de + '</div>' +
        (artLabel ? '<span class="card-article ' + artClass + '">' + artLabel + '</span>' : '') +
        '<div class="card-ar">' + (w.ar || '') + '</div>' +
        '<div class="mywords-status ' + statusClass + '">' + statusLabel + '</div>' +
        '<div class="mywords-meta">مراجعة: ' + w.learnedData.reviewCount + ' مرة | ' + w.level + '</div>' +
      '</div>' +
    '</div>';
  }).join('');
  html += '</div>';

  area.innerHTML = html;
}

function filterMyWords() {
  const query = document.getElementById('myWordsSearch')?.value?.toLowerCase() || '';
  const cards = document.querySelectorAll('#myWordsGrid .word-card');
  cards.forEach(card => {
    const text = card.textContent.toLowerCase();
    card.style.display = text.includes(query) ? '' : 'none';
  });
}

function filterMyWordsTab(status, btn) {
  document.querySelectorAll('.mywords-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const cards = document.querySelectorAll('#myWordsGrid .word-card');
  cards.forEach(card => {
    if (status === 'all') {
      card.style.display = '';
    } else {
      card.style.display = card.dataset.status === status ? '' : 'none';
    }
  });
}

// ============ DAILY GOALS WIDGET ============
function renderDailyGoals() {
  const progress = Progress.load();
  const daily = Progress.getDailyProgress(progress);
  const today = document.getElementById('dailyGoalWidget');
  if (!today) return;

  const pct = daily.dailyGoalType === 'words'
    ? Math.min(100, Math.round((daily.wordsStudied / daily.dailyGoalTarget) * 100))
    : Math.min(100, Math.round((daily.quizzesTaken / daily.dailyGoalTarget) * 100));

  today.innerHTML = '<div class="daily-goal-bar"><div class="daily-goal-fill" style="width:' + pct + '%"></div></div>' +
    '<div class="daily-goal-text">' + daily.wordsStudied + ' / ' + daily.dailyGoalTarget + (daily.dailyGoalType === 'words' ? ' كلمة' : ' كويز') +
    (daily.dailyGoalComplete ? ' ✅' : '') + '</div>';
}

// ============ AI MODES ============
let currentAIMode = 'auto';

const AIModePrompts = {
  auto: '',
  explain: 'اشرح لي كل كلمة جديدة تظهر في جملة. أعطني معناها بالعربية وافصلها. ',
  correct: 'أنا سأكتب جملة بالألماني، صحح لي أي أخطاء فيها وافسّر لي why. ',
  practice: 'احذرني بالألماني نشاط تدريب قصير وأنتظر إجابتي ثم صححها. ',
  grammar: 'أسألك عن قواعد نحوية ألمانية. أعطني إجابات واضحة مع أمثلة. ',
  vocabulary: 'علّمني كلمات جديدة في موضوع معين. أعطني الكلمة وترجمتها ونشأتها.'
};

function setAIMode(mode, btn) {
  currentAIMode = mode;
  document.querySelectorAll('.ai-mode-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  const welcomeMsgs = {
    auto: 'أهلاً! أنا Bat، مساعدك في تعلم الألماني 🇩🇪 اسألني عن أي كلمة أو قاعدة.',
    explain: 'وضع الشرح — اكتب أي كلمة ألمانية وأنا أشرحهالك بالمölly 🔍',
    correct: 'وضع التصحيح — اكتب جملة بالألماني وأنا أصححهالك ✍️',
    practice: 'وضع التدريب — جاهز أسوي لك نشاط تدريب قصير! 🏋️',
    grammar: 'وضع القواعد — اسأل عن أي قاعدة نحوية ألمانية 📐',
    vocabulary: 'وضع المفردات — قولي موضوع تحب تتعلم كلمات عنه 📚'
  };

  const messages = document.getElementById('aiMessages');
  messages.innerHTML = '<div class="ai-msg bot">' + welcomeMsgs[mode] + '</div>';
}

// ============ PLACEMENT TEST ============
const PLACEMENT_QUESTIONS = [
  { q: 'ما هو الترجمة الصحيحة لـ "Danke"؟', opts: ['شكراً', 'عفواً', 'مرحباً', 'مع السلامة'], correct: 0 },
  { q: 'أكمل: Ich ___ Student.', opts: ['bin', 'ist', 'bist', 'sind'], correct: 0 },
  { q: '"الكتاب" بالألماني:', opts: ['das Buch', 'die Buch', 'der Buch', 'ein Buch'], correct: 0 },
  { q: 'ما معنى "Guten Morgen"؟', opts: ['صباح الخير', 'مساء الخير', 'تصبح على خير', 'ليلة سعيدة'], correct: 0 },
  { q: 'أكمل: Sie ___ aus Ägypten.', opts: ['ist', 'bin', 'bist', 'sind'], correct: 3 },
  { q: '"القلم" بالألماني:', opts: ['der Stift', 'die Stift', 'das Stift', 'ein Stift'], correct: 0 },
  { q: 'ما هو جمع "das Kind"؟', opts: ['die Kinder', 'die Kinds', 'der Kinder', 'das Kinder'], correct: 0 },
  { q: 'أكمل: Wir ___ einen Hund.', opts: ['hat', 'habe', 'haben', 'hast'], correct: 2 },
  { q: '"أنا أأكل" بالألماني:', opts: ['Ich esse', 'Ich isst', 'Ich isst', 'Ich essen'], correct: 0 },
  { q: 'ما معنى "Entschuldigung"؟', opts: ['عفواً / آسف', 'شكراً', 'مرحباً', 'مع السلامة'], correct: 0 },
  { q: 'أكمل: Das ist ___ Buch.', opts: ['ein', 'eine', 'einer', 'eines'], correct: 0 },
  { q: '"البيت" بالألماني:', opts: ['das Haus', 'die Haus', 'der Haus', 'ein Haus'], correct: 0 },
  { q: 'ما هو المضارع من "gehen" (يرجع)؟', opts: ['gehe, gehst, geht', 'ginge, gingst, gingt', 'gehen, geht, gehen', 'ging, gingst, ging'], correct: 0 },
  { q: 'أكمل: Ich gehe ___ Supermarkt.', opts: ['zu', 'in', 'nach', 'auf'], correct: 1 },
  { q: '"ال school" بالألماني:', opts: ['die Schule', 'der Schule', 'das Schule', 'ein Schule'], correct: 0 },
  { q: 'ما معنى "Wie viel?"', opts: ['كم؟', 'متى؟', 'أين؟', 'لماذا؟'], correct: 0 },
  { q: 'أكمل: Er ___ Lehrer.', opts: ['ist', 'bin', 'bist', 'sind'], correct: 0 },
  { q: '"الماء" بالألماني:', opts: ['das Wasser', 'die Wasser', 'der Wasser', 'ein Wasser'], correct: 0 },
  { q: 'ما هو الماضي من "sein" (يكون)؟', opts: ['war', 'warst', 'wart', 'waren'], correct: 0 },
  { q: 'أكمل: Die Kinder ___ im Garten.', opts: ['spielen', 'spielt', 'spielst', 'spiele'], correct: 0 }
];

let placementState = { current: 0, score: 0, answered: false };

function startPlacement() {
  placementState = { current: 0, score: 0, answered: false };
  document.getElementById('placementWelcome').style.display = 'none';
  document.getElementById('placementResults').style.display = 'none';
  renderPlacementQuestion();
}

function renderPlacementQuestion() {
  const area = document.getElementById('placementQuiz');
  area.style.display = 'block';
  const i = placementState.current;
  const total = PLACEMENT_QUESTIONS.length;
  const pct = Math.round((i / total) * 100);

  area.innerHTML =
    '<div class="placement-progress">' +
      '<div class="placement-progress-bar"><div class="placement-progress-fill" style="width:' + pct + '%"></div></div>' +
      '<div class="placement-progress-text">سؤال ' + (i + 1) + ' من ' + total + '</div>' +
    '</div>' +
    '<div class="placement-question">' +
      '<h3>' + PLACEMENT_QUESTIONS[i].q + '</h3>' +
      '<div class="placement-options">' +
        PLACEMENT_QUESTIONS[i].opts.map(function(opt, idx) {
          return '<button class="placement-option" onclick="answerPlacement(' + idx + ',this)">' + opt + '</button>';
        }).join('') +
      '</div>' +
    '</div>';
  placementState.answered = false;
}

function answerPlacement(idx, btn) {
  if (placementState.answered) return;
  placementState.answered = true;

  const q = PLACEMENT_QUESTIONS[placementState.current];
  const opts = btn.parentElement.querySelectorAll('.placement-option');

  opts.forEach(function(opt, i) {
    opt.disabled = true;
    if (i === q.correct) opt.classList.add('correct');
    else if (i === idx && idx !== q.correct) opt.classList.add('incorrect');
  });

  if (idx === q.correct) placementState.score++;

  setTimeout(function() {
    placementState.current++;
    if (placementState.current < PLACEMENT_QUESTIONS.length) {
      renderPlacementQuestion();
    } else {
      showPlacementResults();
    }
  }, 800);
}

function showPlacementResults() {
  document.getElementById('placementQuiz').style.display = 'none';
  const area = document.getElementById('placementResults');
  area.style.display = 'block';

  const total = PLACEMENT_QUESTIONS.length;
  const pct = Math.round((placementState.score / total) * 100);
  let level, msg;

  if (pct >= 90) { level = 'C1-C2'; msg = 'ممتاز! مستواك عالي جداً. يمكنك التحدي مع النصوص المعقدة.'; }
  else if (pct >= 75) { level = 'B2'; msg = 'جيد جداً! أساسياتك قوية. ركّز على المحادثة والنصوص الطويلة.'; }
  else if (pct >= 60) { level = 'B1'; msg = 'جيد! عندك أساسيات جيدة. واصل التعلم وركّز على المحادثة.'; }
  else if (pct >= 45) { level = 'A2'; msg = 'مستوى مبتدئ+. ابدأ بالقواعد الأساسية والمفردات اليومية.'; }
  else if (pct >= 25) { level = 'A1'; msg = 'مبتدئ. ابدأ من الصفر مع التحيات والأرقام والأساسيات.'; }
  else { level = 'A0'; msg = 'لا تقلق! الكل يبدأ من الصفر. ابدأ مع الحروف والتحيات.'; }

  area.innerHTML =
    '<div class="placement-results">' +
      '<h2>🎉 نتيجة الاختبار</h2>' +
      '<div class="placement-level-display">' + level + '</div>' +
      '<div class="placement-score">لقد أجبت على ' + placementState.score + ' من ' + total + ' صحيحاً (' + pct + '%)</div>' +
      '<div class="placement-msg">' + msg + '</div>' +
      '<div class="placement-actions">' +
        '<button class="btn-primary" onclick="switchPage(\'home\')">ابدأ التعلم</button>' +
        '<button class="btn-secondary" onclick="resetPlacement()">أعد الاختبار</button>' +
      '</div>' +
    '</div>';

  // Save level to localStorage
  try {
    var prog = Progress.load();
    prog.placementLevel = level;
    Progress.save(prog);
  } catch(e) {}
}

function resetPlacement() {
  document.getElementById('placementResults').style.display = 'none';
  document.getElementById('placementWelcome').style.display = 'block';
}

// ============ SETTINGS PANEL ============
function toggleSettings() {
  var overlay = document.getElementById('settingsOverlay');
  var panel = document.getElementById('settingsPanel');
  overlay.classList.toggle('open');
  panel.classList.toggle('open');

  if (panel.classList.contains('open')) {
    loadSettings();
  }
}

function loadSettings() {
  try {
    var prog = Progress.load();
    var goalSelect = document.getElementById('settingsGoalSelect');
    if (goalSelect && prog.dailyGoal) {
      goalSelect.value = prog.dailyGoal;
    }
    var darkToggle = document.getElementById('darkModeToggle');
    if (darkToggle) {
      darkToggle.checked = document.documentElement.getAttribute('data-theme') === 'dark';
    }
  } catch(e) {}
}

function updateDailyGoal(val) {
  try {
    var prog = Progress.load();
    prog.dailyGoal = parseInt(val);
    Progress.save(prog);
    renderDailyGoals();
  } catch(e) {}
}

function toggleDarkMode(isDark) {
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  try { localStorage.setItem('dfa_theme', isDark ? 'dark' : 'light'); } catch(e) {}
}

function exportData() {
  try {
    var data = {};
    for (var i = 0; i < localStorage.length; i++) {
      var key = localStorage.key(i);
      if (key.indexOf('dfa_') === 0) {
        data[key] = localStorage.getItem(key);
      }
    }
    data.exportDate = new Date().toISOString();
    var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'deutsch-fuer-araber-backup-' + new Date().toISOString().slice(0, 10) + '.json';
    a.click();
    URL.revokeObjectURL(url);
  } catch(e) {
    alert('حدث خطأ أثناء التصدير');
  }
}

function importData(event) {
  var file = event.target.files[0];
  if (!file) return;
  var reader = new FileReader();
  reader.onload = function(e) {
    try {
      var data = JSON.parse(e.target.result);
      var count = 0;
      Object.keys(data).forEach(function(key) {
        if (key.indexOf('dfa_') === 0) {
          localStorage.setItem(key, data[key]);
          count++;
        }
      });
      alert('تم الاستيراد بنجاح! تم استعادة ' + count + ' عنصر.');
      location.reload();
    } catch(err) {
      alert('ملف غير صالح. تأكد من أن الملف من تصدير هذا التطبيق.');
    }
  };
  reader.readAsText(file);
}

function resetData() {
  if (!confirm('هل أنت متأكد من مسح جميع بياناتك؟ هذا الإجراء لا يمكن التراجع عنه.')) return;
  try {
    Object.keys(localStorage).forEach(function(key) {
      if (key.indexOf('dfa_') === 0) localStorage.removeItem(key);
    });
    alert('تم مسح جميع البيانات.');
    location.reload();
  } catch(e) {}
}

// ============ INIT ============
renderCats();
renderWords();
updateProgress();

// Load dark mode preference
(function() {
  try {
    var theme = localStorage.getItem('dfa_theme');
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  } catch(e) {}
}());