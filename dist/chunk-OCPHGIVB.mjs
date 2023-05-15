// src/node/config.ts
import { loadConfigFromFile } from "vite";
import path from "path";
import fs from "fs-extra";
var getUserConfigPath = (root) => {
  try {
    const supportConfigFiles = ["config.ts", "config.js"];
    return supportConfigFiles.map((file) => path.resolve(root, file)).find(fs.pathExistsSync);
  } catch (e) {
    console.error(`Failed to load user config: ${e}`);
    throw e;
  }
};
var resolveUserConfig = async (root, command, mode) => {
  const configPath = getUserConfigPath(root);
  const result = await loadConfigFromFile(
    {
      command,
      mode
    },
    configPath,
    root
  );
  if (result) {
    const { config: rawConfig = {} } = result;
    const userConfig = await (typeof rawConfig === "function" ? rawConfig() : rawConfig);
    return [configPath, userConfig];
  } else {
    return [configPath, {}];
  }
};
var resolveSiteData = (userConfig) => {
  return {
    title: userConfig?.title || "Island.js",
    description: userConfig?.description || "SSG Framework",
    themeConfig: userConfig?.themeConfig || {},
    vite: userConfig?.vite || {}
  };
};
var resolveConfig = async (root, command, mode) => {
  const [configPath, userConfig] = await resolveUserConfig(root, command, mode);
  return {
    root,
    configPath,
    siteData: resolveSiteData(userConfig)
  };
};
var defineConfig = (config) => {
  return config;
};

export {
  resolveConfig,
  defineConfig
};
