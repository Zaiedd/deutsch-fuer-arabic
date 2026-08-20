// ============================================
// Deutsch fuer Araber - Dashboard
// Updates stats, weekly chart, daily progress
// ============================================

const Dashboard = (function() {
  'use strict';

  function update() {
    if (typeof Progress === 'undefined') return;

    updateStats();
    updateWeeklyChart();
    updateDailyProgress();
    updateAchievements();
  }

  function updateStats() {
    var stats = Progress.getStats();
    var streakEl = document.getElementById('stat-streak');
    var xpEl = document.getElementById('stat-xp');
    var wordsEl = document.getElementById('stat-words');
    var lessonsEl = document.getElementById('stat-lessons');

    if (streakEl) streakEl.textContent = stats.streak;
    if (xpEl) xpEl.textContent = stats.xp;
    if (wordsEl) wordsEl.textContent = stats.wordsLearned;
    if (lessonsEl) lessonsEl.textContent = stats.lessonsCompleted;
  }

  function updateWeeklyChart() {
    var canvas = document.getElementById('weekly-chart');
    if (!canvas || !canvas.getContext) return;

    var ctx = canvas.getContext('2d');
    var data = Progress.load();
    var weekly = getWeeklyActivity(data);

    var width = canvas.parentElement ? canvas.parentElement.offsetWidth : 600;
    var height = 200;
    canvas.width = width;
    canvas.height = height;

    var maxVal = Math.max.apply(null, weekly.map(function(d) { return d.count; }).concat([1]));
    var barWidth = Math.floor(width / 7) - 8;
    var gap = 8;

    ctx.clearRect(0, 0, width, height);

    // Draw bars
    var dayNames = ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'];
    weekly.forEach(function(day, i) {
      var x = i * (barWidth + gap) + gap;
      var barHeight = maxVal > 0 ? Math.round((day.count / maxVal) * (height - 40)) : 0;
      var y = height - 30 - barHeight;

      // Bar
      ctx.fillStyle = day.count > 0 ? '#CC0000' : '#e0e0e0';
      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barHeight, 4);
      ctx.fill();

      // Value on top
      if (day.count > 0) {
        ctx.fillStyle = '#1a1a1a';
        ctx.font = '12px Noto Sans Arabic';
        ctx.textAlign = 'center';
        ctx.fillText(day.count, x + barWidth / 2, y - 5);
      }

      // Day name
      ctx.fillStyle = '#666';
      ctx.font = '11px Noto Sans Arabic';
      ctx.textAlign = 'center';
      var dayIdx = new Date(day.date).getDay();
      ctx.fillText(dayNames[dayIdx], x + barWidth / 2, height - 8);
    });
  }

  function getWeeklyActivity(data) {
    var result = [];
    var now = new Date();
    for (var i = 6; i >= 0; i--) {
      var d = new Date(now);
      d.setDate(d.getDate() - i);
      var dateStr = d.toISOString().slice(0, 10);
      var count = 0;

      // Count words learned on this date
      var words = Object.values(data.wordsLearned || {});
      words.forEach(function(w) {
        if (w.firstSeen && w.firstSeen.slice(0, 10) === dateStr) count++;
        if (w.lastReviewed && w.lastReviewed.slice(0, 10) === dateStr) count++;
      });

      // Count quizzes
      (data.quizHistory || []).forEach(function(q) {
        if (q.date && q.date.slice(0, 10) === dateStr) count++;
      });

      result.push({ date: dateStr, count: count });
    }
    return result;
  }

  function updateDailyProgress() {
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

  function updateAchievements() {
    var grid = document.getElementById('achievements-grid');
    if (!grid) return;

    var data = Progress.load();
    var earned = data.achievements || [];

    grid.querySelectorAll('.achievement-card').forEach(function(card) {
      var id = card.getAttribute('data-achievement');
      if (earned.indexOf(id) >= 0) {
        card.classList.remove('locked');
        card.classList.add('unlocked');
      } else {
        card.classList.add('locked');
        card.classList.remove('unlocked');
      }
    });
  }

  return {
    update: update,
    updateStats: updateStats,
    updateAchievements: updateAchievements
  };
})();

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', function() {
    Dashboard.update();
  });
}
