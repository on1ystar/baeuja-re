"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNowKO = void 0;
// 1. 현재 시간(Locale)
var curr = new Date();
// 2. UTC 시간 계산
var utc = curr.getTime() + curr.getTimezoneOffset() * 60 * 1000;
// 3. UTC to KST (UTC + 9시간)
var KR_TIME_DIFF = 9 * 60 * 60 * 1000;
var krCurr = new Date(utc + KR_TIME_DIFF);
exports.getNowKO = function () {
    var year = String(krCurr.getFullYear());
    var month = ('0' + (1 + krCurr.getMonth())).slice(-2);
    var day = ('0' + krCurr.getDate()).slice(-2);
    var hours = ('0' + krCurr.getHours()).slice(-2);
    var minutes = ('0' + krCurr.getMinutes()).slice(-2);
    var seconds = ('0' + krCurr.getSeconds()).slice(-2);
    return year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
};
//# sourceMappingURL=index.js.map