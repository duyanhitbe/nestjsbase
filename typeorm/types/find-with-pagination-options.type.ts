import { BaseEntity, FindOptions } from "..";

export type FindWithPaginationOptions<T extends BaseEntity> = FindOptions<T> & {
  limit: number;
  page: number;
};
