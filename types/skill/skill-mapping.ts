export interface SkillMapping {
  id: string;
  skill: {
    id: string;
    name: string;
  };
  is_active: boolean;
}

export interface ResponseSkillMappings {
  code: number;
  status: string;
  data: SkillMapping[];
  meta: {
    size: number;
    total: number;
    total_pages: number;
    offset: number;
  };
}

export interface ResponseSkillMapping {
  code: number;
  status: string;
  data: SkillMapping;
}
