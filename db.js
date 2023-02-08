const Joi = require('joi');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const connect = () =>
  mongoose
    .connect('mongodb://127.0.0.1:27017/cardsDB')
    .then(() => console.log('connected to db'))

    .catch((err) => console.log(err));

const cardSchema = new mongoose.Schema({
  bizName: String,
  bizPhone: String,
  bizAddress: String,
  bizDescription: String,
  bizImage: String,
});
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
  token: String,
  createdAt: { type: Date, default: Date.now },
  cards: { type: Array },
});
userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { isBiz: this.isBiz, _id: this._id },
    process.env.TOKEN_SECRET,
    {
      expiresIn: '1h',
    }
  );
};
const bizCard = mongoose.model('Card', cardSchema, 'cards');
const User = mongoose.model('User', userSchema, 'users');

const validateCreateUser = (user) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(255).required(),
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(1064).required(),
    isBiz: Joi.boolean().required(),
    token: Joi.string(),
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

const validateCard = (card) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(255).required(),
    phone: Joi.string().min(9).max(10).required(),
    address: Joi.string().min(6).max(50).required(),
    description: Joi.string().min(5).max(30).required(),
    image: Joi.string().allow(''),
  });
  return schema.validate(card);
};
module.exports = {
  connect,
  bizCard,
  User,
  validateCreateUser,
  validateSignIn,
  validateCard,
};
