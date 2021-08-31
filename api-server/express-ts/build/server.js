'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
var app_1 = __importDefault(require('./app'));
var dotenv_1 = __importDefault(require('dotenv'));
dotenv_1.default.config();
var port = process.env.RUN === 'dev' ? 4001 : 3000;
app_1.default.listen(port, function () {
  // eslint-disable-next-line no-console
  return console.log('\u2705 Server listening on api.k-peach.io', port);
});
//# sourceMappingURL=server.js.map
