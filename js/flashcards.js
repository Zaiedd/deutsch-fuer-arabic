// ============================================
// Deutsch fuer Araber - Flashcards System
// With spaced repetition and flip animation
// ============================================

const Flashcards = (function() {
  'use strict';

  var cards = [];
  var currentIndex = 0;
  var stats = { total: 0, easy: 0, ok: 0, hard: 0 };
  var startTime = null;
  var answered = false;

  function init() {
    var startBtn = document.getElementById('fc-start-btn');
    var restartBtn = document.getElementById('fc-restart-btn');
    var hardBtn = document.getElementById('fc-hard-btn');
    var okBtn = document.getElementById('fc-ok-btn');
    var easyBtn = document.getElementById('fc-easy-btn');
    var container = document.getElementById('flashcard-container');

    if (startBtn) startBtn.addEventListener('click', startSession);
    if (restartBtn) restartBtn.addEventListener('click', restartSession);
    if (hardBtn) hardBtn.addEventListener('click', function() { answer('hard'); });
    if (okBtn) okBtn.addEventListener('click', function() { answer('ok'); });
    if (easyBtn) easyBtn.addEventListener('click', function() { answer('easy'); });
    if (container) {
      container.addEventListener('click', flipCard);
      container.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          flipCard();
        }
      });
    }
  }

  function startSession() {
    var levelEl = document.getElementById('fc-level');
    var catEl = document.getElementById('fc-category');
    var countEl = document.getElementById('fc-count');

    var level = levelEl ? levelEl.value : 'A1';
    var category = catEl ? catEl.value : 'all';
    var count = countEl ? parseInt(countEl.value) : 10;

    // Get words
    var allWords = [];
    if (typeof VocabularyData !== 'undefined') {
      allWords = VocabularyData.getWords(level, category);
    }

    // Prioritize learning words, then new words
    var learningWords = [];
    if (typeof Progress !== 'undefined') {
      var myLearning = Progress.getMyWords('learning');
      var myKnown = Progress.getMyWords('known');
      var knownDe = myKnown.map(function(w) { return w.de; });

      allWords.forEach(function(w) {
        if (knownDe.indexOf(w.de) >= 0) return;
        if (myLearning.some(function(l) { return l.de === w.de; })) {
          learningWords.push(w);
        }
      });
    }

    // Shuffle and select
    var selected = shuffle(learningWords.length > 0 ? learningWords : allWords).slice(0, count);

    if (selected.length === 0) {
      showToast('لا توجد كلمات لهذا المستوى. ابدأ بتعلم المفردات أولاً.', 'info');
      return;
    }

    cards = selected;
    currentIndex = 0;
    stats = { total: cards.length, easy: 0, ok: 0, hard: 0 };
    startTime = Date.now();
    answered = false;

    // Hide settings, show cards
    var settings = document.getElementById('flashcard-settings');
    var area = document.getElementById('flashcard-area');
    var complete = document.getElementById('flashcard-complete');
    if (settings) settings.style.display = 'none';
    if (complete) complete.style.display = 'none';
    if (area) area.style.display = 'block';

    updateCounters();
    showCard();
  }

  function showCard() {
    if (currentIndex >= cards.length) {
      showComplete();
      return;
    }

    var card = cards[currentIndex];
    var frontArticle = document.getElementById('fc-front-article');
    var frontWord = document.getElementById('fc-front-word');
    var backTranslation = document.getElementById('fc-back-translation');
    var backExample = document.getElementById('fc-back-example');
    var currentEl = document.getElementById('fc-current');
    var totalEl = document.getElementById('fc-total');

    // Set content
    if (frontArticle) {
      if (card.article && card.article !== 'none') {
        frontArticle.textContent = card.article;
        frontArticle.className = 'flashcard-article article-' + card.article;
      } else {
        frontArticle.textContent = '';
        frontArticle.className = 'flashcard-article';
      }
    }
    if (frontWord) frontWord.textContent = card.de;
    if (backTranslation) backTranslation.textContent = card.ar;
    if (backExample) {
      if (card.example) {
        backExample.textContent = card.example;
      } else {
        backExample.textContent = '';
      }
    }
    if (currentEl) currentEl.textContent = currentIndex + 1;
    if (totalEl) totalEl.textContent = cards.length;

    // Reset flip state
    var flashcard = document.getElementById('flashcard');
    if (flashcard) flashcard.classList.remove('flipped');

    // Reset button states
    answered = false;
    enableControls(true);

    updateProgress();
  }

  function flipCard() {
    var flashcard = document.getElementById('flashcard');
    if (flashcard) flashcard.classList.toggle('flipped');
  }

  function answer(type) {
    if (answered) return;
    answered = true;

    var card = cards[currentIndex];

    if (type === 'easy') {
      stats.easy++;
      if (typeof Progress !== 'undefined') Progress.markWord(card.de, 'known');
      addXP(3);
    } else if (type === 'ok') {
      stats.ok++;
      if (typeof Progress !== 'undefined') Progress.markWord(card.de, 'learning');
      addXP(1);
    } else if (type === 'hard') {
      stats.hard++;
      if (typeof Progress !== 'undefined') Progress.markWord(card.de, 'learning');
      addXP(1);
    }

    updateCounters();
    enableControls(false);

    // Auto-advance after a short delay
    setTimeout(function() {
      currentIndex++;
      showCard();
    }, 500);
  }

  function showComplete() {
    var area = document.getElementById('flashcard-area');
    var complete = document.getElementById('flashcard-complete');
    var finalEasy = document.getElementById('fc-final-easy');
    var finalOk = document.getElementById('fc-final-ok');
    var finalHard = document.getElementById('fc-final-hard');

    if (area) area.style.display = 'none';
    if (complete) complete.style.display = 'block';
    if (finalEasy) finalEasy.textContent = stats.easy;
    if (finalOk) finalOk.textContent = stats.ok;
    if (finalHard) finalHard.textContent = stats.hard;

    // Record session
    if (typeof Progress !== 'undefined') {
      var data = Progress.load();
      Progress.markStudied(data);
      Progress.save(data);
      Progress.checkAchievements();
    }
  }

  function restartSession() {
    var settings = document.getElementById('flashcard-settings');
    var area = document.getElementById('flashcard-area');
    var complete = document.getElementById('flashcard-complete');

    if (complete) complete.style.display = 'none';
    if (area) area.style.display = 'none';
    if (settings) settings.style.display = 'block';
  }

  function updateCounters() {
    var hardCount = document.getElementById('fc-hard-count');
    var okCount = document.getElementById('fc-ok-count');
    var easyCount = document.getElementById('fc-easy-count');

    if (hardCount) hardCount.textContent = stats.hard;
    if (okCount) okCount.textContent = stats.ok;
    if (easyCount) easyCount.textContent = stats.easy;
  }

  function updateProgress() {
    var answered = stats.easy + stats.ok + stats.hard;
    var pct = cards.length > 0 ? Math.round((answered / cards.length) * 100) : 0;
    // Could update a progress bar if one exists
  }

  function enableControls(enabled) {
    var hardBtn = document.getElementById('fc-hard-btn');
    var okBtn = document.getElementById('fc-ok-btn');
    var easyBtn = document.getElementById('fc-easy-btn');
    if (hardBtn) hardBtn.disabled = !enabled;
    if (okBtn) okBtn.disabled = !enabled;
    if (easyBtn) easyBtn.disabled = !enabled;
  }

  function addXP(amount) {
    if (typeof Progress !== 'undefined') {
      var data = Progress.load();
      Progress.addXP(data, amount);
      Progress.save(data);
    }
  }

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i];
      a[i] = a[j];
      a[j] = tmp;
    }
    return a;
  }

  function showToast(msg, type) {
    if (typeof App !== 'undefined' && App.showToast) {
      App.showToast(msg, type);
    }
  }

  return {
    init: init,
    startSession: startSession,
    restartSession: restartSession
  };
})();

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', Flashcards.init);
}
