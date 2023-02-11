const express = require('express');
const authMW = require('../middlewares/auth');
const _ = require('lodash');
const router = express.Router();
const { createUser, getUser } = require('../service');
router.post('/', createUser);
router.get('/me', authMW, getUser);

module.exports = router;
