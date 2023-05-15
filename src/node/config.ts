import { loadConfigFromFile } from 'vite';
import path from 'path';
import fs from 'fs-extra';
import { IUserConfig } from 'shared/types';

type RawConfig =
  | IUserConfig
  | Promise<IUserConfig>
  | (() => IUserConfig | Promise<IUserConfig>);

export interface ISiteConfig {
  root: string;
  configPath: string;
  siteData: IUserConfig;
}

const getUserConfigPath = (root: string) => {
  try {
    const supportConfigFiles = ['config.ts', 'config.js'];
    return supportConfigFiles
      .map((file) => path.resolve(root, file))
      .find(fs.pathExistsSync);
  } catch (e) {
    console.error(`Failed to load user config: ${e}`);
    throw e;
  }
};

export const resolveUserConfig = async (
  root: string,
  command: 'serve' | 'build',
  mode: 'development' | 'production'
) => {
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
    const { config: rawConfig = {} as RawConfig } = result;
    // 三种情况:
    // 1. object
    // 2. promise
    // 3. function
    const userConfig = await (typeof rawConfig === 'function'
      ? rawConfig()
      : rawConfig);
    return [configPath, userConfig] as const;
  } else {
    return [configPath, {} as IUserConfig] as const;
  }
};

export const resolveSiteData = (userConfig: IUserConfig): IUserConfig => {
  return {
    title: userConfig?.title || 'Island.js',
    description: userConfig?.description || 'SSG Framework',
    themeConfig: userConfig?.themeConfig || {},
    vite: userConfig?.vite || {}
  };
};

export const resolveConfig = async (
  root: string,
  command: 'serve' | 'build',
  mode: 'development' | 'production'
): Promise<ISiteConfig> => {
  const [configPath, userConfig] = await resolveUserConfig(root, command, mode);
  return {
    root,
    configPath,
    siteData: resolveSiteData(userConfig as IUserConfig)
  };
};

export const defineConfig = (config: IUserConfig) => {
  return config;
};
