import { createDevServer } from './dev';
import { build } from './build';
import * as path from 'path';
import cac from 'cac';

const cli = cac('island').version('0.0.1').help();

cli.command('dev [root]', 'start dev server').action(async (root: string) => {
  root = root ? path.resolve(root) : process.cwd();
  const server = await createDevServer(root);
  await server.listen();
  server.printUrls();
});

cli
  .command('build [root]', 'build for production')
  .action(async (root: string) => {
    try {
      root = root ? path.resolve(root) : process.cwd();
      await build(root);
    } catch (e) {
      console.log(e);
    }
  });

cli.parse();
