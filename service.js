const { bizCard, User } = require('./db');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const createUser = async (req, res) => {
  const {
    name,
    email,
    password,
    isBiz = false,
    data = jwt.sign({ isBiz: isBiz }, process.env.SECRET, { expiresIn: '1h' }),
  } = req.body;

  const user = new User({
    name: name,
    email: email,
    password: password,
    isBiz: isBiz,
    token: data,
  });
  try {
    await user.save();
    res.send(user);
  } catch (response) {
    console.log('Email already exist');
  }
};

const getUserByEmail = async (req, res) => {
  const user = await User.find({ email: req.body.email });
  res.send(user);
};

const createCard = async (req, res) => {
  const {
    bizName: name,
    bizPhone: phone,
    bizAddress: address,
    bizDescription: description,
    bizImage:
      image = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
  } = req.body;
  const card = new bizCard({
    bizName: name,
    bizPhone: phone,
    bizAddress: address,
    bizDescription: description,
    bizImage: image,
  });

  await card.save();
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

const signIn = async (req, res, next) => {
  const user = await User.findOne({
    email: req.body.email,
    password: req.body.password,
  });

  res.send(user);
};

const updateCard = async (req, res) => {
  const {
    bizName: name,
    bizAddress: address,
    bizPhone: phone,
    bizDescription: description,
    bizImage:
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
