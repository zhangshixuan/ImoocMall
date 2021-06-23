var express = require('express');
var router = express.Router();
var Goods = require('../models/goods');
var User = require('../models/user')
var monggoosUtil = require('../db/mongoose-init')

// mongoose.connect('mongodb://root:root@127.0.0.1:27017/dumall', { useNewUrlParser: true })
//
// mongoose.connection.on("connected",function () {
//   console.log("mongoDB connect success")
// });
// mongoose.connection.on("error",function () {
//   console.log("error")
// });
// mongoose.connection.on("disconnected",function () {
//   console.log("disconected")
// });
/* GET home page. */
//查询所有商品
router.get('/list', function(req, res, next) {
  let params = {};
  let page = parseInt(req.param('page'));
  let pageSize = parseInt(req.param('pageSize'));
  let sort = req.param('sort');
  let skip = (page-1)*pageSize;
  let priceGt = '';
  let priceLte = '';
  let priceLevel = req.param('priceLevel');
  if(priceLevel != "all") {
    switch (priceLevel) {
      case '0':priceGt = 0;priceLte = 100;break;
      case '1':priceGt = 100;priceLte = 500;break;
      case '2':priceGt = 500;priceLte = 1000;break;
      case '3':priceGt = 1000;priceLte = 2000;break;
      case '4':priceGt = 2000;priceLte = 4000;break;
    }
    params = {
      salePrice:{
        $gt:priceGt,
        $lte:priceLte
      }
    }
  }
  //分页
  let goodsModel = Goods.find(params).skip(skip).limit(pageSize);
  //排序
  goodsModel.sort({'salePrice':sort})
  goodsModel.exec((err,doc) => {
    if(err) {
      res.json({
        status:"1",
        msg:err.message
      });
    } else {
      res.json({
        status:'0',
        msg:"",
        result:{
          count:doc.length,
          list:doc
        }
      });
    }
  })
});
//加入购物车
router.post('/addCart', function(req, res, next) {
  let userId = req.cookies.userId;
  let productId = req.body.productId;
  User.findOne({userId:userId},(errU,docUser)=>{
    if(errU) {
      res.json({
        status:"1",
        msg:errU.message
      });
    } else {
      //如果有该用户
      if(docUser) {
        let goodsItem = '';
        docUser.cartList.forEach((item)=>{
          if(item.productId == productId) {
            item.productNum++;
            goodsItem = item;
          }
        });
        if(goodsItem) {
          docUser.save((errC,docC)=> {
            if(errC) {
              res.json({
                status:"1",
                msg:errC.message
              });
            } else {
              res.json({
                status:"0",
                msg:'',
                result:'success'
              });
            }
          });
        } else {
          Goods.findOne({productId:productId},(errG,docG)=> {
            if(errG) {
              res.json({
                status:"1",
                msg:errG.message
              });
            } else {
              if(docG) {
                docG.productNum = 1;
                docG.checked = 1;
                docUser.cartList.push(docG);
                docUser.save((errC,docC)=> {
                  if(errC) {
                    res.json({
                      status:"1",
                      msg:errC.message
                    });
                  } else {
                    res.json({
                      status:"0",
                      msg:'',
                      result:'success'
                    });
                  }
                });
              }
            }
          });
        }
      } else {
        alert("请先登陆");
      }
    }
  })
});


module.exports = router;
