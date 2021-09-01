"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserContentHistory = void 0;
var UserContentHistory = /** @class */ (function () {
    function UserContentHistory(userId, contentId, counts, latestLearningAt, learningTime, progressRate) {
        this.userId = userId;
        this.contentId = contentId;
        this.counts = counts;
        this.latestLearningAt = latestLearningAt;
        this.learningTime = learningTime;
        this.progressRate = progressRate;
    }
    return UserContentHistory;
}());
exports.UserContentHistory = UserContentHistory;
//# sourceMappingURL=user-content-history.entity.js.map