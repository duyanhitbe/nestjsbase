import { NotFoundException } from "@nestjs/common";
import { extend } from "lodash";
import { AnyKeys, Model, UpdateQuery } from "mongoose";
import {
  BaseModel,
  BaseModelDocument,
  FindOptions,
  FindWithPaginationOptions,
  IBaseService,
  IPagination
} from "../";
import { FindOrFailOptions } from "./../types/find-or-fail-options.type";

export class BaseService implements IBaseService {
  constructor(private readonly model: Model<BaseModel>) {}

  create(data: AnyKeys<BaseModel>): Promise<BaseModelDocument> {
    return this.model.create(data);
  }

  async createMany(data: AnyKeys<BaseModel>[]): Promise<BaseModelDocument[]> {
    return this.model.create(data);
  }

  getOne(options: FindOptions<BaseModel>): Promise<BaseModel | null> {
    const { where, relations } = options;
    return this.model.findOne(where).populate(relations || []);
  }

  async getOneOrFail(
    options: FindOrFailOptions<BaseModel>
  ): Promise<BaseModel> {
    const { where, relations, errorMessage } = options;
    const doc = await this.model.findOne(where).populate(relations || []);
    if (!doc) {
      throw new NotFoundException(errorMessage || "Document not found");
    }
    return doc;
  }

  getOneById(
    id: string,
    relations?: string[] | undefined
  ): Promise<BaseModel | null> {
    return this.model.findById(id).populate(relations || []);
  }

  async getOneByIdOrFail(
    id: string,
    relations?: string[],
    errorMessage?: string
  ): Promise<BaseModel> {
    const doc = await this.model.findById(id).populate(relations || []);
    if (!doc) {
      throw new NotFoundException(errorMessage || "Document not found");
    }
    return doc;
  }

  getAll(options: Partial<FindOptions<BaseModel>>): Promise<BaseModel[]> {
    const { where, relations } = options;
    return this.model.find(where || {}).populate(relations || []);
  }

  async getAllWithPagination(
    options: FindWithPaginationOptions<BaseModel>
  ): Promise<IPagination<BaseModel>> {
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
    options: FindOrFailOptions<BaseModel>,
    data: UpdateQuery<BaseModel>
  ): Promise<BaseModel> {
    const where = options.where;
    const doc = await this.getOneOrFail(options);
    const newDoc = extend<BaseModel>(doc, data);
    this.model.findOneAndUpdate(where, data);
    return newDoc;
  }

  async updateById(
    id: string,
    data: UpdateQuery<BaseModel>,
    relations?: string[],
    errorMessage?: string
  ): Promise<BaseModel> {
    const doc = await this.getOneByIdOrFail(id, relations, errorMessage);
    const newEntity = extend<BaseModel>(doc, data);
    this.model.findByIdAndUpdate(id, data);
    return newEntity;
  }

  async remove(options: FindOrFailOptions<BaseModel>): Promise<BaseModel> {
    const where = options.where;
    const doc = await this.getOneOrFail(options);
    this.model.findOneAndRemove(where);
    return doc;
  }

  async removeById(id: string, errorMessage?: string): Promise<BaseModel> {
    const doc = await this.getOneByIdOrFail(id, [], errorMessage);
    this.model.findByIdAndRemove(id);
    return doc;
  }

  async softRemove(options: FindOrFailOptions<BaseModel>): Promise<BaseModel> {
    return this.update(options, { deletedAt: new Date() });
  }

  async softRemoveById(id: string, errorMessage?: string): Promise<BaseModel> {
    return this.updateById(id, { deletedAt: new Date() }, [], errorMessage);
  }
}
