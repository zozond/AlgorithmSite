var mongoose = require("mongoose");
var autoIncrement = require('mongoose-auto-increment');
var problemSchema = mongoose.Schema({
    problemName: { type: String, unique: true, require: true },
    problemContent: { type: String, require: true },
    problemTestInput: { type: String },
    problemTestOutput: { type: String },
    problemInputCase: { type: String },
    problemOutputCase: { type: String },
    problemLimitSecond: { type: Number },
    problemLimitMemory: { type: String },
    problemSubmitCount: { type: Number },
    problemSuccess: { type: Number },
    problemSuccessRatio: { type: String }
});

problemSchema.plugin(autoIncrement.plugin, {
    model: "problem",
    field: 'problemId',
    default: 1,
    startAt: 1,
    increment: 1
});
var Problem = mongoose.model("problem", problemSchema);

// var custom = new Problem();

// custom.save(function (err) {
//     custom.problemId = 0;
//     custom.nextCount(function (err, count) {
//         count = 0;
//         custom.resetCount(function (err, nextCount) {
//             nextCount = 0;
//         });
//     });
// });

module.exports = Problem;