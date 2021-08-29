"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = __importDefault(require("./app"));
var port = Number(process.env.PORT) || 4000;
app_1.default.listen(port, function () {
    // eslint-disable-next-line no-console
    return console.log("\u2705 Server listening on api.k-peach.io");
});
//# sourceMappingURL=server.js.map