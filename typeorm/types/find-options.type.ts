import { FindOptionsWhere } from "typeorm";
import { BaseEntity } from "../";

export type FindOptions<T extends BaseEntity> = {
  where: FindOptionsWhere<T> | FindOptionsWhere<T>[];
  relations?: string[];
};
