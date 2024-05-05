export interface Project {
  id: string;
  title: string;
  image_url: string;
  logo_url: string;
  is_active: boolean;
}

export interface ResponseProjects {
  code: number;
  status: string;
  data: Project[];
  meta: {
    size: number;
    total: number;
    total_pages: number;
    offset: number;
  };
}

export interface ResponseProject {
  code: number;
  status: string;
  data: Project;
}
