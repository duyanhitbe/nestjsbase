# NestJS Base
This is a library includes inheritable classes that can help you to save your time when create CRUD module in NestJS. This classes are supporting for typeorm. If you want to use mongoose instead, you can go [here](https://www.npmjs.com/package/@nestjsbase/mongoose)

## Installation
```bash
npm install @nestjsbase/typeorm
```

## Usage

### BaseEntity
First, you have create your own entity class and inherit BaseEntity of @nestjsbase/typeorm
```typescript
import { Entity, Column } from 'typeorm';
import { BaseEntity } from '@nestjsbase/typeorm';

@Entity()
export class UserEntity extends BaseEntity {
    @Column()
    name!: string;
}
```
This is BaseEntity actually do in background
```typescript
export class BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date;
}
```

### BaseService
Now, make your service inherit BaseService
```typescript
import { Repository } from 'typeorm';
import { BaseService } from '@nestjsbase/typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user.service';

@Injectable()
export class UserService extends BaseService {
    constructor(@InjectRepository(UserEntity) private userRepo: Repository<UserEntity>){
        super(userRepo);
    }
}
```
This BaseService already have methods:
```typescript
export class IBaseService {
  create(...);
  createMany(...);

  getOne(...);
  getOneOrFail(...);

  getOneById(...);
  getOneByIdOrFail(...);

  getAll(...);
  getAllWithPagination(...);

  update(...);
  updateById(...);

  remove(...);
  removeById(...);

  softRemove(...);
  softRemoveById(...);
}
```
#### FindOptions and FindOrFailOptions
- where: usage same as typeorm
- relations: usage same as typeorm
- errorMessage: This message will be thrown when entity not be found. Default is: "Entity not found"
#### FindWithPaginationOptions
- limit: number of items in one page
- page: page number
#### IPagination
```typescript
export interface IPagination<T> {
  data: T[];
  pagination: {
    limit: number;
    page: number;
    total: number;
  };
}
```