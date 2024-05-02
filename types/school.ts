export interface School {
  id: string;
  code: string;
  name: string;
  image_url: string;
  logo_url: string;
  website_url: string;
  is_active: boolean;
}

export interface ResponseSchools {
  code: number;
  status: string;
  data: School[];
  meta: {
    size: number;
    total: number;
    total_pages: number;
    offset: number;
  };
}

export interface ResponseSchool {
  code: number;
  status: string;
  data: School;
}
