"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.build = exports.bundle = exports.renderPage = void 0;
const vite_1 = require("vite");
const constants_1 = require("./constants");
const plugin_react_1 = require("@vitejs/plugin-react");
const path = require("path");
const fs = require("fs-extra");
const renderPage = async (render, root, clientBundle) => {
    const clientChunk = clientBundle.output.find(chunk => chunk.type === 'chunk' && chunk.isEntry);
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
    <script type="module" src="/${clientChunk?.fileName}"></script>
  </body>
</html>`.trim();
    await fs.ensureDir(path.join(root, 'build'));
    await fs.writeFile(path.join(root, 'build/index.html'), html);
    await fs.remove(path.join(root, '.temp'));
};
exports.renderPage = renderPage;
const bundle = async (root) => {
    const resolveViteConfig = (isServer) => ({
        mode: 'production',
        root,
        plugins: [(0, plugin_react_1.default)()],
        build: {
            ssr: isServer,
            outDir: isServer ? '.temp' : 'build',
            rollupOptions: {
                input: isServer ? constants_1.SERVER_ENTRY_PATH : constants_1.CLIENT_ENTRY_PATH,
                output: {
                    format: isServer ? 'cjs' : 'esm',
                }
            }
        }
    });
    try {
        const [clientBundle, serverBundle] = await Promise.all([
            (0, vite_1.build)(resolveViteConfig(false)),
            (0, vite_1.build)(resolveViteConfig(true)),
        ]);
        return [clientBundle, serverBundle];
    }
    catch (e) {
        console.log(e);
    }
};
exports.bundle = bundle;
const build = async (root) => {
    try {
        const [clientBundle, serverBundle] = await (0, exports.bundle)(root);
        const serverEntryPath = path.join(root, '.temp', 'ssr-entry.js');
        const { render } = require(serverEntryPath);
        await (0, exports.renderPage)(render, root, clientBundle);
    }
    catch (e) {
        console.log(e);
    }
};
exports.build = build;
