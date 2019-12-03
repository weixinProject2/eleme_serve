// 跟elm_back操作有关的sql语句
const md5 =require('blueimp-md5');
const allServices = require('./index');

const elmBacSql = {
// 获取主页面Logo
    saveUserinfo :function (info) {
        const md5pass = md5(info.pass);
        let _sql_save = `INSERT into elm_back_userinfo (username,pass,user_type,user_address) 
                                    VALUES('${info.username}',
                                    '${md5pass}',
                                    '${info.user_type},
                                    '${info.address}'');`;
        allServices.query(_sql_save);
        let _sql = `select username,user_type from elm_back_userinfo where username = '${info.username}';`;
        return allServices.query(_sql);
    },
    findUser:function (info) {
        let _sql_find = `SELECT count(*) as info_sum FROM elm_back_userinfo WHERE username = 
                                    '${info.username}' group by username;`;
        return  allServices.query(_sql_find);
    }
}

module.exports = elmBacSql;
