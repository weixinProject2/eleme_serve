const router = require('koa-router')();
const moment = require('moment');
//
const userSql = require('../allSqlStatement/userSql');

// 随机生成用户名
function randomUsername() {
    let str = "",
    arr = [
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l',
    'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x',
    'y', 'z','0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
  ];
    for (let i = 0; i < 8; i++) {
      pos = Math.round(Math.random() * (arr.length - 1));
      str += arr[pos];
    }
  return str;
}
// 获取主页面logo图标
router.get('/logo_img',async(ctx,next) => {
    const res_img = await userSql.getLogoImg();
    ctx.body = {
      list:res_img,
    }
});
// 获取店铺列表
router.get('/store_list',async(ctx,next) => {
  const params = ctx.query;
  const filter = params.filter;
  const res_shop = await userSql.getShopList(filter);
  ctx.body = {
    list:res_shop
  }
});
// 用户登录API
router.post('/login', async(ctx,next) => {
  const userInfo = ctx.request.body;
  let phone = userInfo.phone;
  try {
    const res_isUser = await userSql.queryIsRegister(phone);
    if (res_isUser.length === 0) {
      // 没有注册过，需要注册
      const username = randomUsername();
      const res_userId = await userSql.queryMaxUserId();
      const userId = res_userId[0]['Max(userId)'] + 1;
      const user = {
        tel: phone,
        username,
        userId,
      }
      const res_register = await userSql.addUser(user);
      const str = user.tel.slice(3,7);
      user.tel = user.tel.replace(str,'****');
      ctx.body = {
        userInfo: user,
      }
    } else {
      // 注册过的用户，需要登录
      const user = res_isUser[0];
      const str = user.tel.slice(3,7);
      user.tel = user.tel.replace(str,'****');
      ctx.body = {
        userInfo: user,
      }
    }
  }catch(e) {
    ctx.body = {
      message: e,
      error: -1
    }
  }
});
// 获取用户资料
router.get('/getUserInfo', async(ctx,next) => {
    const params = JSON.parse(JSON.stringify(ctx.query));
    let userId;
    for (item in params) {
      userId = params[item];
    }
    const res_Info = await userSql.queryUserInfo(userId);
    const user = res_Info[0];
    const str = user.tel.slice(3,7);
    user.tel = user.tel.replace(str,"****");
    ctx.body = {
      user,
    }
});

//保存用户地址
router.post('/save_address',async ctx=>{
    //1.先查询获取到的前端的地址是否在数据库已经存在相同数据
    const findResult = await userSql.findAddress(ctx.request.body);
    console.log('结果:',findResult);
    if(findResult.length===1 &&findResult[0].info_sum>=1){
        return ctx.body = {
            code:1,
            msg:'已存在相同地址信息'
        }
    }
    //2.不存在，则保存
    const addressInfo = await userSql.saveAddress(ctx.request.body);
    console.log(addressInfo);
    ctx.body = {
        code:0,
        data:addressInfo[0]
    }
});

//获取当前用户存储的所有的地址
router.post('/get_address',async ctx=>{
    // console.log(ctx.request.body);
   const allAddresses = await userSql.getAddress(ctx.request.body.userId);
   console.log(allAddresses);
   ctx.body={
       code:0,
       data:allAddresses
   }
});

//更新要修改的地址
router.post('/update_address',async ctx=>{
    const updateResult = await  userSql.updateAddress(ctx.request.body);
    console.log(updateResult);
    ctx.body={
        code:0,
        data:updateResult[0]
    }
});
module.exports = router;
