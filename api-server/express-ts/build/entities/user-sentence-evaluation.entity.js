"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
  @version PEAC-162 PEAC-163 complete: evaluate user voice and insert result to db
*/
var db_1 = require("../db");
var UserSentenceEvaluation = /** @class */ (function () {
    function UserSentenceEvaluation(userId, sentenceId, score, sttResult, userVoiceUri, isPublic, createdAt, sentenceEvaluationCounts) {
        var _this = this;
        this.userId = userId;
        this.sentenceId = sentenceId;
        this.score = score;
        this.sttResult = sttResult;
        this.userVoiceUri = userVoiceUri;
        this.isPublic = isPublic;
        this.createdAt = createdAt;
        this.sentenceEvaluationCounts = sentenceEvaluationCounts;
        this.insert = function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        _a = this;
                        return [4 /*yield*/, UserSentenceEvaluation.getSentenceEvaluationCounts(this.userId, this.sentenceId)];
                    case 1:
                        _a.sentenceEvaluationCounts =
                            _b.sent();
                        return [4 /*yield*/, db_1.pool.query('INSERT INTO user_sentence_evaluation(sentence_evaluation_counts, user_id, sentence_id, score, stt_result, user_voice_uri, is_public, created_at)\
    VALUES($1,$2,$3,$4,$5,$6,$7,$8)', [
                                this.sentenceEvaluationCounts,
                                this.userId,
                                this.sentenceId,
                                this.score,
                                this.sttResult,
                                this.userVoiceUri,
                                this.isPublic,
                                this.createdAt
                            ])];
                    case 2:
                        _b.sent();
                        return [2 /*return*/, {
                                sentenceEvaluationCounts: this.sentenceEvaluationCounts,
                                userId: this.userId,
                                sentenceId: this.sentenceId,
                                userVoiceUri: this.userVoiceUri
                            }];
                    case 3:
                        error_1 = _b.sent();
                        console.error('Error: UserSentenceEvaluation insert function ');
                        throw error_1;
                    case 4: return [2 /*return*/];
                }
            });
        }); };
    }
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    UserSentenceEvaluation.getSentenceEvaluationCounts = function (userId, sentenceId) { return __awaiter(void 0, void 0, void 0, function () {
        var sentenceEvaluationCounts, _a, error_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    _a = parseInt;
                    return [4 /*yield*/, db_1.pool.query('SELECT count(*) FROM user_sentence_evaluation WHERE user_id = $1 AND sentence_id = $2', [userId, sentenceId])];
                case 1:
                    sentenceEvaluationCounts = _a.apply(void 0, [(_b.sent()).rows[0].count]) + 1;
                    return [2 /*return*/, sentenceEvaluationCounts];
                case 2:
                    error_2 = _b.sent();
                    console.error('Error: UserSentenceEvaluation getSentenceEvaluationCounts function ');
                    throw error_2;
                case 3: return [2 /*return*/];
            }
        });
    }); };
    return UserSentenceEvaluation;
}());
exports.default = UserSentenceEvaluation;
//# sourceMappingURL=user-sentence-evaluation.entity.js.map