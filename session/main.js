const express = require('express')
const app = express()

const session = require('express-session')
const FileStore = require('session-file-store')(session)
app.use(session({
  secret: '~~~',	//// 원하는 문자 입력
  secure: true, //// https 통신만을 허용함
  HttpOnly: true, //// 자바스크립트를 통한 탈취 방지
  resave: false,
  saveUninitialized: true,
  store: new FileStore(), //// 세션 데이터를 서버 컴퓨터에 저장함
}))

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

var authFunctions = require('./lib/authFunctions.js');
var template = require('./lib/template.js');

// "/"로 접속된 경우

app.get('/', (req, res) => {
  // 로그인 안되어있는 경우 -> 로그인부터 하라고 리다이렉트

  if (!authFunctions.isOwner(req, res)) {  
    res.redirect('/auth/login');

    return false;
  } 
  
  // 로그인 되어있는 경우

  else {                                      
    res.redirect('/main');
    
    return false;
  }
})

// "/auth"로 접속된 경우 

var authRouter = require('./lib/authRouter.js');
app.use('/auth', authRouter); 

// "/main"로 접속된 경우

app.get('/main', (req, res) => {
  // 로그인 안되어있는 경우 -> 로그인부터 하라고 리다이렉트

  if (!authFunctions.isOwner(req, res)) {  
    res.redirect('/auth/login');

    return false;
  }

  // 로그인 되어있는 경우

  var html = template.HTML(
    'Welcome',
    `<hr>
        <h2>Welcome to Main page!</h2>
    `,
    authFunctions.getAuthStatusUI(req, res)
  );
  res.send(html);
})

// 서버가 클라이언트의 request를 listen

app.listen(3000, () => {
  console.log('Example is listening on port 3000!')
})