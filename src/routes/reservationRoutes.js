const express = require('express');
const router = express.Router();

const reservationController = require('../controllers/reservationController');
const auth = require('../middleware/auth');

router.post('/reservas', auth, reservationController.createReservation);
router.get('/reservas/mias', auth, reservationController.getMyReservations);
router.get('/libros/:id/reservas', auth, reservationController.getReservationsByBook);

module.exports = router;
