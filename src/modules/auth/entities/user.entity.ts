import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  toJSON: {
    transform: (doc, ret) => {
      // eslint-disable-next-line
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      delete ret.password;
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

  @Prop({ type: [String], default: [] })
  published: string[];

  @Prop({ type: [String], default: [] })
  commented: string[];

  @Prop({ default: true })
  isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
