export * from './navigation'
export * from './site'
export * from './styles'
export * from './theme'

import { siteConfig } from './site'
import { themeConfig } from './theme'
import { AppConfig } from '@/types/config'

export const appConfig: AppConfig = {
  site: siteConfig,
  theme: themeConfig,
}
