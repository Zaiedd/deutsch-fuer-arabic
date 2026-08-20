// ============================================
// Deutsch fuer Araber - Learning Path
// Updates A1→C2 path with progress data
// ============================================

const LearningPath = (function() {
  'use strict';

  var LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  var LEVEL_NAMES = {
    A1: 'المبتدئ',
    A2: 'ما قبل المتوسط',
    B1: 'المتوسط',
    B2: 'فوق المتوسط',
    C1: 'المتقدم',
    C2: 'الإتقان'
  };

  function update() {
    if (typeof Progress === 'undefined') return;

    var data = Progress.load();
    var pathItems = document.querySelectorAll('#learning-path .path-item');

    pathItems.forEach(function(item) {
      var level = item.getAttribute('data-path-level');
      if (!level) return;

      var progress = calculateLevelProgress(data, level);
      var fill = item.querySelector('.path-progress-fill');
      if (fill) {
        fill.style.width = progress + '%';
        fill.setAttribute('aria-valuenow', progress);
      }

      // Update path state
      item.classList.remove('completed', 'active', 'locked');
      if (progress >= 100) {
        item.classList.add('completed');
        var node = item.querySelector('.path-node');
        if (node) node.innerHTML = '<span class="path-check" aria-hidden="true">&#10003;</span>';
      } else if (isLevelActive(data, level)) {
        item.classList.add('active');
      } else {
        item.classList.add('locked');
      }
    });
  }

  function calculateLevelProgress(data, level) {
    var count = 0;
    var total = 0;

    // Count words learned for this level
    for (var key in data.wordsLearned) {
      if (key.indexOf(level + '_') === 0) {
        total++;
        if (data.wordsMastered && data.wordsMastered[key]) count++;
      }
    }

    // Add myWords count
    if (data.myWords) {
      ['new', 'learning', 'known'].forEach(function(cat) {
        (data.myWords[cat] || []).forEach(function(w) {
          if (w.level === level) total++;
        });
      });
    }

    // Estimate total from vocab data
    if (total === 0 && typeof VocabularyData !== 'undefined') {
      var words = VocabularyData.getWords(level, 'all');
      total = words ? words.length : 0;
    }

    // Quiz completion bonus
    var quizPassed = (data.quizHistory || []).some(function(q) {
      return q.level === level && q.accuracy >= 70;
    });

    if (total === 0) return quizPassed ? 100 : 0;
    var pct = Math.min(Math.round((count / total) * 100), 95);
    if (quizPassed && pct >= 50) pct = 100;
    return pct;
  }

  function isLevelActive(data, level) {
    var idx = LEVELS.indexOf(level);
    if (idx === 0) return true; // A1 is always active
    var prevLevel = LEVELS[idx - 1];
    var prevProgress = calculateLevelProgress(data, prevLevel);
    return prevProgress >= 50; // Previous level at least 50% complete
  }

  return {
    update: update,
    calculateLevelProgress: calculateLevelProgress
  };
})();

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', function() {
    LearningPath.update();
  });
}
