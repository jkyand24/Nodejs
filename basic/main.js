var http = require('http');
var fs = require('fs');
var url = require('url');
 
function templateHTML(title, list, content){
  return `
  <!doctype html>
  <html>
  <head>
    <title>WEB - ${title}</title>
    <meta charset="utf-8">
  </head>
  <body>
    <h1><a href="/">WEB</a></h1>
    ${list}
    ${content}
  </body>
  </html>
  `;
}

function templateList(filelist){
  var list = '<ul>';

  var i = 0;
  while(i < filelist.length){
    list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
    i = i + 1;
  }

  list = list + '</ul>';
  
  return list;
}
 
var app = http.createServer(function(request, response){
    var _url = request.url;
    var query = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;

    if(pathname === '/'){
      if(query.id === undefined){
        fs.readdir('./data', function(error, filelist){
          var description = 'Here is main page!';
          var title = 'Welcome';
          var list = templateList(filelist);
          var template = templateHTML(title, list, `<h2>${title}</h2>${description}`);

          response.writeHead(200);
          response.end(template);
        })
      } 
      else {
        fs.readdir('./data', function(error, filelist){
          fs.readFile(`data/${query.id}`, 'utf8', function(err, description){
            var title = query.id;
            var list = templateList(filelist);
            var template = templateHTML(title, list, `<h2>${title}</h2>${description}`);

            response.writeHead(200);
            response.end(template);
          });
        });
      }
    } 
    
    else {
      response.writeHead(404);
      response.end('Not found');
    }
});

app.listen(3000);