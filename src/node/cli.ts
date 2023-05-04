import { createDevServer } from './dev';
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
  console.log('build', root);
});

cli.parse();