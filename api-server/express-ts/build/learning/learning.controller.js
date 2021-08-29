"use strict";
/*
    메인(문장) 학습 페이지를 위한 컨트롤러
    version: PEAC-161 get learning unit with sentences for main learning UI
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLearningUnit = void 0;
// import { GetEvaluationDTO } from './dto/get-evaluation.dto';
var get_learning_unit_dto_1 = require("./dto/get-learning-unit.dto");
// /learning/contents/:contentId/units/:unitIndex
exports.getLearningUnit = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, _a, unitIndex, contentId, learningUnitDTO, error_1;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                userId = Number((_b = req.headers.authorization) === null || _b === void 0 ? void 0 : _b.substring(7));
                _a = req.params, unitIndex = _a.unitIndex, contentId = _a.contentId;
                // request params 유효성 검사
                if (isNaN(parseInt(unitIndex)) || isNaN(parseInt(unitIndex))) {
                    return [2 /*return*/, res
                            .status(400)
                            .json({ success: false, errorMessage: 'invalid input syntax' })];
                }
                _c.label = 1;
            case 1:
                _c.trys.push([1, 3, , 4]);
                return [4 /*yield*/, get_learning_unit_dto_1.GetLearningUnitDTO.getInstance(userId, parseInt(unitIndex), parseInt(contentId))];
            case 2:
                learningUnitDTO = _c.sent();
                return [2 /*return*/, res.status(200).json(learningUnitDTO)];
            case 3:
                error_1 = _c.sent();
                console.error(error_1.code);
                if (error_1.message === 'noData') {
                    // db에 row가 없는 경우
                    return [2 /*return*/, res
                            .status(404)
                            .json({ success: false, errorMessage: error_1.message })];
                }
                return [2 /*return*/, res
                        .status(400)
                        .json({ success: false, errorMessage: error_1.message })];
            case 4: return [2 /*return*/];
        }
    });
}); };
// /sentences/:sentenceId/units/evaluation
// export const evaluateUserVoice = async (req: Request, res: Response) => {
//   const userId = Number(req.headers.authorization?.substring(7)); // 나중에 auth app에서 처리
//   const { sentenceId } = req.params;
//   // request params 유효성 검사
//   if (isNaN(parseInt(sentenceId))) {
//     return res
//       .status(400)
//       .json({ success: false, errorMessage: 'invalid input syntax' });
//   }
//   try {
//     const learningUnitDTO = new GetEvaluationDTO(
//       userId,
//       parseInt(sentenceId),
//     );
//     return res.status(200).json(learningUnitDTO);
//   } catch (error) {
//     console.error(error.code);
//     if (error.message === 'noData') {
//       // db에 row가 없는 경우
//       return res
//         .status(404)
//         .json({ success: false, errorMessage: error.message });
//     }
//     return res
//       .status(parseInt(error.code))
//       .json({ success: false, errorMessage: error.message });
//   }
// };
//# sourceMappingURL=learning.controller.js.map