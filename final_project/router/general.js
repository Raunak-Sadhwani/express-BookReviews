const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  let username = req.body.username;
  let password = req.body.password;
  if (!username || !password){
    return res.status(400).json({message: "Username and password required"});
  }
  if (isValid(username)){
    return res.status(400).json({message: "User already exists"});
  }
  users.push({username: username, password: password});
  return res.status(200).json({message: "User created"});
});

// Get the book list available in the shop
public_users.get('/',async function (req, res)  {
  let bookList = await books;
  return await res.status(200).json(bookList);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
 let isbn = await req.params.isbn;
  let book = books[isbn];
  if(book){
    return await res.status(200).json(book);
  }else{
    return await res.status(404).json({message: "Book not found"});
  }
});
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
  let author = await req.params.author;
  let bookList = [];
  for(let i in books){
    if(books[i].author == author){
      bookList.push(books[i]);
    }
  }
  if(bookList.length > 0){
    return await res.status(200).json(bookList);
  } else {
    return await res.status(404).json({message: "Author not found"});
  }
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
  let title = await req.params.title;
  let bookList = [];
  for(let i in books){
    if(books[i].title == title){
      bookList.push(books[i]);
    }
  }
  if(bookList.length > 0){
    return await res.status(200).json(bookList);
  } else {
    return await res.status(404).json({message: "Title not found"});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  let book = books[isbn];
  if(book){
    return res.status(200).json(book.reviews);
  }else{
    return res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;
