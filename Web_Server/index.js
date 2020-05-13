var express = require('express'); // 설치한 express module을 불러와서 변수(express)에 담습니다.
const session = require('express-session');
var app = express(); //express를 실행하여 app object를 초기화 합니다.
var request = require('request');
var fs = require('fs');
var exec = require("child_process").exec;
var utf8 = require('utf8');
const axios = require('axios').default;

const bodyParser = require("body-parser");

app.set('view engine', 'ejs'); // 1
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json({ type: 'application/x-www-form-urlencoded' }));
app.use("/public", express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/views'));
app.use(session({
  secret: "My secret code here!",
  resave: true,
  saveUninitialized: false,
  cookie: { maxAge: 3600000 },
}));

//ejs test
app.get('/hello', function (req, res) {
  res.render('main', { name: req.query.nameQuery, isRoot: req.session.userId == "root" ? true : false });
});
app.get('/hello/:nameParam', function (req, res) {
  res.render('main', { name: req.params.nameParam, isRoot: req.session.userId == "root" ? true : false });
});

// URL
app.get('/', function (req, res) {
  res.render('index', { isRoot: req.session.userId == "root" ? true : false, isUser: req.session.userId != null ? true : false });
});


// User Info 
app.get('/info', function (req, res) {
  let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress; ip = ip.replace('::ffff:', '');
  console.log("[/info] [" + new Date().toISOString() + "] [" + ip + "] " + "[START] ");

  var form = { userId: req.session.userId }
  request.post({
    headers: { 'Content-Type': 'application/json' },
    url: 'http://127.0.0.1:3100/api/info',
    body: form,
    json: true
  }, (err, result, body) => {
    if (err) res.send(JSON.stringify(err));
    console.log("[/info] [" + new Date().toISOString() + "] [" + ip + "] " + "[END] " + JSON.stringify(result.body));
    res.render('info', { userinfo: result.body.userinfo, isRoot: req.session.userId == "root" ? true : false, isUser: req.session.userId != null ? true : false });
  });
});

// Logout
app.get('/logout', function (req, res) {
  delete req.session.userId;
  res.redirect('/');
});

// Login 
app.get('/login', function (req, res) {
  res.render('login', { err: req.query.errQuery, isRoot: req.session.userId == "root" ? true : false, isUser: req.session.userId != null ? true : false });
});

app.get('/login/:errParam', function (req, res) {
  res.render('login', { err: req.params.errParam, isRoot: req.session.userId == "root" ? true : false, isUser: req.session.userId != null ? true : false });
});

app.post('/login', function (req, res) {
  let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress; ip = ip.replace('::ffff:', '');
  console.log("[/login] [" + new Date().toISOString() + "] [" + ip + "] " + "[START] " + JSON.stringify(req.body));

  var form = { userId: req.body.userId, userPassword: req.body.userPassword }
  request.post({
    headers: { 'Content-Type': 'application/json' },
    url: 'http://127.0.0.1:3100/api/login',
    body: form,
    json: true
  }, (err, result, body) => {
    if (err) res.send("get err");

    if (result.body.isUser) {
      req.session.isLogined = true;
      req.session.userId = req.body.userId;
      console.log("[/login] [" + new Date().toISOString() + "] [" + ip + "] " + "[END] " + JSON.stringify(result.body));
      res.redirect("/");
    } else {
      console.log("[/login] [" + new Date().toISOString() + "] [" + ip + "] " + "[ERR] " + JSON.stringify(result.body));
      res.redirect('/login/1');
    }
  });
});

//Register
app.get('/register', function (req, res) {
  res.render('register', { err: req.query.errQuery, isRoot: req.session.userId == "root" ? true : false, isUser: req.session.userId != null ? true : false });
});

app.get('/register/:errParam', function (req, res) {
  res.render('register', { err: req.params.errParam, isRoot: req.session.userId == "root" ? true : false, isUser: req.session.userId != null ? true : false });
});

app.post('/register', function (req, res) {
  let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress; ip = ip.replace('::ffff:', '');
  console.log("[/register] [" + new Date().toISOString() + "] [" + ip + "] " + "[START] " + JSON.stringify(req.body));
  if (req.body.userPassword != req.body.userVPassword) {
    res.redirect('/register/1');
  }
  var form = {};
  form.userId = req.body.userId;
  form.userPassword = req.body.userPassword;
  form.userMessage = req.body.userMessage;
  form.userEmail = req.body.userEmail;
  form.userCompany = req.body.userCompany;
  form.userRank = 0;
  form.userSuccess = 0;
  form.userFailed = 0;

  request.post({
    headers: { 'Content-Type': 'application/json' },
    url: 'http://127.0.0.1:3100/api/user/register',
    body: form,
    json: true
  }, (err, result, body) => {
    if (err) res.send("[/register] [" + new Date().toISOString() + "] [" + ip + "] [ERR] " + JSON.stringify(err));
    else if (result.body.isResigtered) {
      console.log("[/register] [" + new Date().toISOString() + "] [" + ip + "] " + "[END] " + JSON.stringify(result.body));
      res.redirect('/');
    } else {
      console.log("[/register] [" + new Date().toISOString() + "] [" + ip + "] " + "[END] " + JSON.stringify(result.body));
      res.redirect('/register/1');
    }
  });
});

// 문제 리스트
app.get('/problemLists', function (req, res) {
  let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress; ip = ip.replace('::ffff:', '');
  console.log("[/problemLists] [" + new Date().toISOString() + "] [" + ip + "] " + "[START] ");

  request.post({
    headers: { 'Content-Type': 'application/json' },
    url: 'http://127.0.0.1:3100/api/problemLists',
    json: true
  }, (err, result, body) => {
    if (err) res.send("[/problemLists] [" + new Date().toISOString() + "] [" + ip + "] [ERR] " + JSON.stringify(err));

    if (result.body.isEmpty) {
      console.log("[/problemLists] [" + new Date().toISOString() + "] [" + ip + "] " + "[END] " + JSON.stringify(result.body));
      res.render("problemLists", { problem: null, isRoot: req.session.userId == "root" ? true : false, isUser: req.session.userId != null ? true : false });
    } else {
      console.log("[/problemLists] [" + new Date().toISOString() + "] [" + ip + "] " + "[END] " + JSON.stringify(result.body));
      res.render("problemLists", { problem: result.body.problem, isRoot: req.session.userId == "root" ? true : false, isUser: req.session.userId != null ? true : false });
    }
  });
});



// 문제 제출
app.get('/problem/submit', function (req, res) {
  res.render("submitProblem", { problem: req.params.problemName, isRoot: req.session.userId == "root" ? true : false, isUser: req.session.userId != null ? true : false });
});

app.get('/problem/submit/:problemName', function (req, res) {
  req.session.currentProblem = req.params.problemName;
  res.render("submitProblem", { problem: req.params.problemName, isRoot: req.session.userId == "root" ? true : false, isUser: req.session.userId != null ? true : false });
});

app.post('/problem/submit', function (req, res) {
/*
  var path = "C:/Users/admin/Desktop/user/" + req.session.userId + "/" + req.session.currentProblemId;

  fs.writeFileSync(path + "/Main.java", req.body.code, (err) => {
    if (err) {
      console.log(err)
    } else {
      console.log(path + "/Main.java saved!");
    }
  })

  var dockerForm =
  {
    "Image": "openjdk:8-jdk",
    "AttachStdin" : true,
    "Cmd": [
      "javac",
      "Main.java"
    ],
    "WorkingDir": "/app",
    "HostConfig": {
      "Memory": 134217728,
      "CpuPeriod": 100000,
      "CpuQuota": 100000,
      "Dns": [
        "8.8.8.8"
      ],
      "Binds": [path + ":/app"]
    }
  }

  console.log(JSON.stringify(dockerForm))
  // dockerForm.Volumes = {path : "/app"};
  request.post({
    headers: { 'Content-Type': 'application/json' },
    url: 'http://localhost:2375/containers/create',
    body: dockerForm,
    json: true
  }, (err, result, body) => {
    if (err) console.log(err);
    console.log(JSON.stringify(body));
    var Id = body.Id;

    request.post({
      headers: { 'Content-Type': 'application/json' },
      url: 'http://localhost:2375/containers/' + Id + "/start",
      json: true
    }, (err, result, body) => { 
        dockerForm.Cmd = ["java", "Main"];
        request.post({
          headers: { 'Content-Type': 'application/json' },
          url: 'http://localhost:2375/containers/create',
          body: dockerForm,
          json: true
        }, (err, result, body) => {
          var Id2 = body.Id;
          console.log(Id2);
          request.post({
            headers: { 'Content-Type': 'application/json' },
            url: 'http://localhost:2375/containers/' + Id2 + "/start",
          }, (err, response, body) => {
            console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            res.redirect("/");
          });
        });
      })
  });
  */
  
  /* CLI 조작 */
  var form = {};
  form.userId = req.session.userId;
  form.problemId = req.session.currentProblemId;
  form.code = req.body.code;
  form.open = req.body.open;

  var path = "C:/Users/admin/Desktop/user/" + req.session.userId +"/" + req.session.currentProblemId;

  fs.writeFileSync(path + "/Main.java", req.body.code, (err) => {
    if(err) {
      console.log(err)
    }else{
      console.log(path + "/Main.java saved!");
    }
  })

  exec('docker run --rm --cpus="1" -m=128m -v ' + path +':/app -w /app openjdk:8-jdk javac Main.java', function (err, stdout, stderr) {
    if(err) {
      console.log("컴파일 에러");
      res.redirect("/problemLists");
    }else if(stderr) {
      console.log("컴파일 에러1")
      res.redirect("/problemLists");
    }else{
      exec('docker run --rm --cpus="1" -m=128m -v ' + path +':/app -w /app openjdk:8-jdk bash -c "java Main <<EOF\'\nhello\nEOF\'"', function (err, stdout, stderr) {
      // exec('docker run --rm --cpus="1" -m=128m -v ' + path +':/app -w /app openjdk:8-jdk java Main', function (err, stdout, stderr) {
        if(err){
          console.log(err);
          res.redirect("/problemLists");
        } else if(stderr) {
          console.log(stderr);
          res.redirect("/problemLists");
        }else{
          fs.writeFile(path + "/result.txt", stdout, (err) => {
            if(err) {
              console.log(err)
            }else{
              console.log(path + "/result.txt saved!");
            }
          })
          res.send("성공");
        }
      });
    }
  });


// Spring REST API Server
  // res.send(JSON.stringify(form));
  // var pform = {};
  // pform.problemName = req.session.currentProblem;
  // request.post({
  //   headers: { 'Content-Type': 'application/json' },
  //   url: 'http://127.0.0.1:3100/api/problem',
  //   body: pform,
  //   json: true
  // }, (err, result, body) => {
  //   if (err) {
  //     res.send("[/problem/submit" +  req.session.currentProblem + "] [" + new Date().toISOString() + "] [" + ip + "] [ERR] " + JSON.stringify(err));
  //   }
  //   form.problemInputCase = result.body.problem.problemInputCase;
  //   form.problemOutputCase = result.body.problem.problemOutputCase;
  //   console.log(form);
  //   request.post({
  //     headers: { 'content-type': 'application/json' },
  //     url: 'http://127.0.0.1:8080/compile',
  //     body: form,
  //     json: true
  //   }, (err, result, body) => {
  //     if (err) res.send(JSON.stringify(err));
  //     res.redirect('/');
  //   });
  // });
});

// 문제 추가
app.get('/problem/register', function (req, res) {
  res.render('addProblem', { isRoot: req.session.userId == "root" ? true : false, isUser: req.session.userId != null ? true : false });
});

app.post('/problem/register', function (req, res) {
  if (req.session.userId == 'root') {
    var form = req.body;
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress; ip = ip.replace('::ffff:', '');
    form.problemSubmitCount = 0;
    form.problemSuccess = 0;
    form.problemSuccessRatio = "0.0 %";
    request.post({
      headers: { 'Content-Type': 'application/json' },
      url: 'http://127.0.0.1:3100/api/problem/register',
      body: form,
      json: true
    }, (err, result, body) => {
      if (err) res.send("[/problem/register] [" + new Date().toISOString() + "] [" + ip + "] [ERR] " + JSON.stringify(err));

      if (result.body.isResigtered) {
        console.log("[/problem/register] [" + new Date().toISOString() + "] [" + ip + "] " + "[END] " + JSON.stringify(result.body));
        res.redirect('/');
      } else {
        console.log("[/problem/register] [" + new Date().toISOString() + "] [" + ip + "] " + "[END] " + JSON.stringify(result.body));
        res.send(JSON.stringify(result.body));
      }
    });
  } else {
    res.send("등록되지 않은 사용자 입니다.");
  }
});

// 문제 보기
app.get('/problem/:problemName', function (req, res) {
  let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress; ip = ip.replace('::ffff:', '');
  console.log("[/problem] [" + new Date().toISOString() + "] [" + ip + "] " + "[START] " + JSON.stringify(req.body));

  var form = req.params;
  request.post({
    headers: { 'Content-Type': 'application/json' },
    url: 'http://127.0.0.1:3100/api/problem',
    body: form,
    json: true
  }, (err, result, body) => {
    if (err) {
      res.send("[/problem/" + req.params.problemName + "] [" + new Date().toISOString() + "] [" + ip + "] [ERR] " + JSON.stringify(err));
    } else if (result.body.isEmpty) {
      console.log("[/problem/" + req.params.problemName + "] [" + new Date().toISOString() + "] [" + ip + "] [END] " + JSON.stringify(result.body));
      req.session.currentProblemId = result.body.problem.problemId;
      res.render('problem', { problem: result.body.problem, isRoot: req.session.userId == "root" ? true : false, isUser: req.session.userId != null ? true : false });
    } else {
      req.session.currentProblemId = result.body.problem.problemId;
      console.log("[/problem/" + req.params.problemName + "] [" + new Date().toISOString() + "] [" + ip + "] [END] " + JSON.stringify(result.body));
      res.render('problem', { problem: result.body.problem, isRoot: req.session.userId == "root" ? true : false, isUser: req.session.userId != null ? true : false });
    }
  });
});


var port = 3000; // 사용할 포트 번호를 port 변수에 넣습니다. 
app.listen(port, function () { // port변수를 이용하여 3000번 포트에 node.js 서버를 연결합니다.
  console.log('server on! http://localhost:' + port); //서버가 실행되면 콘솔창에 표시될 메세지입니다.
});