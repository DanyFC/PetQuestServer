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
export class Quest {
  @Prop({ default: [] })
  characteristics: string[];

  @Prop({ required: true })
  direction: string;

  @Prop({ required: true })
  gender: string;

  @Prop({ default: [] })
  health: string[];

  @Prop({ required: true })
  image: string;

  @Prop({ required: true })
  name: string;

  @Prop({ default: [] })
  race: string[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Update' }],
    default: [],
  })
  record: mongoose.Types.ObjectId[];

  @Prop()
  story: string;

  @Prop({ default: false })
  trained: boolean;

  @Prop({ required: true })
  type: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: mongoose.Types.ObjectId;

  @Prop({ required: true, default: Date.now })
  lostDate: Date;

  @Prop({ required: true })
  placeOfLost: string;

  @Prop()
  foundedDate: Date;

  @Prop()
  lastSeen: Date;
}

export const QuestSchema = SchemaFactory.createForClass(Quest);
