const http = require('http');
http.get('http://jsonplaceholder.typicode.com/posts',(res)=>{
  let data = '';
  res.on('data',(chunk)=>{
    data += chunk;
  });
  res.on('end',()=>{
    const result = JSON.parse(data);
    console.log(`result:${result[0].userId}`)
  })
});
