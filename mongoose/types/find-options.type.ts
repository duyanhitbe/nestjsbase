import { FilterQuery } from "mongoose";
import { BaseModel } from "../models/base.model";

export type FindOptions<T extends BaseModel> = {
  where: FilterQuery<T> | FilterQuery<T>[];
  relations?: string[];
};
