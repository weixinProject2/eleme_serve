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
    const findResult = await elmBacSql.findUser(ctx.request.body);
    console.log('结果:',findResult);
    if(findResult.length===1 &&findResult[0].info_sum>=1){
        return ctx.body = {
            code:1,
            msg:'已存在相同用户名'
        }
    }
    console.log(ctx);
    const saveResult = await elmBacSql.saveUserinfo(ctx.request.body);
    console.log(saveResult);
    ctx.body={
        code:0,
        data:saveResult[0]
    }
});

module.exports = router;
