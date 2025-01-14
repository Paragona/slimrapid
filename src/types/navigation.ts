import { LucideIcon } from 'lucide-react';

export interface NavLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
  variant?: 'sidebar' | 'header' | 'default';
}

export interface NavigationLink {
  href: string;
  icon: LucideIcon;
  label: string;
}

export interface NavigationConfig {
  mainNavLinks: NavigationLink[];
  settingsLinks: NavigationLink[];
}
