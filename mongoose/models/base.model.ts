import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type BaseModelDocument = HydratedDocument<BaseModel>;

export class BaseModel {
  @Prop({ type: Date })
  createdAt!: Date;

  @Prop({ type: Date })
  updatedAt!: Date;

  @Prop({ type: Date })
  deletedAt!: Date;
}

export const BaseModelSchema = SchemaFactory.createForClass(BaseModel);
