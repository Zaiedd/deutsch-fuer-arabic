// Spaced Repetition System for Deutsch für Araber
// SM-2 inspired algorithm for vocabulary learning

const SpacedRepetition = {

    // Default word progress structure
    defaultWordProgress() {
        return {
            lastReviewed: null,
            nextReview: null,
            reviewCount: 0,
            correctCount: 0,
            streak: 0,
            easeFactor: 2.5,
            interval: 0,
            qualityHistory: []
        };
    },

    // Calculate quality rating (0-5) from correctness and difficulty
    calculateQuality(correct, difficulty) {
        difficulty = Math.max(1, Math.min(5, difficulty || 3));

        if (correct) {
            if (difficulty <= 2) return 5;
            if (difficulty === 3) return 4;
            return 3;
        }

        if (difficulty <= 2) return 1;
        return 0;
    },

    // Core SM-2 algorithm: returns updated interval (days) and ease factor
    sm2(currentInterval, easeFactor, quality) {
        quality = Math.max(0, Math.min(5, quality));

        let newEF = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
        newEF = Math.max(1.3, newEF);

        let newInterval;
        if (quality < 3) {
            newInterval = 1;
        } else {
            if (currentInterval === 0) {
                newInterval = 1;
            } else if (currentInterval === 1) {
                newInterval = Math.round(currentInterval * newEF * 1.5);
            } else {
                newInterval = Math.round(currentInterval * newEF);
            }
        }

        return {
            interval: newInterval,
            easeFactor: Math.round(newEF * 100) / 100
        };
    },

    // Update word progress after a review
    updateAfterReview(wordKey, quality, progressData) {
        if (!progressData.words) progressData.words = {};
        if (!progressData.words[wordKey]) {
            progressData.words[wordKey] = this.defaultWordProgress();
        }

        const word = progressData.words[wordKey];
        const now = new Date().toISOString();
        const sm2Result = this.sm2(word.interval, word.easeFactor, quality);

        word.reviewCount += 1;
        word.correctCount += (quality >= 3) ? 1 : 0;
        word.lastReviewed = now;
        word.interval = sm2Result.interval;
        word.easeFactor = sm2Result.easeFactor;

        if (quality >= 3) {
            word.streak += 1;
        } else {
            word.streak = 0;
        }

        if (word.qualityHistory.length >= 20) {
            word.qualityHistory.shift();
        }
        word.qualityHistory.push(quality);

        const nextDate = new Date();
        nextDate.setDate(nextDate.getDate() + sm2Result.interval);
        word.nextReview = nextDate.toISOString();

        return word;
    },

    // Get next review date for a word (without modifying data)
    getNextReview(wordKey, progressData) {
        if (!progressData.words || !progressData.words[wordKey]) {
            return new Date().toISOString();
        }
        return progressData.words[wordKey].nextReview;
    },

    // Get all words that are due for review
    getDueWords(progressData, allWords) {
        const now = new Date();
        const due = [];

        if (!progressData.words) return due;

        for (const key of allWords) {
            const word = progressData.words[key];
            if (!word) {
                due.push(key);
            } else if (new Date(word.nextReview) <= now) {
                due.push(key);
            }
        }

        return due;
    },

    // Get words due within the next N days
    getUpcomingReviews(progressData, allWords, days) {
        const now = new Date();
        const deadline = new Date();
        deadline.setDate(deadline.getDate() + (days || 7));
        const upcoming = [];

        if (!progressData.words) return upcoming;

        for (const key of allWords) {
            const word = progressData.words[key];
            if (!word) {
                upcoming.push(key);
                continue;
            }
            const nextReview = new Date(word.nextReview);
            if (nextReview >= now && nextReview <= deadline) {
                upcoming.push(key);
            }
        }

        return upcoming;
    },

    // Get stats for a specific word
    getWordStats(wordKey, progressData) {
        if (!progressData.words || !progressData.words[wordKey]) {
            return {
                wordKey: wordKey,
                reviewCount: 0,
                correctCount: 0,
                accuracy: 0,
                streak: 0,
                easeFactor: 2.5,
                interval: 0,
                lastReviewed: null,
                nextReview: null,
                status: 'new'
            };
        }

        const w = progressData.words[wordKey];
        const accuracy = w.reviewCount > 0
            ? Math.round((w.correctCount / w.reviewCount) * 100)
            : 0;

        let status = 'learning';
        if (w.reviewCount === 0) status = 'new';
        else if (w.interval >= 21) status = 'mastered';
        else if (w.interval >= 3) status = 'reviewing';

        return {
            wordKey: wordKey,
            reviewCount: w.reviewCount,
            correctCount: w.correctCount,
            accuracy: accuracy,
            streak: w.streak,
            easeFactor: w.easeFactor,
            interval: w.interval,
            lastReviewed: w.lastReviewed,
            nextReview: w.nextReview,
            status: status
        };
    },

    // Get stats for all words in a level
    getLevelStats(level, progressData) {
        if (!progressData.words) progressData.words = {};

        const levelWords = Object.keys(progressData.words).filter(
            (key) => key.startsWith('level-' + level + '-')
        );

        let totalReviews = 0;
        let totalCorrect = 0;
        let masteredCount = 0;
        let learningCount = 0;
        let newCount = 0;

        for (const key of levelWords) {
            const s = this.getWordStats(key, progressData);
            totalReviews += s.reviewCount;
            totalCorrect += s.correctCount;
            if (s.status === 'mastered') masteredCount++;
            else if (s.status === 'new') newCount++;
            else learningCount++;
        }

        return {
            level: level,
            totalWords: levelWords.length,
            totalReviews: totalReviews,
            accuracy: totalReviews > 0
                ? Math.round((totalCorrect / totalReviews) * 100)
                : 0,
            mastered: masteredCount,
            learning: learningCount,
            new: newCount,
            masteredPercent: levelWords.length > 0
                ? Math.round((masteredCount / levelWords.length) * 100)
                : 0
        };
    }
};
