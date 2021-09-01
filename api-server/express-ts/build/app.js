"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
    @author 정성진(on1ystar)
    @email tjdwls0607@naver.com
    @version 1.0, PEAC-39 learning-unit-sentence-with-evaluation
    @copyright BAEUJA
    @script npm run dev:js
    @script npm run dev:ts
    @description BAEUJA API SERVER ENTRY POINT
*/
var express_1 = __importDefault(require("express"));
var helmet_1 = __importDefault(require("helmet"));
var morgan_1 = __importDefault(require("morgan"));
var swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
var yamljs_1 = __importDefault(require("yamljs"));
var path_1 = __importDefault(require("path"));
var users_1 = __importDefault(require("./users"));
var cors_1 = __importDefault(require("cors"));
var learning_1 = __importDefault(require("./learning"));
var app_router_1 = __importDefault(require("./app.router"));
var app = express_1.default();
var logger = morgan_1.default('dev');
var swaggerSpec = yamljs_1.default.load(path_1.default.join(__dirname, '../build/swagger.yaml'));
app.use(helmet_1.default()); // 보안 모듈
app.use(logger); // 로그 관리 모듈
app.use(express_1.default.json()); // request body parsing
app.use(express_1.default.urlencoded({ extended: true })); // url query prameter parsing
users_1.default.use(cors_1.default()); // cors 모듈
app.use('/', app_router_1.default); // 루트
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec)); // swagger로 작성한 파일 setup
app.use('/users', users_1.default); // injecting users app
app.use('/learning', learning_1.default); // injecting learning app
exports.default = app;
//# sourceMappingURL=app.js.map