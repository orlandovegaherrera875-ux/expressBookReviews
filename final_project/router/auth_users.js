const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    let filteredusers = users.filter((user) => user.username === username);
    if (filteredusers.length > 0) {
      return true;
    } else {
      return false;
    }
  }
  
  const authenticatedUser = (username,password)=>{ //returns boolean
    let validusers = users.filter((user) => {
      return (user.username === username && user.password === password);
    });
    if (validusers.length > 0) {
      return true;
    } else {
      return false;
    }
  }
  
  // Register a new user
  regd_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      if (!isValid(username)) {
        users.push({"username": username, "password": password});
        return res.status(200).json({message: "Customer successfully registered. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});
      }
    }
    return res.status(404).json({message: "Unable to register user."});
  });

// Only registered users can login
regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
      return res.status(404).json({ message: "Error logging in" });
    }
  
    if (authenticatedUser(username, password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 });
  
      req.session.authorization = {
        accessToken,
        username
      };
      return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
  });
// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session.authorization['username'];
  
    if (!review) {
      return res.status(400).json({ message: "Review content cannot be empty" });
    }
  
    if (books[isbn]) {
      let bookReviews = books[isbn].reviews;
      bookReviews[username] = review;
      return res.status(200).json({ message: `The review for the book with ISBN ${isbn} has been added/updated successfully.` });
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  });

  // Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization['username'];
  
    if (books[isbn]) {
      let bookReviews = books[isbn].reviews;
      if (bookReviews[username]) {
        delete bookReviews[username];
        return res.status(200).json({ message: `Reviews for the ISBN ${isbn} posted by the user ${username} deleted successfully.` });
      } else {
        return res.status(404).json({ message: "Review not found for this user" });
      }
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
