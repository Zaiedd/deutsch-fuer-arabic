// ============================================
// Deutsch fuer Araber - Quiz Engine Utility
// Main quiz logic is in app.js
// This provides shared utility functions
// ============================================

const QuizEngine = {
  shuffle: function(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i];
      a[i] = a[j];
      a[j] = tmp;
    }
    return a;
  },

  getRandomItem: function(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  },

  getDistractors: function(correct, allItems, field, count) {
    count = count || 3;
    var others = allItems.filter(function(item) {
      return item[field] !== correct[field];
    });
    return this.shuffle(others).slice(0, count).map(function(item) {
      return item[field];
    });
  }
};
