const QuizEngine = {
  _questions: [],
  _currentIndex: 0,
  _answers: [],
  _startTime: null,
  _level: null,
  _type: null,

  startQuiz(level, type, count = 10) {
    this._level = level;
    this._type = type;
    this._currentIndex = 0;
    this._answers = [];
    this._startTime = Date.now();

    const allWords = [];
    const categories = DATA[level].categories;
    for (const cat in categories) {
      categories[cat].forEach(w => allWords.push({ ...w, category: cat }));
    }

    const shuffled = this.shuffle(allWords);
    const selected = shuffled.slice(0, Math.min(count, shuffled.length));
    this._questions = selected.map(w => this.generateQuestion(w, type, allWords));

    return {
      total: this._questions.length,
      type: type,
      level: level
    };
  },

  generateQuestion(word, type, allWords) {
    const others = allWords.filter(w => w.de !== word.de);

    switch (type) {
      case 'vocabulary':
        return this._genVocabulary(word, others);
      case 'articles':
        return this._genArticles(word);
      case 'translation':
        return this._genTranslation(word, others);
      case 'sentence':
        return this._genSentence(word, others);
      case 'mixed':
        return this._genMixed(word, others);
      default:
        return this._genVocabulary(word, others);
    }
  },

  _genVocabulary(word, others) {
    const wrongOptions = this.getWrongOptions(others, word.ar, 3, 'ar');
    const options = this.shuffle([word.ar, ...wrongOptions]);
    const correctIndex = options.indexOf(word.ar);
    return {
      type: 'vocabulary',
      question: `ما معنى كلمة "${word.de}"${word.article !== 'none' ? ' (' + word.article + ')' : ''}؟`,
      options,
      correctIndex,
      word,
      explanation: `${word.de} = ${word.ar}${word.phonetic ? '\nالنطق: ' + word.phonetic : ''}`
    };
  },

  _genArticles(word) {
    if (word.article === 'none') {
      return this._genVocabulary(word, []);
    }
    const options = this.shuffle(['der', 'die', 'das']);
    const correctIndex = options.indexOf(word.article);
    return {
      type: 'articles',
      question: `___ ${word.de.replace(/^(der |die |das )/, '')}`,
      options,
      correctIndex,
      word,
      explanation: `${word.article} ${word.de.replace(/^(der |die |das )/, '')} = ${word.ar}`
    };
  },

  _genTranslation(word, others) {
    const wrongDeOptions = this.getWrongOptions(others, word.de, 3, 'de');
    const options = this.shuffle([word.de, ...wrongDeOptions]);
    const correctIndex = options.indexOf(word.de);
    return {
      type: 'translation',
      question: `ما ترجمة "${word.ar}" بالألمانية؟`,
      options,
      correctIndex,
      word,
      explanation: `${word.ar} = ${word.de}`
    };
  },

  _genSentence(word, others) {
    if (!word.example) {
      return this._genVocabulary(word, others);
    }
    const blank = word.example.replace(new RegExp(word.de.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), '______');
    const wrongOptions = this.getWrongOptions(others, word.de, 3, 'de');
    const options = this.shuffle([word.de, ...wrongOptions]);
    const correctIndex = options.indexOf(word.de);
    return {
      type: 'sentence',
      question: `أكمل الجملة: ${blank}`,
      options,
      correctIndex,
      word,
      explanation: `الجملة الصحيحة: ${word.example}${word.ex_ar ? '\nالترجمة: ' + word.ex_ar : ''}`
    };
  },

  _genMixed(word, others) {
    const types = ['vocabulary', 'articles', 'translation', 'sentence'];
    const available = word.article !== 'none' ? types : types.filter(t => t !== 'articles');
    const availableFiltered = word.example ? available : available.filter(t => t !== 'sentence');
    const chosen = availableFiltered[Math.floor(Math.random() * availableFiltered.length)];
    return this.generateQuestion(word, chosen, others);
  },

  answerQuestion(index, optionIndex) {
    const q = this._questions[index];
    const isCorrect = optionIndex === q.correctIndex;
    this._answers[index] = { questionIndex: index, selected: optionIndex, isCorrect };
    return { isCorrect, correctIndex: q.correctIndex };
  },

  getResults() {
    const duration = Math.round((Date.now() - this._startTime) / 1000);
    const total = this._questions.length;
    const correct = this._answers.filter(a => a && a.isCorrect).length;
    const incorrect = total - correct;
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
    const xpEarned = correct * 5 + (accuracy === 100 ? 10 : 0);

    const weakAreas = {};
    const categoryStats = {};

    this._questions.forEach((q, i) => {
      const cat = q.word.category;
      if (!categoryStats[cat]) categoryStats[cat] = { total: 0, correct: 0 };
      categoryStats[cat].total++;
      if (this._answers[i] && this._answers[i].isCorrect) {
        categoryStats[cat].correct++;
      } else {
        if (!weakAreas[q.type]) weakAreas[q.type] = 0;
        weakAreas[q.type]++;
      }
    });

    if (typeof Progress !== 'undefined') {
      Progress.addXP(xpEarned);
      Progress.addQuizResult({
        level: this._level,
        type: this._type,
        score: accuracy,
        total,
        correct,
        xpEarned,
        date: new Date().toISOString()
      });
    }

    return {
      total,
      correct,
      incorrect,
      accuracy,
      duration,
      weakAreas,
      categoryStats,
      xpEarned,
      questions: this._questions.map((q, i) => ({
        ...q,
        userAnswer: this._answers[i] ? this._answers[i].selected : null,
        isCorrect: this._answers[i] ? this._answers[i].isCorrect : false
      }))
    };
  },

  renderQuizUI(container, questionIndex) {
    const q = this._questions[questionIndex];
    const total = this._questions.length;
    const progress = ((questionIndex + 1) / total) * 100;

    let feedbackHtml = '';
    const answer = this._answers[questionIndex];
    if (answer) {
      const isCorrect = answer.isCorrect;
      const correctWord = q.word.de;
      feedbackHtml = `
        <div class="quiz-feedback ${isCorrect ? 'correct' : 'wrong'}">
          <span class="quiz-feedback-icon">${isCorrect ? '✓' : '✗'}</span>
          <span class="quiz-feedback-text">${isCorrect ? 'أحسنت!' : 'الإجابة خاطئة'}</span>
        </div>
        <div class="quiz-explanation">${q.explanation.replace(/\n/g, '<br>')}</div>
        <button class="quiz-next-btn" onclick="handleQuizNext()">
          ${questionIndex < total - 1 ? 'السؤال التالي →' : 'عرض النتائج'}
        </button>
      `;
    }

    const optionsHtml = q.options.map((opt, i) => {
      let cls = 'quiz-option';
      if (answer) {
        if (i === q.correctIndex) cls += ' correct';
        else if (i === answer.selected) cls += ' wrong';
      }
      return `<button class="${cls}" onclick="handleQuizAnswer(${questionIndex}, ${i})" ${answer ? 'disabled' : ''}>${opt}</button>`;
    }).join('');

    container.innerHTML = `
      <div class="quiz-container">
        <div class="quiz-progress-bar">
          <div class="quiz-progress-fill" style="width: ${progress}%"></div>
        </div>
        <div class="quiz-header">
          <span class="quiz-counter">${questionIndex + 1} / ${total}</span>
          <span class="quiz-type-badge">${this.getTypeName(q.type)}</span>
        </div>
        <div class="quiz-question">${q.question}</div>
        <div class="quiz-options">${optionsHtml}</div>
        ${feedbackHtml}
      </div>
    `;
  },

  renderResults(container, results) {
    const msg = results.accuracy >= 90 ? 'ممتاز! أداء رائع!' :
                results.accuracy >= 70 ? 'جيد جداً! واصل التعلم!' :
                results.accuracy >= 50 ? 'جيد! محتاج مراجعة.' :
                'حاول مرة أخرى! لا تستسلم!';

    const weakBadges = Object.entries(results.weakAreas).map(([type, count]) =>
      `<span class="quiz-weak-badge">${this.getTypeName(type)}: ${count} خطأ</span>`
    ).join('');

    const questionsHtml = results.questions.map((q, i) => `
      <div class="quiz-question-result ${q.isCorrect ? 'correct' : 'wrong'}">
        <span class="quiz-result-num">${i + 1}.</span>
        <span class="quiz-result-q">${q.question}</span>
        <span class="quiz-result-status">${q.isCorrect ? '✓' : '✗'}</span>
        ${!q.isCorrect ? `<span class="quiz-result-correct">${q.options[q.correctIndex]}</span>` : ''}
      </div>
    `).join('');

    const mins = Math.floor(results.duration / 60);
    const secs = results.duration % 60;

    container.innerHTML = `
      <div class="quiz-results">
        <div class="quiz-results-score">${results.accuracy}%</div>
        <div class="quiz-results-msg">${msg}</div>
        <div class="quiz-results-stats">
          <div class="quiz-stat-item">
            <span class="quiz-stat-value">${results.correct}</span>
            <span class="quiz-stat-label">صحيحة</span>
          </div>
          <div class="quiz-stat-item">
            <span class="quiz-stat-value">${results.incorrect}</span>
            <span class="quiz-stat-label">خاطئة</span>
          </div>
          <div class="quiz-stat-item">
            <span class="quiz-stat-value">${mins}:${secs.toString().padStart(2, '0')}</span>
            <span class="quiz-stat-label">المدة</span>
          </div>
          <div class="quiz-stat-item">
            <span class="quiz-stat-value">+${results.xpEarned}</span>
            <span class="quiz-stat-label">XP</span>
          </div>
        </div>
        ${weakBadges ? `<div class="quiz-results-weak"><h3>مجالات تحتاج مراجعة:</h3>${weakBadges}</div>` : ''}
        <div class="quiz-results-questions">${questionsHtml}</div>
        <div class="quiz-results-btn">
          <button class="quiz-btn quiz-btn-primary" onclick="handleQuizRetry()">إعادة الاختبار</button>
          <button class="quiz-btn quiz-btn-secondary" onclick="handleQuizBack()">العودة</button>
        </div>
      </div>
    `;
  },

  getTypeName(type) {
    const names = {
      vocabulary: 'المفردات',
      articles: 'الأحرف الإشارة',
      translation: 'الترجمة',
      sentence: 'إكمال الجملة',
      mixed: 'متنوع'
    };
    return names[type] || type;
  },

  shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  },

  getWrongOptions(others, correctValue, count, field) {
    const seen = new Set();
    const result = [];
    const shuffled = this.shuffle(others);
    for (const w of shuffled) {
      const val = w[field];
      if (val !== correctValue && !seen.has(val)) {
        seen.add(val);
        result.push(val);
        if (result.length >= count) break;
      }
    }
    while (result.length < count) {
      const fake = field === 'ar' ? 'خيار ' + (result.length + 1) : 'Wort ' + (result.length + 1);
      if (!result.includes(fake)) result.push(fake);
    }
    return result;
  },

  getContainer() {
    return document.getElementById('quizArea');
  },

  show(containerId = 'quizArea') {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.style.display = 'block';
    container.scrollIntoView({ behavior: 'smooth' });
  },

  hide(containerId = 'quizArea') {
    const container = document.getElementById(containerId);
    if (container) container.style.display = 'none';
  }
};

