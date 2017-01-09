angular.module('lusirAdmin.services.data', [])
    .factory('httpQuery', function($http, $q, Ajaxing, Alert, $rootScope) {
        var query = function(methed, url, key) {
            return function(params, needRes) {
                if (needRes != 'sub') {
                    Ajaxing.start();
                }
                if (typeof params == 'number' || typeof params == 'string') {
                    var temp = params;
                    params = {};
                    if (key) {
                        params[key] = temp;
                    } else {
                        params.id = temp;
                    }
                }
                var deferred = $q.defer();
                if (methed == 'get') {
                    var _temp = params;
                    params = {
                        "params": _temp
                    };
                }
                $http[methed](url, params).success(function(data, status, headers, config) {

                    if (needRes != 'sub') {
                        Ajaxing.stop();
                    }
                    if (needRes && needRes != 'sub' && needRes != 'hide') { //需提示请求
                        if (data.code === 0) {
                            Alert.success('操作成功');
                            deferred.resolve(data);
                        } else {
                            Alert.error(data.message);
                        }
                    } else if (needRes == 'hide') { //隐藏提示请求
                        deferred.resolve(data);
                    } else { //仅错误提示请求
                        if (data.code !== 0) {
                            Alert.error(data.message);
                        }
                        deferred.resolve(data);
                    }
                }).error(function(data, status, headers, config) {
                    // data=false;
                    Ajaxing.stop();
                    Alert.error('请求失败，请检查网络');
                    // deferred.resolve(data);
                });
                return deferred.promise;
            };
        };
        return {
            get: function(url, key) {
                return query('get', url, key);
            },
            post: function(url, key) {
                return query('post', url, key);
            },
            path: function(url, key) {
                return function(params) {
                    var str = url + '?';
                    for (var i in params) {
                        str += i + '=' + params[i] + '&';
                    }
                    str = str.substr(0, str.length - 1);
                    location.href = str;
                };
            }
        };
    }).factory('StarTags', function() {
        return [{
            name: "名女优",
            key: "famous"
        }, {
            name: "新出道",
            key: "new"
        }, {
            name: "美少女",
            key: "beauty_girl"
        }, {
            name: "引退",
            key: "retire"
        }, {
            name: "萝莉",
            key: "lori"
        }, {
            name: "高中生",
            key: "high_school"
        }, {
            name: "大学生",
            key: "college_students"
        }, {
            name: "熟女",
            key: "mature"
        }, {
            name: "欧巴桑",
            key: "obasan"
        }, {
            name: "素人",
            key: "normal_people"
        }, {
            name: "人妻",
            key: "wife"
        }, {
            name: "丰乳",
            key: "big_breast"
        }, {
            name: "贫乳",
            key: "small_breast"
        }, {
            name: "长身",
            key: "long_body"
        }, {
            name: "低身长",
            key: "short_body"
        }, {
            name: "涩谷系",
            key: "shibuya_kei"
        }];
    })
    .factory('RealtimeSearch', function(Stars, Works, User, Groups, httpQuery) {
        return {
            "star": Stars.search,
            "user": User.list,
            "group": Groups.list,
            "work": Works.list,
            "search": httpQuery.get('/search')
        };
    })
    .factory('User', function(httpQuery) {
        return {
            "logined_user": httpQuery.get('/logined_user'),
            "info": httpQuery.get('/user/info'),
            "list": httpQuery.get('/user/list'),
            "mute": httpQuery.post('/user/mute'),
            "edit": httpQuery.post('/user/edit'),
            "honor":httpQuery.post('/user/honor'),
            "sendmsg":httpQuery.post('/user/sendmsg'),
            "historyMsg":httpQuery.get('/user/history_msg'),
        };
    })
    .factory('Permissions', function(httpQuery) {
        return {
            "get_user_permissions": httpQuery.get('/auth/get_user_permissions'),
            "permission_list": httpQuery.get('/auth/permission_list'),
            "set_user_permissions": httpQuery.post('/auth/set_user_permissions'),
            "administrator_list": httpQuery.get('/auth/administrator_list')
        };
    })
    .factory('ObjectTypes', function() {
        return [{
            key: "user",
            name: "用户"
        }, {
            key: "star",
            name: "老师"
        }, {
            key: "star_face",
            name: "老师人脸"
        }, {
            key: "star_recognize",
            name: "老师识别"
        }, {
            key: "work",
            name: "作品"
        }, {
            key: "album",
            name: "专辑"
        }, {
            key: "photo",
            name: "写真"
        }, {
            key: "crowdsourced_photo",
            name: "众包写真"
        }, {
            key: "group",
            name: "小组"
        }, {
            key: "topic",
            name: "话题"
        }, {
            key: "post",
            name: "帖子"
        }, {
            key: "app_package",
            name: "安装包"
        }, {
            key: "good",
            name: "商品"
        }, {
            key: "good_comment",
            name: "商品评论"
        }];
    })
    .factory('Persition', function(httpQuery, Works, Mall, Photos, albumWorks, Recommends) {
        return {
            "work": Works.position,
            "photo": Photos.position,
            "album_work": albumWorks.position,
            "recommend": Recommends.position,
            "mall_navigation": Mall.navigation.position,
            "mall_category": Mall.category.position,
            "mall_good": Mall.good.position
        };
    })
    .factory('Stars', function(httpQuery) {
        return {
            //老师
            "list": httpQuery.get('index.php'),///star/list
            "info": httpQuery.get('/star/info'),
            "edit": httpQuery.post('/star/edit'),
            "add": httpQuery.post('/star/add'),
            "delete": httpQuery.post('/star/delete'),
            "search": httpQuery.get('/star/search')
        };
    })
    .factory('Works', function(httpQuery) {
        return {
            //作品
            "list": httpQuery.get('/star/work_list'),
            "info": httpQuery.get("/star/work_info"),
            "edit": httpQuery.post('/star/edit_work'),
            "add": httpQuery.post('/star/add_work'),
            "delete": httpQuery.post('/star/delete_work'),
            "position": httpQuery.post('/star/set_star_work_position')
        };
    })
    .factory('Photos', function(httpQuery) {
        return {
            //写真
            "list": httpQuery.get('/star/photo_list'),
            "info": httpQuery.get('/star/photo_info'),
            "edit": httpQuery.post('/star/edit_photo'),
            "add": httpQuery.post('/star/add_photo'),
            "delete": httpQuery.post('/star/delete_photo'),
            "position": httpQuery.post('/star/set_star_photo_position')
        };
    })
    .factory('Albums', function(httpQuery) {
        return {
            //专辑
            "list": httpQuery.get('/star/album_list'),
            "info": httpQuery.get('/star/album_info'),
            "edit": httpQuery.post('/star/edit_album'),
            "add": httpQuery.post('/star/create_album'),
            "delete": httpQuery.post('/star/delete_album')
        };
    })
    .factory('Crowdsourceds', function(httpQuery) {
        return {
            //众包写真
            "list": httpQuery.get('/star/crowdsourced_photo_list'),
            "delete": httpQuery.post('/star/delete_crowdsourced_photo')
        };
    })
    .factory('albumWorks', function(httpQuery) {
        return {
            //专辑下的作品
            "list": httpQuery.get('/star/album_works'),
            "add": httpQuery.post('/star/add_album_work'),
            "delete": httpQuery.post('/star/remove_album_work'),
            "position": httpQuery.post('/star/set_album_work_position')
        };
    })
    .factory('Faces', function(httpQuery) {
        return {
            "detect_face": httpQuery.post('/face/detect_star_face'),
            "recognize_list": httpQuery.get('/face/star_recognize_list'),
            "list": httpQuery.get('/face/star_face_list'),
            "delete": httpQuery.post('/face/delete_star_face')
        };
    })
    .factory('Groups', function(httpQuery) {
        return {
            //小组
            "list": httpQuery.get('/group/list'),
            "info": httpQuery.get(' /group/info'),
            "edit": httpQuery.post('/group/edit'),
            "add": httpQuery.post('/group/create'),
            "delete": httpQuery.post('/group/delete'),
            "status": httpQuery.post('/group/set_status')
        };
    })
    .factory('Topics', function(httpQuery) {
        return {
            //话题
            "list": httpQuery.get('/topic/list'),
            "info": httpQuery.get(' /topic/info'),
            "edit": httpQuery.post('/topic/edit'),
            "add": httpQuery.post('/topic/create'),
            "delete": httpQuery.post('/topic/delete'),
            "status": httpQuery.post('/topic/set_status'),
            "publish": httpQuery.post('/topic/publish'),
            "move": httpQuery.post('/topic/move')

        };
    })
    .factory('MallNavList', function(Mall, $q) {

        var NavlistCach = null;
        var ajaxing = false;
        var deferredlist = [];
        return function() {
            var deferred = $q.defer();
            deferredlist.push(deferred);
            if (NavlistCach) {
                deferred.resolve(NavlistCach);
            } else {
                if (!ajaxing) {
                    ajaxing = true;
                    Mall.navigation.list({}, 'hide').then(function(data) {
                        for (var i in deferredlist) {
                            NavlistCach = data.navigations;
                            deferredlist[i].resolve(NavlistCach);
                            ajaxing = false;
                        }
                        deferredlist = [];
                    });
                }
            }
            return deferred.promise;
        };
    })
    .factory('Mall', function(httpQuery, AdminConfig) {
        var navigation = {
            "list": httpQuery.get('/mall/navigation_list'),
            "add": httpQuery.post('/mall/navigation_create'),
            "info": httpQuery.get('/mall/navigation_info'),
            "edit": httpQuery.post('/mall/navigation_edit'),
            "position": httpQuery.post('/mall/navigation_set_position')
        };
        var category = {
            "list": httpQuery.get('/mall/category_list'),
            "add": httpQuery.post('/mall/category_create'),
            "info": httpQuery.get('/mall/category_info'),
            "edit": httpQuery.post('/mall/category_edit'),
            "position": httpQuery.post('/mall/category_set_position')
        };
        var good = {
            "list": httpQuery.get('/mall/good_list'),
            "add": httpQuery.post('/mall/good_create'),
            "info": httpQuery.get('/mall/good_info'),
            "edit": httpQuery.post('/mall/good_edit'),
            "position": httpQuery.post('/mall/good_set_position'),
            "add_inner": httpQuery.post('/mall/inner_good_create'),
            "comment_good": httpQuery.post('/mall/comment_good'),
            "cost_create_or_edit":httpQuery.post('/mall/cost_create_or_edit')
        };
        var activity = {
            "edit": httpQuery.post('/mall/activity_edit'),
            "list": httpQuery.get('/mall/activity_list'),
            "info": httpQuery.get('/mall/activity_info'),
            "create": httpQuery.post('/mall/activity_create'),
        };
        var innerOrder = {
            "list": httpQuery.get('/mall/inner_order_list'),
            "edit": httpQuery.post('/mall/inner_order_edit'),
            "info": httpQuery.get('/mall/inner_order_info'),
            "deliver": httpQuery.post('/mall/inner_order_deliver'),
            "delete": httpQuery.post('/mall/inner_order_cancel'),
            "finish": httpQuery.post('/mall/inner_order_finish'),
            "receive": httpQuery.post('/mall/inner_order_receive'), //订单确认收货
            "refund": httpQuery.post('/mall/inner_order_refund'), //订单确认退款
            "reject": httpQuery.post('/mall/inner_order_reject'), //订单确认退货
            "cancel_refund": httpQuery.post('/mall/inner_order_cancel_refund'), //订单取消退款
            "cancel_reject_good": httpQuery.post('/mall/inner_order_cancel_reject_good'), //订单取消退货
            "details_xls": httpQuery.path('/mall/inner_order_details_xls'), //获取货单xls 
            "deliver_xls": httpQuery.path('/mall/inner_order_deliver_xls'), //获取快递单xls 
            "partial_refunding": httpQuery.post('/mall/inner_order_partial_refunding') //部分退款

        };
        var coupon = {
            "delete": httpQuery.post('/mall/delete_coupons'),
            "list": httpQuery.get('/mall/coupon_list')
        };
        var gift = {
            "list": httpQuery.get('/mall/gift_package_list'),
            "edit": httpQuery.post('/mall/gift_package_edit'),
            "info": httpQuery.get('/mall/gift_package_info'),
            "delete": httpQuery.post('/mall/gift_package_delete'),
            "add": httpQuery.post('/mall/gift_package_create'),
        };
        var cloud = {
            "list": httpQuery.get('/mall/cloud_list'),
            "edit": httpQuery.post('/mall/cloud_edit'),
            "info": httpQuery.get('/mall/cloud_info'),
            "gen_next": httpQuery.post('/mall/cloud_gen_next'),
            "add": httpQuery.post(' /mall/cloud_create'),
            "reward_list": httpQuery.get('/mall/cloud_reward_list'),
            "user_cloud_list": httpQuery.get('/mall/user_cloud_list'),
            "user_cloud_create": httpQuery.post(' /mall/user_cloud_create')
        };
        return {
            navigation: navigation,
            category: category,
            activity: activity,
            good: good,
            innerOrder: innerOrder,
            coupon: coupon,
            gift: gift,
            cloud: cloud,
            'taoke_trans_detail': httpQuery.get('/mall/taoke_trans_detail'),
            "upload_taoke_trans": httpQuery.post('/mall/upload_taoke_trans'),
            "upload_taoke_trans_url": '/mall/upload_taoke_trans',
            "edit_details_view": httpQuery.post('/mall/edit_details_view'),
            "get_hscode": httpQuery.get('/mall/get_hscode'),
            "good_comment_list": httpQuery.get('/mall/good_comment_list'),
            "good_comment_edit": httpQuery.post('/mall/good_comment_edit'),
            "delete_good_comment": httpQuery.post('/mall/delete_good_comment'),
            "address_list":httpQuery.get('mall/address_list')
        };
    })
    .factory('Posts', function(httpQuery) {
        return {
            //帖子
            "list": httpQuery.get('/post/list'),
            "info": httpQuery.get(' /post/info'),
            "edit": httpQuery.post('/post/edit'),
            "delete": httpQuery.post('/post/delete'),
            "reply": httpQuery.post('/post/reply')
        };
    })
    .factory('Coin', function(httpQuery) {
        return {
            "reward_topic": httpQuery.post('/coin/reward_top_posts'),
            "reward_post": httpQuery.post('/coin/reward_post')
        };
    })
    .factory('Recommends', function(httpQuery) {
        return {
            "list": httpQuery.get('/recommend/list'),
            "position": httpQuery.post('/recommend/set_position'),
            "add": httpQuery.post('/recommend/add'),
            "delete": httpQuery.post('/recommend/delete'),
            "edit": httpQuery.post('/recommend/edit')
        };
    })
    .factory('Message', function(httpQuery) {
        return {
            "send_new_topic_message": httpQuery.post('/message/send_new_topic_message'),
            "push": httpQuery.post('/message/push')
        };
    })
    .factory('Spider', function(httpQuery) {
        return {
            "task_create": httpQuery.post('/spider/task_create'),
            "task_info": httpQuery.get('/spider/task_info'),
            "task_edit": httpQuery.post('/spider/task_edit'),
            "task_list": httpQuery.get('/spider/task_list'),
            "task_update": httpQuery.post('/spider/task_update'),
            "task_retry": httpQuery.post('/spider/task_retry'),
            "good_task_create": httpQuery.post('/spider/good_task_create'),
            "sp_task_info": httpQuery.get('/spider/sp_task_info'),
            "sp_task_retry": httpQuery.post('/spider/sp_task_retry'),
            "sp_update_task_by_object": httpQuery.post('/spider/sp_update_task_by_object'),
            "sp_task_list": httpQuery.get('/spider/sp_task_list')
        };
    })
    .factory('Apppkg', function(httpQuery) {
        return {
            "list": httpQuery.get('/apppkg/list'),
            "info": httpQuery.get(' /apppkg/info'),
            "edit": httpQuery.post('/apppkg/edit'),
            "delete": httpQuery.post('/apppkg/remove'),
            "add": httpQuery.post('/apppkg/add')
        };
    })
    .factory('Channel', function(httpQuery) {
        return {
            "list": httpQuery.get('/apppkg/channel_list'),
            "info": httpQuery.get(' /apppkg/channel_info'),
            "edit": httpQuery.post('/apppkg/edit_channel'),
            "delete": httpQuery.post('/apppkg/remove_channel'),
            "add": httpQuery.post('/apppkg/add_channel')
        };
    })
    .factory('AppConfig', function(httpQuery) {
        return {
            "list": httpQuery.get('/appconfig/config_list'),
            "update": httpQuery.post(' /appconfig/update_config'),
            "newest_config": httpQuery.get(' /appconfig/newest_config'),
            "release_config": httpQuery.post(' /appconfig/release_config')
        };
    })
    .factory('DataConfig', function(httpQuery) {
        return {
            "info": httpQuery.get('/dataconfig/data_config_info'),
            "update": httpQuery.post('/dataconfig/data_config_create_or_edit')
        }
    })
    .factory('Feedback', function(httpQuery) {
        return {
            "list": httpQuery.get('/feedback/list'),
            "delete": httpQuery.post('/feedback/delete'),
            "edit": httpQuery.post('/feedback/edit'),
            "reply": httpQuery.post('/feedback/reply'),
            "info": httpQuery.get('/feedback/info')
        };
    })
    .factory('Report', function(httpQuery) {
        return {
            "list": httpQuery.get('/report/list'),
            "delete": httpQuery.post('/report/delete'),
            "edit": httpQuery.post('/report/edit'),
            "info": httpQuery.get('/report/info')
        };
    })
    .factory('Audit', function(httpQuery) {
        var content = {
            "list": httpQuery.get('/audit/content_list'),
            "delete": httpQuery.post('/audit/content_delete')
        };
        var action = {
            "list": httpQuery.get('/audit/action_list'),
            "delete": httpQuery.post('/audit/action_delete')
        };
        return {
            content: content,
            action: action
        };
    })
    .factory('Storage', function(httpQuery) {
        return {
            "list": httpQuery.get('/storage/file_list'),
            "delete": httpQuery.post('/storage/delete_file')
        };
    })
    .factory('Oplog', function(httpQuery) {
        return {
            "list": httpQuery.get('/oplog/list'),
            "userList": httpQuery.get('/oplog/user_list'),
            "delete":httpQuery.post('/oplog/user_delete'),
            "recovery":httpQuery.post('/oplog/user_recovery')
        };
    })
    .factory('Datamining', function(httpQuery) {
        return {
            "hour": httpQuery.get('/datamining/stat_by_hour_list'),
            "day": httpQuery.get('/datamining/stat_by_day_list'),
            "week": httpQuery.get('/datamining/stat_by_week_list'),
            "month": httpQuery.get('/datamining/stat_by_month_list'),
            "all": httpQuery.get('/datamining/stat_all_list'),
            "metric_info":httpQuery.get('/datamining/metric_info'),
            "metric_list":httpQuery.get('/datamining/metric_list'),
            "newuser_metric_percents": httpQuery.get('/datamining/newuser_metric_percents'),
        };
    })
    .factory('Horn', function(httpQuery) {
        return {
            "ad_list": httpQuery.get('/horn/horn_ad_list'),
            "ad_create": httpQuery.post('/horn/horn_ad_create'),
            "ad_delete": httpQuery.post('/horn/horn_ad_delete'),
            "filter_words": httpQuery.post('/horn/filter_words'),
            "list": httpQuery.get('/horn/horn_list'),
            "delete": httpQuery.post('/horn/horn_delete')
        };
    })
    .factory('Notify', function(httpQuery) {
        return {
            "list": httpQuery.get('/notify/list'),
            "publish": httpQuery.post('/notify/publish'),
            "delete": httpQuery.post('/notify/notify_delete'),
            "send": httpQuery.post('/notify/send'),
            "sending_status": httpQuery.get('/notify/sending_status'),
            "cancel_sending": httpQuery.post('/notify/cancel_sending'),
            "edit": httpQuery.post('/notify/edit'),
            "info": httpQuery.get('/notify/info')
        };
    })
    .factory('Timecondition', function(httpQuery) {
        return {
            "list": httpQuery.get('/timecondition/list'),
            "add": httpQuery.post('/timecondition/create'),
            "delete": httpQuery.post('/timecondition/delete'),
            "edit": httpQuery.post('/timecondition/edit'),
            "info": httpQuery.get('/timecondition/info')
        };
    })
    .factory('Im', function(httpQuery) {
        return {
            "list": httpQuery.get('/im/p2p_receive')
        };
    })
    .factory('Audio', function(httpQuery) {
        return {
            "list": httpQuery.get('/audio/column_list'),
            "create": httpQuery.post('/audio/column_create'),
            "info": httpQuery.get('/audio/column_info'),
            "delete": httpQuery.post('/audio/column_delete'),
            "edit":httpQuery.post('/audio/column_edit')
        };
    });
