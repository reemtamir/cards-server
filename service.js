const {
  bizCard,
  User,
  validateCreateUser,
  validateSignIn,
  validateCard,
} = require('./db');

const bcrypt = require('bcrypt');
const _ = require('lodash');
require('dotenv').config();

const createUser = async (req, res) => {
  const { error } = validateCreateUser(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  const { name, email, password, isBiz } = req.body;

  let user = await User.findOne({ email: email });
  if (user) {
    res.status(400).send('User already registered');
    return;
  }

  user = await new User({
    name: name,
    email: email,
    password: await bcrypt.hash(password, 12),
    isBiz: isBiz,
  }).save();

  res.send(_.pick(user, ['_id', 'name', 'isBiz']));
};

const getUserByEmail = async (req, res) => {
  const user = await User.find({ email: req.body.email });
  res.send(user);
};

const signIn = async (req, res, next) => {
  const { error } = validateSignIn(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  const user = await User.findOne({
    email: req.body.email,
  });

  if (!user) {
    res.status(400).send('Invalid email');
    return;
  }

  const isValidPassword = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!isValidPassword) {
    res.status(400).send('Invalid  password');
    return;
  }
  const token = user.generateAuthToken();
  res.send({ token });
};
const createCard = async (req, res) => {
  const { error } = validateCard(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  const {
    name,
    phone,
    address,
    description,

    image = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
  } = req.body;
  const card = await new bizCard({
    bizName: name,
    bizPhone: phone,
    bizAddress: address,
    bizDescription: description,
    bizImage: image,
  }).save();

  res.send(card);
};
const findCardById = async (req, res) => {
  const card = await bizCard.findOne({ _id: req.params.id });
  res.send(card);
};
const getAllCards = async (req, res) => {
  const cards = await bizCard.find({});

  res.send(cards);
};
const updateCard = async (req, res) => {
  const { error } = validateCard(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  const {
    name,
    address,
    phone,
    description,
    image = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
  } = req.body;
  const updatedCard = await bizCard.updateOne(
    { _id: req.params.id },
    {
      $set: {
        bizName: name,
        bizAddress: address,
        bizPhone: phone,
        bizDescription: description,
        bizImage: image,
      },
    }
  );
  res.send(updatedCard);
};
const deleteCard = async (req, res) => {
  const deletedCard = await bizCard.deleteOne({ _id: req.params.id });
  res.send(deletedCard);
};
module.exports = {
  getAllCards,
  findCardById,
  createCard,
  createUser,
  getUserByEmail,
  deleteCard,
  updateCard,
  signIn,
};
