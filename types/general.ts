export interface ResponseGeneralDynamicResource {
  code: number;
  status: string;
  data: string[];
}

export interface ResponseCountGeneralDynamicResource {
  code: number;
  status: string;
  data: {
    count: number;
  };
}

export interface LanguageParams {
  locale: string;
}
