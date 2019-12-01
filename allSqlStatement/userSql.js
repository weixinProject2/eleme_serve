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
        },
        //保存用户地址
        saveAddress:function (info) {
                //判断是否设置为默认地址
                if(info.defaultAddress == 1){
                        // console.log('保存中',info.defaultAddress);
                        let _sql_update = `UPDATE address_info set defaultAddress = 0 WHERE userId = '${info.userId}';`;
                        allServices.query(_sql_update);
                }
                //准备一条插入语句
                let _sql = `INSERT into address_info (username,phone,city,province,area,detailAddress,userId,defaultAddress,postalId) 
                                    VALUES('${info.username}',
                                    '${info.phone}',
                                    '${info.city}',
                                    '${info.province}',
                                    '${info.area}',
                                    '${info.detailAddress}',
                                    '${info.userId}',
                                     ${info.defaultAddress},
                                    '${info.postalId}');`;
                //保存
                allServices.query(_sql);
                //将保存的地址信息查询出来并返回给前端
                let _get_save_sql = `SELECT * FROM address_info WHERE (username,phone,city,province,area,detailAddress,userId,defaultAddress,postalId) = 
                                    ('${info.username}',
                                    '${info.phone}',
                                    '${info.city}',
                                    '${info.province}',
                                    '${info.area}',
                                    '${info.detailAddress}',
                                     ${info.userId},
                                     ${info.defaultAddress},
                                    '${info.postalId}')`;
                return allServices.query(_get_save_sql);
        },
        //查询是否存在相同地址
        findAddress:function(info){
                let _sql_find = `SELECT count(*) as info_sum FROM address_info WHERE (username,phone,city,province,area,detailAddress,userId,postalId) = 
                                    ('${info.username}',
                                     '${info.phone}',
                                     '${info.city}',
                                     '${info.province}',
                                     '${info.area}',
                                     '${info.detailAddress}',
                                      ${info.userId},
                                     '${info.postalId}') group by username;`;
                return  allServices.query(_sql_find);
        },
        //获取当前用户存储的所有地址
        getAddress:function(userId){
                let _sql = `select * from address_info where userId = '${userId}'`;
                return allServices.query(_sql);
        },
        updateAddress:function (info) {
                //判断是否更新为默认地址
                if(info.defaultAddress == 1){
                        // console.log('保存中',info.defaultAddress);
                        let _sql_update = `UPDATE address_info set defaultAddress = 0 WHERE userId = '${info.userId}';`;
                        allServices.query(_sql_update);
                }
                let _sql = `UPDATE address_info set 
                username = '${info.username}',
                phone='${info.phone}',
                city='${info.city}',
                province='${info.province}',
                area='${info.area}',
                detailAddress='${info.detailAddress}',
                defaultAddress='${info.defaultAddress}',
                postalId='${info.postalId}' WHERE  id =  ${info.id};`;
                //更新
                allServices.query(_sql);
                let _get_update_sql = `SELECT * FROM address_info WHERE id = ${info.id}`;
                //返回跟新后的数据
                return allServices.query(_get_update_sql);
        }
};
module.exports = userSql;
