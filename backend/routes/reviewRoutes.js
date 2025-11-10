const express = require('express');
const router = express.Router();
const Review = require('../models/review');
const { protect } = require('../middleware/authMiddleware');

// Get all reviews for a menu item
router.get('/menu/:menuItemId', async (req, res) => {
    try {
        const reviews = await Review.find({ menuItem: req.params.menuItemId })
            .populate('user', 'name')
            .sort('-createdAt');
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add a new review
router.post('/', protect, async (req, res) => {
    try {
        const { menuItemId, rating, comment } = req.body;
        
        // Check if user has already reviewed this item
        const existingReview = await Review.findOne({
            user: req.user._id,
            menuItem: menuItemId
        });

        if (existingReview) {
            return res.status(400).json({ message: 'You have already reviewed this item' });
        }

        const review = new Review({
            user: req.user._id,
            menuItem: menuItemId,
            rating,
            comment
        });

        const savedReview = await review.save();
        await savedReview.populate('user', 'name');
        
        res.status(201).json(savedReview);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update a review
router.put('/:id', protect, async (req, res) => {
    try {
        const review = await Review.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        const { rating, comment } = req.body;
        review.rating = rating;
        review.comment = comment;

        const updatedReview = await review.save();
        await updatedReview.populate('user', 'name');
        
        res.json(updatedReview);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a review
router.delete('/:id', protect, async (req, res) => {
    try {
        const review = await Review.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        await review.remove();
        res.json({ message: 'Review deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;