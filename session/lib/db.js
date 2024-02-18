var mysql = require('mysql2');

var db = mysql.createConnection({
    host: 'localhost',
    user: 'root', //// 여러분이 설정하신 사용자 이름으로 해주셔야 합니다
    password: '0000', //// 여러분이 설정하신 비밀번호로 해주셔야 합니다
    database: 'mydb1' //// 우리가 생성해준 database의 이름과 동일해야 합니다
});

db.connect();

module.exports = db;