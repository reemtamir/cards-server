const express = require('express');
const router = express.Router();

const {
  createCard,
  getAllCards,
  updateCard,
  findCardById,
  deleteCard,
} = require('../service');

router.post('/create-card', createCard);
router.get('/my_cards', getAllCards);
router.get('/:id', findCardById);
router.put('/:id', updateCard);
router.delete('/:id', deleteCard);

module.exports = router;
