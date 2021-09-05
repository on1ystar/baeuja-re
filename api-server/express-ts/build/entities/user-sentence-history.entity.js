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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSentenceHistory = void 0;
/**
  @description user_sentence_history entity with repository
  @version feature/api/PEAC-39-PEAC-170-user-sentence-history-api
*/
var pg_format_1 = __importDefault(require("pg-format"));
var db_1 = require("../db");
var Date_1 = require("../utils/Date");
var UserSentenceHistory = /** @class */ (function () {
    function UserSentenceHistory(userId, sentenceId, perfectVoiceCounts, userVoiceCounts, averageScore, highestScore, learningRate, latestLearningAt, isBookmark, bookmarkAt) {
        var _this = this;
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
        // 성우 음성 재생 횟수 1 증가
        this.updatePerfectVoiceCounts = function () { return __awaiter(_this, void 0, void 0, function () {
            var perfectVoiceCounts, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, db_1.pool.query('UPDATE user_sentence_history SET perfect_voice_counts = perfect_voice_counts + 1, latest_learning_at = $1 WHERE user_id = $2 AND sentence_id = $3 RETURNING perfect_voice_counts', [Date_1.getNowKO(), this.userId, this.sentenceId])];
                    case 1:
                        perfectVoiceCounts = (_a.sent()).rows[0].perfect_voice_counts;
                        console.log("updated user_sentence_history table's perfect_voice_counts");
                        return [2 /*return*/, perfectVoiceCounts];
                    case 2:
                        error_1 = _a.sent();
                        console.log('Error: user-sentence-history.entity.ts updatePerfectVoiceCounts function ');
                        throw error_1;
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        // 사용자 음성 재생 횟수 1 증가
        this.updateUserVoiceCounts = function () { return __awaiter(_this, void 0, void 0, function () {
            var userVoiceCounts, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, db_1.pool.query('UPDATE user_sentence_history SET user_voice_counts = user_voice_counts + 1, latest_learning_at = $1 WHERE user_id = $2 AND sentence_id = $3 RETURNING user_voice_counts', [Date_1.getNowKO(), this.userId, this.sentenceId])];
                    case 1:
                        userVoiceCounts = (_a.sent()).rows[0].user_voice_counts;
                        console.log("updated user_sentence_history table's user_voice_counts");
                        return [2 /*return*/, userVoiceCounts];
                    case 2:
                        error_2 = _a.sent();
                        console.log('Error: user-sentence-history.entity.ts updateUserVoiceCounts function ');
                        throw error_2;
                    case 3: return [2 /*return*/];
                }
            });
        }); };
    }
    // 사용자 문장 학습 기록 생성
    UserSentenceHistory.createList = function (userId, sentencesId) { return __awaiter(void 0, void 0, void 0, function () {
        var ARRAY_INSERT_SQL, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    ARRAY_INSERT_SQL = pg_format_1.default('INSERT INTO user_sentence_history(user_id, sentence_id, latest_learning_at, learning_rate) VALUES %L', sentencesId.map(function (sentenceId) { return [userId, sentenceId, Date_1.getNowKO(), 0]; }));
                    return [4 /*yield*/, db_1.pool.query(ARRAY_INSERT_SQL)];
                case 1:
                    _a.sent();
                    console.log("inserted user_sentence_history table's rows");
                    return [3 /*break*/, 3];
                case 2:
                    error_3 = _a.sent();
                    console.log('Error: user-sentence-history.entity.ts createList function ');
                    throw error_3;
                case 3: return [2 /*return*/];
            }
        });
    }); };
    return UserSentenceHistory;
}());
exports.UserSentenceHistory = UserSentenceHistory;
//# sourceMappingURL=user-sentence-history.entity.js.map