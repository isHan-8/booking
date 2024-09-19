const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking'); // Ensure the path is correct

// Create a booking
router.post('/', async (req, res) => {
  const { checkIn, checkOut, userId, ownerId } = req.body;

  if (!checkIn || !checkOut || !userId || !ownerId) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const newBooking = new Booking({
      checkIn,
      checkOut,
      userId,
      ownerId,
    });

    const savedBooking = await newBooking.save();
    res.status(201).json({ message: 'Booking confirmed!', booking: savedBooking });
  } catch (error) {
    res.status(500).json({ message: 'Error creating booking.', error });
  }
});

// Approve a booking
router.post('/approve', async (req, res) => {
  const { requestId } = req.body;

  try {
    const booking = await Booking.findById(requestId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    if (booking.status === 'Approved') {
      return res.status(400).json({ message: 'Booking is already approved.' });
    }

    booking.status = 'Approved';
    await booking.save();

    res.json({ message: 'Booking approved.', booking });
  } catch (error) {
    res.status(500).json({ message: 'Error approving booking.', error });
  }
});

// Get all bookings for debugging
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving bookings.', error });
  }
});

module.exports = router;
