const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },

    genre: { type: String, default: "" },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
  },
  { timestamps: true }
);
bookSchema.index({ title: 1, author: 1 }, { unique: true });
module.exports = mongoose.model("Book", bookSchema);
