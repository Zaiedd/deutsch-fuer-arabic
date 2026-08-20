// ============================================
// Deutsch fuer Araber - Placement Quiz
// Smart level assessment from A1 to C2
// ============================================

const PlacementQuiz = (function() {
  'use strict';

  const questions = [
    // A1 Level (Easy)
    { q: 'ما معنى "Hallo"?', options: ['مرحباً', 'وداعاً', 'شكراً', 'من فضلك'], correct: 0, level: 'A1' },
    { q: 'اختر المقال الصحيح: ___ Buch', options: ['der', 'die', 'das', 'den'], correct: 2, level: 'A1' },
    { q: 'كيف تسأل "كيف حالك؟" بالألمانية؟', options: ['Wie geht es dir?', 'Wo bist du?', 'Was machst du?', 'Wann kommst du?'], correct: 0, level: 'A1' },
    { q: 'ما معنى "Danke"?', options: ['عفواً', 'شكراً', 'نعم', 'لا'], correct: 1, level: 'A1' },
    { q: 'أكمل: Ich ___ Student.', options: ['bin', 'ist', 'bist', 'sind'], correct: 0, level: 'A1' },
    { q: 'ما عدد النحوي لـ "die Frauen"?', options: ['واحد', 'اثنان', 'جمع', 'مجهول'], correct: 2, level: 'A1' },
    { q: 'ما معنى "Entschuldigung"?', options: ['أهلاً', 'معذرة', 'شكراً', 'وداعاً'], correct: 1, level: 'A1' },
    { q: 'اختر الترجمة الصحيحة لـ "water":', options: ['Wasser', 'Feuer', 'Luft', 'Erde'], correct: 0, level: 'A1' },

    // A2 Level
    { q: 'أكمل: Gestern ___ ich ins Kino.', options: ['gehe', 'ging', 'bin', 'war'], correct: 1, level: 'A2' },
    { q: 'ما الفرق بين "der" و "die" و "das"؟', options: ['أحرف تعريف للمذكر والمؤنث والمحايد', 'أفعال', 'حروف جر', 'ضمائر'], correct: 0, level: 'A2' },
    { q: 'ما معنى "trotzdem"?', options: ['لذلك', 'مع ذلك', 'أيضاً', 'أحياناً'], correct: 1, level: 'A2' },
    { q: 'أكمل: Ich habe Hunger. Ich möchte etwas ___.', options: ['trinken', 'essen', 'schlafen', 'lesen'], correct: 1, level: 'A2' },
    { q: 'كيف تقول "الort" في المكان؟', options: ['Wo', 'Was', 'Wer', 'Wann'], correct: 0, level: 'A2' },

    // B1 Level
    { q: 'ما نوع الجملة: "Wenn ich Zeit hätte, würde ich reisen"?', options: ['جملة شرطية', 'جملة استفهامية', 'جملة تعجبية', 'جملة نفي'], correct: 0, level: 'B1' },
    { q: 'أي من هذه الأفعال من المجموعة الثانية (schwache Verben)؟', options: ['gehen', 'fahren', 'machen', 'lesen'], correct: 2, level: 'B1' },
    { q: 'ما معنى "allerdings"?', options: ['بالطبع', 'ومع ذلك', 'ربما', 'أبداً'], correct: 1, level: 'B1' },
    { q: 'أكمل: Er hat das Buch ge___ (lesen).', options: ['lesen', 'las', 'gelesen', 'lese'], correct: 2, level: 'B1' },

    // B2 Level
    { q: 'ما الفرق بين "trotz" و "trotzdem"?', options: ['لا فرق', 'trotz حرف جر، trotzdem ظرف', 'كلاهما أفعال', 'كلاهما حروف'], correct: 1, level: 'B2' },
    { q: 'أي من هذه الصيغ صحيحة نحوياً؟', options: ['Ich bin nach Hause gegangen', 'Ich habe nach Hause gegangen', 'Ich bin nach Hause gangen', 'Ich habe nach Hause gelesen'], correct: 0, level: 'B2' },
    { q: 'ما معنى "sich etwas vornehmen"?', options: ['أن يتخلى عن شيء', 'أن يخطط لشيء', 'أن يخشى شيئاً', 'أن ينسى شيئاً'], correct: 1, level: 'B2' },

    // C1 Level
    { q: 'أي من هذه الجمل تحتوي على Konjunktiv II؟', options: ['Wenn ich reich wäre, würde ich ein Haus kaufen', 'Ich war gestern im Kino', 'Er liest ein Buch', 'Wir gehen morgen schwimmen'], correct: 0, level: 'C1' },
    { q: 'ما معنى "es sei denn"?', options: ['ربما', 'إلا إذا', 'بسبب', 'في حين'], correct: 1, level: 'C1' },
    { q: 'ما الفرق بين "während" و "währenddessen"?', options: ['لا فرق', 'während حرف جر/أداة، währenddessen ظرف', 'كلاهما أسماء', 'كلاهما أفعال'], correct: 1, level: 'C1' },

    // C2 Level
    { q: 'أي من هذه العبارات أكثر رسمية؟', options: ['Ich möchte Sie fragen', 'Ich wollt dich mal fragen', 'Kann ich dich was fragen', 'Hör mal'], correct: 0, level: 'C2' },
    { q: 'ما معنى "in Anbetracht"?', options: ['بجانب', 'بالنظر إلى', 'بدلاً من', 'خلال'], correct: 1, level: 'C2' },
  ];

  let currentIndex = 0;
  let score = 0;
  let answers = [];
  let isActive = false;

  function start() {
    currentIndex = 0;
    score = 0;
    answers = [];
    isActive = true;

    const welcome = document.getElementById('placement-welcome');
    const quizArea = document.getElementById('placement-quiz-area');
    const results = document.getElementById('placement-results');

    if (welcome) welcome.style.display = 'none';
    if (results) results.style.display = 'none';
    if (quizArea) quizArea.style.display = 'block';

    showQuestion();
  }

  function showQuestion() {
    if (currentIndex >= questions.length) {
      finish();
      return;
    }

    const q = questions[currentIndex];
    const progressFill = document.querySelector('#placement-progress-bar .placement-progress-fill');
    const progressText = document.getElementById('placement-progress-text');
    const questionText = document.getElementById('placement-question-text');
    const optionsContainer = document.getElementById('placement-options');
    const nextBtn = document.getElementById('placement-next-btn');

    if (progressFill) progressFill.style.width = ((currentIndex / questions.length) * 100) + '%';
    if (progressText) progressText.textContent = (currentIndex + 1) + ' / ' + questions.length;
    if (questionText) questionText.textContent = q.q;
    if (nextBtn) nextBtn.style.display = 'none';

    if (optionsContainer) {
      optionsContainer.innerHTML = '';
      q.options.forEach(function(opt, i) {
        const btn = document.createElement('button');
        btn.className = 'placement-option';
        btn.setAttribute('role', 'radio');
        btn.setAttribute('aria-checked', 'false');
        btn.textContent = opt;
        btn.addEventListener('click', function() { selectAnswer(i); });
        optionsContainer.appendChild(btn);
      });
    }
  }

  function selectAnswer(index) {
    if (!isActive) return;

    const q = questions[currentIndex];
    const options = document.querySelectorAll('.placement-option');
    const nextBtn = document.getElementById('placement-next-btn');

    options.forEach(function(opt, i) {
      opt.disabled = true;
      opt.classList.remove('selected');
      if (i === q.correct) opt.classList.add('correct');
      if (i === index && i !== q.correct) opt.classList.add('incorrect');
    });

    answers.push({ question: currentIndex, selected: index, correct: q.correct, level: q.level });
    if (index === q.correct) score++;

    if (nextBtn) nextBtn.style.display = 'inline-block';
  }

  function nextQuestion() {
    currentIndex++;
    showQuestion();
  }

  function finish() {
    isActive = false;
    const quizArea = document.getElementById('placement-quiz-area');
    const results = document.getElementById('placement-results');

    if (quizArea) quizArea.style.display = 'none';
    if (results) results.style.display = 'block';

    const level = calculateLevel();
    const resultLevel = document.getElementById('placement-result-level');
    const scoreNum = document.getElementById('placement-score-number');
    const resultMsg = document.getElementById('placement-result-msg');

    if (resultLevel) resultLevel.textContent = level;
    if (scoreNum) scoreNum.textContent = score;
    if (resultMsg) resultMsg.textContent = getLevelMessage(level);

    // Save placement result
    if (typeof Progress !== 'undefined') {
      Progress.savePlacement(level);
    }
  }

  function calculateLevel() {
    const levelScores = { A1: 0, A2: 0, B1: 0, B2: 0, C1: 0, C2: 0 };
    const levelCounts = { A1: 0, A2: 0, B1: 0, B2: 0, C1: 0, C2: 0 };

    answers.forEach(function(a) {
      levelCounts[a.level] = (levelCounts[a.level] || 0) + 1;
      if (a.selected === a.correct) {
        levelScores[a.level] = (levelScores[a.level] || 0) + 1;
      }
    });

    let bestLevel = 'A1';
    let bestRatio = 0;
    const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

    levels.forEach(function(level) {
      if (levelCounts[level] > 0) {
        const ratio = levelScores[level] / levelCounts[level];
        if (ratio >= 0.6 && levels.indexOf(level) > levels.indexOf(bestLevel)) {
          bestLevel = level;
        }
      }
    });

    return bestLevel;
  }

  function getLevelMessage(level) {
    const messages = {
      'A1': 'ممتاز! أنت مبتدئ ومستواك يبدأ من A1. سنبدأ بالأساسيات.',
      'A2': 'جيد! لديك أساسيات جيدة. سنعمل على تقوية مفرداتك وقواعدك.',
      'B1': 'ممتاز! مستواك متوسط. يمكنك التعامل مع مواقف يومية.',
      'B2': 'رائع! مستواك فوق المتوسط. سنعمل على تطوير مهاراتك المتقدمة.',
      'C1': 'مذهل! أنت متقدم. يمكنك التعبير بحرية وفهم النصوص المعقدة.',
      'C2': 'إنجاز استثنائي! مستواك يقترب من الإتقان. سنعمل على صقل مهاراتك.'
    };
    return messages[level] || messages['A1'];
  }

  function reset() {
    currentIndex = 0;
    score = 0;
    answers = [];
    isActive = false;

    const welcome = document.getElementById('placement-welcome');
    const quizArea = document.getElementById('placement-quiz-area');
    const results = document.getElementById('placement-results');

    if (welcome) welcome.style.display = 'block';
    if (quizArea) quizArea.style.display = 'none';
    if (results) results.style.display = 'none';
  }

  function init() {
    const startBtn = document.getElementById('placement-start-btn');
    const nextBtn = document.getElementById('placement-next-btn');
    const retryBtn = document.getElementById('placement-retry-btn');
    const learnBtn = document.getElementById('placement-learn-btn');

    if (startBtn) startBtn.addEventListener('click', start);
    if (nextBtn) nextBtn.addEventListener('click', nextQuestion);
    if (retryBtn) retryBtn.addEventListener('click', reset);
    if (learnBtn) learnBtn.addEventListener('click', function() {
      if (typeof App !== 'undefined' && App.navigateTo) {
        App.navigateTo('page-learn');
      }
    });
  }

  return {
    init: init,
    start: start,
    reset: reset,
    calculateLevel: calculateLevel
  };
})();

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', PlacementQuiz.init);
}
