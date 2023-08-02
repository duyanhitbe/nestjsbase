import { DeepPartial } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { BaseEntity, FindOptions, FindOrFailOptions, FindWithPaginationOptions, IPagination } from "..";

export interface IBaseService {
  create(data: DeepPartial<BaseEntity>): Promise<BaseEntity>;
  createMany(data: DeepPartial<BaseEntity>[]): Promise<BaseEntity[]>;

  getOne(options: FindOptions<BaseEntity>): Promise<BaseEntity | null>;
  getOneOrFail(options: FindOrFailOptions<BaseEntity>): Promise<BaseEntity>;

  getOneById(id: string, relations?: string[]): Promise<BaseEntity | null>;
  getOneByIdOrFail(id: string, relations?: string[], errorMessage?: string): Promise<BaseEntity>;

  getAll(options: Partial<FindOptions<BaseEntity>>): Promise<BaseEntity[]>;
  getAllWithPagination(options: FindWithPaginationOptions<BaseEntity>): Promise<IPagination<BaseEntity>>;

  update(options: FindOrFailOptions<BaseEntity>, data: QueryDeepPartialEntity<BaseEntity>): Promise<BaseEntity>;
  updateById(id: string, data: QueryDeepPartialEntity<BaseEntity>, relations?: string[], errorMessage?: string): Promise<BaseEntity>;

  remove(options: FindOrFailOptions<BaseEntity>): Promise<BaseEntity>;
  removeById(id: string, errorMessage?: string): Promise<BaseEntity>;

  softRemove(options: FindOrFailOptions<BaseEntity>): Promise<BaseEntity>;
  softRemoveById(id: string, errorMessage?: string): Promise<BaseEntity>;
}
