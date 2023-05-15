import {
  __dirname
} from "./chunk-CVJ42XEY.mjs";

// src/node/constants/index.ts
import { join } from "path";
var PACKAGE_ROOT = join(__dirname, "..");
var DEFAULT_HTML_PATH = join(PACKAGE_ROOT, "template.html");
var CLIENT_ENTRY_PATH = join(
  PACKAGE_ROOT,
  "src",
  "runtime",
  "client-entry.tsx"
);
var SERVER_ENTRY_PATH = join(
  PACKAGE_ROOT,
  "src",
  "runtime",
  "ssr-entry.tsx"
);

// src/node/plugin/config.ts
import path, { relative } from "path";
var SITE_DATA_ID = "island:site-data";
var pluginConfig = (config, restartServer) => {
  let server = null;
  return {
    name: "island:config",
    config() {
      return {
        root: PACKAGE_ROOT,
        resolve: {
          alias: {
            "@runtime": path.join(PACKAGE_ROOT, "src", "runtime", "index.ts")
          }
        }
      };
    },
    configureServer(s) {
      server = s;
    },
    async handleHotUpdate(ctx) {
      const customWatchedFiles = [config?.configPath];
      const include = (id) => customWatchedFiles.some((file) => id.includes(file));
      if (include(ctx?.file)) {
        console.log(
          `
${relative(config?.root, ctx?.file)} changed, restarting server...`
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

export {
  PACKAGE_ROOT,
  DEFAULT_HTML_PATH,
  CLIENT_ENTRY_PATH,
  SERVER_ENTRY_PATH,
  pluginConfig
};
