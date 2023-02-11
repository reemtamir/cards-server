const express = require('express');
const router = express.Router();
const authMW = require('../middlewares/auth');
const {
  createCard,
  getAllCards,
  updateCard,
  findCardById,
  deleteCard,
} = require('../service');

router.post('/', authMW, createCard);
router.get('/my_cards', authMW, getAllCards);
router.get('/:id', authMW, findCardById);
router.put('/:id', authMW, updateCard);
router.delete('/:id', authMW, deleteCard);

module.exports = router;
