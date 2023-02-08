const express = require('express');
const router = express.Router();

const { signIn } = require('../service');

router.post('/', signIn);
module.exports = router;
