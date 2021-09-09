require("dotenv").config();

// Frame work
const express = require("express");
const mongoose = require("mongoose");

// Database
const database = require("./database/database");

// Models
const BookModels = require("./database/book");
const AuthorModels = require("./database/author");
const PublicationModels = require("./database/publication");

// Initialization express

const booky = express();

// configuration
booky.use(express.json());

// Establish database connection
 mongoose.connect(
   process.env.MONGO_URL,
).then(() => console.log("connection established!!!!!!"));

/*
Route           /
Description     Get all books
Access          PUBLIC
Parameters      NONE
Methods         GET
*/

booky.get("/", (req, res) => {
   // change this line
   return res.json({ books: database.books });
});

/*
Route           /
Description     Get specific books based on ISBN
Access          PUBLIC
Parameters      ISBN
Methods         GET
*/

booky.get("/is/:isbn", (req, res) => {
   const getSpecificBook = database.books.filter(
      (book) => book.ISBN === req.params.isbn
   );

   if (getSpecificBook.length === 0) {
      return res.json({
         error: `No book found for the ISBN of ${req.params.isbn}`,
      });
   }

   return res.json({ book: getSpecificBook });
});

/*
Route           /c
Description     Get specific books based on category
Access          PUBLIC
Parameters      category
Methods         GET
*/

booky.get("/c/:category", (req, res) => {
   const getSpecificBook = database.books.filter((book) =>
      book.category.includes(req.params.category)
      // includes compare for book category array so that a match is found it gives true
   );

   if (getSpecificBook.length === 0) {
      return res.json({
         error: `No book found for the category of ${req.params.category}`,
      });
   }

   return res.json({ book: getSpecificBook });
});

/*
Route           /author
Description     get all authors
Access          PUBLIC
Parameters      category
Methods         GET
*/

booky.get("/author", (req, res) => {
   return res.json({ authors: database.author });
});

/*
Route           /author/book
Description     get all authors  based on books
Access          PUBLIC
Parameters      isbn
Methods         GET
*/

booky.get("/author/book/:isbn", (req, res) => {
   const getSpecificAuthor = database.author.filter((author) =>
      author.books.includes(req.params.isbn)
   );

   if (getSpecificAuthor.length === 0) {
      return res.json({
         error: `No Author found for the isbn of ${req.params.isbn}`,
      });
   }

   return res.json({ authors: getSpecificAuthor });
});

/*
Route           /publications
Description     get all publications
Access          PUBLIC
Parameters      NONE
Methods         GET
*/

booky.get("/publications", (req, res) => {
   return res.json({ publications: database.publication });
});

/*
Route           /book/add
Description     add new book
Access          PUBLIC
Parameters      NONE
Methods         POST
*/

booky.post("/book/add", (req, res) => {
   const { newBook } = req.body;

   database.books.push(newBook);
   return res.json({ books: database.books });
});

// Browser can only perform GET Request no other one
// for other we need a client

// HTTP client -> helper who helps to make http request


/*
Route           /author/add
Description     add new author
Access          PUBLIC
Parameters      NONE
Methods         POST
*/

booky.post("/author/add", (req, res) => {
   const { newAuthor } = req.body;

   database.author.push(newAuthor);
   return res.json({ authors: database.author });
});

/*
Route           /book/update/title/:isbn
Description     Update book title
Access          PUBLIC
Parameters      isbn
Methods         PUT
*/

booky.put("/book/update/title/:isbn", (req, res) => {
   database.books.forEach((book) => {
      if (book.ISBN === req.params.isbn) {
         book.title = req.body.newBookTitle;
         return;
      }
   });

   return res.json({ books: database.books });
});

/*
Route           /book/update/author
Description     update/add new author for a book
Access          PUBLIC
Parameters      isbn
Methods         PUT
*/

booky.put("/book/update/author/:isbn/:authorId", (req, res) => {
   // update book database

   database.books.forEach((book) => {
      if (book.ISBN === req.params.isbn) {
         return book.author.push(parseInt(req.params.authorId));
      }
   });

   // update author database

   database.author.forEach((author) => {
      if (author.id === parseInt(req.params.authorId)) {
         return author.books.push(req.params.isbn);
      }
   });

   return res.json({ books: database.books, author: database.author });
});

/*
Route           /publication/update/book
Description     update/add new book to a publication
Access          PUBLIC
Parameters      isbn
Methods         PUT
*/

booky.put("/publication/update/book/:isbn", (req, res) => {
   // update the publication database
   database.publication.forEach((publications) => {
      if (publications.id === req.body.pubId) {
         return publications.books.push(req.params.isbn);
      }
   });

   // update the book database
   database.books.forEach((book) => {
      if (book.ISBN === req.params.isbn) {
         book.publications = req.body.pubId;
         return;
      }
   });

   return res.json({
      books: database.books,
      publication: database.publication,
      message: "Successfully updated publication",
   });
});

/*
Route           /book/delete
Description     delete a book
Access          PUBLIC
Parameters      isbn
Methods         DELETE
*/

booky.delete("/book/delete/:isbn", (req, res) => {
   const updatedBookDatabase = database.books.filter(
      (book) => book.ISBN !== req.params.isbn
   );

   database.books = updatedBookDatabase;
   return res.json({ books: database.books });
});

/*
Route           /book/delete/author
Description     delete an author from a book
Access          PUBLIC
Parameters      isbn, author id
Methods         DELETE
*/

booky.delete("/book/delete/author/:isbn/:authorId", (req, res) => {

   // update the book database
   database.books.forEach((book) => {
      if (book.ISBN === req.params.isbn) {
         const newAuthorList = book.author.filter(
            (authors) => authors !== parseInt(req.params.authorId)
         );

         book.author = newAuthorList;
         return;
      }
   });

   // update the author database
   database.author.forEach((authors) => {
      if (authors.id === parseInt(req.params.authorId)) {
         const newBooksList = authors.books.filter(
            (book) => book !== req.params.isbn
         );

         authors.books = newBooksList;
         return;
      }
   });

   return res.json({
      message: "author was deleted!!!!!",
      book: database.books,
      author: database.author,
   });
});

/*
Route           /publication/delete/book
Description     delete a book from publication 
Access          PUBLIC
Parameters      isbn, publication id
Methods         DELETE
*/

booky.delete("/publication/delete/book/:isbn/:pubId", (req, res) => {
   // update publication database
   database.publication.forEach((publications) => {
      if (publications.id === parseInt(req.params.pubId)) {
         const newBooksList = publications.books.filter(
            (book) => book !== req.params.isbn
         );

         publications.books = newBooksList;
         return;
      }
   });

   // update book database
   database.books.forEach((book) => {
      if (book.ISBN === req.params.isbn) {
         book.publications = 0; // no publication available
         return;
      }
   });

   return res.json({
      books: database.books,
      publications: database.publication,
   });
});

booky.listen(3000, () => console.log("Hey Server is running!"));

