export interface AuthLogin {
  username_or_email: string;
  password: string;
}


export interface AuthProfile {
  profile: {
    id: string,
    username: string,
    email: string,
    name: string,
    no_handphone: string,
    gender: string,
    role?: {
      id: number,
      code: string,
      name: string
    },
    image_url: string,
    view_mode: string[]
  },
  refresh: () => void;
  theme: string;
}

export interface AuthProfilePassword {
  old_password: string;
  new_password: string;
  confirm_new_password: string;
}
