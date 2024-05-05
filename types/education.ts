export interface Education {
  id: string;
  title: string;
  school: {
    id: string;
    name: string;
  };
  started_at: string;
  finished_at: string;
  is_active: boolean;
}

export interface ResponseEducations {
  code: number;
  status: string;
  data: Education[];
  meta: {
    size: number;
    total: number;
    total_pages: number;
    offset: number;
  };
}

export interface ResponseEducation {
  code: number;
  status: string;
  data: Education;
}
