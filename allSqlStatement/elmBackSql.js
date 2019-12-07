// 跟elm_back操作有关的sql语句
const md5 =require('blueimp-md5');
const allServices = require('./index');

const elmBacSql = {
    //保存用户信息
    saveUserinfo :function (info) {
        const md5pass = md5(info.pass);
        const register_time = Date.now();
        let _sql_save = `INSERT into elm_back_userinfo (username,pass,user_type,register_time,province,city,district,street,streetNumber) 
                                    VALUES('${info.username}',
                                    '${md5pass}',
                                    '${info.user_type}',
                                    '${register_time}',
                                    '${info.province}',
                                    '${info.city||""}',
                                    '${info.district||""}',
                                    '${info.street||""}',
                                    '${info.streetNumber||""}');`;
        allServices.query(_sql_save);
        return this.getUserInfo(info);
    },
    //查找用户信息个数通过用户名查找
    findUserByName:function (info) {
        let _sql_find = `SELECT count(*) as info_sum FROM elm_back_userinfo WHERE username = 
                                    '${info.username}' group by username;`;
        return  allServices.query(_sql_find);
    },
    //查找用户信息个数通过cookie查找
    findUserByCookie:function (info) {
        let _sql_find = `SELECT count(*) as info_sum FROM elm_back_userinfo WHERE _id = 
                                    '${info._id}' group by username;`;
        return  allServices.query(_sql_find);
    },
    getUserInfo:function(info){
        let _sql = `select username,user_type,register_time,province,city,district,street,streetNumber,_id from elm_back_userinfo where username = 
                                    '${info.username}';`;
        return allServices.query(_sql);
    },
    //验证用户通过用户密码
    loginUser:function (info) {
        const md5Pass = md5(info.pass);
        let _sql_find = `SELECT count(*) as info_sum FROM elm_back_userinfo WHERE (username,pass) = (
                        '${info.username}',
                        '${md5Pass}' )  group by username;`;
        return  allServices.query(_sql_find);
    }
};

module.exports = elmBacSql;
