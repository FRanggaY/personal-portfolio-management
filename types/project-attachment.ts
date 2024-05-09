export interface ProjectAttachment {
  id: string;
  title: string;
  description: string;
  website_url: string;
  category: string;
  created_at: string;
  updated_at: string;
  image_url: string;
  is_active: boolean;
}

export interface ResponseProjectAttachments {
  code: number;
  status: string;
  data: ProjectAttachment[];
  meta: {
    size: number;
    total: number;
    total_pages: number;
    offset: number;
  };
}

export interface ResponseProjectAttachment {
  code: number;
  status: string;
  data: ProjectAttachment;
}
