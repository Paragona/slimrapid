export interface StyleConfig {
  nav: {
    base: string;
    link: {
      base: string;
      active: string;
      sidebar: string;
    };
    icon: {
      base: string;
      logo: string;
    };
    container: {
      base: string;
      settings: string;
    };
  };
  text: {
    logo: string;
    title: string;
  };
  layout: {
    spacing: {
      base: string;
      tight: string;
    };
  };
}
