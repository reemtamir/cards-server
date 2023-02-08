const express = require('express');

const router = express.Router();
const { createUser, getUserByEmail } = require('../service');
router.post('/', createUser);
router.get('/user', getUserByEmail);

module.exports = router;
