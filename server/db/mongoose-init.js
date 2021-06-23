var mongoose = require('mongoose')

mongoose.connect('mongodb://root:root@127.0.0.1:27017/dumall', { useNewUrlParser: true })

mongoose.connection.on("connected",function () {
  console.log("mongoDB connect success")
});
mongoose.connection.on("error",function () {
  console.log("error")
});
mongoose.connection.on("disconnected",function () {
  console.log("disconected")
});

module.export;
