const express = require('express');
const { connect } = require('./db');
const {
  findCardById,
  createCard,
  createUser,
  getAllCards,
  updateCard,
  getUserByEmail,
  deleteCard,
  signIn,
} = require('./service');

const app = express();
const PORT = 3000;
const cors = require('cors');
String.prototype.toObjectId = function () {
  const ObjectId = require('mongoose').Types.ObjectId;
  return new ObjectId(this.toString());
};
app.use(express.json());
app.use(express.urlencoded());

app.use((req, res, next) => {
  res.set('Authorization', 'Bearer x-auth-token');
  next();
});

connect();
app.use(cors());
app.post('/cards', createCard);
app.post('/users', createUser);
app.post('/auth', signIn);
app.get('/user', getUserByEmail);
app.get('/cards/:id', findCardById);
//TO FIX
app.get('/all/', getAllCards);
app.put('/cards/:id', updateCard);

app.delete('/cards/:id', deleteCard);

app.listen(PORT, () => console.log(`listening in port ${PORT}`));
