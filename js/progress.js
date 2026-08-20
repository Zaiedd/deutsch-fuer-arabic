// نظام التقدم: تخزين محلي، سلسلة التعلم، الأهداف اليومية، الإنجازات

const Progress = {
  KEY: 'dfa_progress',

  defaults() {
    return {
      wordsLearned: {},
      wordsMastered: {},
      quizHistory: [],
      totalXP: 0,
      currentStreak: 0,
      longestStreak: 0,
      lastStudyDate: null,
      totalStudyDays: 0,
      dailyGoal: { type: 'words', target: 10 },
      dailyProgress: { date: null, wordsStudied: 0, quizzesTaken: 0, listeningMinutes: 0 },
      achievements: [],
      recentSearches: [],
      weakAreas: {},
      aiSessions: [],
      flashcardStats: {},
      level: 'A1'
    };
  },

  load() {
    try {
      const raw = localStorage.getItem(this.KEY);
      if (raw) {
        const data = JSON.parse(raw);
        return { ...this.defaults(), ...data };
      }
    } catch (e) {}
    return this.defaults();
  },

  save(data) {
    try {
      localStorage.setItem(this.KEY, JSON.stringify(data));
    } catch (e) {}
  },

  today() {
    return new Date().toISOString().slice(0, 10);
  },

  ensureToday(data) {
    const today = this.today();
    if (data.dailyProgress.date !== today) {
      data.dailyProgress = { date: today, wordsStudied: 0, quizzesTaken: 0, listeningMinutes: 0 };
    }
    return data;
  },

  markStudied(data) {
    const today = this.today();
    if (data.lastStudyDate === today) return data;

    if (data.lastStudyDate) {
      const last = new Date(data.lastStudyDate);
      const now = new Date(today);
      const diff = Math.floor((now - last) / 86400000);
      if (diff === 1) {
        data.currentStreak++;
      } else if (diff > 1) {
        data.currentStreak = 1;
      }
    } else {
      data.currentStreak = 1;
    }

    data.lastStudyDate = today;
    data.totalStudyDays++;
    if (data.currentStreak > data.longestStreak) {
      data.longestStreak = data.currentStreak;
    }
    return data;
  },

  addXP(data, amount) {
    data.totalXP += amount;
    return data;
  },

  learnWord(data, level, word) {
    const key = level + '_' + word;
    data.wordsLearned[key] = {
      word, level,
      firstSeen: data.wordsLearned[key]?.firstSeen || new Date().toISOString(),
      reviewCount: (data.wordsLearned[key]?.reviewCount || 0) + 1,
      correctCount: (data.wordsLearned[key]?.correctCount || 0),
      incorrectCount: (data.wordsLearned[key]?.incorrectCount || 0),
      lastReviewed: new Date().toISOString(),
      nextReview: this.calcNextReview(data.wordsLearned[key] || { reviewCount: 0, correctCount: 0 }),
      difficulty: 1
    };
    return data;
  },

  masterWord(data, level, word) {
    const key = level + '_' + word;
    data.wordsMastered[key] = true;
    return data;
  },

  recordQuizResult(data, result) {
    data.quizHistory.push({
      ...result,
      date: new Date().toISOString()
    });
    if (data.quizHistory.length > 100) {
      data.quizHistory = data.quizHistory.slice(-100);
    }
    return data;
  },

  updateWeakAreas(data, category, isCorrect) {
    if (!data.weakAreas[category]) {
      data.weakAreas[category] = { correct: 0, incorrect: 0 };
    }
    if (isCorrect) {
      data.weakAreas[category].correct++;
    } else {
      data.weakAreas[category].incorrect++;
    }
    return data;
  },

  calcNextReview(wordData) {
    const { reviewCount = 0, correctCount = 0 } = wordData;
    const quality = correctCount / Math.max(reviewCount, 1);
    let interval;
    if (quality < 0.4) interval = 1;
    else if (quality < 0.6) interval = 3;
    else if (quality < 0.8) interval = 7;
    else interval = 14;

    const next = new Date();
    next.setDate(next.getDate() + interval);
    return next.toISOString();
  },

  getWordsForReview(data) {
    const now = new Date();
    const words = Object.values(data.wordsLearned).filter(w => {
      if (!w.nextReview) return false;
      return new Date(w.nextReview) <= now;
    });
    words.sort((a, b) => (a.nextReview || '').localeCompare(b.nextReview || ''));
    return words.slice(0, 20);
  },

  getDailyProgress(data) {
    data = this.ensureToday(data);
    const target = data.dailyGoal.target;
    const wordsDone = data.dailyProgress.wordsStudied;
    const quizzesDone = data.dailyProgress.quizzesTaken;
    return {
      wordsStudied: wordsDone,
      quizzesTaken: quizzesDone,
      dailyGoalTarget: target,
      dailyGoalType: data.dailyGoal.type,
      dailyGoalComplete: data.dailyGoal.type === 'words' ? wordsDone >= target : quizzesDone >= target,
      streak: data.currentStreak,
      totalXP: data.totalXP
    };
  },

  addSearch(data, query) {
    data.recentSearches = data.recentSearches.filter(s => s !== query);
    data.recentSearches.unshift(query);
    if (data.recentSearches.length > 10) data.recentSearches = data.recentSearches.slice(0, 10);
    return data;
  },

  getAchievements(data) {
    const earned = [];
    const wordsCount = Object.keys(data.wordsLearned).length;
    const masteredCount = Object.keys(data.wordsMastered).length;
    const quizzesCount = data.quizHistory.length;

    if (quizzesCount >= 1) earned.push({ id: 'first_quiz', icon: '🏆', title: 'أول كويز', desc: 'كمّلت أول كويز' });
    if (quizzesCount >= 10) earned.push({ id: 'quiz_10', icon: '🎯', title: '10 كويزات', desc: 'كمّلت 10 كويزات' });
    if (quizzesCount >= 50) earned.push({ id: 'quiz_50', icon: '🏅', title: '50 كويز', desc: 'كمّلت 50 كويز' });
    if (data.currentStreak >= 3) earned.push({ id: 'streak_3', icon: '🔥', title: '3 أيام متتالية', desc: '3 أيام تعلم متتالية' });
    if (data.currentStreak >= 7) earned.push({ id: 'streak_7', icon: '🔥', title: 'أسبوع كامل', desc: '7 أيام تعلم متتالية' });
    if (wordsCount >= 50) earned.push({ id: 'words_50', icon: '📚', title: '50 كلمة', desc: 'تعلمت 50 كلمة' });
    if (wordsCount >= 100) earned.push({ id: 'words_100', icon: '📚', title: '100 كلمة', desc: 'تعلمت 100 كلمة' });
    if (wordsCount >= 500) earned.push({ id: 'words_500', icon: '🎓', title: '500 كلمة', desc: 'تعلمت 500 كلمة' });
    if (masteredCount >= 10) earned.push({ id: 'mastered_10', icon: '⭐', title: '10 كلمات متقنة', desc: 'أتقن 10 كلمات' });
    if (masteredCount >= 50) earned.push({ id: 'mastered_50', icon: '⭐', title: '50 كلمة متقنة', desc: 'أتقن 50 كلمة' });
    if (data.totalXP >= 100) earned.push({ id: 'xp_100', icon: '💎', title: '100 نقطة', desc: 'جمعت 100 نقطة خبرة' });
    if (data.totalXP >= 500) earned.push({ id: 'xp_500', icon: '💎', title: '500 نقطة', desc: 'جمعت 500 نقطة خبرة' });
    if (data.totalStudyDays >= 7) earned.push({ id: 'days_7', icon: '📅', title: 'أسبوع تعلم', desc: 'تعلمت 7 أيام' });
    if (data.totalStudyDays >= 30) earned.push({ id: 'days_30', icon: '📅', title: 'شهر تعلم', desc: 'تعلمت 30 يوم' });

    return earned;
  }
};
