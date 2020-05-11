var express = require('express'); // 설치한 express module을 불러와서 변수(express)에 담습니다.
var app = express(); //express를 실행하여 app object를 초기화 합니다.
var mongoose = require('./mongodb/Database.js');
var user = require('./mongodb/UserSchema');
var problem = require('./mongodb/ProblemSchema');
var usp = require('./mongodb/UserSolveProblemSchema');
var request = require('request');
const bodyParser = require("body-parser");

// mongoose.dropCollection("problem", (err) => {
//     console.log(err)
// })

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/views'));

// info
app.post('/api/info', function (req, res) {
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    ip = ip.replace('::ffff:', '');
    console.log("[/api/info] [" + new Date().toISOString() + "] [" + ip + "] " + "[START] " + JSON.stringify(req.body));

    user.findOne({ userId : req.body.userId }, function (err, resUser) {
        if (err) {
            console.log("[/api/info] [" + new Date().toISOString() + "] [" + ip + "] " + "[END] " + JSON.stringify(err));
            res.send({ isUser: false, error: err });
        }else{
            console.log("[/api/info] [" + new Date().toISOString() + "] [" + ip + "] " + "[END] " + JSON.stringify(resUser));
            if (resUser == null) {
                res.send({ isUser: false });
            } else {
                res.send({ isUser: true, userinfo: resUser });
            }
        }
    });
});


// login
app.post('/api/login', function (req, res) {
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    ip = ip.replace('::ffff:', '');
    console.log("[/api/login] [" + new Date().toISOString() + "] [" + ip + "] " + "[START] " + JSON.stringify(req.body));

    user.findOne({ userId : req.body.userId }, function (err, resUser) {
        if (err) {
            console.log("[/api/login] [" + new Date().toISOString() + "] [" + ip + "] " + "[END] " + JSON.stringify(err));
            res.send({ isUser: false, error: err });
        }
        
        console.log("[/api/login] [" + new Date().toISOString() + "] [" + ip + "] " + "[END] " + JSON.stringify(resUser));
        if (resUser == null) {
            res.send({ isUser: false });
        } else {
            if(resUser.userPassword == req.body.userPassword){
                res.send({ isUser: true });
            }else{
                res.send({ isUser: false });
            }
        }
    });
});

// 유저 등록
app.post('/api/user/register', function (req, res) {
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    ip = ip.replace('::ffff:', '');
    console.log("[/api/user/register] [" + new Date().toISOString() + "] [" + ip + "] " + "[START] " + JSON.stringify(req.body));

    var registerForm = req.body;
    // DB Insert
    user.create(registerForm, function (err) {
        if (err) {
            console.log("[/api/user/register] [" + new Date().toISOString() + "] [" + ip + "] " + "[END] " + JSON.stringify(err));
            res.send({ isResigtered: false, error: JSON.stringify(err) });
        } else {
            console.log("[/api/user/register] [" + new Date().toISOString() + "] [" + ip + "] " + "[END] Register Success");
            res.send({ isResigtered: true });
        }
    })
});

// 문제 등록
app.post('/api/problem/register', function (req, res) {
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    ip = ip.replace('::ffff:', '');
    console.log("[/api/problem/register] [" + new Date().toISOString() + "] [" + ip + "] " + "[START] " + JSON.stringify(req.body));

    var form = req.body;
    problem.create(form, function (err) {
        if (err) {
            console.log("[/api/problem/register] [" + new Date().toISOString() + "] [" + ip + "] " + "[ERR] " + JSON.stringify(err));
            res.send({ isResigtered: false, error: err });
        } else {
            console.log("[/api/problem/register] [" + new Date().toISOString() + "] [" + ip + "] " + "[END] Problem Register Success");
            res.send({ isResigtered: true });
        }
    })
});

// 문제 리스트 
app.post('/api/problemLists', function (req, res) {
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    ip = ip.replace('::ffff:', '');
    console.log("[/api/problemLists] [" + new Date().toISOString() + "] [" + ip + "] " + "[START] " + JSON.stringify(req.body));

    problem.find().select('problemName problemContent').then((resProblem) => {
        if( resProblem == null || resProblem.length == 0 ){
            console.log("[/api/problemLists] [" + new Date().toISOString() + "] [" + ip + "] " + "[END] Problem Lists is Empty");
            res.send({isEmpty: true})
        }else{
            console.log("[/api/problemLists] [" + new Date().toISOString() + "] [" + ip + "] " + "[END] " + JSON.stringify(resProblem));
            res.send({isEmpty: false, problem: resProblem});
        }
    }).catch((err) => {
        console.log("[/api/problemLists] [" + new Date().toISOString() + "] [" + ip + "] " + "[ERR] " + JSON.stringify(req.body));
            res.send({isEmpty: true, error: JSON.stringify(err)})
    } );

    // problem.find({}, function (err, resProblem) {
    //     if (err) {
    //         console.log("[/api/problemLists] [" + new Date().toISOString() + "] [" + ip + "] " + "[ERR] " + JSON.stringify(req.body));
    //         res.send({isEmpty: true, error: JSON.stringify(err)})
    //     }else if( resProblem == null || resProblem.length == 0 ){
    //         console.log("[/api/problemLists] [" + new Date().toISOString() + "] [" + ip + "] " + "[END] Problem Lists is Empty");
    //         res.send({isEmpty: true})
    //     }else{
    //         console.log("[/api/problemLists] [" + new Date().toISOString() + "] [" + ip + "] " + "[END] " + JSON.stringify(resProblem));
    //         res.send({isEmpty: false, problem: resProblem});
    //     }
    // });
});

