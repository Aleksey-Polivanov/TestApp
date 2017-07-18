const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let userSchema = new Schema({
    login: {type: String, required: true, unique: true },
    passwordHash: {type: String, required: true},
    email: {type: String, default: 'empty'},
    phone: {type: String, default: 'empty'},
    name:  {type: String, default: 'empty'},
    role: {type: String, default: 'User'},
    books: [],
    created_at: Date,
    updated_at: Date
});

let User = mongoose.model('User', userSchema);

module.exports = User;