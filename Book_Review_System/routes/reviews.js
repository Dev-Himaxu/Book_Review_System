const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Book = require('../models/Book');
const authMiddleware = require('../middleware/auth');

// Submit a review for a book (Authenticated users only)
router.post('/books/:id/reviews', authMiddleware, async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }

        const review = new Review({
            bookId: req.params.id,
            userId: req.user.id,
            rating: req.body.rating,
            comment: req.body.comment || ''
        });

        await review.save();
        book.reviews.push(review._id);
        await book.save();

        res.status(201).json(review);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: 'You have already reviewed this book' });
        }
        res.status(400).json({ error: error.message });
    }
});

// Update a review (Authenticated users, only their own review)
router.put('/reviews/:id', authMiddleware, async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }

        if (review.userId.toString() !== req.user.id) {
            return res.status(403).json({ error: 'You are not authorized to update this review' });
        }

        review.rating = req.body.rating || review.rating;
        review.comment = req.body.comment || review.comment;
        await review.save();

        res.json(review);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete a review (Authenticated users, only their own review)
router.delete('/reviews/:id', authMiddleware, async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }

        if (review.userId.toString() !== req.user.id) {
            return res.status(403).json({ error: 'You are not authorized to delete this review' });
        }

        await Review.deleteOne({ _id: req.params.id });
        await Book.updateOne(
            { _id: review.bookId },
            { $pull: { reviews: req.params.id } }
        );

        res.json({ message: 'Review deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;