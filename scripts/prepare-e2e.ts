import path from 'path';
import fse from 'fs-extra';
import * as execa from 'execa';

const exampleDir = path.resolve(__dirname, '../e2e/playground/basic');

const prepareE2E = async () => {
  if (!fse.existsSync(path.resolve(__dirname, '../dist'))) {
    execa.execaCommandSync('pnpm build', {
      cwd: path.resolve(__dirname, '../')
    });
  }

  execa.execaCommandSync('npx playwright install', {
    cwd: path.resolve(__dirname, '../'),
    stdout: process.stdout,
    stdin: process.stdin,
    stderr: process.stderr
  });

  execa.execaCommandSync('pnpm i', {
    cwd: exampleDir,
    stdout: process.stdout,
    stdin: process.stdin,
    stderr: process.stderr
  });

  execa.execaCommandSync('pnpm dev', {
    cwd: exampleDir,
    stdout: process.stdout,
    stdin: process.stdin,
    stderr: process.stderr
  });
};

prepareE2E();
