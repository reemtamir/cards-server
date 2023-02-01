const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const connect = () =>
  mongoose
    .connect('mongodb://127.0.0.1:27017/cardsDB')
    .then(() => console.log('connected to db'))

    .catch((err) => console.log(err));

const cardSchema = new mongoose.Schema(
  {
    bizName: String,
    bizPhone: String,
    bizAddress: String,
    bizDescription: String,
    bizImage: String,
  },
  { collection: 'cards' }
);
const userSchema = new mongoose.Schema(
  {
    name: String,
    email: {
      type: String,
      unique: true,
      index: true,
    },
    password: String,
    isBiz: Boolean,
    token: String,
    date: { type: Date, default: Date.now },
  },
  { collection: 'users' }
);

const bizCard = mongoose.model('Card', cardSchema);
const User = mongoose.model('User', userSchema);
module.exports = { connect, bizCard, User };
