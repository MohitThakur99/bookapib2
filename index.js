require("dotenv").config();

// Frame work
const express = require("express");
const mongoose = require("mongoose");

// Database
const database = require("./database/database");

// Models
const BookModel = require("./database/book");
const AuthorModel = require("./database/author");
const PublicationModel = require("./database/publication");

// Initialization express

const booky = express();

// configuration
booky.use(express.json());

// Establish database connection
mongoose.connect(process.env.MONGO_URL,
).then(() => console.log("connection established!!!!!"));

/*
Route           /
Description     Get all books
Access          PUBLIC
Parameters      NONE
Methods         GET
*/

booky.get("/", async (req, res) => {
   const getAllBooks = await BookModel.find();
   return res.json(getAllBooks);
});

/*
Route           /
Description     Get specific books based on ISBN
Access          PUBLIC
Parameters      ISBN
Methods         GET
*/

booky.get("/is/:isbn", async (req, res) => {

   const getSpecificBook = await BookModel.findOne({ ISBN: req.params.isbn });

   // if mongoDB does not find any adata it returns null

   if (!getSpecificBook) {
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

booky.get("/c/:category", async (req, res) => {
   const getSpecificBook = await BookModel.findOne({
      category: req.params.category,
   });


   if (!getSpecificBook) {
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

booky.get("/author", async (req, res) => {
   const getAllAuthors = await AuthorModel.find();
   return res.json({ authors: getAllAuthors });
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

booky.post("/book/add", async (req, res) => {
   const { newBook } = req.body;

   const addNewBook = BookModel.create(newBook);

   return res.json({ message: "book was added!" });
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

booky.post("/author/add", async (req, res) => {
   const { newAuthor } = req.body;

   AuthorModel.create(newAuthor);

   return res.json({ message: "author was added!" });
});

/*
Route           /book/update/:isbn
Description     Update book title
Access          PUBLIC
Parameters      isbn
Methods         PUT
*/

booky.put("/book/update/:isbn", async (req, res) => {

   const updatedBook = await BookModel.findOneAndUpdate(
      {
         ISBN: req.params.isbn,
      },
      {
         title: req.body.newBookTitle,
      },
      {
         new: true, // to get updated data
      }
   );

   return res.json({ books: updatedBook });
});

/*
Route           /book/author/update
Description     update/add new author for a book
Access          PUBLIC
Parameters      isbn
Methods         PUT
*/

booky.put("/book/author/update/:isbn", async (req, res) => {
   //  update book database

   const updatedBook = await BookModel.findOneAndUpdate(
      {
         ISBN: req.params.isbn,
      },
      {
         $addToSet: {
            author: req.body.newAuthor,
         },
      },
      {
         new: true,
      }
   );

   // database.books.forEach((book) => {
   //    if (book.ISBN === req.params.isbn) {
   //       return book.author.push(parseInt(req.params.authorId));
   //    }
   // });

   // update author database

   const updatedAuthor = await AuthorModel.findOneAndUpdate(
      {
         id: req.body.newAuthor,
      },
      {
         $addToSet: {
            books: req.params.isbn,
         },
      },
      {
         new: true,
      }
   );

   // database.author.forEach((author) => {
   //    if (author.id === parseInt(req.params.authorId)) {
   //       return author.books.push(req.params.isbn);
   //    }
   // });

   return res.json({
      books: updatedBook,
      author: updatedAuthor,
      message: "New Author was added",
   });
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

booky.delete("/book/delete/:isbn", async (req, res) => {

   const updatedBookDatabase = await BookModel.findOneAndDelete({
      ISBN: req.params.isbn,
   });
   // const updatedBookDatabase = database.books.filter(
   //    (book) => book.ISBN !== req.params.isbn
   // );

   // database.books = updatedBookDatabase;
   return res.json({ books: database.books });
});

/*
Route           /book/delete/author
Description     delete an author from a book
Access          PUBLIC
Parameters      isbn, author id
Methods         DELETE
*/

booky.delete("/book/delete/author/:isbn/:authorId", async (req, res) => {
   // update the book database

   const updatedBook = await BookModel.findOneAndUpdate(
      {
         ISBN: req.params.isbn,
      },
      {
         $pull: {
            author: parseInt(req.params.authorId),
         },
      },
      {
         new: true,
      }
   );

   // database.books.forEach((book) => {
   //    if (book.ISBN === req.params.isbn) {
   //       const newAuthorList = book.author.filter(
   //          (authors) => authors !== parseInt(req.params.authorId)
   //       );

   //       book.author = newAuthorList;
   //       return;
   //    }
   // });

   // update the author database

   const updatedAuthor = await AuthorModel.findOneAndUpdate(
      {
         id: parseInt(req.params.authorId),
      },
      {
         $pull: {
            books: req.params.isbn,
         },
      },
      {
         new: true,
      }
      );
   // database.author.forEach((authors) => {
   //    if (authors.id === parseInt(req.params.authorId)) {
   //       const newBooksList = authors.books.filter(
   //          (book) => book !== req.params.isbn
   //       );

   //       authors.books = newBooksList;
   //       return;
   //    }
   // });

   return res.json({
      message: "author was deleted!!!!!",
      book: updatedBook,
      author: updatedAuthor,
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

booky.listen(3001, () => console.log("Hey Server is running!"));

