import { createServer } from 'vite';
import { pluginIndexHtml } from './plugin/indexHtml';

export async function createDevServer(root: string) {
  return createServer({
    root,
    plugins: [pluginIndexHtml()],
  })
}
