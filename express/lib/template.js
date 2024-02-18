module.exports = {
  // 페이지의 html 코드 양식

  HTML:function(title, list, control, content){
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
      ${control} 
      ${content} 
    </body>
    </html>
    `;
  },
  list:function(filelist){
    var list = '<ul>';

    var i = 0;
    while(i < filelist.length){ //// 반복문을 통해, filelist에 존재하는 모든 요소를 누적
      list = list + `<li><a href="/topic/${filelist[i]}">${filelist[i]}</a></li>`;
      i = i + 1;
    }

    list = list + '</ul>';

    return list;
  }
}