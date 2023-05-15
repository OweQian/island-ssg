import { relative } from 'path';
import { Plugin, ViteDevServer } from 'vite';
import { ISiteConfig } from '../config';

const SITE_DATA_ID = 'island:site-data';

export const pluginConfig = (
  config: ISiteConfig,
  restartServer: () => Promise<void>
): Plugin => {
  let server: ViteDevServer | null = null;
  return {
    name: 'island:config',
    configureServer(s) {
      server = s;
    },
    async handleHotUpdate(ctx) {
      const customWatchedFiles = [config?.configPath];
      const include = (id: string) =>
        customWatchedFiles.some((file) => id.includes(file));
      if (include(ctx?.file)) {
        console.log(
          `\n${relative(config?.root, ctx?.file)} changed, restarting server...`
        );
        await restartServer();
      }
    },
    resolveId(id) {
      if (id === SITE_DATA_ID) {
        return `\0${SITE_DATA_ID};`;
      }
    },
    load(id) {
      if (id === `\0${SITE_DATA_ID}`) {
        return `export default ${JSON.stringify(config?.siteData)}`;
      }
    }
  };
};
