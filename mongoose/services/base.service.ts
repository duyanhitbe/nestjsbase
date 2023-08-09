import { NotFoundException } from "@nestjs/common";
import { extend } from "lodash";
import { AnyKeys, HydratedDocument, Model, UpdateQuery } from "mongoose";
import {
  BaseModel,
  BaseModelDocument,
  FindOptions,
  FindWithPaginationOptions,
  IBaseService,
  IPagination
} from "../";
import { FindOrFailOptions } from "./../types/find-or-fail-options.type";

export class BaseService<T extends BaseModel> implements IBaseService {
  constructor(private readonly model: Model<T>) {}

  create(data: AnyKeys<T>): Promise<HydratedDocument<T>> {
    return this.model.create(data);
  }

  async createMany(data: AnyKeys<T>[]): Promise<HydratedDocument<T>[]> {
    return this.model.create(data);
  }

  async getOne(options: FindOptions<T>): Promise<T | null> {
    const { where, relations } = options;
    const doc = (await this.model.findOne(where).populate(relations || [])) as (T | null);
    return doc;
  }

  async getOneOrFail(
    options: FindOrFailOptions<T>
  ): Promise<T> {
    const { where, relations, errorMessage } = options;
    const doc = (await this.model.findOne(where).populate(relations || [])) as (T | null);
    if (!doc) {
      throw new NotFoundException(errorMessage || "Document not found");
    }
    return doc;
  }

  async getOneById(
    id: string,
    relations?: string[] | undefined
  ): Promise<T | null> {
    const doc = (await this.model.findById(id).populate(relations || [])) as (T | null);
    return doc;
  }

  async getOneByIdOrFail(
    id: string,
    relations?: string[],
    errorMessage?: string
  ): Promise<T> {
    const doc = (await this.model.findById(id).populate(relations || [])) as (T | null);
    if (!doc) {
      throw new NotFoundException(errorMessage || "Document not found");
    }
    return doc;
  }

  getAll(options: Partial<FindOptions<T>>): Promise<T[]> {
    const { where, relations } = options;
    return this.model.find(where || {}).populate(relations || []);
  }

  async getAllWithPagination(
    options: FindWithPaginationOptions<T>
  ): Promise<IPagination<T>> {
    const { where, relations, limit, page } = options;
    const skip = limit * (page - 1);
    const total = await this.model.count(where);
    const data = await this.model
      .find(where)
      .populate(relations || [])
      .limit(limit)
      .skip(skip);
    return {
      data,
      pagination: {
        limit,
        page,
        total
      }
    };
  }

  async update(
    options: FindOrFailOptions<T>,
    data: UpdateQuery<T>
  ): Promise<T> {
    const where = options.where;
    const doc = await this.getOneOrFail(options);
    const newDoc = extend<T>(doc, data);
    this.model.findOneAndUpdate(where, data);
    return newDoc;
  }

  async updateById(
    id: string,
    data: UpdateQuery<T>,
    relations?: string[],
    errorMessage?: string
  ): Promise<T> {
    const doc = await this.getOneByIdOrFail(id, relations, errorMessage);
    const newEntity = extend<T>(doc, data);
    this.model.findByIdAndUpdate(id, data);
    return newEntity;
  }

  async remove(options: FindOrFailOptions<T>): Promise<T> {
    const where = options.where;
    const doc = await this.getOneOrFail(options);
    this.model.findOneAndRemove(where);
    return doc;
  }

  async removeById(id: string, errorMessage?: string): Promise<T> {
    const doc = await this.getOneByIdOrFail(id, [], errorMessage);
    this.model.findByIdAndRemove(id);
    return doc;
  }

  async softRemove(options: FindOrFailOptions<T>): Promise<T> {
    return this.update(options, { deletedAt: new Date() });
  }

  async softRemoveById(id: string, errorMessage?: string): Promise<T> {
    return this.updateById(id, { deletedAt: new Date() }, [], errorMessage);
  }
}
