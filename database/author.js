const mongoose = require("mongoose");

// Author Schema
const AuthorSchema = mongoose.mongoose({
    id: Number,
    name: String,
    books: [String]
});

// Create a Author model
const AuthorModel = mongoose.model(AuthorSchema);

module.exports = AuthorModel;