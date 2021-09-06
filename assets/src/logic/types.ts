export type Page = 'index' | 'scan' | 'show';

export type Route = {
  page: Page;
  id?: string;
  key?: string;
  token?: string;
};

export type Status = {
  status: 'connecting' | 'connected' | 'error';
  data?: string | null;
};