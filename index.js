require('dotenv').config();

const express = require('express');
const { connect } = require('./db');
const userRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const cardsRouter = require('./routes/cards');

const cors = require('cors');

const app = express();
const PORT = 3000;
connect();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded());

app.use('/users', userRouter);
app.use('/auth', authRouter);
app.use('/cards', cardsRouter);

app.listen(PORT, () => console.log(`listening in port ${PORT}`));
