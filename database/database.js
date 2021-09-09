let books = [
    {
        ISBN: "12345Book",
        title: "Getting started with MERN",
        pubDate: "2021-07-07",
        language: "en",
        numPage: "250",
        author: [1, 2],
        publications: 1,
        category: ["tech", "programming", "education", "thriller"],
    },
    {
        ISBN: "12345Two",
        title: "Getting started with Python",
        pubDate: "2021-07-07",
        language: "en",
        numPage: "225",
        author: [1, 2],
        publications: 1,
        category: ["fiction", "tech", "web dev"],
    },
];

const author = [
    {
        id: 1,
        name: "Mohit",
        books: ["12345Book", "123456789Secret"]
    },
    {
        id: 2,
        name: "Elon Musk",
        books: ["12345Book"],
    },
];

const publication = [
    {
        id: 1,
        name: "writex",
        books: ["12345Book"],
    },
    {
        id: 2,
        name: "Yodi",
        books: [],
    },
];

module.exports = { books, author, publication };