window.quizState = {
  level: null,
  type: null,
  count: 10,
  containerId: 'quizArea'
};

function handleQuizAnswer(qIndex, optIndex) {
  const result = QuizEngine.answerQuestion(qIndex, optIndex);
  const container = document.getElementById(window.quizState.containerId);
  if (container) {
    QuizEngine.renderQuizUI(container, qIndex);
  }
}

function handleQuizNext() {
  QuizEngine._currentIndex++;
  const container = document.getElementById(window.quizState.containerId);
  if (!container) return;

  if (QuizEngine._currentIndex >= QuizEngine._questions.length) {
    const results = QuizEngine.getResults();
    QuizEngine.renderResults(container, results);
  } else {
    QuizEngine.renderQuizUI(container, QuizEngine._currentIndex);
  }
}

function handleQuizRetry() {
  const s = window.quizState;
  QuizEngine.startQuiz(s.level, s.type, s.count);
  const container = document.getElementById(s.containerId);
  if (container) QuizEngine.renderQuizUI(container, 0);
}

function handleQuizBack() {
  QuizEngine.hide(window.quizState.containerId);
  if (typeof showLevelSelect === 'function') {
    showLevelSelect();
  }
}

function startQuiz(level, type, count = 10, containerId = 'quizArea') {
  window.quizState = { level, type, count, containerId };
  QuizEngine.startQuiz(level, type, count);
  const container = document.getElementById(containerId);
  if (container) {
    QuizEngine.show(containerId);
    QuizEngine.renderQuizUI(container, 0);
  }
}
