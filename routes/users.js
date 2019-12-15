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

//保存
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
