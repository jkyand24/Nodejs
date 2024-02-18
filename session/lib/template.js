module.exports = {
    HTML: function (title, content, authStatusUI) {
      return `
      <!doctype html>
      <html>
      <head>    
        <title>Auth by Session in Node.js - ${title}</title>
        <meta charset="utf-8">
      </head>
      <body>
        ${authStatusUI}
        ${content}
      </body>
      </html>
      `;
    }
  }