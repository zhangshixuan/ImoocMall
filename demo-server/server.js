const http = require('http');
const path = require('path');
const url = require('url');
const fs = require('fs');
const util = require('util');

http.createServer((req,res) => {
  // res.statusCode = 200;
  let name = url.parse(req.url).pathname.substring(1);
  fs.readFile(name,(err, data)=>{
    if (err) {
      res.writeHead(404,{
        'Content-Type':'text/html'
      });
    } else {
      res.writeHead(200,{
        'Content-Type':'text/html'

      });
      res.write(data.toString());
    }
    res.end();
  });
}).listen(3000,'127.0.0.1',()=>{
  console.log("服务器已经运行。")
});
