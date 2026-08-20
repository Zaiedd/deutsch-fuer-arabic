// لوحة التحكم الشخصية: إحصائيات، تقدم يومي، أنشطة أسبوعية، إنجازات، توصيات

const Dashboard = {
  CEFR_LEVELS: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
  LEVEL_NAMES: { A1: 'مبتدئ', A2: 'متوسط أول', B1: 'متوسط', B2: 'فوق متوسط', C1: 'متقدم', C2: 'إتقان' },

  QUIZ_TYPE_NAMES: {
    vocabulary: 'المفردات',
    articles: 'الأحرف الإشارة',
    translation: 'الترجمة',
    sentence: 'إكمال الجملة',
    mixed: 'متنوع'
  },

  WEAK_AREA_LABELS: {
    vocabulary: 'المفردات',
    articles: 'الأحرف الإشارة',
    translation: 'الترجمة',
    sentence: 'إكمال الجملة',
    mixed: 'المتنوع'
  },

  render(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const data = Progress.load();
    const daily = Progress.getDailyProgress(data);
    const achievements = Progress.getAchievements(data);
    const weekly = this._getWeeklyActivity(data);
    const weakAreas = this._getWeakAreas(data);
    const recentQuizzes = this._getRecentQuizzes(data, 5);
    const recommendation = this._getRecommendation(data, daily, weakAreas);

    let html = '';

    html += this._renderHeader(data);
    html += this._renderStatsGrid(data, daily);
    html += this._renderDailyProgress(daily);
    html += this._renderWeeklyActivity(weekly);
    html += this._renderWeakAreas(weakAreas);
    html += this._renderRecentQuizzes(recentQuizzes);
    html += this._renderAchievements(achievements);
    html += this._renderRecommendation(recommendation);
    html += this._renderActions(data);
    html += this._renderLevelSelect(data);

    container.innerHTML = html;

    this._bindEvents(container, data);
  },

  _renderHeader(data) {
    const level = data.level || 'A1';
    const levelName = this.LEVEL_NAMES[level] || level;
    return '<div class="dash-header">' +
      '<div class="dash-header-greeting">' +
        '<h2>أهلاً بيك! 👋</h2>' +
        '<p>المستوى: <strong>' + level + ' — ' + levelName + '</strong></p>' +
      '</div>' +
    '</div>';
  },

  _renderStatsGrid(data, daily) {
    const wordsCount = Object.keys(data.wordsLearned).length;
    const masteredCount = Object.keys(data.wordsMastered).length;
    const avgAccuracy = this._getQuizAverage(data);
    const streak = data.currentStreak || 0;

    const stats = [
      { icon: ICONS.eye, value: wordsCount, label: 'كلمة متعلمة' },
      { icon: ICONS.check, value: masteredCount, label: 'كلمة متقنة' },
      { icon: ICONS.target, value: avgAccuracy + '%', label: 'متوسط الكويزات' },
      { icon: ICONS.sparkles, value: streak + ' 🔥', label: 'أيام متتالية' },
      { icon: ICONS.star, value: data.totalXP || 0, label: 'نقطة خبرة (XP)' }
    ];

    let html = '<div class="dash-stats-grid">';
    stats.forEach(function(s) {
      html += '<div class="dash-stat-card">' +
        '<div class="dash-stat-icon">' + s.icon + '</div>' +
        '<div class="dash-stat-value">' + s.value + '</div>' +
        '<div class="dash-stat-label">' + s.label + '</div>' +
      '</div>';
    });
    html += '</div>';
    return html;
  },

  _renderDailyProgress(daily) {
    const target = daily.dailyGoalTarget || 10;
    const goalType = daily.dailyGoalType || 'words';
    const done = goalType === 'words' ? daily.wordsStudied : daily.quizzesTaken;
    const pct = Math.min(Math.round((done / target) * 100), 100);
    const goalLabel = goalType === 'words' ? 'كلمة' : 'كويز';
    const complete = daily.dailyGoalComplete;

    const circumference = 2 * Math.PI * 42;
    const offset = circumference - (pct / 100) * circumference;
    const color = complete ? 'var(--gold)' : 'var(--red)';

    let html = '<div class="dash-daily">' +
      '<h3>التقدم اليومي</h3>' +
      '<div class="dash-daily-progress">' +
        '<div class="dash-daily-ring">' +
          '<svg width="100" height="100" viewBox="0 0 100 100">' +
            '<circle cx="50" cy="50" r="42" fill="none" stroke="var(--gray2)" stroke-width="8"/>' +
            '<circle cx="50" cy="50" r="42" fill="none" stroke="' + color + '" stroke-width="8" ' +
              'stroke-linecap="round" stroke-dasharray="' + circumference + '" ' +
              'stroke-dashoffset="' + offset + '" ' +
              'transform="rotate(-90 50 50)" style="transition: stroke-dashoffset 0.6s ease;"/>' +
          '</svg>' +
          '<div class="dash-daily-percent">' + pct + '%</div>' +
        '</div>' +
        '<div class="dash-daily-info">' +
          '<div class="dash-daily-done"><strong>' + done + '</strong> / ' + target + ' ' + goalLabel + '</div>' +
          '<div class="dash-daily-streak">' +
            (complete
              ? '🎉 أحسنت! أتممت هدفك اليوم!'
              : 'كمّل! باقي ' + (target - done) + ' ' + goalLabel) +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';
    return html;
  },

  _renderWeeklyActivity(weekly) {
    const dayNames = ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'];
    const maxVal = Math.max.apply(null, weekly.map(function(d) { return d.count; }).concat([1]));

    let html = '<div class="dash-activity">' +
      '<h3>نشاط الأسبوع</h3>' +
      '<div class="dash-activity-chart">';

    weekly.forEach(function(day) {
      const barHeight = Math.round((day.count / maxVal) * 100);
      const dayName = dayNames[new Date(day.date).getDay()];
      html += '<div class="dash-activity-col">' +
        '<div class="dash-activity-bar" style="height: ' + Math.max(barHeight, 3) + '%;" ' +
          'title="' + day.count + ' نشاط"></div>' +
        '<div class="dash-activity-label">' + dayName + '</div>' +
      '</div>';
    });

    html += '</div></div>';
    return html;
  },

  _renderWeakAreas(weakAreas) {
    if (!weakAreas.length) {
      return '<div class="dash-weak">' +
        '<h3>مجالات تحتاج مراجعة</h3>' +
        '<p class="dash-weak-empty">ما فيش أخطاء مسجلة — أداء ممتاز!</p>' +
      '</div>';
    }

    let html = '<div class="dash-weak">' +
      '<h3>مجالات تحتاج مراجعة</h3>' +
      '<div class="dash-weak-list">';

    weakAreas.forEach(function(area) {
      const pct = area.total > 0 ? Math.round((area.incorrect / area.total) * 100) : 0;
      const label = Dashboard.WEAK_AREA_LABELS[area.type] || area.type;
      html += '<div class="dash-weak-badge">' +
        '<span class="dash-weak-badge-name">' + label + '</span>' +
        '<span class="dash-weak-badge-stat">' + pct + '% خطأ (' + area.incorrect + '/' + area.total + ')</span>' +
      '</div>';
    });

    html += '</div></div>';
    return html;
  },

  _renderRecentQuizzes(quizzes) {
    if (!quizzes.length) {
      return '<div class="dash-recent">' +
        '<h3>آخر الكويزات</h3>' +
        '<p class="dash-recent-empty">ما فيش كويزات بعد — ابدأ أول كويز!</p>' +
      '</div>';
    }

    let html = '<div class="dash-recent">' +
      '<h3>آخر الكويزات</h3>' +
      '<div class="dash-recent-list">';

    quizzes.forEach(function(q) {
      var date = q.date ? new Date(q.date) : null;
      var dateStr = date ? Dashboard._formatDate(date) : '';
      var typeName = Dashboard.QUIZ_TYPE_NAMES[q.type] || q.type;
      var accuracy = q.accuracy || 0;
      var level = q.level || '';
      var color = accuracy >= 80 ? 'var(--gold)' : accuracy >= 50 ? 'var(--text)' : 'var(--red)';
      var scoreLabel = accuracy >= 90 ? 'ممتاز' : accuracy >= 70 ? 'جيد جداً' : accuracy >= 50 ? 'جيد' : 'يحتاج تدريب';

      html += '<div class="dash-recent-item">' +
        '<div class="dash-recent-item-head">' +
          '<span class="dash-recent-item-type">' + typeName + '</span>' +
          '<span class="dash-recent-item-level">' + level + '</span>' +
        '</div>' +
        '<div class="dash-recent-item-body">' +
          '<span class="dash-recent-item-score" style="color:' + color + '">' + accuracy + '%</span>' +
          '<span class="dash-recent-item-label">' + scoreLabel + '</span>' +
          '<span class="dash-recent-item-xp">+' + (q.xpEarned || 0) + ' XP</span>' +
        '</div>' +
        '<div class="dash-recent-item-foot">' +
          '<span class="dash-recent-item-detail">' + q.correct + '/' + q.total + ' صحيحة</span>' +
          '<span class="dash-recent-item-date">' + dateStr + '</span>' +
        '</div>' +
      '</div>';
    });

    html += '</div></div>';
    return html;
  },

  _renderAchievements(achievements) {
    if (!achievements.length) {
      return '<div class="dash-achievements">' +
        '<h3>الإنجازات</h3>' +
        '<p class="dash-achievements-empty">كمّل عشان تفتح إنجازات جديدة!</p>' +
      '</div>';
    }

    let html = '<div class="dash-achievements">' +
      '<h3>الإنجازات (' + achievements.length + ')</h3>' +
      '<div class="dash-achievements-grid">';

    achievements.forEach(function(a) {
      html += '<div class="dash-achievement">' +
        '<div class="dash-achievement-icon">' + a.icon + '</div>' +
        '<div class="dash-achievement-title">' + a.title + '</div>' +
        '<div class="dash-achievement-desc">' + a.desc + '</div>' +
      '</div>';
    });

    html += '</div></div>';
    return html;
  },

  _renderRecommendation(rec) {
    if (!rec) return '';

    let html = '<div class="dash-recommend">' +
      '<h3>الخطوة التالية</h3>' +
      '<div class="dash-recommend-card">' +
        '<div class="dash-recommend-icon">' + rec.icon + '</div>' +
        '<div class="dash-recommend-info">' +
          '<div class="dash-recommend-title">' + rec.title + '</div>' +
          '<div class="dash-recommend-desc">' + rec.desc + '</div>' +
        '</div>' +
        '<button class="dash-recommend-btn" data-action="' + rec.action + '" data-params="' + (rec.params || '') + '">' +
          rec.btnText +
        '</button>' +
      '</div>' +
    '</div>';
    return html;
  },

  _renderActions(data) {
    let html = '<div class="dash-actions">' +
      '<button class="dash-action-btn" data-action="quiz">' +
        '<span class="dash-action-icon">' + ICONS.target + '</span>' +
        '<span>ابدأ كويز</span>' +
      '</button>' +
      '<button class="dash-action-btn" data-action="flashcards">' +
        '<span class="dash-action-icon">' + ICONS.refresh + '</span>' +
        '<span>مراجعة بطاقات</span>' +
      '</button>' +
      '<button class="dash-action-btn" data-action="vocabulary">' +
        '<span class="dash-action-icon">' + ICONS.library + '</span>' +
        '<span>تعلم مفردات</span>' +
      '</button>' +
    '</div>';
    return html;
  },

  _renderLevelSelect(data) {
    var currentLevel = data.level || 'A1';
    let html = '<div class="dash-level-select">' +
      '<h3>المستوى الحالي</h3>' +
      '<div class="dash-level-options">';

    this.CEFR_LEVELS.forEach(function(level) {
      var active = level === currentLevel ? ' active' : '';
      var label = Dashboard.LEVEL_NAMES[level] || level;
      html += '<button class="dash-level-btn' + active + '" data-level="' + level + '">' +
        level + ' — ' + label +
      '</button>';
    });

    html += '</div></div>';
    return html;
  },

  _bindEvents(container) {
    var self = this;

    // Quick actions
    var actionBtns = container.querySelectorAll('.dash-action-btn');
    actionBtns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        var action = btn.getAttribute('data-action');
        self._handleAction(action);
      });
    });

    // Recommendation button
    var recBtn = container.querySelector('.dash-recommend-btn');
    if (recBtn) {
      recBtn.addEventListener('click', function() {
        var action = recBtn.getAttribute('data-action');
        self._handleAction(action);
      });
    }

    // Level selector
    var levelBtns = container.querySelectorAll('.dash-level-btn');
    levelBtns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        var level = btn.getAttribute('data-level');
        self._changeLevel(level);
      });
    });
  },

  _handleAction(action) {
    switch (action) {
      case 'quiz':
        this._navigateToQuiz();
        break;
      case 'flashcards':
        this._navigateToFlashcards();
        break;
      case 'vocabulary':
        this._navigateToVocab();
        break;
    }
  },

  _navigateToQuiz() {
    if (typeof startQuiz === 'function') {
      var data = Progress.load();
      var level = data.level || 'A1';
      var quizArea = document.getElementById('quiz-area');
      if (quizArea) {
        quizArea.style.display = 'block';
        quizArea.scrollIntoView({ behavior: 'smooth' });
        startQuiz(level, 'mixed', 10, 'quiz-area');
      }
    } else if (typeof switchPage === 'function') {
      switchPage('quiz');
    }
  },

  _navigateToFlashcards() {
    if (typeof switchPage === 'function') {
      switchPage('vocab');
    }
  },

  _navigateToVocab() {
    if (typeof switchPage === 'function') {
      switchPage('vocab');
    }
  },

  _changeLevel(level) {
    var data = Progress.load();
    data.level = level;
    Progress.save(data);

    var container = document.getElementById('dash-container');
    if (container) {
      this.render('dash-container');
    }

    // Sync with vocab page if it exists
    if (typeof currentLevel !== 'undefined') {
      currentLevel = level;
    }

    // Sync nav level tabs if they exist
    var tabs = document.querySelectorAll('#vocabLevelTabs .level-tab');
    tabs.forEach(function(tab) {
      tab.classList.remove('active');
      if (tab.textContent.trim().startsWith(level)) {
        tab.classList.add('active');
      }
    });
  },

  // ---- Data helpers ----

  _getWeeklyActivity(data) {
    var result = [];
    var today = new Date();

    for (var i = 6; i >= 0; i--) {
      var d = new Date(today);
      d.setDate(d.getDate() - i);
      var dateStr = d.toISOString().slice(0, 10);

      var count = 0;

      // Count words learned on this date
      var words = Object.values(data.wordsLearned || {});
      words.forEach(function(w) {
        if (w.firstSeen && w.firstSeen.slice(0, 10) === dateStr) count++;
        if (w.lastReviewed && w.lastReviewed.slice(0, 10) === dateStr) count++;
      });

      // Count quizzes taken on this date
      (data.quizHistory || []).forEach(function(q) {
        if (q.date && q.date.slice(0, 10) === dateStr) count++;
      });

      result.push({ date: dateStr, count: count });
    }

    return result;
  },

  _getWeakAreas(data) {
    var quizWeakCounts = {};

    (data.quizHistory || []).forEach(function(q) {
      if (q.weakAreas) {
        Object.keys(q.weakAreas).forEach(function(type) {
          if (!quizWeakCounts[type]) quizWeakCounts[type] = 0;
          quizWeakCounts[type] += q.weakAreas[type];
        });
      }
    });

    // Merge with Progress weakAreas (which uses category names)
    var allAreas = {};

    // From quiz weak areas (type-based)
    Object.keys(quizWeakCounts).forEach(function(type) {
      allAreas[type] = {
        correct: 0,
        incorrect: quizWeakCounts[type],
        total: quizWeakCounts[type]
      };
    });

    // From Progress tracked weak areas (category-based, convert to display)
    var progressWeak = data.weakAreas || {};
    Object.keys(progressWeak).forEach(function(key) {
      var area = progressWeak[key];
      var total = area.correct + area.incorrect;
      if (total > 0) {
        if (!allAreas[key]) {
          allAreas[key] = { correct: area.correct, incorrect: area.incorrect, total: total };
        } else {
          allAreas[key].correct += area.correct;
          allAreas[key].incorrect += area.incorrect;
          allAreas[key].total += total;
        }
      }
    });

    var result = Object.keys(allAreas).map(function(type) {
      return {
        type: type,
        correct: allAreas[type].correct,
        incorrect: allAreas[type].incorrect,
        total: allAreas[type].total
      };
    });

    // Sort by error rate descending, show top 5
    result.sort(function(a, b) {
      return (b.incorrect / b.total) - (a.incorrect / a.total);
    });

    return result.slice(0, 5);
  },

  _getRecentQuizzes(data, count) {
    var history = data.quizHistory || [];
    return history.slice(-count).reverse();
  },

  _getQuizAverage(data) {
    var history = data.quizHistory || [];
    if (!history.length) return 0;
    var sum = 0;
    history.forEach(function(q) { sum += (q.accuracy || 0); });
    return Math.round(sum / history.length);
  },

  _getRecommendation(data, daily, weakAreas) {
    var wordsCount = Object.keys(data.wordsLearned).length;
    var quizzesCount = (data.quizHistory || []).length;

    // Priority 1: Daily goal not done
    if (!daily.dailyGoalComplete) {
      var goalType = daily.dailyGoalType || 'words';
      if (goalType === 'words') {
        return {
          icon: '📚',
          title: 'كمّل هدفك اليومي',
          desc: 'تعلم ' + (daily.dailyGoalTarget - daily.wordsStudied) + ' كلمة كمان اليوم.',
          action: 'vocabulary',
          btnText: 'ابدأ الآن'
        };
      } else {
        return {
          icon: '🎯',
          title: 'كمّل هدفك اليومي',
          desc: 'حل ' + (daily.dailyGoalTarget - daily.quizzesTaken) + ' كويز كمان.',
          action: 'quiz',
          btnText: 'ابدأ كويز'
        };
      }
    }

    // Priority 2: Weak areas need work
    if (weakAreas.length > 0) {
      var worst = weakAreas[0];
      var label = this.WEAK_AREA_LABELS[worst.type] || worst.type;
      return {
        icon: '🔄',
        title: 'راجع: ' + label,
        desc: 'نسبة الأخطاء في ' + label + ' عالية (' + Math.round((worst.incorrect / worst.total) * 100) + '%).',
        action: 'quiz',
        btnText: 'تدرب الآن'
      };
    }

    // Priority 3: No quizzes done yet
    if (quizzesCount === 0) {
      return {
        icon: '🎯',
        title: 'جرّب أول كويز',
        desc: 'اختبر معلوماتك في أول كويز!',
        action: 'quiz',
        btnText: 'ابدأ كويز'
      };
    }

    // Priority 4: Many words learned but few mastered
    var masteredCount = Object.keys(data.wordsMastered || {}).length;
    if (wordsCount > 20 && masteredCount < wordsCount * 0.3) {
      return {
        icon: '⭐',
        title: 'راجع المفردات',
        desc: 'عندك ' + wordsCount + ' كلمة متعلمة بس ' + masteredCount + ' متقنة. كرر المراجعة.',
        action: 'flashcards',
        btnText: 'مراجعة البطاقات'
      };
    }

    // Priority 5: Streak encouragement
    if (data.currentStreak >= 3 && data.currentStreak < 7) {
      return {
        icon: '🔥',
        title: 'ممتاز! أكمل السلاسل',
        desc: 'عندك ' + data.currentStreak + ' أيام متتالية. وصل لـ 7 أيام!',
        action: 'vocabulary',
        btnText: 'كمّل التعلم'
      };
    }

    // Default: try a higher level or new content
    return {
      icon: '🚀',
      title: 'جرّب كويز آخر',
      desc: 'أداء ممتاز! استمر في التدريب عشان توصل للمستوى التالي.',
      action: 'quiz',
      btnText: 'ابدأ كويز'
    };
  },

  _formatDate(date) {
    var now = new Date();
    var diff = Math.floor((now - date) / 86400000);

    if (diff === 0) return 'اليوم';
    if (diff === 1) return 'إمبارح';
    if (diff < 7) return 'قبل ' + diff + ' أيام';

    var day = date.getDate();
    var month = date.getMonth() + 1;
    return day + '/' + month;
  }
};
