import { createDevServer } from './dev';
import { build } from './build';
import * as path from 'path';

const cli = require('cac')()
const version = require('../../package.json').version;

cli.version(version).help();

cli.command('dev [root]', 'start dev server').action(async (root: string) => {
  root = root ? path.resolve(root) : process.cwd();
  const server = await createDevServer(root);
  await server.listen();
  server.printUrls();
});

cli.command('build [root]', 'build for production').action(async (root: string) => {
  try {
    root = root ? path.resolve(root) : process.cwd();
    await build(root);
  } catch (e) {
    console.log(e);
  }
});

cli.parse();
