import { StyleConfig } from '@/types'

export const styles: StyleConfig = {
  nav: {
    base: "flex items-center gap-2",
    link: {
      base: "text-muted-foreground hover:text-foreground transition-colors",
      active: "text-foreground",
      sidebar: "p-2 rounded-lg hover:bg-muted",
    },
    icon: {
      base: "h-5 w-5",
      logo: "h-6 w-6 text-primary"
    },
    container: {
      base: "space-y-1 px-2",
      settings: "mt-8 space-y-1 px-2"
    }
  },
  text: {
    logo: "hidden md:inline font-semibold",
    title: "text-sm font-semibold"
  },
  layout: {
    spacing: {
      base: "space-y-4",
      tight: "space-y-2"
    }
  }
}
