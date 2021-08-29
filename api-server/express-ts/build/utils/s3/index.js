"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.s3Client = void 0;
var client_s3_1 = require("@aws-sdk/client-s3");
var config_1 = __importDefault(require("../../config"));
// const awsConfig = new AWS.Config({
//   accessKeyId: conf.peachApi.accessKey,
//   secretAccessKey: conf.peachApi.secretKey,
//   region: conf.peachApi.region
// });
var credentials = {
    accessKeyId: config_1.default.peachApi.accessKey,
    secretAccessKey: config_1.default.peachApi.secretKey
};
exports.s3Client = new client_s3_1.S3Client({
    credentials: credentials,
    region: config_1.default.peachApi.region
});
//# sourceMappingURL=index.js.map