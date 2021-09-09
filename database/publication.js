const mongoose = require("mongoose");

// Publication Schema
const PublicationSchema = mongoose.mongoose({
    id: Number,
    name: String,
    books: [String]
});

// Create a Publication model
const PublicationModel = mongoose.model(PublicationSchema);

module.exports = PublicationModel;  