var express = require('express');
var router = express.Router();
var template = require('./template.js');
var db = require('./db.js');
const bcrypt = require("bcrypt");

// 로그인 페이지

router.get('/login', function (request, response) {
    var title = 'Login';
    var html = template.HTML(
            title,
            `
            <h2>Login</h2>
            <form action="/auth/login_process" method="post">
            <p><input class="login" type="text" name="id" placeholder="ID"></p>
            <p><input class="login" type="password" name="pwd" placeholder="Password"></p>
            <p><input class="btn" type="submit" value="Login"></p>
            </form>            
            <p>Don't have an account?  <a href="/auth/register">Register</a></p> 
            `, 
            ''
            );
    response.send(html);
});

// 로그인 버튼을 누른 순간

router.post('/login_process', function (request, response) {
    var id = request.body.id;
    var password = request.body.pwd;

    // ID와 PW 모두 입력된 경우

    if (id && password) { 
        
        db.query('SELECT id, password FROM userTable WHERE id = ?', [id], function(error, results, fields) { //// 입력된 id를 가진 row의 id, password를 SELECT 
            // 에러 처리
            
            if (error) throw error;

            // 입력한 ID가 DB에 존재하는 경우

            if (results.length > 0) { 
                password_e_indb = results[0].password;
                const isSame =  bcrypt.compareSync(password, password_e_indb);

                // 입력한 PW가 올바른 경우

                if (isSame) {
                    request.session.isLogined = true; //// 세션 정보 업데이트
                    request.session.nickname = id;
                    request.session.save(function () {
                        response.redirect(`/`); //// root 페이지로 리다이렉트
                    })}

                // 입력한 PW가 올바르지 않은 경우

                else {              
                    response.send(`<script type="text/javascript">alert("Login information (PW) does not match."); 
                    document.location.href="/auth/login";</script>`);    
                }        
            } 

            // 입력한 ID가 DB에 존재하지 않는 경우
            
            else {              
                response.send(`<script type="text/javascript">alert("Login information (ID) does not match."); 
                document.location.href="/auth/login";</script>`);    
            }            
        });
    } 
    
    // ID나 PW 중 입력되지 않은 값이 있는 경우
    
    else {
        response.send(`<script type="text/javascript">alert("Enter your ID and Password!"); 
        document.location.href="/auth/login";</script>`);    
    }
});

// 로그아웃 페이지

router.get('/logout', function (request, response) {
    request.session.destroy(function (err) { //// 세션을 삭제
        response.redirect('/');
    });
});

// 회원가입 페이지

router.get('/register', function(request, response) {
    var title = 'Register';    
    var html = template.HTML(
        title, 
        `
        <h2>Register</h2>
        <form action="/auth/register_process" method="post">
        <p><input class="login" type="text" name="id" placeholder="ID"></p>
        <p><input class="login" type="password" name="pwd" placeholder="Password"></p>    
        <p><input class="login" type="password" name="pwd2" placeholder="Enter Password Again"></p>
        <p><input class="btn" type="submit" value="Create"></p>
        </form>            
        <p><a href="/auth/login">Back to the Login Page</a></p>
        `, 
        ''
        );
    response.send(html);
});
 
// 회원가입 버튼을 누른 순간

router.post('/register_process', function(request, response) {    
    var id = request.body.id;
    var password = request.body.pwd;
    var password2 = request.body.pwd2;

    const password_e = bcrypt.hashSync(password, 10); //// 비밀번호를 암호화함. saltOrRounds: salt를 몇 번 돌릴건지.

    // 모든 게 입력된 경우

    if (id && password && password2) {
        
        db.query('SELECT * FROM userTable WHERE id = ?', [id], function(error, results, fields) { //// 입력한 ID를 가진 row를 SELECT
            // 에러 처리 
            
            if (error) throw error;

            // 입력된 ID가 DB에 아직 없고, PW = PW2인 경우 (정상)

            if (results.length <= 0 && password == password2) { 
                db.query('INSERT INTO usertable (id, password) VALUES(?,?)', [id, password_e], function (error, data) { //// 입력한 ID와 암호화된 PW를 테이블에 INSERT
                    if (error) throw error;
                    response.send(`<script type="text/javascript">alert("Registration is Complete!");
                    document.location.href="/";</script>`);
                });
            } 

            // PW != PW2인 경우

            else if (password != password2) { 
                response.send(`<script type="text/javascript">alert("The entered passwords are not same."); 
                document.location.href="/auth/register";</script>`);    
            }

            // 입력된 ID가 DB에 이미 있는 경우

            else { 
                response.send(`<script type="text/javascript">alert("The ID already exists."); 
                document.location.href="/auth/register";</script>`);    
            }            
        });
    } 
    
    // 아직 입력되지 않은 것이 있는 경우

    else { 
        response.send(`<script type="text/javascript">alert("There is information that has not been entered."); 
        document.location.href="/auth/register";</script>`);
    }
});

// export

module.exports = router;