import { NotFoundException } from "@nestjs/common";
import { extend } from "lodash";
import { DeepPartial, FindOptionsWhere, Repository } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import {
  AbstractBaseService,
  BaseEntity,
  FindOptions,
  FindWithPaginationOptions,
  IPagination
} from "../";
import { FindOrFailOptions } from "./../types/find-or-fail-options.type";

export class BaseService<T extends BaseEntity> extends AbstractBaseService {
  constructor(private readonly repository: Repository<T>) {
    super();
  }

  create(data: DeepPartial<T>): Promise<T> {
    return this.repository.create(data).save();
  }

  async createMany(data: DeepPartial<T>[]): Promise<T[]> {
    const entities: T[] = [];
    const newEntities = this.repository.create(data);
    for (let i = 0; i < newEntities.length; i++) {
      const newEntity = await newEntities[i].save();
      entities.push(newEntity);
    }
    return entities;
  }

  getOne(options: FindOptions<T>): Promise<T | null> {
    const { where, relations } = options;
    return this.repository.findOne({ where, relations });
  }

  async getOneOrFail(options: FindOrFailOptions<T>): Promise<T> {
    const { where, relations, errorMessage } = options;
    const entity = await this.repository.findOne({ where, relations });
    if (!entity) {
      throw new NotFoundException(errorMessage || "Entity not found");
    }
    return entity;
  }

  getOneById(id: string, relations?: string[] | undefined): Promise<T | null> {
    const where = { id } as FindOptionsWhere<T>;
    return this.repository.findOne({ where, relations });
  }

  async getOneByIdOrFail(
    id: string,
    relations?: string[],
    errorMessage?: string
  ): Promise<T> {
    const where = { id } as FindOptionsWhere<T>;
    const entity = await this.repository.findOne({ where, relations });
    if (!entity) {
      throw new NotFoundException(errorMessage || "Entity not found");
    }
    return entity;
  }

  getAll(options: Partial<FindOptions<T>>): Promise<T[]> {
    const { where, relations } = options;
    return this.repository.find({
      where,
      relations
    });
  }

  async getAllWithPagination(
    options: FindWithPaginationOptions<T>
  ): Promise<IPagination<T>> {
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
    options: FindOrFailOptions<T>,
    data: QueryDeepPartialEntity<T>
  ): Promise<T> {
    const where = options.where as FindOptionsWhere<T>;
    const entity = await this.getOneOrFail(options);
    const newEntity = extend<T>(entity, data);
    this.repository.update(where, data);
    return newEntity;
  }

  async updateById(
    id: string,
    data: QueryDeepPartialEntity<T>,
    relations?: string[],
    errorMessage?: string
  ): Promise<T> {
    const where = { id } as FindOptionsWhere<T>;
    const entity = await this.getOneByIdOrFail(id, relations, errorMessage);
    const newEntity = extend<T>(entity, data);
    this.repository.update(where, data);
    return newEntity;
  }

  async remove(options: FindOrFailOptions<T>): Promise<T> {
    const entity = await this.getOneOrFail(options);
    return this.repository.remove(entity);
  }

  async removeById(id: string, errorMessage?: string): Promise<T> {
    const entity = await this.getOneByIdOrFail(id, [], errorMessage);
    return this.repository.remove(entity);
  }

  async softRemove(options: FindOrFailOptions<T>): Promise<T> {
    const entity = await this.getOneOrFail(options);
    return this.repository.softRemove(entity);
  }

  async softRemoveById(id: string, errorMessage?: string): Promise<T> {
    const entity = await this.getOneByIdOrFail(id, [], errorMessage);
    return this.repository.softRemove(entity);
  }
}
