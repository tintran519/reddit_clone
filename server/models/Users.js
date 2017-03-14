var mongoose  = require('mongoose');
var crypto    = require('crypto');
var jwt       = require('jsonwebtoken');
var topSecret = env.topSecret;

// ===============================
// User Schema

var UserSchema = new mongoose.Schema({
  username: {type: String, lowercase: true, unique: true},
  hash: String,
  salt: String
});

// Accepts pw then generates salt associated with pw hash
UserSchema.methods.setPassword = function(password){
  this.salt = crypto.randomBytes(16).toString('hex');

  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

// Accepts pw and compares it to the hash stored, returning boolean
UserSchema.methods.validPassword = function(password){
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');

  return this.hash === hash;
}

// Generate JWT
UserSchema.methods.generateJWT = function(){

  // expiration = 60 days
  var today = new Date();
  var exp = new Date(today);
  exp.setDate(today.getDate() + 60);

  return jwt.sign({
    _id: this._id,
    username: this.username,
    exp: parseInt(exp.getTime()/1000)
  }, topSecret);
}

var User = mongoose.model('User', UserSchema);

module.exports = User;
