var mongoose = require('mongoose');

// ===============================
// User Schema

var UserSchema = new mongoose.Schema({
  username: {type: String, lowercase: true, unique: true},
  hash: String,
  salt: String
});

var User = mongoose.model('User', UserSchema);

module.exports = User;
