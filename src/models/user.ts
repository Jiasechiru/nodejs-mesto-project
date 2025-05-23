import mongoose from 'mongoose';
import validator from 'validator';

export interface IUser {
  name?: string;
  about?: string;
  avatar?: string;
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: 2,
      maxlength: 30,
      default: 'Жак-Ив Кусто',
    },
    about: {
      type: String,
      minlength: 2,
      maxlength: 200,
      default: 'Исследователь',
    },
    avatar: {
      type: String,
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
      validate: {
        validator: (url: string) => validator.isURL(url, { host_blacklist: [/^www\.\w+$/] }),
        message: 'Неверная ссылка',
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (email: string) => validator.isEmail(email),
        message: 'Email указан в неверном формате',
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  { versionKey: false },
);

export default mongoose.model<IUser>('user', userSchema);
