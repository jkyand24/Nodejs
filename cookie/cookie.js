var http = require('http');
var cookie = require('cookie');

var count = 0; //// 단지 확인용... 아래의 createServer가 몇회 째 실행되는건지 체크

http.createServer(function(request, response){
    count += 1;
    console.log("The count is: " + count);

    // 쿠키 읽기

    console.log(request.headers.cookie);

    var cookie_parsed = {};
    if(request.headers.cookie !== undefined){
        cookie_parsed = cookie.parse(request.headers.cookie);
    }
    console.log(cookie_parsed);

    // 쿠키 생성

    response.writeHead(200, {
        'Set-Cookie':[ //// 서버가 클라이언트로 쿠키를 보낼 때 사용. -> 추후, 클라이언트는 서버로 되돌려보냄
            'cookie1 = choco', 
            'cookie2 = strawberry',
            `cookie3 = matcha; Max-Age=${60*60*24*30}`, //// 이 쿠키는 60*60*24*30초 동안 남아있음
            'cookie4 = vanilla; Secure', //// 서버와 브라우저가 https로 통신하는 경우에만 브라우저가 쿠키를 서버로 전송하는 옵션
            'cookie5 = banana; HttpOnly', //// 자바스크립트의 document.cookie를 이용한 쿠키 접속을 막는 옵션
            'cookie6 = yogurt; Path=/path1', //// /path1/... 요청 시 전송
            'cookie7 = walnut; Domain=o2.org' //// 브라우저는 이 도메인을 쓰는 서버에 요청할 때만 쿠키를 전송
        ]
    });

    // 응답 종료

    response.end('Cookie!!');
}).listen(3000);