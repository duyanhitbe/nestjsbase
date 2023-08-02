import { BaseModel } from "..";
import { FindOptions } from "./find-options.type";

export type FindOrFailOptions<T extends BaseModel> = FindOptions<T> & {
  errorMessage?: string;
};
