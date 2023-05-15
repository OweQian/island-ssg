import {
  CLIENT_ENTRY_PATH,
  SERVER_ENTRY_PATH,
  pluginConfig
} from "./chunk-C2WWN3RH.mjs";
import {
  resolveConfig
} from "./chunk-CVJ42XEY.mjs";

// src/node/build.ts
import { build as viteBuild } from "vite";
import pluginReact from "@vitejs/plugin-react";
import { pathToFileURL } from "url";
import * as path from "path";
import ora from "ora";
import fs from "fs-extra";
var renderPage = async (render, root, clientBundle) => {
  const clientChunk = clientBundle.output.find(
    (chunk) => chunk.type === "chunk" && chunk.isEntry
  );
  const appHtml = render();
  const html = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>title</title>
    <meta name="description" content="xxx">
  </head>
  <body>
    <div id="root">${appHtml}</div>
    <script type="module" src="/${clientChunk?.fileName}"></script>
  </body>
</html>`.trim();
  await fs.ensureDir(path.join(root, "build"));
  await fs.writeFile(path.join(root, "build/index.html"), html);
  await fs.remove(path.join(root, ".temp"));
};
var bundle = async (root, config) => {
  const resolveViteConfig = (isServer) => ({
    mode: "production",
    root,
    plugins: [pluginReact(), pluginConfig(config)],
    ssr: {
      noExternal: ["react-router-dom"]
    },
    build: {
      minify: false,
      ssr: isServer,
      outDir: isServer ? path.join(root, ".temp") : "build",
      rollupOptions: {
        input: isServer ? SERVER_ENTRY_PATH : CLIENT_ENTRY_PATH,
        output: {
          format: isServer ? "cjs" : "esm"
        }
      }
    }
  });
  const spinner = ora();
  try {
    const [clientBundle, serverBundle] = await Promise.all([
      viteBuild(resolveViteConfig(false)),
      viteBuild(resolveViteConfig(true))
    ]);
    return [clientBundle, serverBundle];
  } catch (e) {
    console.log(e);
  }
};
var build = async (root, config) => {
  const [clientBundle] = await bundle(root, config);
  const serverEntryPath = path.join(root, ".temp", "ssr-entry.js");
  const { render } = await import(pathToFileURL(serverEntryPath));
  try {
    await renderPage(render, root, clientBundle);
  } catch (e) {
    console.log("Render page error.\n", e);
  }
};

// src/node/cli.ts
import * as path2 from "path";
import cac from "cac";
var cli = cac("island").version("0.0.1").help();
cli.command("dev [root]", "start dev server").action(async (root) => {
  const createServer = async () => {
    const { createDevServer } = await import("./dev.mjs");
    root = root ? path2.resolve(root) : process.cwd();
    const server = await createDevServer(root, async () => {
      await server.close();
      await createServer();
    });
    await server.listen();
    server.printUrls();
  };
  await createServer();
});
cli.command("build [root]", "build for production").action(async (root) => {
  try {
    root = root ? path2.resolve(root) : process.cwd();
    const config = await resolveConfig(root, "build", "production");
    await build(root, config);
  } catch (e) {
    console.log(e);
  }
});
cli.parse();
