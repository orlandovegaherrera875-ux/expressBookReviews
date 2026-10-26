const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
      return res.status(200).send(JSON.stringify(books[isbn], null, 4));
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  });
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    let booksByAuthor = [];
    let keys = Object.keys(books);
    
    keys.forEach((key) => {
      if (books[key].author.toLowerCase() === author.toLowerCase()) {
        booksByAuthor.push(books[key]);
      }
    });
  
    if (booksByAuthor.length > 0) {
      return res.status(200).send(JSON.stringify(booksByAuthor, null, 4));
    } else {
      return res.status(404).json({ message: "Author not found" });
    }
  });

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    let booksByTitle = [];
    let keys = Object.keys(books);
  
    keys.forEach((key) => {
      if (books[key].title.toLowerCase() === title.toLowerCase()) {
        booksByTitle.push(books[key]);
      }
    });
  
    if (booksByTitle.length > 0) {
      return res.status(200).send(JSON.stringify(booksByTitle, null, 4));
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  });

// Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
      return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  });

// Task 10: Get all books using async-await with Axios
public_users.get('/async-books', async function (req, res) {
    try {
      const response = await axios.get('http://localhost:5000/');
      return res.status(200).json(response.data);
    } catch (error) {
      return res.status(500).json({ message: "Error fetching books" });
    }
  });
module.exports.general = public_users;
