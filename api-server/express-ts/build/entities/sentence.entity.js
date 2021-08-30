"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sentence = void 0;
/**
  @version PEAC-162 PEAC-163 complete: evaluate user voice and insert result to db
*/
var Sentence = /** @class */ (function () {
    function Sentence(sentenceId, unitIndex, contentsId, koreanText, translatedText, perfectVoiceUri, isConversation, isFamousLine, startTime, endTime, createdAt, modifiedAt) {
        this.sentenceId = sentenceId;
        this.unitIndex = unitIndex;
        this.contentsId = contentsId;
        this.koreanText = koreanText;
        this.translatedText = translatedText;
        this.perfectVoiceUri = perfectVoiceUri;
        this.isConversation = isConversation;
        this.isFamousLine = isFamousLine;
        this.startTime = startTime;
        this.endTime = endTime;
        this.createdAt = createdAt;
        this.modifiedAt = modifiedAt;
    }
    return Sentence;
}());
exports.Sentence = Sentence;
//# sourceMappingURL=sentence.entity.js.map