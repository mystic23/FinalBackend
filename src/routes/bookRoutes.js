const express = require('express');
const router = express.Router();

const bookController = require('../controllers/bookController');
const auth = require('../middleware/auth');
const requirePermission = require('../middleware/requirePermission');

router.get('/books', bookController.getBooks);
router.get('/books/:id', bookController.getBookById);
router.post('/books', auth, requirePermission('canCreateBooks'), bookController.createBook);
router.put('/books/:id', auth, requirePermission('canUpdateBooks'), bookController.updateBook);
router.patch('/books/:id/disable', auth, requirePermission('canDisableBooks'), bookController.disableBook);

module.exports = router;
