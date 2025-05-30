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
export class Update {
  @Prop({ required: true, default: Date.now })
  dateUpdate: Date;

  @Prop({ required: true })
  descriptionUpdate: string;

  @Prop({ required: true })
  placeUpdate: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Quest' })
  quest: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: mongoose.Types.ObjectId;
}

export const UpdateSchema = SchemaFactory.createForClass(Update);
