export interface PublicProfile {
  id: string;
  username: string;
  gender: string;
  name: string;
  image_url: string
}

export interface PublicProfileEducation {
  id: string;
  title: string;
  degree: string;
  description: string;
  field_of_study: string;
  started_at: string;
  finished_at: string;
  created_at: string;
  updated_at: string;
  school: {
    name: string;
    description: string;
    address: string;
    image_url: string;
    logo_url: string;
    website_url: string;
  }
}

export interface PublicProfileExperience {
  id: string;
  title: string;
  description: string;
  employee_type: string;
  location: string;
  location_type: string;
  started_at: string;
  finished_at: string;
  created_at: string;
  updated_at: string;
  company: {
    name: string;
    description: string;
    address: string;
    image_url: string;
    logo_url: string;
    website_url: string;
  }
}

export interface PublicProfileSkill {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  image_url: string;
  logo_url: string;
  website_url: string;
}

export interface PublicProfileSolution {
  id: string;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
  image_url: string;
  logo_url: string;
}

export interface PublicProfileProject {
  id: string;
  title: string;
  description: string;
  slug: string;
  created_at: string;
  updated_at: string;
  image_url: string;
  logo_url: string;
}

export interface PublicProfileProjectAttachment {
  id: string;
  title: string;
  category: string;
  description: string;
  created_at: string;
  updated_at: string;
  image_url: string;
  website_url: string;
}

export interface PublicProfileProjectDetail {
  id: string;
  title: string;
  description: string;
  slug: string;
  created_at: string;
  updated_at: string;
  image_url: string;
  logo_url: string;
  skills: PublicProfileSkill[];
  attachments: PublicProfileProjectAttachment[];
}

export interface ResponsePublicProfile {
  code: number;
  status: string;
  data: PublicProfile;
}

export interface ResponsePublicProfileEducations {
  code: number;
  status: string;
  data: PublicProfileEducation[];
  meta: {
    size: number;
    total: number;
    total_pages: number;
    offset: number
  }
}

export interface ResponsePublicProfileSkills {
  code: number;
  status: string;
  data: PublicProfileSkill[];
  meta: {
    size: number;
    total: number;
    total_pages: number;
    offset: number
  }
}

export interface ResponsePublicProfileSolutions {
  code: number;
  status: string;
  data: PublicProfileSolution[];
  meta: {
    size: number;
    total: number;
    total_pages: number;
    offset: number
  }
}

export interface ResponsePublicProfileProjects {
  code: number;
  status: string;
  data: PublicProfileProject[];
  meta: {
    size: number;
    total: number;
    total_pages: number;
    offset: number
  }
}

export interface ResponsePublicProfileProject {
  code: number;
  status: string;
  data: PublicProfileProjectDetail;
}
