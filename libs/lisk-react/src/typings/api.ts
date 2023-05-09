export interface ApiResponse<T> {
  data: T;
  meta?: {
    count: number;
    offset: number;
    total: number;
  };
}

export interface ApiMethods {
  get<T>(options: any): Promise<ApiResponse<T> | undefined>;
  post<T>(options: any): Promise<ApiResponse<T> | undefined>;
}

export interface RequestOptions {
  uri: string;
  body: any;
  headers: {
    [key: string]: string;
  };
}
