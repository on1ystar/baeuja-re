"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.GetLearningUnitDTO = void 0;
/*
  메인(문장) 학습 화면 구성을 위한 DTO
  version: PEAC-161 get learning unit with sentences for main learning UI
 */
var pg_1 = require("pg");
var db_1 = require("../../db");
// --------------------------------------------------------------------
// getInstance(userId: number, unitIndex: number, contentId: number)를 호출해서 인스턴스 생성
var GetLearningUnitDTO = /** @class */ (function () {
    function GetLearningUnitDTO(unit, sentences) {
        this.unit = unit;
        this.sentences = sentences;
    }
    // GetLearningUnitDTO 객체 반환
    GetLearningUnitDTO.getInstance = function (userId, unitIndex, contentId) {
        return __awaiter(this, void 0, void 0, function () {
            var unit, sentences, words_1, mappedSentences, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, this.getUnit(unitIndex, contentId)];
                    case 1:
                        unit = _a.sent();
                        return [4 /*yield*/, this.getSentences(userId, unitIndex, contentId)];
                    case 2:
                        sentences = _a.sent();
                        return [4 /*yield*/, this.getWords(unitIndex, contentId)];
                    case 3:
                        words_1 = _a.sent();
                        mappedSentences = sentences.map(function (sentence) {
                            return __assign(__assign({}, sentence), { words: words_1.filter(function (word) { return word.sentenceId === sentence.sentenceId; }) });
                        });
                        return [2 /*return*/, new GetLearningUnitDTO(unit, mappedSentences)];
                    case 4:
                        error_1 = _a.sent();
                        throw error_1;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    GetLearningUnitDTO.getUnit = function (unitIndex, contentId) {
        return __awaiter(this, void 0, void 0, function () {
            var queryResult, unit, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, db_1.pool.query('SELECT youtube_url as "youtubeUrl", start_time as "startTime", end_time as "endTime" FROM unit WHERE "unit_index" = $1 AND "content_id" = $2', [unitIndex, contentId])];
                    case 1:
                        queryResult = _a.sent();
                        if (!queryResult.rowCount) {
                            throw new pg_1.DatabaseError('unitIndex or contentsId does not exist', 0, 'noData');
                        }
                        unit = __assign({ unitIndex: unitIndex,
                            contentId: contentId }, queryResult.rows[0]);
                        return [2 /*return*/, unit];
                    case 2:
                        error_2 = _a.sent();
                        console.error('Error: getUnit function ');
                        throw error_2;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    GetLearningUnitDTO.getSentences = function (userId, unitIndex, contentId) {
        return __awaiter(this, void 0, void 0, function () {
            var queryResult, sentences, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, db_1.pool.query('SELECT s.sentence_id as "sentenceId", s.korean_text as "koreanText", s.translated_text as "translatedText", s.perfect_voice_uri as "perfectVoiceUrl", s.start_time as "startTime", s.end_time as "endTime", COALESCE(h.is_bookmark, false) as "isBookmark"\
            FROM sentence as s \
            FULL JOIN (SELECT user_id, sentence_id, is_bookmark FROM user_sentence_history WHERE user_id = $1) as h \
            ON s.sentence_id = h.sentence_id \
            WHERE s.content_id = $2 AND s.unit_index = $3 ', [userId, contentId, unitIndex])];
                    case 1:
                        queryResult = _a.sent();
                        if (!queryResult.rowCount) {
                            throw new pg_1.DatabaseError('unitIndex or contentsId does not exist', 0, 'noData');
                        }
                        sentences = queryResult.rows;
                        return [2 /*return*/, sentences];
                    case 2:
                        error_3 = _a.sent();
                        console.error('Error: getSentences function ');
                        throw error_3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    GetLearningUnitDTO.getWords = function (unitIndex, contentId) {
        return __awaiter(this, void 0, void 0, function () {
            var queryResult, words;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.pool.query('SELECT w.word_id as "wordId", w.sentence_id as "sentenceId", w.original_korean_text, w.prev_korean_text as "prevKoreanText",w.prev_translated_text as "prevTranslatedText",w.original_korean_text as "originalKoreanText",w.original_translated_text as "originalTranslatedText"\
          FROM word as w \
          JOIN sentence as s \
          ON s.sentence_id = w.sentence_id \
          WHERE s.unit_index = $1 AND s.content_id = $2', [unitIndex, contentId])];
                    case 1:
                        queryResult = _a.sent();
                        if (!queryResult.rowCount) {
                            throw new pg_1.DatabaseError('unitIndex or contentsId does not exist', 0, 'noData');
                        }
                        try {
                            words = queryResult.rows;
                            return [2 /*return*/, words];
                        }
                        catch (error) {
                            console.error('Error: getWords function ');
                            console.error(error);
                            throw error;
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return GetLearningUnitDTO;
}());
exports.GetLearningUnitDTO = GetLearningUnitDTO;
//# sourceMappingURL=get-learning-unit.dto.js.map