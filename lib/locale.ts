import { DataLocale } from "@/types/data_locale";

const engData = {
  settings: {
    title: 'Settings',
    public_profile: {
      title: 'Public Profile',
      button_submit: 'UPDATE PROFILE',
    },
    change_password: {
      title: 'Change Password'
    },
    theme: {
      title: 'Theme'
    },
    language: {
      title: 'Language'
    },
  },
  navbar: {
    settings: {
      title: 'Settings'
    },
    log_out: {
      title: 'Log Out'
    }
  },
  sidebar: {
    dashboard: {
      title: 'Dashboard'
    },
    skill: {
      title: 'Skill'
    },
    school: {
      title: 'School'
    },
  }
}

const indData = {
  settings: {
    title: 'Pengaturan',
    public_profile: {
      title: 'Profil',
      button_submit: 'UPDATE PROFIL',
    },
    change_password: {
      title: 'Ubah Password'
    },
    theme: {
      title: 'Tema'
    },
    language: {
      title: 'Bahasa'
    },
  },
  navbar: {
    settings: {
      title: 'Pengaturan'
    },
    log_out: {
      title: 'Keluar'
    }
  },
  sidebar: {
    dashboard: {
      title: 'Dashboard'
    },
    skill: {
      title: 'Skill'
    },
    school: {
      title: 'Universitas'
    },
  },
}

export const dataLocale: DataLocale = {
  en: engData,
  id: indData
};


export const validLocale = (locale: string) => {
  return locale === 'en' || locale === 'id' ? locale : 'en'
} 
