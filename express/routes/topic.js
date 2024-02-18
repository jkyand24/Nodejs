// router 객체 생성

var express = require('express');
var router = express.Router();

// 필요한 것 준비

var path = require('path');
var fs = require('fs');
var sanitizeHtml = require('sanitize-html'); //// html 코드 중 민감한 tag는 삭제함으로써 보안 강화
var template = require('../lib/template.js');

// 생성 페이지

router.get('/create', function(request, response){
  // 페이지 내의 요소들 준비

    var title = 'WEB - create';
    var list = template.list(request.list);

  // 위 요소들을 가지고 html 페이지 완성하여 send
  //// form의 action: submit 시 action에 설정된 경로로 이동함
    
    var html = template.HTML(
      title, 
      list, 
      '',
      `
      <form action="/topic/create_process" method="post"> 
        <p><input type="text" name="title" placeholder="title"></p>
        <p>
          <textarea name="description" placeholder="description"></textarea>
        </p>
        <p>
          <input type="submit">
        </p>
      </form>
      `
      );
    response.send(html);
  });

// 생성 버튼 클릭한 순간
  
router.post('/create_process', function(request, response){
  // request.body로부터 필요한 요소 추출

  var post = request.body; //// 이 때를 위해 body-parser 사용한 것
  var title = post.title;
  var description = post.description;

  // 페이지 작성한 뒤 리다이렉트

  fs.writeFile(`data/${title}`, description, 'utf8', function(err){
    response.redirect(`/topic/${title}`); //// 생성한 페이지로 리다이렉트: 이게 없으면 response가 끝나지 않아 error 발생
  });
});

// 업데이트 페이지

router.get('/update/:pageId', function(request, response){
  // 페이지 내의 요소들 준비

  var filteredId = path.parse(request.params.pageId).base; //// 보안을 위해 id filter
  fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
    var title = request.params.pageId;
    var list = template.list(request.list);

  // 위 요소들을 가지고 html 페이지 완성하여 send
  //// form의 action: submit 시 action에 설정된 경로로 이동함
    
    var html = template.HTML(
      title, 
      list,
      '',
      `
      <form action="/topic/update_process" method="post"> 
        <input type="hidden" name="id" value="${title}">
        <p><input type="text" name="title" placeholder="title" value="${title}"></p>
        <p>
          <textarea name="description" placeholder="description">${description}</textarea>
        </p>
        <p>
          <input type="submit">
        </p>
      </form>
      `
    );
    response.send(html);
  });
});

// 업데이트 버튼 클릭한 순간

router.post('/update_process', function(request, response){
  // request.body로부터 필요한 요소 추출

  var post = request.body; //// 이 때를 위해 body-parser 사용한 것
  var id = post.id;
  var title = post.title;
  var description = post.description;

  // 제목 변경하고 페이지 작성한 뒤 리다이렉트

  fs.rename(`data/${id}`, `data/${title}`, function(error){
    fs.writeFile(`data/${title}`, description, 'utf8', function(err){
      response.redirect(`/topic/${title}`); //// 업데이트한 페이지로 리다이렉트: 이게 없으면 response가 끝나지 않아 error 발생
    })
  });
});

// 삭제 버튼 클릭한 순간

router.post('/delete_process', function(request, response){
  // request.body로부터 필요한 요소 추출

  var post = request.body; //// 이 때를 위해 body-parser 사용한 것
  var id = post.id;
  var filteredId = path.parse(id).base; //// 보안을 위해 id filter

  // 페이지 삭제

  fs.unlink(`data/${filteredId}`, function(error){
    response.redirect('/'); //// 홈페이지로 리다이렉트: 이게 없으면 response가 끝나지 않아 error 발생
  });
});

// 상세 페이지

router.get('/:pageId', function(request, response, next) { 
  // 페이지 내의 요소들 준비

  var filteredId = path.parse(request.params.pageId).base; //// 보안을 위해 id filter
  fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
    if(err){ //// error 있을 시, main.js의 error handler 실행됨
      next(err);
    } 
    else {
      var title = request.params.pageId;
      var sanitizedTitle = sanitizeHtml(title);
      var sanitizedDescription = sanitizeHtml(description, {
        allowedTags:['h1'] //// 이 tag는 포함되어도 괜찮음
      });
      var list = template.list(request.list);

  // 위 요소들을 가지고 html 페이지 완성하여 send
  //// form의 action: submit 시 action에 설정된 경로로 이동함

      var html = template.HTML(
        sanitizedTitle, 
        list,
        ` 
        <a href="/topic/create">create</a>
        <a href="/topic/update/${sanitizedTitle}">update</a>
        <form action="/topic/delete_process" method="post"> 
          <input type="hidden" name="id" value="${sanitizedTitle}">
          <input type="submit" value="delete">
        </form>
        `,
        `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`
      );
      response.send(html);
    }
  });
});

// export

module.exports = router;