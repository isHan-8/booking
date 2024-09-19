const mongoose = require('mongoose');

//  booking schema
const bookingSchema = new mongoose.Schema({
  checkIn: Date,
  checkOut: Date,
  userId: String,
  ownerId: String,
  status: { type: String, default: 'Pending' },
});

//booking model
module.exports = mongoose.model('Booking', bookingSchema);
