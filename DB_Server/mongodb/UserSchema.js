var mongoose = require("mongoose");
var autoIncrement = require('mongoose-auto-increment');

var userSchema = mongoose.Schema({
    userId: { type: String, unique: true, require: true },
    userPassword: { type: String, require: true},
    userEmail: { type: String, require: true },
    userMessage: { type: String },
    userCompany: { type: String },
    userRank: { type: Number },
    userSuccess: { type: Number },
    userFailed: { type: Number }
});

userSchema.plugin(autoIncrement.plugin, {
    model:"user",
    field: 'id',
    startAt: 1,
    increment: 1
});

var User = mongoose.model("user", userSchema);
module.exports = User;