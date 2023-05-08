import { UserConfig as ViteConfiguration } from 'vite';

export type NavItemWithLink = {
  text: string;
  link: string;
};

export interface ISidebar {
  [path: string]: ISidebarGroup[];
}

export interface ISidebarGroup {
  text?: string;
  items: SidebarItem[];
}

export type SidebarItem =
  | { text: string; link: string }
  | { text: string; link?: string; items: SidebarItem[] };

export interface IThemeConfig {
  nav?: NavItemWithLink[];
  sidebar?: ISidebar;
  footer?: IFooter;
}

export interface IFooter {
  message?: string;
  copyright?: string;
}

export interface IUserConfig {
  title?: string;
  description?: string;
  themeConfig?: IThemeConfig;
  vite?: ViteConfiguration;
}
