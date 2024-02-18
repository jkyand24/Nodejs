// router 객체 생성

var express = require('express');
var router = express.Router();

// 필요한 것 준비

var template = require('../lib/template.js');

// 홈페이지

router.get('/', function(request, response) { 
  // 페이지 내의 요소들 준비

    var title = 'Welcome';
    var description = 'Here is the root page';
    var list = template.list(request.list);

    // 위 요소들을 가지고 html 페이지 완성하여 send
    
    var html = template.HTML(
      title, 
      list,
      `<a href="/topic/create">create</a>`,
      `
      <h2>${title}</h2>${description}
      <img src="/images/hello.jpg" style="width:300px; display:block; margin-top:10px;">
      `
    ); 
    response.send(html);
  });
  
// export

  module.exports = router;