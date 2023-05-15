"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }



var _chunkV2F2AQ67js = require('./chunk-V2F2AQ67.js');


var _chunkSK74JNCJjs = require('./chunk-SK74JNCJ.js');

// src/node/dev.ts
var _vite = require('vite');

// src/node/plugin/indexHtml.ts
var _promises = require('fs/promises');
function pluginIndexHtml() {
  return {
    name: "island:index-html",
    apply: "serve",
    transformIndexHtml(html) {
      return {
        html,
        tags: [
          {
            tag: "script",
            attrs: {
              type: "module",
              src: `/@fs/${_chunkV2F2AQ67js.CLIENT_ENTRY_PATH}`
            },
            injectTo: "body"
          }
        ]
      };
    },
    configureServer(server) {
      return () => {
        server.middlewares.use(async (req, res, next) => {
          let html = await _promises.readFile.call(void 0, _chunkV2F2AQ67js.DEFAULT_HTML_PATH, "utf-8");
          try {
            html = await server.transformIndexHtml(
              req.url,
              html,
              req.originalUrl
            );
            res.statusCode = 200;
            res.setHeader("Content-Type", "text/html");
            res.end(html);
          } catch (e) {
            return next(e);
          }
        });
      };
    }
  };
}

// src/node/plugin/config.ts
var _path = require('path');
var SITE_DATA_ID = "island:site-data";
var pluginConfig = (config, restartServer) => {
  let server = null;
  return {
    name: "island:config",
    configureServer(s) {
      server = s;
    },
    async handleHotUpdate(ctx) {
      const customWatchedFiles = [_optionalChain([config, 'optionalAccess', _ => _.configPath])];
      const include = (id) => customWatchedFiles.some((file) => id.includes(file));
      if (include(_optionalChain([ctx, 'optionalAccess', _2 => _2.file]))) {
        console.log(`
${_path.relative.call(void 0, _optionalChain([config, 'optionalAccess', _3 => _3.root]), _optionalChain([ctx, 'optionalAccess', _4 => _4.file]))} changed, restarting server...`);
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

// src/node/dev.ts
var _pluginreact = require('@vitejs/plugin-react'); var _pluginreact2 = _interopRequireDefault(_pluginreact);
async function createDevServer(root, restartServer) {
  const config = await _chunkSK74JNCJjs.resolveConfig.call(void 0, root, "serve", "development");
  return _vite.createServer.call(void 0, {
    root,
    plugins: [pluginIndexHtml(), _pluginreact2.default.call(void 0, ), pluginConfig(config, restartServer)],
    server: {
      fs: {
        allow: [_chunkV2F2AQ67js.PACKAGE_ROOT]
      }
    }
  });
}


exports.createDevServer = createDevServer;
