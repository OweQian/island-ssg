import { createServer } from 'vite';
import { pluginIndexHtml } from './plugin/indexHtml';
import { pluginConfig } from './plugin/config';
import { PACKAGE_ROOT } from './constants';
import pluginReact from '@vitejs/plugin-react';
import { resolveConfig } from './config';

export async function createDevServer(
  root: string,
  restartServer: () => Promise<void>
) {
  const config = await resolveConfig(root, 'serve', 'development');
  return createServer({
    root,
    plugins: [
      pluginIndexHtml(),
      pluginReact(),
      pluginConfig(config, restartServer)
    ],
    server: {
      fs: {
        allow: [PACKAGE_ROOT]
      }
    }
  });
}
