import { FindOptionsWhere } from "typeorm";
import { BaseEntity } from "../";

export type FindOptions<T extends BaseEntity> = {
  where: FindOptionsWhere<BaseEntity> | FindOptionsWhere<BaseEntity>[];
  relations?: string[];
};
