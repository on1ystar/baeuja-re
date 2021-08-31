"use strict";
/* eslint-disable no-console */
/**
 @description 메인(문장) 학습 페이지를 위한 컨트롤러
 @version PEAC-39 learning-unit-sentence-with-evaluation / doing evaluateUserVoice
 */
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
exports.evaluateUserVoice = exports.getLearningUnit = void 0;
var config_1 = __importDefault(require("../config"));
var post_evaluation_dto_1 = __importDefault(require("./dto/post-evaluation.dto"));
var get_learning_unit_dto_1 = __importDefault(require("./dto/get-learning-unit.dto"));
var user_sentence_evaluation_entity_1 = __importDefault(require("../entities/user-sentence-evaluation.entity"));
var multer_1 = require("multer");
var s3_1 = require("../utils/s3");
var client_s3_1 = require("@aws-sdk/client-s3");
// const regex = /([^/]+)(\.[^./]+)$/g; // 파일 경로에서 파일 이름만 필터링
var FORMAT = 'wav';
var AI_SERVER_URL = "http://" + config_1.default.peachAi.ip;
// /learning/contents/:contentId/units/:unitIndex
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
exports.getLearningUnit = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, _a, unitIndex, contentId, getLearningUnitDTO, error_1;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                userId = Number((_b = req.headers.authorization) === null || _b === void 0 ? void 0 : _b.substring(7));
                _a = req.params, unitIndex = _a.unitIndex, contentId = _a.contentId;
                _c.label = 1;
            case 1:
                _c.trys.push([1, 3, , 4]);
                // request params 유효성 검사
                if (isNaN(parseInt(unitIndex)) || isNaN(parseInt(unitIndex)))
                    throw new Error("invalid params's syntax");
                return [4 /*yield*/, get_learning_unit_dto_1.default.getInstance(userId, parseInt(unitIndex), parseInt(contentId))];
            case 2:
                getLearningUnitDTO = _c.sent();
                return [2 /*return*/, res.status(200).json(getLearningUnitDTO)];
            case 3:
                error_1 = _c.sent();
                console.error(error_1);
                return [2 /*return*/, res
                        .status(400)
                        .json({ success: false, errorMessage: error_1.message })];
            case 4: return [2 /*return*/];
        }
    });
}); };
// /sentences/:sentenceId/units/evaluation
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
exports.evaluateUserVoice = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, sentenceId, sentenceEvaluationCounts, Key, userVoiceUri, postEvaluationDTO, error_2;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                userId = Number((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.substring(7));
                sentenceId = req.params.sentenceId;
                _c.label = 1;
            case 1:
                _c.trys.push([1, 4, , 5]);
                // request params 유효성 검사
                if (isNaN(parseInt(sentenceId)))
                    throw new Error("invalid params's syntax");
                sentenceEvaluationCounts = user_sentence_evaluation_entity_1.default.getSentenceEvaluationCounts(userId, parseInt(sentenceId));
                Key = "user-voice/" + userId + "/" + sentenceId + "/" + sentenceEvaluationCounts + "." + FORMAT;
                userVoiceUri = "https://s3.ap-northeast-2.amazonaws.com/data.k-peach.io/" + Key;
                return [4 /*yield*/, s3_1.s3Client.send(new client_s3_1.PutObjectCommand({
                        Bucket: config_1.default.bucket.data,
                        Key: Key,
                        Body: (_b = req.file) === null || _b === void 0 ? void 0 : _b.buffer
                        // ACL: 'public-read'
                    }))];
            case 2:
                _c.sent();
                console.info('Success S3 upload--------------');
                return [4 /*yield*/, post_evaluation_dto_1.default.getInstance(userId, userVoiceUri, parseInt(sentenceId))];
            case 3:
                postEvaluationDTO = _c.sent();
                // request to ai server
                // let {
                //   evaluatedSentence, // eslint-disable-next-line prefer-const
                //   pitchData
                // }: {
                //   evaluatedSentence: { score: number; sttResult: string };
                //   pitchData: {
                //     perfectVoice: { hz: string; time: string };
                //     userVoice: { hz: string; time: string };
                //   };
                // } = (
                //   await axios({
                //     method: 'post',
                //     url: `${AI_SERVER_URL}/evaluation`,
                //     data: {
                //       ...postEvaluationDTO
                //     }
                //   })
                // ).data;
                // // 발음 평가 결과 DB 저장
                // const userSentenceEvaluation = new UserSentenceEvaluation(
                //   userId,
                //   parseInt(sentenceId),
                //   50, // evaluatedSentence.score,
                //   'testing', // evaluatedSentence.sttResult,
                //   userVoiceUri,
                //   false,
                //   getNowKO()
                // );
                // evaluatedSentence = {
                //   ...evaluatedSentence,
                //   ...(await userSentenceEvaluation.insert())
                // };
                return [2 /*return*/, res
                        .status(200)
                        .json({ success: true, evaluatedSentence: 'test', pitchData: 'test' })];
            case 4:
                error_2 = _c.sent();
                if (error_2 instanceof multer_1.MulterError)
                    console.log('MulterError ');
                console.error(error_2);
                return [2 /*return*/, res
                        .status(400)
                        .json({ success: false, errorMessage: error_2.message })];
            case 5: return [2 /*return*/];
        }
    });
}); };
//# sourceMappingURL=learning.controller.js.map