// ============================================
// Deutsch fuer Araber - Progress System
// localStorage-based progress tracking
// ============================================

const Progress = (function() {
  'use strict';

  var KEY = 'dfa_progress';

  function defaults() {
    return {
      wordsLearned: {},
      wordsMastered: {},
      quizHistory: [],
      totalXP: 0,
      currentStreak: 0,
      longestStreak: 0,
      lastStudyDate: null,
      totalStudyDays: 0,
      dailyGoal: 10,
      dailyProgress: { date: null, wordsStudied: 0, quizzesTaken: 0, listeningMinutes: 0 },
      achievements: [],
      weakAreas: {},
      aiChatCount: 0,
      level: 'A1',
      placementResult: null,
      myWords: { new: [], learning: [], known: [] }
    };
  }

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (raw) {
        var data = JSON.parse(raw);
        var def = defaults();
        for (var k in def) {
          if (!(k in data)) data[k] = def[k];
        }
        return data;
      }
    } catch (e) {}
    return defaults();
  }

  function save(data) {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
    } catch (e) {}
  }

  function today() {
    return new Date().toISOString().slice(0, 10);
  }

  function ensureToday(data) {
    var t = today();
    if (data.dailyProgress.date !== t) {
      data.dailyProgress = { date: t, wordsStudied: 0, quizzesTaken: 0, listeningMinutes: 0 };
    }
    return data;
  }

  function markStudied(data) {
    var t = today();
    if (data.lastStudyDate === t) return data;
    if (data.lastStudyDate) {
      var last = new Date(data.lastStudyDate);
      var now = new Date(t);
      var diff = Math.floor((now - last) / 86400000);
      if (diff === 1) {
        data.currentStreak++;
      } else if (diff > 1) {
        data.currentStreak = 1;
      }
    } else {
      data.currentStreak = 1;
    }
    data.lastStudyDate = t;
    data.totalStudyDays++;
    if (data.currentStreak > data.longestStreak) {
      data.longestStreak = data.currentStreak;
    }
    return data;
  }

  function addXP(data, amount) {
    data.totalXP += amount;
    return data;
  }

  function todayKey(word) {
    return 'w_' + today() + '_' + word.replace(/\s+/g, '_');
  }

  // ---- Public API ----
  function init() {
    var data = load();
    save(data);
  }

  function updateStreak() {
    var data = load();
    // Check if streak is still valid
    if (data.lastStudyDate) {
      var last = new Date(data.lastStudyDate);
      var now = new Date(today());
      var diff = Math.floor((now - last) / 86400000);
      if (diff > 1) {
        data.currentStreak = 0;
        save(data);
      }
    }
  }

  function getLevelProgress(level) {
    var data = load();
    var count = 0;
    var total = 0;
    for (var key in data.wordsLearned) {
      if (key.indexOf(level + '_') === 0) {
        total++;
        if (data.wordsMastered[key]) count++;
      }
    }
    // Also count words from myWords
    if (data.myWords) {
      ['new', 'learning', 'known'].forEach(function(cat) {
        (data.myWords[cat] || []).forEach(function(w) {
          if (w.level === level) total++;
        });
      });
    }
    if (total === 0) {
      // Estimate based on vocab data
      if (typeof VocabularyData !== 'undefined') {
        var words = VocabularyData.getWords(level, 'all');
        total = words ? words.length : 0;
      }
    }
    return total > 0 ? Math.min(Math.round((count / total) * 100), 100) : 0;
  }

  function getSettings() {
    var data = load();
    return { dailyGoal: data.dailyGoal || 10 };
  }

  function updateSettings(settings) {
    var data = load();
    if (settings.dailyGoal !== undefined) data.dailyGoal = settings.dailyGoal;
    save(data);
  }

  function getStats() {
    var data = load();
    var wordsCount = 0;
    var masteredCount = 0;
    for (var key in data.wordsLearned) wordsCount++;
    for (var key in data.wordsMastered) masteredCount++;

    return {
      streak: data.currentStreak || 0,
      xp: data.totalXP || 0,
      wordsLearned: wordsCount,
      wordsMastered: masteredCount,
      lessonsCompleted: data.totalStudyDays || 0,
      quizzesCompleted: (data.quizHistory || []).length,
      longestStreak: data.longestStreak || 0
    };
  }

  function getTodayProgress() {
    var data = load();
    data = ensureToday(data);
    return {
      wordsLearned: data.dailyProgress.wordsStudied || 0,
      quizzesTaken: data.dailyProgress.quizzesTaken || 0,
      dailyGoal: data.dailyGoal || 10
    };
  }

  function markWord(word, status) {
    var data = load();
    if (!data.myWords) data.myWords = { new: [], learning: [], known: [] };

    // Remove from all lists first
    ['new', 'learning', 'known'].forEach(function(cat) {
      data.myWords[cat] = (data.myWords[cat] || []).filter(function(w) {
        return w.de !== word;
      });
    });

    // Add to target list
    if (status === 'known') {
      data.myWords.known.push({ de: word, date: today() });
      // Also mark in wordsMastered
      var keys = Object.keys(data.wordsLearned);
      keys.forEach(function(k) {
        if (data.wordsLearned[k] && data.wordsLearned[k].word === word) {
          data.wordsMastered[k] = true;
        }
      });
    } else if (status === 'learning') {
      data.myWords.learning.push({ de: word, date: today() });
      // Also mark in wordsLearned if not already
      var found = false;
      for (var k in data.wordsLearned) {
        if (data.wordsLearned[k] && data.wordsLearned[k].word === word) {
          found = true;
          break;
        }
      }
      if (!found) {
        var data2 = load();
        data2.wordsLearned['learning_' + word] = {
          word: word,
          level: data2.level || 'A1',
          firstSeen: new Date().toISOString(),
          reviewCount: 1,
          correctCount: 0,
          incorrectCount: 0,
          lastReviewed: new Date().toISOString(),
          nextReview: null,
          difficulty: 1
        };
        save(data2);
        return;
      }
    } else if (status === 'new') {
      data.myWords.new.push({ de: word, date: today() });
    }

    // Update daily progress
    data = ensureToday(data);
    data.dailyProgress.wordsStudied++;
    markStudied(data);
    addXP(data, 1);
    save(data);
  }

  function removeWord(word) {
    var data = load();
    if (!data.myWords) return;
    ['new', 'learning', 'known'].forEach(function(cat) {
      data.myWords[cat] = (data.myWords[cat] || []).filter(function(w) {
        return w.de !== word;
      });
    });
    save(data);
  }

  function getMyWords(tab) {
    var data = load();
    if (!data.myWords) return [];
    return data.myWords[tab] || [];
  }

  function isWordKnown(word) {
    var data = load();
    if (!data.myWords) return false;
    return (data.myWords.known || []).some(function(w) { return w.de === word; });
  }

  function isWordLearning(word) {
    var data = load();
    if (!data.myWords) return false;
    return (data.myWords.learning || []).some(function(w) { return w.de === word; });
  }

  function recordQuiz(level, score, total) {
    var data = load();
    data.quizHistory.push({
      level: level,
      score: score,
      total: total,
      accuracy: total > 0 ? Math.round((score / total) * 100) : 0,
      date: new Date().toISOString()
    });
    if (data.quizHistory.length > 100) {
      data.quizHistory = data.quizHistory.slice(-100);
    }
    data = ensureToday(data);
    data.dailyProgress.quizzesTaken++;
    markStudied(data);
    addXP(data, score * 2);

    // Check level completion
    var pct = total > 0 ? Math.round((score / total) * 100) : 0;
    if (pct >= 80) {
      var levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
      var idx = levels.indexOf(level);
      if (idx >= 0 && idx < levels.length - 1) {
        var nextLevel = levels[idx + 1];
        if (data.level === level) {
          data.level = nextLevel;
        }
      }
    }

    save(data);
    checkAchievements();
  }

  function incrementChatCount() {
    var data = load();
    data.aiChatCount = (data.aiChatCount || 0) + 1;
    markStudied(data);
    addXP(data, 1);
    save(data);
    checkAchievements();
  }

  function checkAchievements() {
    var data = load();
    var newAchievements = [];
    var existing = data.achievements || [];

    var wordsCount = Object.keys(data.wordsLearned).length;
    var masteredCount = Object.keys(data.wordsMastered).length;
    var quizzesCount = (data.quizHistory || []).length;
    var chatCount = data.aiChatCount || 0;

    function has(id) { return existing.indexOf(id) >= 0; }
    function earn(id, title, desc) {
      if (!has(id)) {
        newAchievements.push({ id: id, title: title, desc: desc, date: today() });
        existing.push(id);
      }
    }

    if (quizzesCount >= 1) earn('first-quiz', 'أول اختبار', 'أكمل أول اختبار تدريبي');
    if (wordsCount >= 10) earn('words-10', '10 كلمات', 'احفظ 10 كلمات جديدة');
    if (wordsCount >= 50) earn('words-50', '50 كلمة', 'احفظ 50 كلمة جديدة');
    if (wordsCount >= 100) earn('words-100', '100 كلمة', 'احفظ 100 كلمة جديدة');
    if (data.currentStreak >= 3) earn('streak-3', '3 أيام متتالية', 'تعلم 3 أيام متتالية');
    if (data.currentStreak >= 7) earn('streak-7', 'أسبوع كامل', 'تعلم 7 أيام متتالية');
    if (data.currentStreak >= 30) earn('streak-30', 'شهر كامل', 'تعلم 30 يوماً متتالية');
    if (quizzesCount >= 1 && getQuizPerfect()) earn('quiz-perfect', 'درجة كاملة', 'احصل على 100% في اختبار');
    if (chatCount >= 10) earn('chat-10', 'محادثة مع Bat', 'أرسل 10 رسائل لمساعد Bat');

    data.achievements = existing;
    save(data);

    // Show achievement notifications
    newAchievements.forEach(function(a) {
      if (typeof App !== 'undefined' && App.showToast) {
        App.showToast('🏆 إنجاز جديد: ' + a.title, 'success');
      }
    });
  }

  function getQuizPerfect() {
    var data = load();
    return (data.quizHistory || []).some(function(q) {
      return q.accuracy === 100;
    });
  }

  function savePlacement(level) {
    var data = load();
    data.placementResult = { level: level, date: today() };
    data.level = level;
    save(data);
  }

  function getContext() {
    var data = load();
    return {
      level: data.level || 'A1',
      streak: data.currentStreak || 0,
      xp: data.totalXP || 0,
      wordsLearned: Object.keys(data.wordsLearned).length,
      placementResult: data.placementResult
    };
  }

  function exportAll() {
    var data = load();
    data.exportDate = new Date().toISOString();
    data.exportVersion = '2.0';
    return data;
  }

  function importAll(importedData) {
    if (!importedData || typeof importedData !== 'object') return false;
    // Merge with defaults
    var def = defaults();
    var merged = {};
    for (var k in def) {
      merged[k] = importedData[k] !== undefined ? importedData[k] : def[k];
    }
    save(merged);
    return true;
  }

  function resetAll() {
    localStorage.removeItem(KEY);
    save(defaults());
  }

  function initQuizLevel() {
    var data = load();
    return data.level || 'A1';
  }

  return {
    init: init,
    updateStreak: updateStreak,
    getLevelProgress: getLevelProgress,
    getSettings: getSettings,
    updateSettings: updateSettings,
    getStats: getStats,
    getTodayProgress: getTodayProgress,
    markWord: markWord,
    removeWord: removeWord,
    getMyWords: getMyWords,
    isWordKnown: isWordKnown,
    isWordLearning: isWordLearning,
    recordQuiz: recordQuiz,
    incrementChatCount: incrementChatCount,
    checkAchievements: checkAchievements,
    savePlacement: savePlacement,
    getContext: getContext,
    exportAll: exportAll,
    importAll: importAll,
    resetAll: resetAll,
    initQuizLevel: initQuizLevel,
    load: load,
    save: save,
    addXP: addXP,
    markStudied: markStudied,
    ensureToday: ensureToday
  };
})();
