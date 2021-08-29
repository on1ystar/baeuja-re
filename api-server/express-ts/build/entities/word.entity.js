"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Word = void 0;
var Word = /** @class */ (function () {
    function Word(wordId, sentenceId, prevKoreanText, prevTranslatedText, originalKoreanText, originalTranslatedText, perfectVoiceUri, importance, createdAt, modifiedAt) {
        this.wordId = wordId;
        this.sentenceId = sentenceId;
        this.prevKoreanText = prevKoreanText;
        this.prevTranslatedText = prevTranslatedText;
        this.originalKoreanText = originalKoreanText;
        this.originalTranslatedText = originalTranslatedText;
        this.perfectVoiceUri = perfectVoiceUri;
        this.importance = importance;
        this.createdAt = createdAt;
        this.modifiedAt = modifiedAt;
    }
    return Word;
}());
exports.Word = Word;
//# sourceMappingURL=word.entity.js.map