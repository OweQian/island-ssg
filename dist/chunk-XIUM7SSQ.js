"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }// src/node/constants/index.ts
var _path = require('path'); var _path2 = _interopRequireDefault(_path);
var PACKAGE_ROOT = _path.join.call(void 0, __dirname, "..");
var DEFAULT_HTML_PATH = _path.join.call(void 0, PACKAGE_ROOT, "template.html");
var CLIENT_ENTRY_PATH = _path.join.call(void 0, 
  PACKAGE_ROOT,
  "src",
  "runtime",
  "client-entry.tsx"
);
var SERVER_ENTRY_PATH = _path.join.call(void 0, 
  PACKAGE_ROOT,
  "src",
  "runtime",
  "ssr-entry.tsx"
);

// src/node/plugin/config.ts

var SITE_DATA_ID = "island:site-data";
var pluginConfig = (config, restartServer) => {
  let server = null;
  return {
    name: "island:config",
    config() {
      return {
        root: PACKAGE_ROOT,
        resolve: {
          alias: {
            "@runtime": _path2.default.join(PACKAGE_ROOT, "src", "runtime", "index.ts")
          }
        }
      };
    },
    configureServer(s) {
      server = s;
    },
    async handleHotUpdate(ctx) {
      const customWatchedFiles = [_optionalChain([config, 'optionalAccess', _ => _.configPath])];
      const include = (id) => customWatchedFiles.some((file) => id.includes(file));
      if (include(_optionalChain([ctx, 'optionalAccess', _2 => _2.file]))) {
        console.log(
          `
${_path.relative.call(void 0, _optionalChain([config, 'optionalAccess', _3 => _3.root]), _optionalChain([ctx, 'optionalAccess', _4 => _4.file]))} changed, restarting server...`
        );
        await restartServer();
      }
    },
    resolveId(id) {
      if (id === SITE_DATA_ID) {
        return `\0${SITE_DATA_ID};`;
      }
    },
    load(id) {
      if (id === `\0${SITE_DATA_ID}`) {
        return `export default ${JSON.stringify(_optionalChain([config, 'optionalAccess', _5 => _5.siteData]))}`;
      }
    }
  };
};







exports.PACKAGE_ROOT = PACKAGE_ROOT; exports.DEFAULT_HTML_PATH = DEFAULT_HTML_PATH; exports.CLIENT_ENTRY_PATH = CLIENT_ENTRY_PATH; exports.SERVER_ENTRY_PATH = SERVER_ENTRY_PATH; exports.pluginConfig = pluginConfig;
