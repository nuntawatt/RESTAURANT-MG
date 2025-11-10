const express = require('express');
const router = express.Router();
const Reservation = require('../models/reservation');
const { protect } = require('../middleware/authMiddleware');

// Get all reservations for a user
router.get('/my', protect, async (req, res) => {
    try {
        const reservations = await Reservation.find({ user: req.user._id })
            .sort('-date');
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create new reservation
router.post('/', protect, async (req, res) => {
    try {
        const { date, time, guests } = req.body;
        
        // Check if there's already a reservation at the same time
        const existingReservation = await Reservation.findOne({
            date,
            time,
            status: { $ne: 'cancelled' }
        });

        if (existingReservation) {
            return res.status(400).json({ message: 'This time slot is already booked' });
        }

        const reservation = new Reservation({
            user: req.user._id,
            date,
            time,
            guests,
            status: 'pending'
        });

        const savedReservation = await reservation.save();
        res.status(201).json(savedReservation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update reservation
router.put('/:id', protect, async (req, res) => {
    try {
        const reservation = await Reservation.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }

        if (reservation.status === 'confirmed') {
            return res.status(400).json({ message: 'Cannot modify confirmed reservation' });
        }

        const { date, time, guests } = req.body;
        
        // Check if new time slot is available
        if (date !== reservation.date || time !== reservation.time) {
            const existingReservation = await Reservation.findOne({
                date,
                time,
                status: { $ne: 'cancelled' },
                _id: { $ne: req.params.id }
            });

            if (existingReservation) {
                return res.status(400).json({ message: 'This time slot is already booked' });
            }
        }

        reservation.date = date;
        reservation.time = time;
        reservation.guests = guests;

        const updatedReservation = await reservation.save();
        res.json(updatedReservation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Cancel reservation
router.delete('/:id', protect, async (req, res) => {
    try {
        const reservation = await Reservation.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }

        if (reservation.status === 'confirmed') {
            return res.status(400).json({ message: 'Cannot cancel confirmed reservation' });
        }

        reservation.status = 'cancelled';
        await reservation.save();
        
        res.json({ message: 'Reservation cancelled successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get available time slots for a date
router.get('/available/:date', async (req, res) => {
    try {
        const date = req.params.date;
        const bookedTimes = await Reservation.find({
            date,
            status: { $ne: 'cancelled' }
        }).select('time -_id');

        // Generate all possible time slots (e.g., from 11:00 to 22:00)
        const allTimeSlots = [];
        for (let hour = 11; hour <= 21; hour++) {
            allTimeSlots.push(`${hour}:00`);
            allTimeSlots.push(`${hour}:30`);
        }

        // Filter out booked times
        const bookedTimesList = bookedTimes.map(r => r.time);
        const availableTimeSlots = allTimeSlots.filter(
            time => !bookedTimesList.includes(time)
        );

        res.json(availableTimeSlots);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;