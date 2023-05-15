"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }// src/node/config.ts
var _vite = require('vite');
var _path = require('path'); var _path2 = _interopRequireDefault(_path);
var _fsextra = require('fs-extra'); var _fsextra2 = _interopRequireDefault(_fsextra);
var getUserConfigPath = (root) => {
  try {
    const supportConfigFiles = ["config.ts", "config.js"];
    return supportConfigFiles.map((file) => _path2.default.resolve(root, file)).find(_fsextra2.default.pathExistsSync);
  } catch (e) {
    console.error(`Failed to load user config: ${e}`);
    throw e;
  }
};
var resolveUserConfig = async (root, command, mode) => {
  const configPath = getUserConfigPath(root);
  const result = await _vite.loadConfigFromFile.call(void 0, 
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
    title: _optionalChain([userConfig, 'optionalAccess', _ => _.title]) || "Island.js",
    description: _optionalChain([userConfig, 'optionalAccess', _2 => _2.description]) || "SSG Framework",
    themeConfig: _optionalChain([userConfig, 'optionalAccess', _3 => _3.themeConfig]) || {},
    vite: _optionalChain([userConfig, 'optionalAccess', _4 => _4.vite]) || {}
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




exports.resolveConfig = resolveConfig; exports.defineConfig = defineConfig;
