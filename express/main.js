// express를 통해 application 객체 생성

var express = require('express');
var app = express();

// 초기에 설정해줘야 하는 미들웨어

var helmet = require('helmet') //// 보안상 목적
var bodyParser = require('body-parser'); //// request의 body 속성을 활용하기 위함. 이게 없으면 undefined됨
var compression = require('compression'); //// 서버가 클라이언트에 응답할 때 데이터를 "압축"하여 보냄
var fs = require('fs');

app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());
app.use(express.static('public')); //// 'public' 폴더에 있는 정적 파일들을 사용하겠다는 뜻
app.get('*', function(request, response, next){ //// request에 list라는 속성을 만들어 줌으로써 추후 활용하려 함. "*"이므로, get 방식을 통해 어떤 경로를 접속하든 적용됨
  fs.readdir('./data', function(error, filelist){
    request.list = filelist;
    next();
  });
});

// 홈페이지 혹은 상세 페이지로의 라우팅. 자세한 기능은 routes 폴더 내 파일에 기술되어 있음
//// "/"로 들어온 경우 index.js에서 가져온 라우터를, "/topic"로 들어온 경우 topic.js에서 가져온 라우터를 사용

var indexRouter = require('./routes/index'); 
var topicRouter = require('./routes/topic');

app.use('/', indexRouter);
app.use('/topic', topicRouter);

// 에러 처리

app.use(function(req, res, next) { 
  res.status(404).send('Error (404) - Not found');
});
app.use(function (err, req, res, next) {  
  console.error(err.stack)
  res.status(500).send('Something broke!')
});

// 서버 열기

app.listen(3000, function() {
  console.log('Example app listening on port 3000!')
});