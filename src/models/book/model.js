const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let bookSchema = new Schema({
    author: { type: String, required: true},
    name: { type: String, required: true, unique: true},
    userID: {type: String, default: 'empty'},
    userName: {type: String, default: 'empty'},
    created_at: Date,
    updated_at: Date
});

let Book = mongoose.model('Book', bookSchema);

module.exports = Book;