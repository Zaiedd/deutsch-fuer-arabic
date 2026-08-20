// ============================================
// Deutsch fuer Araber - Main Application
// Handles navigation, tabs, vocab, grammar,
// AI chat, settings, and all page logic
// ============================================

const App = (function() {
  'use strict';

  // ---- State ----
  let currentPage = 'page-home';
  let currentLevel = 'A1';
  let currentCategory = 'all';
  let currentGrammarCat = 'all';
  let aiMode = 'explain';
  let chatHistory = [];
  let tipIndex = 0;
  let tipTimer = null;

  // ---- Initialize ----
  function init() {
    initNavigation();
    initTabs();
    initHomePage();
    initLearnPage();
    initPracticePage();
    initAIPage();
    initProgressPage();
    initSettingsPage();
    initModals();
    initDarkMode();
    initTooltips();
    loadProgress();
    updateLevelProgress();
    showPage('page-home');
  }

  // ---- Navigation ----
  function initNavigation() {
    // All nav links (desktop + mobile)
    document.querySelectorAll('[data-page]').forEach(function(el) {
      el.addEventListener('click', function(e) {
        e.preventDefault();
        var page = this.getAttribute('data-page');
        if (page) navigateTo(page);
      });
    });
  }

  function navigateTo(pageId) {
    var page = document.getElementById(pageId);
    if (!page) return;

    // Hide all pages
    document.querySelectorAll('.page').forEach(function(p) {
      p.style.display = 'none';
      p.classList.remove('active');
    });

    // Show target page
    page.style.display = 'block';
    page.classList.add('active');
    currentPage = pageId;

    // Update nav active states
    document.querySelectorAll('.nav-link').forEach(function(link) {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
      if (link.getAttribute('data-page') === pageId) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    });
    document.querySelectorAll('.bottom-nav-link').forEach(function(link) {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
      if (link.getAttribute('data-page') === pageId) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    });

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Page-specific init
    if (pageId === 'page-progress') refreshProgressPage();
    if (pageId === 'page-home') updateLevelProgress();
  }

  // ---- Tab System ----
  function initTabs() {
    document.querySelectorAll('.tab-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var tabId = this.getAttribute('data-tab');
        var parent = this.closest('.page');
        if (!parent || !tabId) return;

        // Deactivate all tabs in this group
        parent.querySelectorAll('.tab-btn').forEach(function(t) {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        // Activate clicked tab
        this.classList.add('active');
        this.setAttribute('aria-selected', 'true');

        // Hide all tab-pages in this group
        parent.querySelectorAll('.tab-page').forEach(function(tp) {
          tp.style.display = 'none';
          tp.classList.remove('active');
        });
        // Show target tab-page
        var target = document.getElementById(tabId);
        if (target) {
          target.style.display = 'block';
          target.classList.add('active');
        }
      });
    });
  }

  function switchToTab(pageId, tabId) {
    navigateTo(pageId);
    var tabBtn = document.querySelector('[data-tab="' + tabId + '"]');
    if (tabBtn) tabBtn.click();
  }

  // ---- Home Page ----
  function initHomePage() {
    // Tips carousel
    var dots = document.querySelectorAll('.tip-dot');
    var cards = document.querySelectorAll('.tip-card');
    if (dots.length && cards.length) {
      dots.forEach(function(dot) {
        dot.addEventListener('click', function() {
          var idx = parseInt(this.getAttribute('data-index'));
          showTip(idx);
        });
      });
      // Auto-rotate tips
      tipTimer = setInterval(function() {
        tipIndex = (tipIndex + 1) % cards.length;
        showTip(tipIndex);
      }, 5000);
    }

    // Level cards click
    document.querySelectorAll('.level-card').forEach(function(card) {
      card.addEventListener('click', function() {
        var level = this.getAttribute('data-level');
        currentLevel = level;
        switchToTab('page-learn', 'learn-vocab');
        setVocabLevel(level);
      });
      card.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.click();
        }
      });
    });

    // Topic cards
    document.querySelectorAll('.topic-card').forEach(function(card) {
      card.addEventListener('click', function() {
        var page = this.getAttribute('data-page');
        var tab = this.getAttribute('data-tab');
        if (page && tab) switchToTab(page, tab);
      });
    });
  }

  function showTip(index) {
    var cards = document.querySelectorAll('.tip-card');
    var dots = document.querySelectorAll('.tip-dot');
    cards.forEach(function(c, i) {
      c.classList.toggle('active', i === index);
      c.style.display = i === index ? 'block' : 'none';
    });
    dots.forEach(function(d, i) {
      d.classList.toggle('active', i === index);
      d.setAttribute('aria-selected', i === index ? 'true' : 'false');
    });
    tipIndex = index;
  }

  function updateLevelProgress() {
    if (typeof Progress === 'undefined') return;
    document.querySelectorAll('.level-card').forEach(function(card) {
      var level = card.getAttribute('data-level');
      var pct = Progress.getLevelProgress(level);
      var fill = card.querySelector('.level-progress-fill');
      var text = card.querySelector('.level-progress-text');
      if (fill) {
        fill.style.width = pct + '%';
        fill.setAttribute('aria-valuenow', pct);
      }
      if (text) text.textContent = pct + '%';
    });
  }

  // ---- Learn Page (Vocabulary) ----
  function initLearnPage() {
    // Level filter chips
    document.querySelectorAll('[data-level]').forEach(function(chip) {
      if (chip.closest('#learn-vocab')) {
        chip.addEventListener('click', function() {
          var parent = this.closest('.filter-group');
          parent.querySelectorAll('.filter-chip').forEach(function(c) {
            c.classList.remove('active');
            c.setAttribute('aria-checked', 'false');
          });
          this.classList.add('active');
          this.setAttribute('aria-checked', 'true');
          currentLevel = this.getAttribute('data-level');
          renderVocabulary();
        });
      }
    });

    // Category filter chips
    document.querySelectorAll('[data-category]').forEach(function(chip) {
      chip.addEventListener('click', function() {
        var parent = this.closest('.filter-group');
        parent.querySelectorAll('.filter-chip').forEach(function(c) {
          c.classList.remove('active');
          c.setAttribute('aria-checked', 'false');
        });
        this.classList.add('active');
        this.setAttribute('aria-checked', 'true');
        currentCategory = this.getAttribute('data-category');
        renderVocabulary();
      });
    });

    // Grammar category filter
    document.querySelectorAll('[data-grammar-cat]').forEach(function(chip) {
      chip.addEventListener('click', function() {
        var parent = this.closest('.filter-group');
        parent.querySelectorAll('.filter-chip').forEach(function(c) {
          c.classList.remove('active');
          c.setAttribute('aria-checked', 'false');
        });
        this.classList.add('active');
        this.setAttribute('aria-checked', 'true');
        currentGrammarCat = this.getAttribute('data-grammar-cat');
        renderGrammar();
      });
    });

    // Reading click-to-translate
    document.querySelectorAll('.de-word').forEach(function(word) {
      word.addEventListener('click', function() {
        var translation = this.getAttribute('data-translation');
        var passage = this.closest('.reading-passage');
        if (!passage) return;
        var transArea = passage.querySelector('.reading-translation');
        if (transArea && translation) {
          transArea.innerHTML = '<strong>' + this.textContent + '</strong> = ' + translation;
        }
        // Highlight this word
        passage.querySelectorAll('.de-word').forEach(function(w) {
          w.classList.remove('highlighted');
        });
        this.classList.add('highlighted');
      });
    });

    // Listening speed buttons
    document.querySelectorAll('.speed-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var parent = this.closest('.speed-selector');
        parent.querySelectorAll('.speed-btn').forEach(function(b) {
          b.classList.remove('active');
          b.setAttribute('aria-checked', 'false');
        });
        this.classList.add('active');
        this.setAttribute('aria-checked', 'true');
      });
    });

    renderVocabulary();
    renderGrammar();
  }

  function setVocabLevel(level) {
    currentLevel = level;
    // Update level filter chips
    document.querySelectorAll('#learn-vocab [data-level]').forEach(function(chip) {
      chip.classList.toggle('active', chip.getAttribute('data-level') === level);
      chip.setAttribute('aria-checked', chip.getAttribute('data-level') === level ? 'true' : 'false');
    });
    renderVocabulary();
  }

  function renderVocabulary() {
    var grid = document.getElementById('vocab-grid');
    if (!grid || typeof VocabularyData === 'undefined') return;

    var words = VocabularyData.getWords(currentLevel, currentCategory);
    if (!words || words.length === 0) {
      grid.innerHTML = '<div class="vocab-empty-state"><span class="vocab-empty-icon" aria-hidden="true">📖</span><p>لا توجد مفردات在这个 المستوى والتصنيف</p></div>';
      return;
    }

    grid.innerHTML = '';
    words.forEach(function(word) {
      var articleClass = '';
      if (word.article === 'der') articleClass = 'article-der';
      else if (word.article === 'die') articleClass = 'article-die';
      else if (word.article === 'das') articleClass = 'article-das';

      var known = typeof Progress !== 'undefined' && Progress.isWordKnown(word.de);
      var learning = typeof Progress !== 'undefined' && Progress.isWordLearning(word.de);

      var statusClass = '';
      if (known) statusClass = 'word-known';
      else if (learning) statusClass = 'word-learning';

      var card = document.createElement('div');
      card.className = 'vocab-card ' + statusClass;
      card.setAttribute('role', 'listitem');
      card.innerHTML =
        '<div class="vocab-card-top">' +
          '<span class="vocab-article ' + articleClass + '">' + (word.article || '') + '</span>' +
          '<span class="vocab-german" lang="de" dir="ltr">' + word.de + '</span>' +
          '<span class="vocab-pronunciation" lang="de" dir="ltr">' + (word.pronunciation || '') + '</span>' +
        '</div>' +
        '<div class="vocab-card-bottom">' +
          '<span class="vocab-arabic">' + word.ar + '</span>' +
          '<span class="vocab-level-tag">' + word.level + '</span>' +
        '</div>' +
        '<div class="vocab-card-actions">' +
          '<button class="vocab-action-btn vocab-know-btn" data-word="' + word.de + '" title="أعرفها" aria-label="أعرف هذه الكلمة">✓</button>' +
          '<button class="vocab-action-btn vocab-learn-btn" data-word="' + word.de + '" title="أتعلمها" aria-label="أتعلم هذه الكلمة">↻</button>' +
        '</div>';

      // Mark as known/learning
      card.querySelector('.vocab-know-btn').addEventListener('click', function(e) {
        e.stopPropagation();
        var w = this.getAttribute('data-word');
        if (typeof Progress !== 'undefined') Progress.markWord(w, 'known');
        showToast('تمت إضافة "' + w + '" للكلمات المعروفة', 'success');
        renderVocabulary();
      });
      card.querySelector('.vocab-learn-btn').addEventListener('click', function(e) {
        e.stopPropagation();
        var w = this.getAttribute('data-word');
        if (typeof Progress !== 'undefined') Progress.markWord(w, 'learning');
        showToast('تمت إضافة "' + w + '" للكلمات قيد التعلم', 'info');
        renderVocabulary();
      });

      grid.appendChild(card);
    });
  }

  // ---- Learn Page (Grammar) ----
  function renderGrammar() {
    var list = document.getElementById('grammar-list');
    if (!list || typeof VocabularyData === 'undefined') return;

    var rules = VocabularyData.getGrammarRules ? VocabularyData.getGrammarRules(currentGrammarCat) : [];
    if (!rules || rules.length === 0) {
      list.innerHTML = '<div class="grammar-empty-state"><span class="grammar-empty-icon" aria-hidden="true">📝</span><p>لا توجد قواعد在这个 التصنيف</p></div>';
      return;
    }

    list.innerHTML = '';
    rules.forEach(function(rule) {
      var item = document.createElement('div');
      item.className = 'grammar-item';
      item.setAttribute('role', 'listitem');
      item.innerHTML =
        '<div class="grammar-header">' +
          '<h3 class="grammar-title">' + rule.title + '</h3>' +
          '<span class="grammar-level tag-' + rule.level.toLowerCase() + '">' + rule.level + '</span>' +
          '<span class="grammar-toggle" aria-hidden="true">▼</span>' +
        '</div>' +
        '<div class="grammar-body" style="display:none">' +
          '<p class="grammar-explanation">' + rule.explanation + '</p>' +
          '<div class="grammar-examples">' +
            (rule.examples || []).map(function(ex) {
              return '<div class="grammar-example"><span class="de-word" dir="ltr" lang="de">' + ex.de + '</span> <span class="grammar-example-ar">' + ex.ar + '</span></div>';
            }).join('') +
          '</div>' +
          '<button class="btn btn-sm btn-outline grammar-practice-btn" data-level="' + rule.level + '">تدرب على هذا</button>' +
        '</div>';

      item.querySelector('.grammar-header').addEventListener('click', function() {
        var body = this.nextElementSibling;
        var toggle = this.querySelector('.grammar-toggle');
        if (body.style.display === 'none') {
          body.style.display = 'block';
          if (toggle) toggle.textContent = '▲';
        } else {
          body.style.display = 'none';
          if (toggle) toggle.textContent = '▼';
        }
      });

      var practiceBtn = item.querySelector('.grammar-practice-btn');
      if (practiceBtn) {
        practiceBtn.addEventListener('click', function() {
          var level = this.getAttribute('data-level');
          navigateTo('page-practice');
          // Switch to quiz tab
          var quizTab = document.querySelector('[data-tab="practice-quiz"]');
          if (quizTab) quizTab.click();
          // Set level and start quiz
          var levelSelect = document.getElementById('quiz-level');
          if (levelSelect) levelSelect.value = level;
        });
      }

      list.appendChild(item);
    });
  }

  // ---- Practice Page (Quiz) ----
  function initPracticePage() {
    var startBtn = document.getElementById('quiz-start-btn');
    var nextBtn = document.getElementById('quiz-next-btn');
    var retryBtn = document.getElementById('quiz-retry-btn');

    if (startBtn) startBtn.addEventListener('click', startQuiz);
    if (nextBtn) nextBtn.addEventListener('click', nextQuizQuestion);
    if (retryBtn) retryBtn.addEventListener('click', resetQuiz);

    // Quiz type selection
    document.querySelectorAll('.quiz-type-card').forEach(function(card) {
      card.addEventListener('click', function() {
        document.querySelectorAll('.quiz-type-card').forEach(function(c) {
          c.classList.remove('active');
          c.setAttribute('aria-checked', 'false');
        });
        this.classList.add('active');
        this.setAttribute('aria-checked', 'true');
      });
    });
  }

  var quizState = {
    questions: [],
    currentIndex: 0,
    score: 0,
    mistakes: [],
    type: 'vocab',
    level: 'A1'
  };

  function startQuiz() {
    var typeEl = document.querySelector('.quiz-type-card.active');
    var levelEl = document.getElementById('quiz-level');
    quizState.type = typeEl ? typeEl.getAttribute('data-quiz-type') : 'vocab';
    quizState.level = levelEl ? levelEl.value : 'A1';
    quizState.currentIndex = 0;
    quizState.score = 0;
    quizState.mistakes = [];
    quizState.questions = generateQuizQuestions(quizState.type, quizState.level, 10);

    var setup = document.getElementById('quiz-setup');
    var area = document.getElementById('quiz-area');
    var results = document.getElementById('quiz-results');
    if (setup) setup.style.display = 'none';
    if (results) results.style.display = 'none';
    if (area) area.style.display = 'block';

    showQuizQuestion();
  }

  function generateQuizQuestions(type, level, count) {
    if (typeof VocabularyData === 'undefined') return [];
    var allWords = VocabularyData.getWords(level, 'all') || VocabularyData.getWords(level) || [];
    var questions = [];

    // Shuffle words
    var shuffled = allWords.slice().sort(function() { return 0.5 - Math.random(); });
    var selected = shuffled.slice(0, count);

    selected.forEach(function(word) {
      if (type === 'vocab' || type === 'mixed') {
        questions.push({
          type: 'vocab',
          question: 'ما معنى "' + word.de + '"?',
          options: shuffleOptions([word.ar, getRandomOtherArabic(word, allWords), getRandomOtherArabic(word, allWords), getRandomOtherArabic(word, allWords)]),
          correct: 0,
          word: word
        });
      } else if (type === 'articles') {
        var otherArticles = ['der', 'die', 'das'].filter(function(a) { return a !== word.article; });
        questions.push({
          type: 'articles',
          question: 'المقال الصحيح لـ "' + word.de + '" هو:',
          options: shuffleOptions([word.article, otherArticles[0], otherArticles[1], 'ein']),
          correct: 0,
          word: word
        });
      } else if (type === 'grammar') {
        questions.push({
          type: 'grammar',
          question: 'ما الترجمة الصحيحة لـ "' + word.ar + '"?',
          options: shuffleOptions([word.de, getRandomOtherGerman(word, allWords), getRandomOtherGerman(word, allWords), getRandomOtherGerman(word, allWords)]),
          correct: 0,
          word: word
        });
      }
    });

    return questions.slice(0, count);
  }

  function getRandomOtherArabic(word, allWords) {
    var others = allWords.filter(function(w) { return w.ar !== word.ar; });
    if (others.length === 0) return '—';
    return others[Math.floor(Math.random() * others.length)].ar;
  }

  function getRandomOtherGerman(word, allWords) {
    var others = allWords.filter(function(w) { return w.de !== word.de; });
    if (others.length === 0) return '—';
    return others[Math.floor(Math.random() * others.length)].de;
  }

  function shuffleOptions(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = a[i];
      a[i] = a[j];
      a[j] = temp;
    }
    return a;
  }

  function showQuizQuestion() {
    if (quizState.currentIndex >= quizState.questions.length) {
      finishQuiz();
      return;
    }

    var q = quizState.questions[quizState.currentIndex];
    var total = quizState.questions.length;
    var progressFill = document.querySelector('#quiz-progress-bar .quiz-progress-fill');
    var progressText = document.getElementById('quiz-progress-text');
    var questionText = document.getElementById('quiz-question-text');
    var optionsContainer = document.getElementById('quiz-options');
    var nextBtn = document.getElementById('quiz-next-btn');

    if (progressFill) progressFill.style.width = ((quizState.currentIndex / total) * 100) + '%';
    if (progressText) progressText.textContent = (quizState.currentIndex + 1) + ' / ' + total;
    if (questionText) questionText.textContent = q.question;
    if (nextBtn) nextBtn.style.display = 'none';

    if (optionsContainer) {
      optionsContainer.innerHTML = '';
      q.options.forEach(function(opt, i) {
        var btn = document.createElement('button');
        btn.className = 'quiz-option';
        btn.setAttribute('role', 'radio');
        btn.setAttribute('aria-checked', 'false');
        btn.textContent = opt;
        btn.addEventListener('click', function() { selectQuizAnswer(i); });
        optionsContainer.appendChild(btn);
      });
    }
  }

  function selectQuizAnswer(index) {
    var q = quizState.questions[quizState.currentIndex];
    var options = document.querySelectorAll('.quiz-option');
    var nextBtn = document.getElementById('quiz-next-btn');

    options.forEach(function(opt, i) {
      opt.disabled = true;
      if (i === q.correct) opt.classList.add('correct');
      if (i === index && i !== q.correct) opt.classList.add('incorrect');
    });

    if (index === q.correct) {
      quizState.score++;
    } else {
      quizState.mistakes.push(q);
    }

    if (nextBtn) nextBtn.style.display = 'inline-block';
  }

  function nextQuizQuestion() {
    quizState.currentIndex++;
    showQuizQuestion();
  }

  function finishQuiz() {
    var area = document.getElementById('quiz-area');
    var results = document.getElementById('quiz-results');
    if (area) area.style.display = 'none';
    if (results) results.style.display = 'block';

    var total = quizState.questions.length;
    var score = quizState.score;
    var pct = Math.round((score / total) * 100);

    var scoreEl = document.getElementById('quiz-score');
    var msgEl = document.getElementById('quiz-results-msg');

    if (scoreEl) scoreEl.textContent = score + ' / ' + total + ' (' + pct + '%)';
    if (msgEl) {
      if (pct >= 90) msgEl.textContent = 'ممتاز! أداء رائع.';
      else if (pct >= 70) msgEl.textContent = 'جيد جداً! واصل التقدم.';
      else if (pct >= 50) msgEl.textContent = 'جيد. حاول مرة أخرى لتحسين نتيجتك.';
      else msgEl.textContent = 'تحتاج لمزيد من الممارسة. لا تيأس!';
    }

    // Update progress
    if (typeof Progress !== 'undefined') {
      Progress.recordQuiz(quizState.level, score, total);
      // Add wrong words to flashcards for review
      quizState.mistakes.forEach(function(m) {
        if (m.word) Progress.markWord(m.word.de, 'learning');
      });
      // Check achievements
      Progress.checkAchievements();
    }

    // Update dashboard
    if (typeof Dashboard !== 'undefined') Dashboard.update();
  }

  function resetQuiz() {
    var setup = document.getElementById('quiz-setup');
    var area = document.getElementById('quiz-area');
    var results = document.getElementById('quiz-results');
    if (setup) setup.style.display = 'block';
    if (area) area.style.display = 'none';
    if (results) results.style.display = 'none';
  }

  // ---- Practice Page (Flashcards) ----
  // Flashcards logic is handled by flashcards.js

  // ---- AI Chat Page ----
  function initAIPage() {
    // Mode selection
    document.querySelectorAll('.ai-mode-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        document.querySelectorAll('.ai-mode-btn').forEach(function(b) {
          b.classList.remove('active');
          b.setAttribute('aria-checked', 'false');
        });
        this.classList.add('active');
        this.setAttribute('aria-checked', 'true');
        aiMode = this.getAttribute('data-mode');
        updateAISuggestions();
      });
    });

    // Send message
    var sendBtn = document.getElementById('ai-send-btn');
    var input = document.getElementById('ai-input');
    if (sendBtn) sendBtn.addEventListener('click', sendAIMessage);
    if (input) {
      input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          sendAIMessage();
        }
      });
      // Auto-resize textarea
      input.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 120) + 'px';
      });
    }

    // Quick suggestions
    document.querySelectorAll('.ai-suggestion-chip').forEach(function(chip) {
      chip.addEventListener('click', function() {
        var suggestion = this.getAttribute('data-suggestion');
        if (input && suggestion) {
          input.value = suggestion;
          sendAIMessage();
        }
      });
    });
  }

  function updateAISuggestions() {
    var suggestions = {
      explain: ['اشرح لي تصريف动词 sein', 'ما الفرق بين der و die و das?', 'علّمني قواعد الأسماء'],
      correct: ['ękorrekt هذه الجملة', 'صحح لي أخطائي', 'هل هذه الجملة صحيحة؟'],
      practice: ['تدرب معي على الأفعال', 'اختبرني على المفردات', 'تمرين على حالات الأسماء'],
      chat: ['مرحباً كيف حالك؟', 'أخبرني عن يومك', 'تدرب على محادثة في المقهى'],
      grammar: ['اشرح لي الحالة الرابعة', 'ما الفرق بين Akkusativ و Dativ?', 'قواعد الأفعال المنفصلة'],
      vocabulary: ['كلمات عن الطعام', 'أفعال مهمة للسفر', 'كلمات للعمل']
    };

    var container = document.getElementById('ai-suggestions');
    if (!container) return;

    var modes = suggestions[aiMode] || suggestions.explain;
    container.innerHTML = '';
    modes.forEach(function(s) {
      var chip = document.createElement('button');
      chip.className = 'ai-suggestion-chip';
      chip.setAttribute('role', 'listitem');
      chip.setAttribute('data-suggestion', s);
      chip.textContent = s;
      chip.addEventListener('click', function() {
        var input = document.getElementById('ai-input');
        if (input) {
          input.value = this.getAttribute('data-suggestion');
          sendAIMessage();
        }
      });
      container.appendChild(chip);
    });
  }

  function sendAIMessage() {
    var input = document.getElementById('ai-input');
    var chatArea = document.getElementById('ai-chat-area');
    if (!input || !chatArea) return;

    var message = input.value.trim();
    if (!message) return;

    // Remove welcome screen
    var welcome = chatArea.querySelector('.ai-welcome');
    if (welcome) welcome.remove();

    // Add user message
    var userMsg = document.createElement('div');
    userMsg.className = 'ai-message user-message';
    userMsg.innerHTML = '<div class="ai-message-content">' + escapeHtml(message) + '</div>';
    chatArea.appendChild(userMsg);

    // Clear input
    input.value = '';
    input.style.height = 'auto';

    // Show typing indicator
    var typing = document.createElement('div');
    typing.className = 'ai-message ai-typing';
    typing.innerHTML = '<div class="ai-typing-dots"><span></span><span></span><span></span></div>';
    chatArea.appendChild(typing);
    chatArea.scrollTop = chatArea.scrollHeight;

    // Build context-aware prompt
    var contextPrompt = buildAIContext(message);

    // Send to AI (via Cloudflare Function)
    fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: contextPrompt,
        mode: aiMode,
        history: chatHistory.slice(-6)
      })
    })
    .then(function(res) { return res.json(); })
    .then(function(data) {
      typing.remove();
      var reply = data.reply || data.error || 'عذراً، حدث خطأ. حاول مرة أخرى.';

      var aiMsg = document.createElement('div');
      aiMsg.className = 'ai-message ai-response';
      aiMsg.innerHTML = '<div class="ai-message-content">' + formatAIResponse(reply) + '</div>';
      chatArea.appendChild(aiMsg);
      chatArea.scrollTop = chatArea.scrollHeight;

      chatHistory.push({ role: 'user', content: message });
      chatHistory.push({ role: 'assistant', content: reply });

      // Update chat count for achievements
      if (typeof Progress !== 'undefined') Progress.incrementChatCount();
    })
    .catch(function() {
      typing.remove();
      var errMsg = document.createElement('div');
      errMsg.className = 'ai-message ai-response';
      errMsg.innerHTML = '<div class="ai-message-content">عذراً، لم أتمكن من الاتصال. تأكد من اتصالك بالإنترنت وحاول مرة أخرى.</div>';
      chatArea.appendChild(errMsg);
    });
  }

  function buildAIContext(message) {
    var modePrompts = {
      explain: 'أنت معلم ألماني. اشرح للمستخدم بالعربية. كن واضحاً وبسيطاً.',
      correct: 'أنت مصحح لغوي. صحح أخطاء المستخدم في الألمانية واشرح الأخطاء.',
      practice: 'أنت ممارس تدريبي. أعط المستخدم تدريبات عملية.',
      chat: 'أنت صديق ألماني. تحدث مع المستخدم بالألمانية مع ترجمة عربية للجمل.',
      grammar: 'أنت خبير في قواعد اللغة الألمانية. اشرح القواعد بالعربية مع أمثلة.',
      vocabulary: 'أنت معلم مفردات. علّم المستخدم كلمات جديدة مع أمثلة.'
    };

    var context = typeof Progress !== 'undefined' ? Progress.getContext() : {};
    var prefix = modePrompts[aiMode] || modePrompts.explain;
    if (context.level) prefix += ' مستوى المستخدم: ' + context.level + '.';
    if (context.streak) prefix += ' عدد أيام المتتالية: ' + context.streak + '.';

    return prefix + '\n\nرسالة المستخدم: ' + message;
  }

  function formatAIResponse(text) {
    // Basic formatting: newlines to <br>, bold
    return escapeHtml(text)
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/`(.*?)`/g, '<code class="inline-code">$1</code>');
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ---- Progress Page ----
  function initProgressPage() {
    // My Words tabs
    document.querySelectorAll('.mywords-tab').forEach(function(tab) {
      tab.addEventListener('click', function() {
        document.querySelectorAll('.mywords-tab').forEach(function(t) {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        this.classList.add('active');
        this.setAttribute('aria-selected', 'true');

        var tabName = this.getAttribute('data-mywords-tab');
        ['new', 'learning', 'known'].forEach(function(name) {
          var el = document.getElementById('mywords-' + name);
          if (el) el.style.display = name === tabName ? 'block' : 'none';
        });
        renderMyWords(tabName);
      });
    });
  }

  function refreshProgressPage() {
    updateStats();
    renderMyWords('new');
    updateDailyProgress();
    if (typeof Dashboard !== 'undefined') Dashboard.update();
    if (typeof LearningPath !== 'undefined') LearningPath.update();
  }

  function updateStats() {
    if (typeof Progress === 'undefined') return;
    var stats = Progress.getStats();
    var streakEl = document.getElementById('stat-streak');
    var xpEl = document.getElementById('stat-xp');
    var wordsEl = document.getElementById('stat-words');
    var lessonsEl = document.getElementById('stat-lessons');

    if (streakEl) animateNumber(streakEl, parseInt(streakEl.textContent) || 0, stats.streak);
    if (xpEl) animateNumber(xpEl, parseInt(xpEl.textContent) || 0, stats.xp);
    if (wordsEl) animateNumber(wordsEl, parseInt(wordsEl.textContent) || 0, stats.wordsLearned);
    if (lessonsEl) animateNumber(lessonsEl, parseInt(lessonsEl.textContent) || 0, stats.lessonsCompleted);
  }

  function animateNumber(el, from, to) {
    var duration = 500;
    var start = performance.now();
    function frame(now) {
      var elapsed = now - start;
      var progress = Math.min(elapsed / duration, 1);
      var current = Math.round(from + (to - from) * progress);
      el.textContent = current;
      if (progress < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  function updateDailyProgress() {
    if (typeof Progress === 'undefined') return;
    var today = Progress.getTodayProgress();
    var settings = Progress.getSettings();
    var goal = settings.dailyGoal || 10;
    var pct = Math.min(Math.round((today.wordsLearned / goal) * 100), 100);

    var fill = document.getElementById('daily-progress-fill');
    var text = document.getElementById('daily-progress-text');
    if (fill) {
      fill.style.width = pct + '%';
      fill.setAttribute('aria-valuenow', pct);
    }
    if (text) text.textContent = today.wordsLearned + ' / ' + goal + ' كلمة اليوم';
  }

  function renderMyWords(tab) {
    if (typeof Progress === 'undefined') return;
    var words = Progress.getMyWords(tab);
    var container = document.getElementById('mywords-' + tab);
    if (!container) return;

    if (!words || words.length === 0) {
      container.innerHTML = '<div class="mywords-empty"><span aria-hidden="true">📭</span><p>' +
        (tab === 'new' ? 'لا توجد كلمات جديدة بعد. ابدأ بتعلم المفردات!' :
         tab === 'learning' ? 'لا توجد كلمات قيد التعلم.' :
         'لا توجد كلمات محفوظة بعد.') + '</p></div>';
      return;
    }

    container.innerHTML = '';
    words.forEach(function(word) {
      var card = document.createElement('div');
      card.className = 'mywords-card';
      card.setAttribute('role', 'listitem');
      card.innerHTML =
        '<div class="mywords-card-info">' +
          '<span class="mywords-de" lang="de" dir="ltr">' + word.de + '</span>' +
          '<span class="mywords-ar">' + word.ar + '</span>' +
        '</div>' +
        '<div class="mywords-card-actions">' +
          '<button class="mywords-move-btn" data-word="' + word.de + '" data-target="' + (tab === 'new' ? 'learning' : tab === 'learning' ? 'known' : 'learning') + '" aria-label="نقل">' +
            (tab === 'known' ? '→ أتعلم' : '→ أعرف') +
          '</button>' +
          '<button class="mywords-delete-btn" data-word="' + word.de + '" aria-label="حذف">✕</button>' +
        '</div>';

      card.querySelector('.mywords-move-btn').addEventListener('click', function() {
        var w = this.getAttribute('data-word');
        var t = this.getAttribute('data-target');
        Progress.markWord(w, t);
        renderMyWords(tab);
      });
      card.querySelector('.mywords-delete-btn').addEventListener('click', function() {
        var w = this.getAttribute('data-word');
        Progress.removeWord(w);
        renderMyWords(tab);
      });

      container.appendChild(card);
    });
  }

  // ---- Settings Page ----
  function initSettingsPage() {
    var backBtn = document.getElementById('settings-back-btn');
    if (backBtn) backBtn.addEventListener('click', function() { navigateTo('page-home'); });

    // Export
    var exportBtn = document.getElementById('settings-export-btn');
    if (exportBtn) exportBtn.addEventListener('click', exportData);

    // Import
    var importFile = document.getElementById('settings-import-file');
    if (importFile) importFile.addEventListener('change', importData);

    // Reset
    var resetBtn = document.getElementById('settings-reset-btn');
    if (resetBtn) resetBtn.addEventListener('click', function() {
      showModal('تأكيد مسح البيانات', 'هل أنت متأكد من حذف جميع بياناتك؟ لا يمكن التراجع عن هذا الإجراء.', function() {
        if (typeof Progress !== 'undefined') Progress.resetAll();
        showToast('تم مسح جميع البيانات بنجاح', 'success');
        updateLevelProgress();
        navigateTo('page-home');
      });
    });

    // Daily goal slider
    var slider = document.getElementById('daily-goal-slider');
    var valueEl = document.getElementById('daily-goal-value');
    if (slider) {
      var currentGoal = 10;
      if (typeof Progress !== 'undefined') currentGoal = Progress.getSettings().dailyGoal || 10;
      slider.value = currentGoal;
      if (valueEl) valueEl.textContent = currentGoal;

      slider.addEventListener('input', function() {
        var val = parseInt(this.value);
        if (valueEl) valueEl.textContent = val;
        if (typeof Progress !== 'undefined') Progress.updateSettings({ dailyGoal: val });
      });
    }
  }

  function exportData() {
    if (typeof Progress === 'undefined') return;
    var data = Progress.exportAll();
    var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'deutsch-fuer-araber-backup-' + new Date().toISOString().slice(0, 10) + '.json';
    a.click();
    URL.revokeObjectURL(url);
    showToast('تم تصدير البيانات بنجاح', 'success');
  }

  function importData(e) {
    var file = e.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function(evt) {
      try {
        var data = JSON.parse(evt.target.result);
        if (typeof Progress !== 'undefined') {
          Progress.importAll(data);
          showToast('تم استيراد البيانات بنجاح', 'success');
          updateLevelProgress();
          navigateTo('page-home');
        }
      } catch (err) {
        showToast('خطأ في ملف البيانات. تأكد من صحة الملف.', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  // ---- Dark Mode ----
  function initDarkMode() {
    var toggle = document.getElementById('dark-mode-toggle');
    if (!toggle) return;

    var saved = localStorage.getItem('dfa_dark_mode');
    if (saved === 'true') {
      document.documentElement.setAttribute('data-theme', 'dark');
      toggle.checked = true;
    }

    toggle.addEventListener('change', function() {
      if (this.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('dfa_dark_mode', 'true');
      } else {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('dfa_dark_mode', 'false');
      }
    });
  }

  // ---- Modals ----
  function initModals() {
    var overlay = document.getElementById('modal-overlay');
    var cancelBtn = document.getElementById('modal-cancel-btn');
    if (cancelBtn) cancelBtn.addEventListener('click', hideModal);
    if (overlay) overlay.addEventListener('click', function(e) {
      if (e.target === overlay) hideModal();
    });
  }

  function showModal(title, message, onConfirm) {
    var overlay = document.getElementById('modal-overlay');
    var titleEl = document.getElementById('modal-title');
    var msgEl = document.getElementById('modal-message');
    var confirmBtn = document.getElementById('modal-confirm-btn');

    if (titleEl) titleEl.textContent = title;
    if (msgEl) msgEl.textContent = message;
    if (overlay) overlay.style.display = 'flex';

    if (confirmBtn) {
      confirmBtn.onclick = function() {
        hideModal();
        if (onConfirm) onConfirm();
      };
    }
  }

  function hideModal() {
    var overlay = document.getElementById('modal-overlay');
    if (overlay) overlay.style.display = 'none';
  }

  // ---- Toasts ----
  function showToast(message, type) {
    type = type || 'info';
    var container = document.getElementById('toast-container');
    if (!container) return;

    var toast = document.createElement('div');
    toast.className = 'toast toast-' + type;
    toast.setAttribute('role', 'alert');
    toast.innerHTML =
      '<span class="toast-icon">' + (type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ') + '</span>' +
      '<span class="toast-message">' + message + '</span>';

    container.appendChild(toast);
    // Trigger animation
    requestAnimationFrame(function() { toast.classList.add('show'); });

    setTimeout(function() {
      toast.classList.remove('show');
      setTimeout(function() { toast.remove(); }, 300);
    }, 3000);
  }

  // ---- Tooltips (basic) ----
  function initTooltips() {
    // Minimal: title attributes are sufficient for now
  }

  // ---- Progress Load ----
  function loadProgress() {
    if (typeof Progress !== 'undefined') {
      Progress.init();
      Progress.updateStreak();
    }
  }

  // ---- Public API ----
  return {
    init: init,
    navigateTo: navigateTo,
    switchToTab: switchToTab,
    showToast: showToast,
    showModal: showModal,
    refreshProgressPage: refreshProgressPage,
    updateLevelProgress: updateLevelProgress
  };
})();

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', App.init);
}
