const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
 if (users.find(user => user.username == username)){
   return true;
  }else{ 
   return false;
 }
}

const authenticatedUser = (username,password)=>{ 
  if (isValid(username)){
    let user = users.find(user => user.username == username);
    if (user.password == password){
      return true;
    }
  } 
  return false;
}


//only registered users can login
regd_users.post("/login", (req,res) => {
  let username = req.body.username;
  let password = req.body.password;
  if (!username || !password){
    return res.status(400).json({message: "Username and password required"});
  }
  if (authenticatedUser(username,password)){
    let token = jwt.sign({username: username}, "secret_keyx");
    req.session.user = token;
    return res.status(200).json({message: "Login successful", token: token});
  }
  return res.status(401).json({message: "Invalid credentials"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;
  let review = req.body.review;
  let token = req.session.user;
  if (!review){
    return res.status(400).json({message: "Review required"});
  }
  jwt.verify(token, "secret_keyx", (err, user) => {
    if (err){
      return res.status(401).json({message: "Unauthorized access"});
    }
    if (books[isbn]){
      books[isbn].reviews[user.username] = review;
      return res.status(200).json({message: "Review added"});
    }else{
      return res.status(404).json({message: "Book not found"});
    }
  });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;
  let token = req.session.user;
  jwt.verify(token, "secret_keyx", (err, user) => {
    if (err){
      return res.status(401).json({message: "Unauthorized access"});
    }
    if (books[isbn]){
      if (!books[isbn].reviews[user.username]){
        return res.status(404).json({message: "Review not found"});
      }
      delete books[isbn].reviews[user.username]; 
      return res.status(200).json({message: "Review deleted"});
    }else{
      return res.status(404).json({message: "Book not found"});
    }
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
