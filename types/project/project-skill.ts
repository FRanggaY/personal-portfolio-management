export interface ProjectSkill {
  id: string;
  skill: {
    id: string;
    name: string;
    category: string;
    image_url: string;
    logo_url: string;
  };
  project: {
    id: string;
    title: string;
  };
  is_active: boolean;
}

export interface ResponseProjectSkills {
  code: number;
  status: string;
  data: ProjectSkill[];
  meta: {
    size: number;
    total: number;
    total_pages: number;
    offset: number;
  };
}

export interface ResponseProjectSkill {
  code: number;
  status: string;
  data: ProjectSkill;
}
