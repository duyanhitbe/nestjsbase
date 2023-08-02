# NestJS Base
This is a library includes inheritable classes that can help you to save your time when create CRUD module in NestJS. This classes are supporting for mongoose. If you want to use typeorm instead, you can go [here](https://www.npmjs.com/package/@nestjsbase/typeorm)

## Installation
```bash
npm install @nestjsbase/mongoose
```

## Usage

### BaseModel
First, you have create your own entity class and inherit BaseModel of @nestjsbase/mongoose
```typescript
import { Schema, Prop } from '@nestjs/mongoose';
import { BaseModel } from '@nestjsbase/mongoose';

@Schema({ timestamp: true })
export class UserModel extends BaseModel {
    @Prop()
    name!: string;
}
```
You have to enable timestamp if you want to use createdAt and updatedAt

This is BaseModel actually do in background
```typescript
export class BaseModel {
  @Prop({ type: Date })
  createdAt!: Date;

  @Prop({ type: Date })
  updatedAt!: Date;

  @Prop({ type: Date })
  deletedAt!: Date;
}
```

### BaseService
Now, make your service inherit BaseService
```typescript
import { Model } from 'mongoose';
import { BaseService } from '@nestjsbase/mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserModel } from '../user.model';

@Injectable()
export class UserService extends BaseService {
    constructor(@InjectModel(UserModel.name) private userModel: Model<UserModel>){
        super(userModel);
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
- where: usage same as filter of mongoose
- relations: usage same as populate of mongoose
- errorMessage: This message will be thrown when entity not be found. Default is: "Document not found"
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