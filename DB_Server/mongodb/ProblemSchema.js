var mongoose = require("mongoose");
var autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema({
    problemId:{type:Number, unique:true, require: true},
    problemName:{type:String, unique:true, require: true},
    problemContent:{type:String, require: true},
    problemTestInput:{type:String},
    problemTestOutput:{type:String},
    problemInputCase:{type:String},
    problemOutputCase:{type:String},
});

var Problem = mongoose.model("problem", Schema);
module.exports = Problem;