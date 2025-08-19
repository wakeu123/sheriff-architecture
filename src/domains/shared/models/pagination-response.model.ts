export type PaginationResponse<T> = {
  items: T[];
  page: number;
  total: number;
  pageSize: number;
};
