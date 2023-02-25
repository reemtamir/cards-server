const {
  bizCard,
  User,
  validateCreateUser,
  validateSignIn,
  validateCard,
  generateBizNumber,
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

const signIn = async (req, res) => {
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

  res.send(token);
};

const getUser = async (req, res) => {
  const user = await User.findById({ _id: req.user._id }, { password: 0 });
  res.send(user);
};
const createCard = async (req, res) => {
  const { error } = validateCard(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  const card = await new bizCard({
    ...req.body,
    bizImage:
      req.body.bizImage ||
      'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
    bizNumber: await generateBizNumber(),
    user_id: req.user._id,
  }).save();

  res.send(card);
};
const findCardById = async (req, res) => {
  const card = await bizCard.findOne({
    _id: req.params.id,
    user_id: req.user._id,
  });

  if (!card) {
    res.status(404).send('No card found with the given ID');
    return;
  }
  res.send(card);
};
const getAllCards = async (req, res) => {
  if (!req.user.isBiz) {
    res.status(401).send('Access dinied');
    return;
  }
  const cards = await bizCard.find({ user_id: req.user._id });

  res.send(cards);
};
const updateCard = async (req, res) => {
  const { error } = validateCard(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  const updatedCard = await bizCard.findByIdAndUpdate(
    { _id: req.params.id, user_id: req.user._id },
    {
      ...req.body,
      bizImage:
        req.body.bizImage ||
        'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
    },
    { new: true }
  );
  if (!updateCard) {
    res.status(404).send('No card found with the given ID');
    return;
  }
  res.send(updatedCard);
};
const deleteCard = async (req, res) => {
  const deletedCard = await bizCard.findByIdAndRemove({
    _id: req.params.id,
    user_id: req.user._id,
  });
  if (!deletedCard) {
    res.status(404).send('No card found with the given ID');
    return;
  }
  res.send(deletedCard);
};
module.exports = {
  getAllCards,
  findCardById,
  createCard,
  createUser,
  getUser,
  deleteCard,
  updateCard,
  signIn,
};
