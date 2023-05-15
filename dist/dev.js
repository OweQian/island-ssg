"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }




var _chunkXIUM7SSQjs = require('./chunk-XIUM7SSQ.js');


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
              src: `/@fs/${_chunkXIUM7SSQjs.CLIENT_ENTRY_PATH}`
            },
            injectTo: "body"
          }
        ]
      };
    },
    configureServer(server) {
      return () => {
        server.middlewares.use(async (req, res, next) => {
          let html = await _promises.readFile.call(void 0, _chunkXIUM7SSQjs.DEFAULT_HTML_PATH, "utf-8");
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

// src/node/dev.ts
var _pluginreact = require('@vitejs/plugin-react'); var _pluginreact2 = _interopRequireDefault(_pluginreact);
async function createDevServer(root, restartServer) {
  const config = await _chunkSK74JNCJjs.resolveConfig.call(void 0, root, "serve", "development");
  return _vite.createServer.call(void 0, {
    root: _chunkXIUM7SSQjs.PACKAGE_ROOT,
    plugins: [
      pluginIndexHtml(),
      _pluginreact2.default.call(void 0, ),
      _chunkXIUM7SSQjs.pluginConfig.call(void 0, config, restartServer)
    ],
    server: {
      fs: {
        allow: [_chunkXIUM7SSQjs.PACKAGE_ROOT]
      }
    }
  });
}


exports.createDevServer = createDevServer;
