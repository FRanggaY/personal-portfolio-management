export interface Skill {
  id: string;
  code: string;
  name: string;
  category: string;
  image_url: string;
  logo_url: string;
  website_url: string;
  is_active: boolean;
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
