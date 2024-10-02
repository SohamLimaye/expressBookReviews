const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  // Check if the username is valid
  return users.some(user => user.username === username);
}

const authenticatedUser = (username, password) => {
  // Check if username and password match the one we have in records
  return users.some(user => user.username === username && user.password === password);
}

// Only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (!isValid(username)) {
    return res.status(401).json({ message: "Invalid username" });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid password" });
  }

  // Generate JWT token
  const token = jwt.sign({ username }, 'fingerprint_customer', { expiresIn: '1h' });

  // Save the user credentials in the session
  req.session.user = { username, token };

  return res.status(200).json({ message: "Login successful", token });
});

regd_users.delete("/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { username } = req.session.user;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  const book = books[isbn];
  if (!book.reviews) {
    return res.status(404).json({ message: "No reviews found for this book" });
  }

  const reviewIndex = book.reviews.findIndex(review => review.username === username);

  if (reviewIndex === -1) {
    return res.status(404).json({ message: "Review not found" });
  }

  book.reviews.splice(reviewIndex, 1);
  return res.status(200).json({ message: "Review deleted successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;