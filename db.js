const Joi = require('joi');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const _ = require('lodash');
mongoose.set('strictQuery', false);
const connect = () =>
  mongoose
    .connect('mongodb://127.0.0.1:27017/cardsDB')
    .then(() => console.log('connected to db'))

    .catch((err) => console.log(err));

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 255,
  },
  email: {
    type: String,
    minLength: 6,
    maxLength: 255,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
    maxLength: 1064,
  },
  isBiz: { type: Boolean, required: true, default: false },
  createdAt: { type: Date, default: Date.now },
});
userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { isBiz: this.isBiz, _id: this._id },
    process.env.JWT_SECRET_TOKEN
  );
};

const User = mongoose.model('User', userSchema, 'users');

const validateCreateUser = (user) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(255).required(),
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(1064).required(),
    isBiz: Joi.boolean().required(),
  });
  return schema.validate(user);
};
const validateSignIn = (user) => {
  const schema = Joi.object({
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(1064).required(),
  });
  return schema.validate(user);
};
const cardSchema = new mongoose.Schema({
  bizName: { type: String, required: true, minLength: 2, maxLength: 255 },
  bizPhone: { type: String, required: true, minLength: 9, maxLength: 10 },
  bizAddress: { type: String, required: true, minLength: 2, maxLength: 400 },
  bizDescription: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 1024,
  },
  bizImage: { type: String, required: true, minLength: 11, maxLength: 1064 },
  bizNumber: {
    type: Number,
    min: 100,
    max: 99_999_999_999,
    unique: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});
const validateCard = (card) => {
  const schema = Joi.object({
    bizName: Joi.string().min(2).max(255).required(),
    bizPhone: Joi.string()
      .min(9)
      .max(10)
      .required()
      .regex(/^0[2-9]\d{7,8}$/),
    bizAddress: Joi.string().min(2).max(400).required(),
    bizDescription: Joi.string().min(2).max(1024).required(),
    bizImage: Joi.string().allow('').min(11).max(1064).uri(),
  });
  return schema.validate(card);
};
const generateBizNumber = async () => {
  while (true) {
    let random = _.random(100, 99_999_999_999);
    let card = await bizCard.findOne({ bizNumber: random });

    if (!card) {
      return random;
    }
  }
};
const bizCard = mongoose.model('Card', cardSchema, 'cards');
module.exports = {
  connect,
  bizCard,
  User,
  validateCreateUser,
  validateSignIn,
  validateCard,
  generateBizNumber,
};
