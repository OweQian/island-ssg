"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dev_1 = require("./dev");
const path = require("path");
const cli = require('cac')();
const version = require('../../package.json').version;
cli.version(version).help();
cli.command('dev [root]', 'start dev server').action(async (root) => {
    root = root ? path.resolve(root) : process.cwd();
    const server = await (0, dev_1.createDevServer)(root);
    await server.listen();
    server.printUrls();
});
cli.command('build [root]', 'build for production').action(async (root) => {
    console.log('build', root);
});
cli.parse();
