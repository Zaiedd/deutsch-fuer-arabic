// منطق الموقع: التنقل بين الصفحات، عرض المحتوى، والمساعد الذكي
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
}
let gramInit=false, listenInit=false, readInit=false, blogInit=false;

// ============ VOCAB PAGE (existing) ============
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
  btn.textContent = learnedWords[key] ? '✓ حفظتها' : '☆ حفظتها؟';
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
    grid.innerHTML = '<div class="empty-state"><div class="empty-icon">🔍</div><h3>لا توجد نتائج</h3><p>جرّب كلمة بحث مختلفة</p></div>';
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
        '<div class="card-de">' + w.de + '</div>' +
        (artLabel ? '<span class="card-article ' + artClass + '">' + artLabel + '</span>' : '') +
        '<div class="card-ar">' + (w.ar || '') + '</div>' +
        '<div class="card-ex">' + (hasEx ? w.example : '<span class="no-example">لا يوجد مثال</span>') + '</div>' +
        '<div class="card-actions">' +
          '<button class="card-btn" onclick="event.stopPropagation();flipCard(\'' + cardId + '\')">🔄 اقلب</button>' +
          '<button class="card-btn ' + (isLearned ? 'learned' : '') + '" onclick="event.stopPropagation();toggleLearned(\'' + key + '\',this)">' + (isLearned ? '✓ حفظتها' : '☆ حفظتها؟') + '</button>' +
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
    wrap.innerHTML = '<div class="empty-state"><div class="empty-icon">🚧</div><h3>قريباً</h3><p>محتوى هذا المستوى قيد الإعداد</p></div>';
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
        '<div class="gram-arrow" id="garrow_' + i + '">▶</div>' +
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
  btn.textContent = '⏸';
  utter.onend = () => { btn.classList.remove('playing'); btn.textContent = '▶'; };
  utter.onerror = () => { btn.classList.remove('playing'); btn.textContent = '▶'; };
  window.speechSynthesis.speak(utter);
}
function toggleListenAr(id) {
  document.getElementById('lar_' + id).classList.toggle('shown');
}
function renderListening() {
  const items = LISTENING[listenLevel] || [];
  const wrap = document.getElementById('listenList');
  if (!items.length) {
    wrap.innerHTML = '<div class="empty-state"><div class="empty-icon">🚧</div><h3>قريباً</h3><p>محتوى هذا المستوى قيد الإعداد</p></div>';
    return;
  }
  wrap.innerHTML = items.map((item, i) => {
    const btnId = 'lbtn_' + i;
    return '<div class="listen-card">' +
      '<button class="listen-btn" id="' + btnId + '" onclick="speakGerman(\'' + item.de.replace(/'/g,"\\'") + '\',\'' + btnId + '\')">▶</button>' +
      '<div class="listen-text">' +
        '<div class="listen-de">' + item.de + '</div>' +
        '<div class="listen-ar" id="lar_' + i + '">' + item.ar + '</div>' +
      '</div>' +
      '<button class="listen-toggle" onclick="toggleListenAr(' + i + ')">👁 الترجمة</button>' +
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
    wrap.innerHTML = '<div class="empty-state"><div class="empty-icon">🚧</div><h3>قريباً</h3><p>محتوى هذا المستوى قيد الإعداد</p></div>';
    return;
  }
  wrap.innerHTML = items.map(story => {
    const paras = story.paragraphs.map(p =>
      '<div class="read-para"><div class="read-de">' + p.de + '</div><div class="read-ar">' + p.ar + '</div></div>'
    ).join('');
    return '<div class="read-card"><div class="read-title">📖 ' + story.title + '</div>' + paras + '</div>';
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
        '<div class="blog-icon">' + post.icon + '</div>' +
        '<div class="blog-info"><div class="blog-title">' + post.title + '</div><div class="blog-summary">' + post.summary + '</div></div>' +
        '<div class="blog-arrow" id="barrow_' + i + '">▶</div>' +
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
  aiHistory.push({ role: 'user', content: text });

  try {
    // بنكلم الباك-إند بتاعنا (/api/chat) بدل ما نكلم الـ AI مباشرة،
    // عشان مفتاح الـ API يفضل مخبّي وآمن على السيرفر ومحدش يقدر يسرقه من المتصفح.
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

// ============ INIT ============
renderCats();
renderWords();
updateProgress();