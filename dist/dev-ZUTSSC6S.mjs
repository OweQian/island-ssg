import {
  CLIENT_ENTRY_PATH,
  DEFAULT_HTML_PATH,
  PACKAGE_ROOT
} from "./chunk-BZ6TZHJX.mjs";
import {
  resolveConfig
} from "./chunk-OCPHGIVB.mjs";
import "./chunk-H5GV5IEL.mjs";

// src/node/dev.ts
import { createServer } from "vite";

// src/node/plugin/indexHtml.ts
import { readFile } from "fs/promises";
function pluginIndexHtml() {
  return {
    name: "island:index-html",
    apply: "serve",
    transformIndexHtml(html) {
      return {
        html,
        tags: [
          {
            tag: "script",
            attrs: {
              type: "module",
              src: `/@fs/${CLIENT_ENTRY_PATH}`
            },
            injectTo: "body"
          }
        ]
      };
    },
    configureServer(server) {
      return () => {
        server.middlewares.use(async (req, res, next) => {
          let html = await readFile(DEFAULT_HTML_PATH, "utf-8");
          try {
            html = await server.transformIndexHtml(
              req.url,
              html,
              req.originalUrl
            );
            res.statusCode = 200;
            res.setHeader("Content-Type", "text/html");
            res.end(html);
          } catch (e) {
            return next(e);
          }
        });
      };
    }
  };
}

// src/node/plugin/config.ts
import { relative } from "path";
var SITE_DATA_ID = "island:site-data";
var pluginConfig = (config, restartServer) => {
  let server = null;
  return {
    name: "island:config",
    configureServer(s) {
      server = s;
    },
    async handleHotUpdate(ctx) {
      const customWatchedFiles = [config?.configPath];
      const include = (id) => customWatchedFiles.some((file) => id.includes(file));
      if (include(ctx?.file)) {
        console.log(`
${relative(config?.root, ctx?.file)} changed, restarting server...`);
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

// src/node/dev.ts
import pluginReact from "@vitejs/plugin-react";
async function createDevServer(root, restartServer) {
  const config = await resolveConfig(root, "serve", "development");
  return createServer({
    root,
    plugins: [pluginIndexHtml(), pluginReact(), pluginConfig(config, restartServer)],
    server: {
      fs: {
        allow: [PACKAGE_ROOT]
      }
    }
  });
}
export {
  createDevServer
};
