import { UserConfig } from 'vite';

type NavItemWithLink = {
    text: string;
    link: string;
};
interface ISidebar {
    [path: string]: ISidebarGroup[];
}
interface ISidebarGroup {
    text?: string;
    items: SidebarItem[];
}
type SidebarItem = {
    text: string;
    link: string;
} | {
    text: string;
    link?: string;
    items: SidebarItem[];
};
interface IThemeConfig {
    nav?: NavItemWithLink[];
    sidebar?: ISidebar;
    footer?: IFooter;
}
interface IFooter {
    message?: string;
    copyright?: string;
}
interface IUserConfig {
    title?: string;
    description?: string;
    themeConfig?: IThemeConfig;
    vite?: UserConfig;
}

declare const defineConfig: (config: IUserConfig) => IUserConfig;

export { defineConfig };
