"use strict"; function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } } function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }



var _chunkXIUM7SSQjs = require('./chunk-XIUM7SSQ.js');


var _chunkSK74JNCJjs = require('./chunk-SK74JNCJ.js');

// src/node/build.ts
var _vite = require('vite');
var _pluginreact = require('@vitejs/plugin-react'); var _pluginreact2 = _interopRequireDefault(_pluginreact);
var _url = require('url');
var _path = require('path'); var path = _interopRequireWildcard(_path); var path2 = _interopRequireWildcard(_path);
var _ora = require('ora'); var _ora2 = _interopRequireDefault(_ora);
var _fsextra = require('fs-extra'); var _fsextra2 = _interopRequireDefault(_fsextra);
var renderPage = async (render, root, clientBundle) => {
  const clientChunk = clientBundle.output.find(
    (chunk) => chunk.type === "chunk" && chunk.isEntry
  );
  const appHtml = render();
  const html = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>title</title>
    <meta name="description" content="xxx">
  </head>
  <body>
    <div id="root">${appHtml}</div>
    <script type="module" src="/${_optionalChain([clientChunk, 'optionalAccess', _ => _.fileName])}"></script>
  </body>
</html>`.trim();
  await _fsextra2.default.ensureDir(path.join(root, "build"));
  await _fsextra2.default.writeFile(path.join(root, "build/index.html"), html);
  await _fsextra2.default.remove(path.join(root, ".temp"));
};
var bundle = async (root, config) => {
  const resolveViteConfig = (isServer) => ({
    mode: "production",
    root,
    plugins: [_pluginreact2.default.call(void 0, ), _chunkXIUM7SSQjs.pluginConfig.call(void 0, config)],
    ssr: {
      noExternal: ["react-router-dom"]
    },
    build: {
      minify: false,
      ssr: isServer,
      outDir: isServer ? path.join(root, ".temp") : "build",
      rollupOptions: {
        input: isServer ? _chunkXIUM7SSQjs.SERVER_ENTRY_PATH : _chunkXIUM7SSQjs.CLIENT_ENTRY_PATH,
        output: {
          format: isServer ? "cjs" : "esm"
        }
      }
    }
  });
  const spinner = _ora2.default.call(void 0, );
  try {
    const [clientBundle, serverBundle] = await Promise.all([
      _vite.build.call(void 0, resolveViteConfig(false)),
      _vite.build.call(void 0, resolveViteConfig(true))
    ]);
    return [clientBundle, serverBundle];
  } catch (e) {
    console.log(e);
  }
};
var build = async (root, config) => {
  const [clientBundle] = await bundle(root, config);
  const serverEntryPath = path.join(root, ".temp", "ssr-entry.js");
  const { render } = await Promise.resolve().then(() => _interopRequireWildcard(require(_url.pathToFileURL.call(void 0, serverEntryPath))));
  try {
    await renderPage(render, root, clientBundle);
  } catch (e) {
    console.log("Render page error.\n", e);
  }
};

// src/node/cli.ts

var _cac = require('cac'); var _cac2 = _interopRequireDefault(_cac);
var cli = _cac2.default.call(void 0, "island").version("0.0.1").help();
cli.command("dev [root]", "start dev server").action(async (root) => {
  const createServer = async () => {
    const { createDevServer } = await Promise.resolve().then(() => _interopRequireWildcard(require("./dev.js")));
    root = root ? path2.resolve(root) : process.cwd();
    const server = await createDevServer(root, async () => {
      await server.close();
      await createServer();
    });
    await server.listen();
    server.printUrls();
  };
  await createServer();
});
cli.command("build [root]", "build for production").action(async (root) => {
  try {
    root = root ? path2.resolve(root) : process.cwd();
    const config = await _chunkSK74JNCJjs.resolveConfig.call(void 0, root, "build", "production");
    await build(root, config);
  } catch (e) {
    console.log(e);
  }
});
cli.parse();
