export interface ShortenApiResponse {
  status: number;
  message: string;
  short_url: string;
  long_url: string;
}

export interface RetrieveApiResponse {
  status: number;
  _id: number;
  short_url: string;
  long_url: URL;
  created_at: Date;
  number_of_visits: number;
}
