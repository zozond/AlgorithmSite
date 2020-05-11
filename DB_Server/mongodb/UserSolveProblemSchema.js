var mongoose = require("mongoose");
var autoIncrement = require('mongoose-auto-increment');

var Schema = mongoose.Schema({
    userId:{type: String, require: true}, // 유저 아이디
    problemName:{type:String, require: true}, // 유저가 푼 문제 이름
    state:{type: String}, // 상태
    solveCount: {type: Number},
    totalCount: {type: Number}
});

Schema.plugin(autoIncrement.plugin, {
    model:"user_solve_problem",
    field: 'uspId',
    startAt: 1,
    increment: 1
});

var USP = mongoose.model("user_solve_problem", Schema);
module.exports = USP;