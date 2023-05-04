const cli = require('cac')()
const version = require('../../package.json').version;

cli.version(version).help();

cli.command('dev [root]', 'start dev server').action(async (root: string) => {
  console.log('dev', root);
});

cli.command('build [root]', 'build for production').action(async (root: string) => {
  console.log('build', root);
});

cli.parse();
