const mongoose = require("mongoose");

// Author Schema
const AuthorSchema = mongoose.Schema({
    id: Number,
    name: String,
    books: [String]
});

// Create a Author model
const AuthorModel = mongoose.model("authors", AuthorSchema);

module.exports = AuthorModel;