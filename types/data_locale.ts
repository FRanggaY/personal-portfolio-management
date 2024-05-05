interface Settings {
  title: string;
  public_profile: {
    title: string;
    button_submit: string;
  };
  change_password: {
    title: string;
  };
  theme: {
    title: string;
  };
  language: {
    title: string;
  }
}

interface Navbar {
  settings: {
    title: string;
  };
  log_out: {
    title: string;
  };
}

interface Sidebar {
  dashboard: {
    title: string;
  };
  skill: {
    title: string;
  };
  skill_mapping: {
    title: string;
  };
  school: {
    title: string;
  };
  company: {
    title: string;
  };
  experience: {
    title: string;
  };
  education: {
    title: string;
  };
  solution: {
    title: string;
  };
  project: {
    title: string;
  };
}

export interface DataLocale {
  [key: string]: {
    settings: Settings;
    navbar: Navbar;
    sidebar: Sidebar;
  };
}
