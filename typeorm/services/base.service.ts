import { NotFoundException } from "@nestjs/common";
import { extend } from "lodash";
import { DeepPartial, FindOptionsWhere, Repository } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import {
  BaseEntity,
  FindOptions,
  FindWithPaginationOptions,
  IBaseService,
  IPagination
} from "../";
import { FindOrFailOptions } from "./../types/find-or-fail-options.type";

export class BaseService implements IBaseService {
  constructor(private readonly repository: Repository<BaseEntity>) {}

  create(data: DeepPartial<BaseEntity>): Promise<BaseEntity> {
    return this.repository.create(data).save();
  }

  async createMany(data: DeepPartial<BaseEntity>[]): Promise<BaseEntity[]> {
    const entities: BaseEntity[] = [];
    const newEntities = this.repository.create(data);
    for (let i = 0; i < newEntities.length; i++) {
      const newEntity = await newEntities[i].save();
      entities.push(newEntity);
    }
    return entities;
  }

  getOne(options: FindOptions<BaseEntity>): Promise<BaseEntity | null> {
    const { where, relations } = options;
    return this.repository.findOne({ where, relations });
  }

  async getOneOrFail(
    options: FindOrFailOptions<BaseEntity>
  ): Promise<BaseEntity> {
    const { where, relations, errorMessage } = options;
    const entity = await this.repository.findOne({ where, relations });
    if (!entity) {
      throw new NotFoundException(errorMessage || "Entity not found");
    }
    return entity;
  }

  getOneById(
    id: string,
    relations?: string[] | undefined
  ): Promise<BaseEntity | null> {
    const where = { id };
    return this.repository.findOne({ where, relations });
  }

  async getOneByIdOrFail(
    id: string,
    relations?: string[],
    errorMessage?: string
  ): Promise<BaseEntity> {
    const where = { id };
    const entity = await this.repository.findOne({ where, relations });
    if (!entity) {
      throw new NotFoundException(errorMessage || "Entity not found");
    }
    return entity;
  }

  getAll(options: Partial<FindOptions<BaseEntity>>): Promise<BaseEntity[]> {
    const { where, relations } = options;
    return this.repository.find({
      where,
      relations
    });
  }

  async getAllWithPagination(
    options: FindWithPaginationOptions<BaseEntity>
  ): Promise<IPagination<BaseEntity>> {
    const { where, relations, limit, page } = options;
    const take = limit;
    const skip = limit * (page - 1);
    const [data, total] = await this.repository.findAndCount({
      where,
      relations,
      take,
      skip
    });
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
    options: FindOrFailOptions<BaseEntity>,
    data: QueryDeepPartialEntity<BaseEntity>
  ): Promise<BaseEntity> {
    const where = options.where as FindOptionsWhere<BaseEntity>;
    const entity = await this.getOneOrFail(options);
    const newEntity = extend<BaseEntity>(entity, data);
    this.repository.update(where, data);
    return newEntity;
  }

  async updateById(
    id: string,
    data: QueryDeepPartialEntity<BaseEntity>,
    relations?: string[],
    errorMessage?: string
  ): Promise<BaseEntity> {
    const where = { id };
    const entity = await this.getOneByIdOrFail(id, relations, errorMessage);
    const newEntity = extend<BaseEntity>(entity, data);
    this.repository.update(where, data);
    return newEntity;
  }

  async remove(options: FindOrFailOptions<BaseEntity>): Promise<BaseEntity> {
    const entity = await this.getOneOrFail(options);
    return this.repository.remove(entity);
  }

  async removeById(id: string, errorMessage?: string): Promise<BaseEntity> {
    const entity = await this.getOneByIdOrFail(id, [], errorMessage);
    return this.repository.remove(entity);
  }

  async softRemove(
    options: FindOrFailOptions<BaseEntity>
  ): Promise<BaseEntity> {
    const entity = await this.getOneOrFail(options);
    return this.repository.softRemove(entity);
  }

  async softRemoveById(id: string, errorMessage?: string): Promise<BaseEntity> {
    const entity = await this.getOneByIdOrFail(id, [], errorMessage);
    return this.repository.softRemove(entity);
  }
}
