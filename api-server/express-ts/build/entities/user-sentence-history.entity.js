"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSentenceHistory = void 0;
var UserSentenceHistory = /** @class */ (function () {
    function UserSentenceHistory(userId, sentenceId, perfectVoiceCounts, userVoiceCounts, averageScore, highestScore, learningRate, latestLearningAt, isBookmark, bookmarkAt) {
        this.userId = userId;
        this.sentenceId = sentenceId;
        this.perfectVoiceCounts = perfectVoiceCounts;
        this.userVoiceCounts = userVoiceCounts;
        this.averageScore = averageScore;
        this.highestScore = highestScore;
        this.learningRate = learningRate;
        this.latestLearningAt = latestLearningAt;
        this.isBookmark = isBookmark;
        this.bookmarkAt = bookmarkAt;
    }
    // update 테이블명 set 컬럼명 = 컬럼명+ 1
    // 성우 음성 재생 횟수 1 증가
    UserSentenceHistory.insertPerfectVoiceCounts = function () { };
    return UserSentenceHistory;
}());
exports.UserSentenceHistory = UserSentenceHistory;
//# sourceMappingURL=user-sentence-history.entity.js.map