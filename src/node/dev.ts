import { createServer } from 'vite';
import { pluginIndexHtml } from './plugin/indexHtml';
import { PACKAGE_ROOT } from './constants';
import pluginReact from '@vitejs/plugin-react';

export async function createDevServer(root: string) {
  return createServer({
    root,
    plugins: [pluginIndexHtml(), pluginReact()],
    server: {
      fs: {
        allow: [PACKAGE_ROOT]
      }
    }
  });
}
