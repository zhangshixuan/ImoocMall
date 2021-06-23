var express = require('express');
var router = express.Router();
var User = require('./../models/user')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
//登陆接口
router.post('/login', (req, res, next)=>{
  let param = {
    userName: req.body.userName,
    userPwd: req.body.userPwd
  }
  User.findOne(param,(err,doc)=>{
    if(err) {
      res.json({
        status:"1",
        msg:err.message
      });
    } else {
      if(doc) {
        //设置cookie时长，把useId返回，通过cookieParser中间插件
        res.cookie("userId",doc.userId,{
          path:'/',
          maxAge:1000*60*60
        });
        res.cookie("userName",doc.userName,{
          path:'/',
          maxAge:1000*60*60
        });
        //将用户信息放入session
        // req.session.user = doc;
        res.json({
          status:"0",
          msg:'',
          result:{
            userName:doc.userName
          }
        });
      }
    }
  })
});
//登出接口
router.post('/logout',(req, res, next)=>{
  res.cookie("userId","",{
    path:"/",
    maxAge:-1
  });
  res.json({
    status:"0",
    msg:"",
    result:""
  });
});
//判断用户是否登陆
router.get('/checkLogin',(req, res, next)=>{
  if (req.cookies.userId) {
    res.json({
      status:'0',
      msg:"",
      result:req.cookies.userName || ""
    });
  } else {
    res.json({
      status:'1',
      msg:"未登陆",
      result:""
    });
  }
});

//查询用户购物车数据
router.get('/cartList',(req, res, next)=>{
  if (req.cookies.userId) {
    let userId = req.cookies.userId;
    User.findOne({userId:userId}, function (err, doc){
      if(err) {
        res.json({
          status:"1",
          msg:err.message
        });
      } else {
        if(doc) {
          res.json({
            status:"0",
            msg:'',
            result:{
              cartList:doc.cartList
            }
          });
        }
      }
    });
  } else {
    res.json({
      status:'1',
      msg:"未登陆",
      result:""
    });
  }
});
//购物车删除
router.post('/cartDel',(req, res, next)=>{
  let userId = req.cookies.userId;
  let productId = req.body.productId;
  User.update({userId:userId},{$pull:{'cartList':{'productId':productId}}}, function (err, doc){
    if(err) {
      res.json({
        status:'1',
        msg:"",
        result:err.message
      });
    } else {
      res.json({
        status:'0',
        msg:"删除成功",
        result:doc
      });
    }
  });
});
//修改购物车数据
router.post('/cartEdit',(req, res, next)=>{
  let userId = req.cookies.userId;
  let productId = req.body.productId;
  let productNum = req.body.productNum;
  let checked = req.body.checked;
  User.update({"userId":userId,"cartList.productId":productId},{
    "cartList.$.productNum":productNum,
    "cartList.$.checked":checked
  },function (err, doc) {
    if(err) {
      res.json({
        status:'1',
        msg:"",
        result:err.message
      });
    } else {
      res.json({
        status:'0',
        msg:"修改成功",
        result:doc
      });
    }
  });
});
//修改选中状态
router.post('/editCheckAll',(req,res,next)=>{
  let userId = req.cookies.userId,
    checkAll = req.body.checkAll?'1':'0';
  User.findOne({userId:userId},(err,user)=>{
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      });
    } else {
      if(user){
        user.cartList.forEach((item)=>{
          item.checked = checkAll;
        })
        user.save(function (err1,doc) {
          if(err1){
            res.json({
              status:'1',
              msg:err1.message,
              result:''
            });
          }else{
            res.json({
              status:'0',
              msg:'',
              result:'suc'
            });
          }
        })
      }
    }
  });
});

//查询地址列表
router.get('/addressList',(req,res,next)=>{
  if(req.cookies.userId) {
    let userId = req.cookies.userId;
    User.findOne({userId:userId},(err, doc)=>{
      if(doc) {
        if(err){
          res.json({
            status:'1',
            msg:err.message,
            result:''
          });
        } else {
          if(doc) {
            res.json({
              status:"0",
              msg:'',
              result:{
                addressList:doc.addressList
              }
            });
          }
        }
      }
    });
  }
});

module.exports = router;
