// 跟elm_back操作有关的sql语句
const md5 =require('blueimp-md5');
const allServices = require('./index');

const elmBacSql = {
    //关于用户的操作
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
    },
    //获取userList
    getUserList:function(limit){
        let _find_user_list = `select username ,register_time, province from elm_back_userinfo limit ${limit.header},${limit.tail};`;
        return allServices.query(_find_user_list);
    },


    //商铺相关操作
    //保存商铺信息
    saveShop:  function (info) {
        let _sql_save = `INSERT into elm_back_shop_list (shop_name,shop_address,shop_phone,shop_detail,
                        shop_tag,shop_type,shop_characteristics,shop_float_delivery_fee,shop_float_minimum_order_amount,shop_date1,shop_date2,shop_user_id) 
                                    VALUES('${info.shop_name}',
                                    '${info.shop_address}',
                                    '${info.shop_phone}',
                                    '${info.shop_detail}',
                                    '${info.shop_tag}',
                                    '${info.shop_type}',
                                    '${info.shop_characteristics}',
                                    '${info.shop_float_delivery_fee}',
                                    '${info.shop_float_minimum_order_amount}',
                                    '${info.shop_date1}',
                                    '${info.shop_date2}',
                                    '${info.shop_user_id}');`;
         allServices.query(_sql_save);
        // const shop_info = this.findShop(info);
        //
        // console.log('shop_info',shop_info,'shop_id:',shop_info.shop_id);
        //
        // for(let i=0 ; i<info.tableData.length;i++){
        //     let _sql_table_date = `INSERT into elm_back_shop_list_table_data (active_name,active_tag,active_text,active_shop_id)
        //                             values('${info.tableData[i].activeName}',
        //                                    '${info.tableData[i].activeTag}',
        //                                    '${info.tableData[i].activeText}',
        //                                    '${shop_info.shop_id}')`;
        // }
        // let shopInfo = this.findShopByShopId(shop_id);
        // let activesData = this.findShopActivesByShopId(shop_id);
        // return {...shopInfo,activesData:activesData}
    },
    //保存商铺活动
    saveShopActives:function(info,shop_id) {
        for (let i = 0; i < info.tableData.length; i++) {
            let _sql_table_date = `INSERT into elm_back_shop_list_table_data (active_name,active_tag,active_text,active_shop_id)
                                    values('${info.tableData[i].activeName}',
                                           '${info.tableData[i].activeTag}',
                                           '${info.tableData[i].activeText}',
                                           '${shop_id}')`;
            allServices.query(_sql_table_date);
        }
    },
    //查找商铺
    findShop: function (info) {
        let _find_shop = `select * from elm_back_shop_list where (shop_name,shop_address,shop_phone,shop_detail,
                        shop_tag,shop_type,shop_characteristics,shop_float_delivery_fee,shop_float_minimum_order_amount,shop_date1,shop_date2,shop_user_id) = 
                                    ('${info.shop_name}',
                                    '${info.shop_address}',
                                    '${info.shop_phone}',
                                    '${info.shop_detail}',
                                    '${info.shop_tag}',
                                    '${info.shop_type}',
                                    '${info.shop_characteristics}',
                                    '${info.shop_float_delivery_fee}',
                                    '${info.shop_float_minimum_order_amount}',
                                    '${info.shop_date1}',
                                    '${info.shop_date2}',
                                    '${info.shop_user_id}');`;
        return allServices.query(_find_shop);
    },
    //查找商铺by shop_id
    findShopByShopId:function (shop_id) {
        let _find_shop_by_shop_id = `select * from elm_back_shop_list where shop_id = ${shop_id}`;
        return allServices.query(_find_shop_by_shop_id);
    },
    //查找商铺里的活动列表by shop_id
    findShopActivesByShopId:function (shop_id) {
        let _find_actives_by_shop_id = `select * from elm_back_shop_list_table_data where active_shop_id = ${shop_id}`;
        return allServices.query(_find_actives_by_shop_id);
    },
    //查抄商铺by shop_name
    findShopByName:function (info) {
        let _find_by_shop_name = `SELECT count(*) as info_sum FROM elm_back_shop_list WHERE shop_name = 
                                    '${info.shop_name}' group by shop_name;`
        return allServices.query(_find_by_shop_name);
    },
    //获取商铺列表
    getShopList:function (limit) {
        let _find_shop_list = `select * from elm_back_shop_list limit ${limit.header},${limit.tail};`;
        return allServices.query(_find_shop_list);
    }
};

module.exports = elmBacSql;