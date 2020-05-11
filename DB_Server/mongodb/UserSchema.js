var mongoose = require("mongoose");
var autoIncrement = require('mongoose-auto-increment');

var userSchema = mongoose.Schema({
    userId: { type: String, unique: true, require: true },
    userPassword: { type: String, require: true},
    userName: { type: String, require: true},
    userEmail: { type: String }
});

userSchema.plugin(autoIncrement.plugin, 'user');
var User = mongoose.model("user", userSchema);
module.exports = User;