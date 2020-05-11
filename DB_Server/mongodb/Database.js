var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

// DB setting
mongoose.set('useNewUrlParser', true);    // 1
mongoose.set('useFindAndModify', false);  // 1
mongoose.set('useCreateIndex', true);     // 1
mongoose.set('useUnifiedTopology', true); // 1

var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function () {
    console.log("Connected to mongod server");
});

// mongoose.connect("mongodb://root:mongodb@localhost:27017/test", {useNewUrlParser: true});
autoIncrement.initialize(mongoose.connection);
mongoose.connect("mongodb://localhost:27017", {useNewUrlParser: true})

module.exports = db;