const express = require("express");
const router = express.Router();
const Book = require("../models/Book");
const Review = require("../models/Review");
const authMiddleware = require("../middleware/auth");

// Add a new book (Authenticated users only)
router.post("/books", authMiddleware, async (req, res) => {
  try {
    const book = new Book(req.body);
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    if (error.message.includes("duplicate key error collection")){
        res.status(400).json({ error: "Book already exists" });
    } else {
        res.status(400).json({ error: error.message });
    }
  }
});

// Get all books with pagination and optional filters
router.get("/books", async (req, res) => {
  try {
    const { page = 1, limit = 10, author, genre } = req.query;

    const query = {};
    if (author) query.author = { $regex: new RegExp(author.trim(), "i") };
    if (genre) query.genre = { $regex: new RegExp(genre.trim(), "i") };

    const books = await Book.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Book.countDocuments(query);
    res.json({
      books,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get book details by ID, including average rating and reviews
router.get("/books/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate("reviews");
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    const reviews = await Review.find({ bookId: req.params.id })
      .populate("userId", "name")
      .limit(10); // Paginate reviews if needed

    const averageRating =
      reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        : 0;

    res.json({
      book,
      // averageRating,
      // reviews
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search books by title or author (case-insensitive)
router.get("/search", async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: "Query parameter is required" });
    }

    const books = await Book.find({
      $or: [
        { title: { $regex: q, $options: "i" } },
        { author: { $regex: q, $options: "i" } },
      ],
    });
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
