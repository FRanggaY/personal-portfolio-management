export interface Solution {
  id: string;
  title: string;
  image_url: string;
  logo_url: string;
  is_active: boolean;
}

export interface ResponseSolutions {
  code: number;
  status: string;
  data: Solution[];
  meta: {
    size: number;
    total: number;
    total_pages: number;
    offset: number;
  };
}

export interface ResponseSolution {
  code: number;
  status: string;
  data: Solution;
}
