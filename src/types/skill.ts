export interface Skill {
  id: number;
  code: string;
  name: string;
  image_url: string;
  logo_url: string;
  website_url: string;
  category: string;
  is_active: boolean;
  updated_at: string;
  created_at: string;
}

export interface ResponseSkills {
  code: number;
  status: string;
  data: Skill[];
  meta: {
    size: number;
    total: number;
    total_pages: number;
    offset: number;
  };
}

export interface ResponseSkill {
  code: number;
  status: string;
  data: Skill;
}
