const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
  {username: "Ron", password: "pass"},
];

const isValid = (username)=>{ //returns boolean
 if (users.find(user => user.username == username)){
   return true;
  }else{ 
   return false;
 }
}

const authenticatedUser = (username,password)=>{ 
  if (isValid(username)){
    if (users[username].password == password){
      return true;
    }
  } 
  return false;
}


//only registered users can login
regd_users.post("/login", (req,res) => {
  let username = req.body.username;
  let password = req.body.password;
  if (authenticatedUser(username,password)){
    let token = jwt.sign({username: username}, "secret_key");
    return res.status(200).json({token: token});
  }
  return res.status(401).json({message: "Invalid credentials"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
