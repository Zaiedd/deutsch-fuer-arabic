// نظام بطاقات المفردات: مراجعة ب间隔 متكرر (Spaced Repetition)

const Flashcards = {
  _cards: [],
  _currentIndex: 0,
  _stats: { total: 0, known: 0, learning: 0, dontknow: 0 },
  _startTime: null,
  _containerId: null,
  _answered: false,

  startSession(words, containerId) {
    if (!words || !words.length) return false;
    this._cards = this.shuffle(words);
    this._currentIndex = 0;
    this._stats = { total: this._cards.length, known: 0, learning: 0, dontknow: 0 };
    this._startTime = Date.now();
    this._containerId = containerId;
    this._answered = false;
    return true;
  },

  getCurrentCard() {
    if (this._currentIndex >= this._cards.length) return null;
    return this._cards[this._currentIndex];
  },

  answer(type) {
    if (this._answered || this._currentIndex >= this._cards.length) return;
    this._answered = true;

    const card = this._cards[this._currentIndex];
    const level = Progress.level || 'A1';

    if (type === 'know') {
      this._stats.known++;
      Progress.masterWord(Progress.load(), level, card.de);
      const data = Progress.load();
      Progress.addXP(data, 3);
      Progress.save(data);
    } else if (type === 'learning') {
      this._stats.learning++;
      const data = Progress.load();
      Progress.learnWord(data, level, card.de);
      Progress.addXP(data, 1);
      Progress.save(data);
    } else if (type === 'dontknow') {
      this._stats.dontknow++;
      const data = Progress.load();
      Progress.learnWord(data, level, card.de);
      Progress.save(data);
    }
  },

  nextCard() {
    this._answered = false;
    this._currentIndex++;
    return this._currentIndex < this._cards.length;
  },

  isFinished() {
    return this._currentIndex >= this._cards.length;
  },

  getStats() {
    return { ...this._stats };
  },

  getProgressPercent() {
    if (!this._stats.total) return 0;
    const answered = this._stats.known + this._stats.learning + this._stats.dontknow;
    return Math.round((answered / this._stats.total) * 100);
  },

  getXP() {
    return this._stats.known * 3 + this._stats.learning * 1;
  },

  renderCard(container) {
    const card = this.getCurrentCard();
    if (!card) {
      this.renderResults(container);
      return;
    }

    const idx = this._currentIndex;
    const total = this._stats.total;
    const progress = this.getProgressPercent();
    const artClass = ['der', 'die', 'das'].includes(card.article) ? card.article : 'none';
    const artLabel = card.article && card.article !== 'none' ? card.article : '';
    const hasExample = card.example && card.example.trim();

    container.innerHTML =
      '<div class="fc-container">' +
        '<div class="fc-progress"><div class="fc-progress-fill" style="width:' + progress + '%"></div></div>' +
        '<div class="fc-counter">' + (idx + 1) + ' / ' + total + '</div>' +
        '<div class="fc-card" onclick="Flashcards._flip()">' +
          '<div class="fc-card-inner">' +
            '<div class="fc-front">' +
              (artLabel ? '<span class="fc-article ' + artClass + '">' + artLabel + '</span>' : '') +
              '<div class="fc-de">' + card.de + ' <button class="speak-btn" onclick="event.stopPropagation();speakGerman(\'' + card.de.replace(/'/g, "\\'") + '\')" title="اسمع النطق">🔊</button></div>' +
              '<div class="fc-ar">' + (card.ar || '') + '</div>' +
            '</div>' +
            '<div class="fc-back">' +
              (artLabel ? '<span class="fc-article ' + artClass + '">' + artLabel + '</span>' : '') +
              '<div class="fc-de">' + card.de + ' <button class="speak-btn" onclick="event.stopPropagation();speakGerman(\'' + card.de.replace(/'/g, "\\'") + '\')" title="اسمع النطق">🔊</button></div>' +
              (card.phonetic ? '<div class="fc-phonetic">/' + card.phonetic + '/</div>' : '') +
              '<div class="fc-ar">' + (card.ar || '') + '</div>' +
              (hasExample ?
                '<div class="fc-example">' +
                  '<div>' + card.example + ' <button class="speak-btn speak-btn-sm" onclick="event.stopPropagation();speakGerman(\'' + card.example.replace(/'/g, "\\'") + '\')" title="اسمع الجملة">🔊</button></div>' +
                  (card.ex_ar ? '<div class="fc-ex-ar">' + card.ex_ar + '</div>' : '') +
                '</div>' : '') +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="fc-actions">' +
          '<button class="fc-btn know" onclick="event.stopPropagation();handleFlashcardAnswer(\'know\')">عارفها</button>' +
          '<button class="fc-btn learning" onclick="event.stopPropagation();handleFlashcardAnswer(\'learning\')">بتعلمها</button>' +
          '<button class="fc-btn dontknow" onclick="event.stopPropagation();handleFlashcardAnswer(\'dontknow\')">مش عارفها</button>' +
        '</div>' +
      '</div>';

    this._answered = false;
  },

  _flip() {
    var card = document.querySelector('.fc-card');
    if (card) card.classList.toggle('flipped');
  },

  renderResults(container) {
    var stats = this.getStats();
    var xp = this.getXP();
    var duration = Math.round((Date.now() - this._startTime) / 1000);
    var mins = Math.floor(duration / 60);
    var secs = duration % 60;
    var accuracy = stats.total > 0 ? Math.round((stats.known / stats.total) * 100) : 0;

    var msg;
    if (accuracy >= 80) msg = 'ممتاز! أداء رائع في المراجعة!';
    else if (accuracy >= 60) msg = 'جيد جداً! واصل المراجعة!';
    else if (accuracy >= 40) msg = 'محتاج مراجعة تانية عشان تتقنها.';
    else msg = 'محتاج تكرر المراجعة. لا تستسلم!';

    container.innerHTML =
      '<div class="fc-results">' +
        '<div class="fc-results-score">' + accuracy + '%</div>' +
        '<div class="fc-results-msg">' + msg + '</div>' +
        '<div class="fc-results-stats">' +
          '<div class="fc-stat-item">' +
            '<span class="fc-stat-value">' + stats.total + '</span>' +
            '<span class="fc-stat-label">إجمالي</span>' +
          '</div>' +
          '<div class="fc-stat-item">' +
            '<span class="fc-stat-value">' + stats.known + '</span>' +
            '<span class="fc-stat-label">عارفها</span>' +
          '</div>' +
          '<div class="fc-stat-item">' +
            '<span class="fc-stat-value">' + stats.learning + '</span>' +
            '<span class="fc-stat-label">بتعلمها</span>' +
          '</div>' +
          '<div class="fc-stat-item">' +
            '<span class="fc-stat-value">' + stats.dontknow + '</span>' +
            '<span class="fc-stat-label">مش عارفها</span>' +
          '</div>' +
          '<div class="fc-stat-item">' +
            '<span class="fc-stat-value">' + mins + ':' + (secs < 10 ? '0' : '') + secs + '</span>' +
            '<span class="fc-stat-label">المدة</span>' +
          '</div>' +
          '<div class="fc-stat-item">' +
            '<span class="fc-stat-value">+' + xp + '</span>' +
            '<span class="fc-stat-label">XP</span>' +
          '</div>' +
        '</div>' +
        '<div class="fc-results-btn">' +
          '<button class="fc-btn know" onclick="handleFlashcardRetry()">إعادة المراجعة</button>' +
          '<button class="fc-btn dontknow" onclick="handleFlashcardBack()">العودة</button>' +
        '</div>' +
      '</div>';

    var data = Progress.load();
    Progress.addXP(data, xp);
    Progress.markStudied(data);
    Progress.ensureToday(data);
    Progress.save(data);
  },

  startMode(containerId) {
    var container = document.getElementById(containerId);
    if (!container) return;

    container.style.display = 'block';
    container.scrollIntoView({ behavior: 'smooth' });

    var data = Progress.load();
    var wordsForReview = Progress.getWordsForReview(data);
    var words = [];

    if (wordsForReview.length >= 5) {
      words = wordsForReview;
    } else {
      var level = data.level || 'A1';
      var allWords = [];
      var categories = DATA[level] && DATA[level].categories;
      if (categories) {
        for (var cat in categories) {
          categories[cat].forEach(function(w) { allWords.push(w); });
        }
      }
      var shuffled = this.shuffle(allWords);
      words = shuffled.slice(0, Math.min(10, shuffled.length));
    }

    if (!words.length) {
      container.innerHTML =
        '<div class="fc-container">' +
          '<div class="fc-results-msg" style="padding:40px 20px">مفيش كلمات للمراجعة حالياً. اتعلم كلمات جديدة الأول!</div>' +
          '<div class="fc-results-btn">' +
            '<button class="fc-btn dontknow" onclick="handleFlashcardBack()">العودة</button>' +
          '</div>' +
        '</div>';
      return;
    }

    this.startSession(words, containerId);
    this.renderCard(container);
  },

  shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i];
      a[i] = a[j];
      a[j] = tmp;
    }
    return a;
  }
};

window.flashcardState = {
  containerId: 'flashcard-area'
};

function handleFlashcardAnswer(type) {
  Flashcards.answer(type);
  if (Flashcards.isFinished()) {
    var container = document.getElementById(window.flashcardState.containerId);
    if (container) Flashcards.renderResults(container);
  } else {
    Flashcards.nextCard();
    var container = document.getElementById(window.flashcardState.containerId);
    if (container) Flashcards.renderCard(container);
  }
}

function handleFlashcardNext() {
  Flashcards.nextCard();
  var container = document.getElementById(window.flashcardState.containerId);
  if (container) {
    if (Flashcards.isFinished()) {
      Flashcards.renderResults(container);
    } else {
      Flashcards.renderCard(container);
    }
  }
}

function handleFlashcardRetry() {
  var cid = window.flashcardState.containerId;
  Flashcards.startMode(cid);
}

function handleFlashcardBack() {
  var container = document.getElementById(window.flashcardState.containerId);
  if (container) container.style.display = 'none';
  if (typeof showLevelSelect === 'function') {
    showLevelSelect();
  }
}

function startFlashcards(containerId) {
  containerId = containerId || 'flashcard-area';
  window.flashcardState.containerId = containerId;
  Flashcards.startMode(containerId);
}
