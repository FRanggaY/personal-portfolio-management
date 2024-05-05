export interface Experience {
  id: string;
  title: string;
  company: {
    id: string;
    name: string;
  };
  started_at: string;
  finished_at: string;
  is_active: boolean;
}

export interface ResponseExperiences {
  code: number;
  status: string;
  data: Experience[];
  meta: {
    size: number;
    total: number;
    total_pages: number;
    offset: number;
  };
}

export interface ResponseExperience {
  code: number;
  status: string;
  data: Experience;
}
