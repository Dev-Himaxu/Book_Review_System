# Book Review API

A RESTful API built with Node.js and Express for managing books and reviews. This project implements user authentication using JWT and supports CRUD operations for books and reviews.

## Tech Stack

- **Node.js** with **Express.js** for API development
- **MongoDB** with **Mongoose** for data storage
- **JWT** (JSON Web Token) for user authentication
- **dotenv** for environment variable management

## Features

- User authentication with signup and login endpoints returning JWT tokens
- CRUD operations for books (Authenticated users can add books)
- Retrieve books with pagination and optional filters (author, genre)
- Search books by title or author (case-insensitive partial search)
- Submit, update, and delete reviews for books (Authenticated users only, one review per user per book)
- View book details including average rating and paginated reviews

## Database Schema

### User

- `email`: String (unique, required)
- `password`: String (hashed, required)
- `name`: String (required)

### Book

- `title`: String (required)
- `author`: String (required)
- `genre`: String (optional)
- `reviews`: Array of Review IDs (references)

### Review

- `bookId`: ObjectId (reference to Book, required)
- `userId`: ObjectId (reference to User, required)
- `rating`: Number (1-5, required)
- `comment`: String (optional)

## Prerequisites

- **Node.js**: Version 16 or higher
- **MongoDB**: Local installation or a cloud instance (e.g., MongoDB Atlas)
- **Postman**: For testing API endpoints (optional, can also use curl or other tools)

## Setup Instructions

Follow these steps to set up and run the project locally on your machine.

### 1. Clone the Repository

Clone this repository to your local machine using:

````bash
git clone <your-repo-link>
cd <your-project-directory>

### 2. Open the Project in Visual Studio Code
Open the project in Visual Studio Code.

### 3. Install Dependencies
```bash
npm install
````

### 4. Start the Server

```bash
npm start
```

### 6. API Documentation

📚 API Endpoints
All routes are prefixed with /api
Base URL: http://localhost:5000/api

🔐 Authentication
POST /signup
Register a new user.

POST /login
Authenticate user and receive a JWT token.

📘 Books
POST /books
Add a new book.


GET /books
Get all books. Supports pagination and filters.

GET /books/:id
Get book details by ID. Includes average rating and paginated reviews.

📝 Reviews
POST /books/:id/reviews
Submit a review for a book.

PUT /reviews/:id
Update your own review.

DELETE /reviews/:id
Delete your own review.

🔍 Search
GET /search
Search books by title or author (partial and case-insensitive).

