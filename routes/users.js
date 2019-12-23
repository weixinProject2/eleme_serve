//此文件主要为elm_back相关接口

const router = require('koa-router')();

const elmBacSql = require('../allSqlStatement/elmBackSql');

router.prefix('/elm_back');

router.get('/', function (ctx, next) {
    ctx.body = 'this is a users response!'
});

router.get('/bar', function (ctx, next) {
    ctx.body = 'this is a users/bar response'
});

//保存用户以及登录
router.post('/save_user', async ctx=>{
    const findResult = await elmBacSql.findUserByName(ctx.request.body);
    if(findResult.length===1 &&findResult[0].info_sum>=1){
        const loginResult = await elmBacSql.loginUser(ctx.request.body);
        if(loginResult.length===1 && loginResult[0].info_sum>=1){
            const userinfo =  await elmBacSql.getUserInfo(ctx.request.body);
            console.log(userinfo);
            // console.log(userinfo._id);
            ctx.cookies.set('_id',userinfo[0]._id,{
                domain: 'localhost',  // 写cookie所在的域名
                maxAge: 60 * 60 * 1000, // cookie有效时长
                httpOnly: false,  // 是否只用于http请求中获取
                overwrite: false  // 是否允许重写
            });
            // console.log(ctx.cookies.get("_id"));
            return ctx.body = {
                code:0,
                msg:'登录成功',
                data:userinfo[0]
            }
        }
        return ctx.body={
            code:1,
            msg:'密码错误'
        }
    }
    // console.log(ctx);
    const saveResult = await elmBacSql.saveUserinfo(ctx.request.body);
    ctx.cookies.set('_id',saveResult._id,{
        domain: 'localhost',  // 写cookie所在的域名
        path: ctx.url,       // 写cookie所在的路径
        maxAge: 60 * 60 * 1000, // cookie有效时长
        httpOnly: false,  // 是否只用于http请求中获取
        overwrite: false  // 是否允许重写
    });
    // console.log('保存:',saveResult);
    ctx.body={
        code:0,
        data:saveResult[0]
    }
});

//验证cookies
router.get('/cookies',async ctx=>{
    const findResult = await elmBacSql.findUserByCookie(ctx.query);
    if(findResult.length===1 ){
       return  ctx.body={
            code:0,
            msg:'存在当前cookie'
        }
    }
    return  ctx.body={
        code:1,
        msg:'不存在当前cookie'
    }
});

//保存商铺
router.post('/save_shop',async ctx => {
    //先判断是否存在相同名称的商铺
    const findResult = await elmBacSql.findShopByName(ctx.request.body);
    if(findResult.length===1 &&findResult[0].info_sum>=1){
        return ctx.body={
            code : 1,
            msg:'该商铺名已存在'
        }
    }
    //不存在则保存该店铺
    console.log('1');
    await elmBacSql.saveShop(ctx.request.body);
    //获取刚添加的商铺的shop_id
    console.log('2');
    const shopData = await elmBacSql.findShop(ctx.request.body);

    console.log('shopData',shopData);
    //通过shop_id保存与该店铺相关的活动
    await elmBacSql.saveShopActives(ctx.request.body,shopData[0].shop_id);
    //通过shop_id查找当前shop 的信息
    let shopInfo = await elmBacSql.findShopByShopId(shopData[0].shop_id);
    console.log('shopinfo',shopInfo);
    //通过shop_id查找当前shop的活动的信息
    let activesData =await elmBacSql.findShopActivesByShopId(shopData[0].shop_id);
    console.log('activesData',activesData);
    ctx.body={
        code:0,
        data:{...shopInfo,activesData:activesData}
    }
});

//获取首页数据。当日数据，新注册用户，新注册管理员
//获取图片
router.post('/photos',ctx=>{
        console.log(ctx);
        ctx.body={
            code:0,
            data:ctx.request.body
        }
});

module.exports = router;
