export interface Company {
  id: string;
  code: string;
  name: string;
  image_url: string;
  logo_url: string;
  website_url: string;
  is_active: boolean;
}

export interface ResponseCompanies {
  code: number;
  status: string;
  data: Company[];
  meta: {
    size: number;
    total: number;
    total_pages: number;
    offset: number;
  };
}

export interface ResponseCompany {
  code: number;
  status: string;
  data: Company;
}
