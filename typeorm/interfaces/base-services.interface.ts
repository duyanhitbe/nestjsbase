import { DeepPartial } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { BaseEntity, FindOptions, FindOrFailOptions, FindWithPaginationOptions, IPagination } from "..";

export abstract class AbstractBaseService implements ICreateService, IGetOneService, IGetAllService, IUpdateService, IRemoveService, ISoftRemoveService {
  abstract create(data: DeepPartial<BaseEntity>): Promise<BaseEntity>;
  abstract createMany(data: DeepPartial<BaseEntity>[]): Promise<BaseEntity[]>;

  abstract getOne(options: FindOptions<BaseEntity>): Promise<BaseEntity | null>;
  abstract getOneOrFail(options: FindOrFailOptions<BaseEntity>): Promise<BaseEntity>;

  abstract getOneById(id: string, relations?: string[]): Promise<BaseEntity | null>;
  abstract getOneByIdOrFail(id: string, relations?: string[], errorMessage?: string): Promise<BaseEntity>;

  abstract getAll(options: Partial<FindOptions<BaseEntity>>): Promise<BaseEntity[]>;
  abstract getAllWithPagination(options: FindWithPaginationOptions<BaseEntity>): Promise<IPagination<BaseEntity>>;

  abstract update(options: FindOrFailOptions<BaseEntity>, data: QueryDeepPartialEntity<BaseEntity>): Promise<BaseEntity>;
  abstract updateById(id: string, data: QueryDeepPartialEntity<BaseEntity>, relations?: string[], errorMessage?: string): Promise<BaseEntity>;

  abstract remove(options: FindOrFailOptions<BaseEntity>): Promise<BaseEntity>;
  abstract removeById(id: string, errorMessage?: string): Promise<BaseEntity>;

  abstract softRemove(options: FindOrFailOptions<BaseEntity>): Promise<BaseEntity>;
  abstract softRemoveById(id: string, errorMessage?: string): Promise<BaseEntity>;
}

export interface ICreateService {
  create(data: DeepPartial<BaseEntity>): Promise<BaseEntity>;
  createMany(data: DeepPartial<BaseEntity>[]): Promise<BaseEntity[]>;
}

export interface IGetOneService {
  getOne(options: FindOptions<BaseEntity>): Promise<BaseEntity | null>;
  getOneOrFail(options: FindOrFailOptions<BaseEntity>): Promise<BaseEntity>;
  getOneById(id: string, relations?: string[]): Promise<BaseEntity | null>;
getOneByIdOrFail(id: string, relations?: string[], errorMessage?: string): Promise<BaseEntity>;
}

export interface IGetAllService {
  getAll(options: Partial<FindOptions<BaseEntity>>): Promise<BaseEntity[]>;
  getAllWithPagination(options: FindWithPaginationOptions<BaseEntity>): Promise<IPagination<BaseEntity>>;
}

export interface IUpdateService {
  update(options: FindOrFailOptions<BaseEntity>, data: QueryDeepPartialEntity<BaseEntity>): Promise<BaseEntity>;
  updateById(id: string, data: QueryDeepPartialEntity<BaseEntity>, relations?: string[], errorMessage?: string): Promise<BaseEntity>;
}

export interface IRemoveService {
  remove(options: FindOrFailOptions<BaseEntity>): Promise<BaseEntity>;
  removeById(id: string, errorMessage?: string): Promise<BaseEntity>;
}

export interface ISoftRemoveService {
  softRemove(options: FindOrFailOptions<BaseEntity>): Promise<BaseEntity>;
  softRemoveById(id: string, errorMessage?: string): Promise<BaseEntity>;
}
