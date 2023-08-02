import { BaseModel, FindOptions } from "..";

export type FindWithPaginationOptions<T extends BaseModel> = FindOptions<T> & {
  limit: number;
  page: number;
};
