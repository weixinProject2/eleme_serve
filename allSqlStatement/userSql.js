// 跟用户操作有关的sql语句
const allServices = require('./index');

let  userSql = {
        // 获取主页面Logo
        getLogoImg:function(){
                let _sql = 'select * from logo_img';
                return allServices.query(_sql);
        },
        // 获取店铺列表
        getShopList:function(filter){
                let _sql = '';
                if (filter === 'recently') {
                    _sql = 'select * from store_list order by distance asc';
                } else if(filter === 'quality') {
                   _sql = "select * from store_list where tag2 = '品质联盟';";
                } 
                else {
                   _sql = 'select * from store_list';
                }
                return allServices.query(_sql);
        },
        queryIsRegister:function(tel) {
                let _sql = `select tel,username,userId from user_info where tel = ${tel};`;
                return allServices.query(_sql);
        },
        addUser:function(user) {
                let _sql = `insert into user_info (tel,username,userId) values (${user.tel},'${user.username}',${user.userId});`;
                return allServices.query(_sql);
        },
        queryMaxUserId:function(){
                let _sql = 'select Max(userId) from user_info';
                return allServices.query(_sql);
        },
        // 通过userId 查询用户信息
        queryUserInfo:function(userId){
                let _sql = `select * from user_info where userId = ${userId};`;
                return allServices.query(_sql);
        }
};
module.exports = userSql;