import mongoose from 'mongoose';
import validator from 'validator';

export interface ICard {
  name: string;
  link: string;
  createdAt: Date;
  owner: mongoose.Types.ObjectId;
  likes: mongoose.Types.ObjectId[];
}

const cardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
    },
    link: {
      type: String,
      required: true,
      validate: {
        validator: (url: string) => validator.isURL(url, { host_blacklist: [/^www\.\w+$/] }),
        message: 'Неверная ссылка',
      },
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
    },
  },
  { versionKey: false },
);

export default mongoose.model<ICard>('card', cardSchema);
