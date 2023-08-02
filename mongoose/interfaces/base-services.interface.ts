import { AnyKeys, UpdateQuery } from "mongoose";
import { BaseModel, FindOptions, FindOrFailOptions, FindWithPaginationOptions, IPagination } from "..";

export interface IBaseService {
  create(data: AnyKeys<BaseModel>): Promise<BaseModel>;
  createMany(data: AnyKeys<BaseModel>[]): Promise<BaseModel[]>;

  getOne(options: FindOptions<BaseModel>): Promise<BaseModel | null>;
  getOneOrFail(options: FindOrFailOptions<BaseModel>): Promise<BaseModel>;

  getOneById(id: string, relations?: string[]): Promise<BaseModel | null>;
  getOneByIdOrFail(id: string, relations?: string[], errorMessage?: string): Promise<BaseModel>;

  getAll(options: Partial<FindOptions<BaseModel>>): Promise<BaseModel[]>;
  getAllWithPagination(options: FindWithPaginationOptions<BaseModel>): Promise<IPagination<BaseModel>>;

  update(options: FindOrFailOptions<BaseModel>, data: UpdateQuery<BaseModel>): Promise<BaseModel>;
  updateById(id: string, data: UpdateQuery<BaseModel>, relations?: string[], errorMessage?: string): Promise<BaseModel>;

  remove(options: FindOrFailOptions<BaseModel>): Promise<BaseModel>;
  removeById(id: string, errorMessage?: string): Promise<BaseModel>;

  softRemove(options: FindOrFailOptions<BaseModel>): Promise<BaseModel>;
  softRemoveById(id: string, errorMessage?: string): Promise<BaseModel>;
}