// 문제리스트에서 문제 가져오기
app.post('/api/problem', function (req, res) {
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    ip = ip.replace('::ffff:', '');
    console.log("[/api/problem] [" + new Date().toISOString() + "] [" + ip + "] " + "[START] " + JSON.stringify(req.body));
    console.log(req.body)

    problem.findOne({ problemName: req.body.problemName }, function (err, resProblem) {
        if (err) {
            console.log("[/api/problem] [" + new Date().toISOString() + "] [" + ip + "] " + "[ERR] " + JSON.stringify(req.body));
            res.send({isEmpty: true, error: JSON.stringify(err)})
        }else if( resProblem == null || resProblem.length == 0 ){
            console.log("[/api/problem] [" + new Date().toISOString() + "] [" + ip + "] " + "[END] Problem Lists is Empty");
            res.send({isEmpty: true})
        }else{
            console.log("[/api/problem] [" + new Date().toISOString() + "] [" + ip + "] " + "[END] " + JSON.stringify(resProblem));
            res.send({isEmpty: false, problem: resProblem});
        }
    });
});

// 유저가 문제를 풀었을 때
app.post('/api/solve/update', function (req, res) {
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    ip = ip.replace('::ffff:', '');
    console.log("[/api/solve/update] [" + new Date().toISOString() + "] [" + ip + "] " + "[START] " + JSON.stringify(req.body));
    
    usp.findOne({ userId: req.body.userId, problemName: req.body.problemName }, function (err, resSolve) {
        if (err) {
            console.log("[/api/solve/update] [" + new Date().toISOString() + "] [" + ip + "] " + "[ERR] " + JSON.stringify(req.body));
            res.send(true);
        }else{
            if(resSolve == null){                
                var form = req.body;
                usp.create(form, function (err) {
                    if (err) {
                        console.log("[/api/solve/update] [" + new Date().toISOString() + "] [" + ip + "] " + "[ERR] Created " + JSON.stringify(req.body));
                        res.send(false);
                    } else {
                        console.log("[/api/solve/update] [" + new Date().toISOString() + "] [" + ip + "] " + "[END] Created " + JSON.stringify(req.body));
                        res.send(true);
                    }
                })
            }else{
                if(resSolve.state == "finish"){
                    console.log(resSolve)
                    usp.findOneAndUpdate({ userId: req.body.userId, problemName: req.body.problemName }, {solveCount: req.body.solveCount, state: req.body.state}, function (err, resProblem) {
                        if (err) {
                            console.log("[/api/solve/update] [" + new Date().toISOString() + "] [" + ip + "] " + "[ERR] " + JSON.stringify(req.body));
                            res.send(false);
                        }else{        
                            console.log("[/api/solve/update] [" + new Date().toISOString() + "] [" + ip + "] " + "[END] " + JSON.stringify(resProblem));
                            res.send(true);
                        }
                    });
                }else{
                    console.log(resSolve)
                    usp.findOneAndUpdate({ userId: req.body.userId, problemName: req.body.problemName }, {solveCount: resSolve.solveCount + req.body.solveCount, state: req.body.state}, function (err, resProblem) {
                        if (err) {
                            console.log("[/api/solve/update] [" + new Date().toISOString() + "] [" + ip + "] " + "[ERR] " + JSON.stringify(req.body));
                            res.send(false);
                        }else{        
                            console.log("[/api/solve/update] [" + new Date().toISOString() + "] [" + ip + "] " + "[END] " + JSON.stringify(resProblem));
                            res.send(true);
                        }
                    });
                }
            }
        }
    });
});


var port = 3100; // 사용할 포트 번호를 port 변수에 넣습니다. 
app.listen(port, function () { // port변수를 이용하여 3000번 포트에 node.js 서버를 연결합니다.
    console.log('server on! http://localhost:' + port); //서버가 실행되면 콘솔창에 표시될 메세지입니다.
});