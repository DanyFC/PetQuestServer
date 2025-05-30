import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({
  versionKey: false,
  toJSON: {
    transform: (doc, ret) => {
      // eslint-disable-next-line
      ret.id = ret._id;
      delete ret.__v;
      delete ret._id;
      return ret;
    },
  },
  toObject: {
    transform: (doc, ret) => {
      // eslint-disable-next-line
      ret.id = ret._id;
      delete ret.__v;
      delete ret._id;
      return ret;
    },
  },
})
export class User {
  @Prop({ required: true, minlength: 3 })
  userName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true, minlength: 6 })
  password: string;

  @Prop({ default: new Date() })
  createdAt: Date;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Quest' }],
    default: [],
  })
  published: mongoose.Types.ObjectId[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Update' }],
    default: [],
  })
  commented: mongoose.Types.ObjectId[];

  @Prop({ default: true })
  isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
