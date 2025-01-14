import { NavigationLink } from './navigation';

export interface SiteConfig {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  links: {
    twitter: string;
    github: string;
  };
}

export interface FooterConfig {
  company: NavigationLink[];
  support: NavigationLink[];
  legal: NavigationLink[];
  social: NavigationLink[];
}

export interface ThemeConfig {
  defaultTheme: 'light' | 'dark' | 'system';
  themes: string[];
}

export interface AppConfig {
  site: SiteConfig;
  theme: ThemeConfig;
}
