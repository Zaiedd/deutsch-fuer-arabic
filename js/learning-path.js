const LearningPath = {
  levels: [
    {
      id: 'A1',
      name: 'A1 – Anfänger',
      nameAr: 'المبتدئون',
      steps: [
        { id: 'vocab', type: 'vocabulary', name: 'المفردات', icon: '📖', section: 'vocab' },
        { id: 'articles', type: 'articles', name: 'الأدوات', icon: '📝', section: 'articles' },
        { id: 'grammar', type: 'grammar', name: 'القواعد', icon: '📐', section: 'grammar' },
        { id: 'listening', type: 'listening', name: 'الاستماع', icon: '🎧', section: 'listening' },
        { id: 'reading', type: 'reading', name: 'القراءة', icon: '📰', section: 'reading' },
        { id: 'quiz', type: 'quiz', name: 'الاختبار', icon: '✅', section: 'quiz' },
      ],
    },
    {
      id: 'A2',
      name: 'A2 – أساسي',
      nameAr: 'الأساسي',
      steps: [
        { id: 'vocab', type: 'vocabulary', name: 'المفردات', icon: '📖', section: 'vocab' },
        { id: 'articles', type: 'articles', name: 'الأدوات', icon: '📝', section: 'articles' },
        { id: 'grammar', type: 'grammar', name: 'القواعد', icon: '📐', section: 'grammar' },
        { id: 'listening', type: 'listening', name: 'الاستماع', icon: '🎧', section: 'listening' },
        { id: 'reading', type: 'reading', name: 'القراءة', icon: '📰', section: 'reading' },
        { id: 'quiz', type: 'quiz', name: 'الاختبار', icon: '✅', section: 'quiz' },
      ],
    },
    {
      id: 'B1',
      name: 'B1 – متوسط',
      nameAr: 'المتوسط',
      steps: [
        { id: 'vocab', type: 'vocabulary', name: 'المفردات', icon: '📖', section: 'vocab' },
        { id: 'articles', type: 'articles', name: 'الأدوات', icon: '📝', section: 'articles' },
        { id: 'grammar', type: 'grammar', name: 'القواعد', icon: '📐', section: 'grammar' },
        { id: 'listening', type: 'listening', name: 'الاستماع', icon: '🎧', section: 'listening' },
        { id: 'reading', type: 'reading', name: 'القراءة', icon: '📰', section: 'reading' },
        { id: 'quiz', type: 'quiz', name: 'الاختبار', icon: '✅', section: 'quiz' },
      ],
    },
    {
      id: 'B2',
      name: 'B2 – متقدم',
      nameAr: 'المتقدم',
      steps: [
        { id: 'vocab', type: 'vocabulary', name: 'المفردات', icon: '📖', section: 'vocab' },
        { id: 'articles', type: 'articles', name: 'الأدوات', icon: '📝', section: 'articles' },
        { id: 'grammar', type: 'grammar', name: 'القواعد', icon: '📐', section: 'grammar' },
        { id: 'listening', type: 'listening', name: 'الاستماع', icon: '🎧', section: 'listening' },
        { id: 'reading', type: 'reading', name: 'القراءة', icon: '📰', section: 'reading' },
        { id: 'quiz', type: 'quiz', name: 'الاختبار', icon: '✅', section: 'quiz' },
      ],
    },
    {
      id: 'C1',
      name: 'C1 – رفيع',
      nameAr: 'العالي',
      steps: [
        { id: 'vocab', type: 'vocabulary', name: 'المفردات', icon: '📖', section: 'vocab' },
        { id: 'articles', type: 'articles', name: 'الأدوات', icon: '📝', section: 'articles' },
        { id: 'grammar', type: 'grammar', name: 'القواعد', icon: '📐', section: 'grammar' },
        { id: 'listening', type: 'listening', name: 'الاستماع', icon: '🎧', section: 'listening' },
        { id: 'reading', type: 'reading', name: 'القراءة', icon: '📰', section: 'reading' },
        { id: 'quiz', type: 'quiz', name: 'الاختبار', icon: '✅', section: 'quiz' },
      ],
    },
    {
      id: 'C2',
      name: 'C2 – إتقان',
      nameAr: 'الإتقان',
      steps: [
        { id: 'vocab', type: 'vocabulary', name: 'المفردات', icon: '📖', section: 'vocab' },
        { id: 'articles', type: 'articles', name: 'الأدوات', icon: '📝', section: 'articles' },
        { id: 'grammar', type: 'grammar', name: 'القواعد', icon: '📐', section: 'grammar' },
        { id: 'listening', type: 'listening', name: 'الاستماع', icon: '🎧', section: 'listening' },
        { id: 'reading', type: 'reading', name: 'القراءة', icon: '📰', section: 'reading' },
        { id: 'quiz', type: 'quiz', name: 'الاختبار', icon: '✅', section: 'quiz' },
      ],
    },
  ],

  _progress: null,

  _loadProgress() {
    if (typeof Progress !== 'undefined' && typeof Progress.load === 'function') {
      this._progress = Progress.load();
    } else {
      this._progress = this._loadFromStorage();
    }
    return this._progress;
  },

  _loadFromStorage() {
    try {
      const raw = localStorage.getItem('german_learning_progress');
      if (raw) return JSON.parse(raw);
    } catch (e) {
      // ignore
    }
    return {
      wordsLearned: {},
      wordsMastered: [],
      quizHistory: [],
      totalXP: 0,
      currentStreak: 0,
      level: 'A1',
    };
  },

  _getTotalWords(levelId) {
    let total = 0;
    if (typeof DATA === 'undefined' || !DATA[levelId] || !DATA[levelId].categories) {
      return 0;
    }
    var cats = DATA[levelId].categories;
    for (var catName in cats) {
      if (Array.isArray(cats[catName])) {
        total += cats[catName].length;
      }
    }
    return total;
  },

  _getWordsLearnedCount(levelId) {
    const p = this._progress;
    if (!p || !p.wordsLearned) return 0;
    if (!DATA[levelId] || !DATA[levelId].categories) return 0;

    const learnedSet = new Set(Object.keys(p.wordsLearned));
    let count = 0;
    var cats = DATA[levelId].categories;
    for (var catName in cats) {
      if (Array.isArray(cats[catName])) {
        cats[catName].forEach(function (w) {
          const word = typeof w === 'string' ? w : w.word || w.de;
          if (learnedSet.has(word)) count++;
        });
      }
    }
    return count;
  },

  _getGrammarLessonsCount(levelId) {
    if (typeof GRAMMAR === 'undefined' || !GRAMMAR) return { viewed: 0, total: 0 };
    const lessons = GRAMMAR[levelId];
    if (!lessons) return { viewed: 0, total: 0 };

    const arr = Array.isArray(lessons) ? lessons : Object.keys(lessons);
    const total = arr.length;

    const p = this._progress;
    let viewed = 0;
    if (p && p.grammarViewed) {
      const viewedSet = new Set(p.grammarViewed);
      arr.forEach(function (lesson, i) {
        const id = typeof lesson === 'string' ? lesson : lesson.id || lesson.title || String(i);
        if (viewedSet.has(id)) viewed++;
      });
    }
    return { viewed: viewed, total: total };
  },

  _getListeningLessonsCount(levelId) {
    if (typeof LISTENING === 'undefined' || !LISTENING) return { listened: 0, total: 0 };
    const lessons = LISTENING[levelId];
    if (!lessons) return { listened: 0, total: 0 };

    const arr = Array.isArray(lessons) ? lessons : Object.keys(lessons);
    const total = arr.length;

    const p = this._progress;
    let listened = 0;
    if (p && p.listeningDone) {
      const doneSet = new Set(p.listeningDone);
      arr.forEach(function (lesson, i) {
        const id = typeof lesson === 'string' ? lesson : lesson.id || lesson.title || String(i);
        if (doneSet.has(id)) listened++;
      });
    }
    return { listened: listened, total: total };
  },

  _getReadingLessonsCount(levelId) {
    if (typeof READING === 'undefined' || !READING) return { read: 0, total: 0 };
    const lessons = READING[levelId];
    if (!lessons) return { read: 0, total: 0 };

    const arr = Array.isArray(lessons) ? lessons : Object.keys(lessons);
    const total = arr.length;

    const p = this._progress;
    let read = 0;
    if (p && p.readingDone) {
      const doneSet = new Set(p.readingDone);
      arr.forEach(function (lesson, i) {
        const id = typeof lesson === 'string' ? lesson : lesson.id || lesson.title || String(i);
        if (doneSet.has(id)) read++;
      });
    }
    return { read: read, total: total };
  },

  _getQuizResult(levelId) {
    const p = this._progress;
    if (!p || !p.quizHistory) return { passed: false, bestScore: 0, attempts: 0 };

    const levelQuizzes = p.quizHistory.filter(function (q) {
      return q.level === levelId || (q.levelId && q.levelId === levelId);
    });

    if (levelQuizzes.length === 0) return { passed: false, bestScore: 0, attempts: 0 };

    let best = 0;
    levelQuizzes.forEach(function (q) {
      const score = q.score || q.percentage || 0;
      if (score > best) best = score;
    });

    return {
      passed: best > 60,
      bestScore: best,
      attempts: levelQuizzes.length,
    };
  },

  _getArticleProgress(levelId) {
    const p = this._progress;
    if (!p || !p.articlesStudied) return { studied: 0, total: 0 };

    const articles = p.articlesStudied[levelId] || p.articlesStudied;
    if (typeof articles === 'object' && !Array.isArray(articles)) {
      const studied = Object.keys(articles).length;
      return { studied: studied, total: Math.max(studied, 3) };
    }
    if (Array.isArray(articles)) {
      return { studied: articles.length, total: Math.max(articles.length, 3) };
    }
    return { studied: 0, total: 0 };
  },

  _checkStepStatus(level, step) {
    const levelId = level.id;
    const stepIndex = level.steps.indexOf(step);
    const prevStep = stepIndex > 0 ? level.steps[stepIndex - 1] : null;

    let prevCompleted = true;
    if (prevStep) {
      prevCompleted = this._checkStepCompleted(level, prevStep);
    }

    if (!prevCompleted) return 'locked';

    if (this._checkStepCompleted(level, step)) return 'completed';

    if (prevCompleted && !this._checkStepCompleted(level, step)) return 'current';

    return 'locked';
  },

  _checkStepCompleted(level, step) {
    const levelId = level.id;

    switch (step.type) {
      case 'vocabulary': {
        const total = this._getTotalWords(levelId);
        if (total === 0) return true;
        const learned = this._getWordsLearnedCount(levelId);
        return learned >= total * 0.5;
      }
      case 'articles': {
        const art = this._getArticleProgress(levelId);
        if (art.total === 0) return true;
        return art.studied >= art.total * 0.5;
      }
      case 'grammar': {
        const gr = this._getGrammarLessonsCount(levelId);
        return gr.viewed >= 1;
      }
      case 'listening': {
        const li = this._getListeningLessonsCount(levelId);
        return li.listened >= 1;
      }
      case 'reading': {
        const re = this._getReadingLessonsCount(levelId);
        return re.read >= 1;
      }
      case 'quiz': {
        const qz = this._getQuizResult(levelId);
        return qz.passed;
      }
      default:
        return false;
    }
  },

  _getStepDetail(level, step) {
    const levelId = level.id;

    switch (step.type) {
      case 'vocabulary': {
        const total = this._getTotalWords(levelId);
        const learned = this._getWordsLearnedCount(levelId);
        return { detail: learned + '/' + total + ' كلمة', percent: total > 0 ? Math.round((learned / total) * 100) : 0 };
      }
      case 'articles': {
        const art = this._getArticleProgress(levelId);
        return { detail: art.studied + '/' + art.total, percent: art.total > 0 ? Math.round((art.studied / art.total) * 100) : 0 };
      }
      case 'grammar': {
        const gr = this._getGrammarLessonsCount(levelId);
        return { detail: gr.viewed + '/' + gr.total + ' درس', percent: gr.total > 0 ? Math.round((gr.viewed / gr.total) * 100) : 0 };
      }
      case 'listening': {
        const li = this._getListeningLessonsCount(levelId);
        return { detail: li.listened + '/' + li.total + ' درس', percent: li.total > 0 ? Math.round((li.listened / li.total) * 100) : 0 };
      }
      case 'reading': {
        const re = this._getReadingLessonsCount(levelId);
        return { detail: re.read + '/' + re.total + ' قصة', percent: re.total > 0 ? Math.round((re.read / re.total) * 100) : 0 };
      }
      case 'quiz': {
        const qz = this._getQuizResult(levelId);
        return { detail: qz.passed ? 'ناجح ' + qz.bestScore + '%' : 'أفضل نتيجة: ' + qz.bestScore + '%', percent: qz.bestScore };
      }
      default:
        return { detail: '', percent: 0 };
    }
  },

  _getLevelProgress(level) {
    const completed = level.steps.filter((s) => this._checkStepCompleted(level, s)).length;
    return Math.round((completed / level.steps.length) * 100);
  },

  _getTotalProgress() {
    let totalSteps = 0;
    let completedSteps = 0;
    this.levels.forEach((level) => {
      totalSteps += level.steps.length;
      level.steps.forEach((step) => {
        if (this._checkStepCompleted(level, step)) completedSteps++;
      });
    });
    return totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
  },

  _navigateToSection(levelId, section) {
    const sectionMap = {
      vocab: 'vocabulary-section',
      articles: 'articles-section',
      grammar: 'grammar-section',
      listening: 'listening-section',
      reading: 'reading-section',
      quiz: 'quiz-section',
    };

    const targetId = sectionMap[section] || section;
    let el = document.getElementById(targetId);
    if (!el) {
      el = document.getElementById(levelId.toLowerCase() + '-' + targetId);
    }
    if (!el) {
      el = document.querySelector('[data-section="' + section + '"][data-level="' + levelId + '"]');
    }
    if (!el) {
      el = document.querySelector('#' + section);
    }

    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  },

  render(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    this._loadProgress();

    const totalProgress = this._getTotalProgress();
    let html = '';

    html += '<div class="lp-container">';

    html += '<div class="lp-header">';
    html += '<h2>مسار التعلم</h2>';
    html += '<div class="lp-total-progress">';
    html += '<div class="lp-total-bar">';
    html += '<div class="lp-total-fill" style="width: ' + totalProgress + '%;"></div>';
    html += '</div>';
    html += '<span>' + totalProgress + '% مكتمل</span>';
    html += '</div>';
    html += '</div>';

    this.levels.forEach((level, levelIndex) => {
      const levelProgress = this._getLevelProgress(level);

      html += '<div class="lp-level" data-level="' + level.id + '">';

      html += '<div class="lp-level-header">';
      html += '<span class="lp-level-name">' + level.name + ' – ' + level.nameAr + '</span>';
      html += '<span class="lp-level-progress">' + levelProgress + '%</span>';
      html += '</div>';

      html += '<div class="lp-steps">';

      level.steps.forEach((step, stepIndex) => {
        const status = this._checkStepStatus(level, step);
        const detail = this._getStepDetail(level, step);

        const statusClass = status;
        const isClickable = status !== 'locked';

        html += '<div class="lp-step ' + statusClass + '"';
        if (isClickable) {
          html += ' onclick="LearningPath._handleStepClick(\'' + level.id + '\', \'' + step.section + '\')" style="cursor: pointer;"';
        }
        html += ' data-level="' + level.id + '" data-step="' + step.id + '">';

        html += '<div class="lp-step-icon">' + step.icon + '</div>';
        html += '<div class="lp-step-info">';
        html += '<div class="lp-step-name">' + step.name + '</div>';
        html += '<div class="lp-step-status">';
        if (status === 'completed') {
          html += '✓ مكتمل';
        } else if (status === 'current') {
          html += '● جاري – ' + detail.detail;
        } else {
          html += '🔒 مقفل';
        }
        html += '</div>';
        html += '</div>';

        html += '</div>';

        if (stepIndex < level.steps.length - 1) {
          html += '<div class="lp-connector"></div>';
        }
      });

      html += '</div>';
      html += '</div>';
    });

    html += '</div>';

    container.innerHTML = html;
  },

  _handleStepClick(levelId, section) {
    this._navigateToSection(levelId, section);
  },
};
