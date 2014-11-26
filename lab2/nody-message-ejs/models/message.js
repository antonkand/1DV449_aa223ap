var mongoose = require('mongoose');
var Message = mongoose.Schema({
    user: String,
    message: String,
    date: Date
});

module.exports = mongoose.model('Message', Message);