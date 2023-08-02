export interface IPagination<T> {
  data: T[];
  pagination: {
    limit: number;
    page: number;
    total: number;
  };
}
