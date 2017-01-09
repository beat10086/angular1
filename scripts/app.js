
/**
 * @ngdoc overview
 * @name deffileApp
 * @description
 * # deffileApp
 *
 * Main module of the application.
 */

var templatesToCache = [];
var myApp = angular.module('lusirAdmin', ['ui.router', 'ngCookies', 'dndLists', 'fileUpload', 'lusirAdmin.controller', 'lusirAdmin.controller.ui', 'lusirAdmin.services', 'lusirAdmin.services.data', 'lusirAdmin.directives'], function($httpProvider) {
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    /**
     * The workhorse; converts an object to x-www-form-urlencoded serialization.
     * @param {Object} obj
     * @return {String}
     */
    var param = function(obj) {
        var query = '',
            name, value, fullSubName, subName, subValue, innerObj, i;
        for (name in obj) {
            value = obj[name];
            if (value instanceof Array) {
                for (i = 0; i < value.length; ++i) {
                    subValue = value[i];
                    fullSubName = name + '[' + i + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += param(innerObj) + '&';
                }
            } else if (value instanceof Object) {
                for (subName in value) {
                    subValue = value[subName];
                    fullSubName = name + '[' + subName + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += param(innerObj) + '&';
                }
            } else if (value !== undefined && value !== null) query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
        }
        return query.length ? query.substr(0, query.length - 1) : query;
    };
    // Override $http service's default transformRequest
    $httpProvider.defaults.transformRequest = [function(data) {
        return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
    }];
});
myApp.run(function($rootScope, Ajaxing, Alert, LoginUser, LoginState, $state) {
    $rootScope.$on('$stateChangeStart', function(event, next, nextParams, prev, prevParams) {
        $(document.body).removeClass('show-slide');
        /*if (!LoginState.get() && next.name != 'main') {
            event.preventDefault();
            LoginUser().then(function(data) {
                if (!data) {
                    Alert.error('请先登录!');
                    location.href = "login";
                } else {
                    LoginState.success();
                    $state.go(next.name, nextParams);
                }
            });
        } else if (next.name == 'main') {
            LoginUser().then(function(data) {
                if (!data) {
                    Alert.error('请先登录!');
                    location.href = "login";
                } else {
                    LoginState.success();
                }
            });
        } else {
            Ajaxing.stop();
            Alert.stop(true);
            $rootScope.pageTitle = '加载中……';
        }*/
    });

});

function configureTemplateFactory($provide) {
    // Set a suffix outside the decorator function 
    var cacheBuster = Date.now().toString();

    function templateFactoryDecorator($delegate) {
        var fromUrl = angular.bind($delegate, $delegate.fromUrl);
        $delegate.fromUrl = function(url, params) {
            if (url !== null && angular.isDefined(url) && angular.isString(url)) {
                url += (url.indexOf("?") === -1 ? "?" : "&");
                url += "v=" + cacheBuster;
            }

            return fromUrl(url, params);
        };

        return $delegate;
    }

    $provide.decorator('$templateFactory', ['$delegate', templateFactoryDecorator]);
}

myApp.config(['$provide', configureTemplateFactory]);
// myApp.config(['$stateProvider',
//     function($stateProvider) {
//         var stateProviderState = $stateProvider.state;
//         $stateProvider.state = function(stateName, definition) {
//             // don't even bother if it's disabled. note, another config may run after this, so it's not a catch-all
//             if (typeof definition === 'object') {
//                 var enabled = definition.prefetchTemplate !== false;
//                 if (enabled && angular.isString(definition.templateUrl)) templatesToCache.push(definition.templateUrl);
//                 if (angular.isObject(definition.views)) {
//                     for (var key in definition.views) {
//                         enabled = definition.views[key].prefetchTemplate !== false;
//                         if (enabled && angular.isString(definition.views[key].templateUrl)) templatesToCache.push(definition.views[key].templateUrl);
//                     }
//                 }
//             }
//             return stateProviderState.call($stateProvider, stateName, definition);
//         };
//     }
// ])
myApp.config(function($stateProvider, $urlRouterProvider) {
    //
    // For any unmatched url, redirect to /state1
    $urlRouterProvider.otherwise("/");
    //
    // Now set up the states
    $stateProvider.state('main', {
            url: '/',
            templateUrl: 'views/main.html'
        })
        //老师管理
        .state('star/list', {
            url: "/star/list?:currentPage?:sort?:status?:keyword",
            templateUrl: "views/star.list.html",
            controller: 'starListCtrl'
        })
        .state('star/info', {
            url: "/star/info?:id",
            templateUrl: "views/star.info.html",
            controller: 'starInfoCtrl'
        })
        .state('star/add', {
            url: "/star/create",
            templateUrl: "views/star.info.html",
            controller: 'starInfoCtrl'
        })
        .state('star/work_list', {
            url: "/star/work_list?:star_id?:currentPage?:sort?:status?:keyword",
            templateUrl: "views/star.work_list.html",
            controller: 'starWorkCtrl'
        })
        .state('star/add_work', {
            url: "/star/add_work?:star_id",
            templateUrl: "views/star.work_info.html",
            controller: 'starWorkInfoCtrl'
        })
        .state('star/work_info', {
            url: "/star/work_info/:id",
            templateUrl: "views/star.work_info.html",
            controller: 'starWorkInfoCtrl'
        })
        .state('star/photo_list', {
            url: "/star/photo_list?:star_id?:currentPage?:sort?:status?:keyword",
            templateUrl: "views/star.photo_list.html",
            controller: 'starPhotoCtrl'
        })
        .state('star/add_photo', {
            url: "/star/add_photo?:star_id",
            templateUrl: "views/star.photo_info.html",
            controller: 'starPhotoInfoCtrl'
        })
        .state('star/photo_info', {
            url: "/star/photo_info/:id",
            templateUrl: "views/star.photo_info.html",
            controller: 'starPhotoInfoCtrl'
        })
        .state('star/crowdsourced_photo_list', {
            url: "/star/crowdsourced_photo_list?:star_id?:currentPage?:sort?:is_detected?:uploader_id?:is_internal",
            templateUrl: "views/star.crowdsourced_photo_list.html",
            controller: 'starCrowdsourcedInfoCtrl'
        })
        .state('star/album_list', {
            url: "/star/album_list?:currentPage?:sort?:status?:keyword",
            templateUrl: "views/star.album_list.html",
            controller: 'starAlbumCtrl'
        })
        .state('star/create_album', {
            url: "/star/create_album",
            templateUrl: "views/star.album_info.html",
            controller: 'starAlbumInfoCtrl'
        })
        .state('star/album_info', {
            url: "/star/album_info/:id",
            templateUrl: "views/star.album_info.html",
            controller: 'starAlbumInfoCtrl'
        })
        .state('star/album_works', {
            url: "/star/album_works?:album_id?:currentPage?:sort?:status?:keyword",
            templateUrl: "views/star.album_works.html",
            controller: 'starAlbumWorkCtrl'
        })
        //人脸管理
        .state('face/list', {
            url: "/face/list?:currentPage?:sort?:status?:keyword?:parent_image_id",
            templateUrl: "views/face.list.html",
            controller: 'faceListCtrl'
        })
        .state('face/star_recognize_list', {
            url: "/face/recognize_list?:user_id?:currentPage?:sort?:is_empty?:keyword",
            templateUrl: "views/face.recognize_list.html",
            controller: 'faceRecognizeListCtrl'
        })
        //用户管理
        .state('user/list', {
            url: "/user/list?:currentPage?:sort?:keyword?:is_internal?:status?:msg_status",
            templateUrl: "views/user.list.html",
            controller: 'userListCtrl'
        })
        .state('user/info', {
            url: "/user/info/:id?:honor",
            templateUrl: "views/user.info.html",
            controller: 'userInfoCtrl'
        })
        .state('user/msglist', {
            url: "/user/msglist/:id?:nick?:currentPage",
            templateUrl: "views/user.msglist.html",
            controller: 'privateMsgCtrl'
        })
        //小组管理
        .state('group/list', {
            url: "/group/list?:currentPage?:sort?:keyword?:is_internal?:status",
            templateUrl: "views/group.list.html",
            controller: 'groupListCtrl'
        })
        .state('group/create', {
            url: "/group/create",
            templateUrl: "views/group.info.html",
            controller: 'groupInfoCtrl'
        })
        .state('group/info', {
            url: "/group/info/:id",
            templateUrl: "views/group.info.html",
            controller: 'groupInfoCtrl'
        })
        //话题管理
        .state('topic/list', {
            url: "/topic/list?:viewstyle?:group_id?:currentPage?:sort?:keyword?:is_internal?:status?:is_top",
            templateUrl: "views/topic.list.html",
            controller: 'topicListCtrl'
        })
        .state('topic/info', {
            url: "/topic/info/:id",
            templateUrl: "views/topic.info.html",
            controller: 'topicInfoCtrl'
        })
        .state('topic/create', {
            url: "/topic/create/:group_id",
            templateUrl: "views/topic.info.html",
            controller: 'topicInfoCtrl'
        })
        .state('topic/post', {
            url: "/post/list?:currentPage?:sort?:keyword?:is_internal?:status",
            templateUrl: "views/post.list.html",
            controller: 'postListCtrl',
            resolve: {
                postView: function() {
                    return false;
                }
            }
        })
        .state('post/info', {
            url: "/post/info/:id",
            templateUrl: "views/post.info.html",
            controller: 'postInfoCtrl'
        })
        .state('topic/view', {
            url: "/topic/view/:topic_id?:currentPage",
            templateUrl: "views/topic.view.html",
            controller: 'postListCtrl',
            resolve: {
                postView: function() {
                    return {
                        value: 'simple'
                    };
                }
            }
        })
        //热门推荐
        .state('recommend/list', {
            url: "/recommend/list/:type?:currentPage",
            templateUrl: "views/recommend.list.html",
            controller: 'recommendListCtrl'
        })
        .state('recommend/goods', {
            url: "/recommend/goods/:type?:currentPage",
            templateUrl: "views/recommend.goods.html",
            controller: 'recommendListCtrl'
        })
        //爬虫管理
        .state('spider/task_create', {
            url: "/spider/task_create",
            templateUrl: "views/spider.task_info.html",
            controller: 'taskInfoCtrl'
        })
        .state('spider/task_list', {
            url: "/spider/task_list?:is_success?:is_continue_update?:status?:sort?:currentPage?:keyword",
            templateUrl: "views/spider.task_list.html",
            controller: 'taskListCtrl'
        })
        .state('spider/task_info', {
            url: "/spider/task_info/:id",
            templateUrl: "views/spider.task_info.html",
            controller: 'taskInfoCtrl'
        })
        .state('spider/sp_task_list', {
            url: "/spider/sp_task_list?:is_success?:status?:task_type?:object_type?:currentPage?:keyword?:object_id",
            templateUrl: "views/spider.sp_task_list.html",
            controller: 'spTaskListCtrl'
        })
        .state('spider/sp_task_info', {
            url: "/spider/sp_task_info/:id",
            templateUrl: "views/spider.sp_task_info.html",
            controller: 'spTaskInfoCtrl'
        })
        //权限管理
        .state('permission/set', { //accountCtrl.js
            url: "/permission/set/:username",
            templateUrl: "views/permission.set.html",
            controller: 'permissionCtrl'
        })
        .state('permission/administrators', { //userCtrl.js
            url: "/permission/administrators?:currentPage?:sort?:keyword?:is_internal?:status",
            templateUrl: "views/permission.administrators.html",
            controller: 'administratorCtrl'
        })
        //安装包管理
        .state('apppkg/list', {
            url: "/apppkg/list?:currentPage?:platform?:channel",
            templateUrl: "views/apppkg.list.html",
            controller: 'apppkgListCtrl'
        })
        .state('apppkg/info', {
            url: "/apppkg/info/:platform/:channel/:version",
            templateUrl: "views/apppkg.info.html",
            controller: 'apppkgInfoCtrl'
        })
        .state('apppkg/add', {
            url: "/apppkg/info",
            templateUrl: "views/apppkg.info.html",
            controller: 'apppkgInfoCtrl'
        })
        .state('apppkg/channel_list', {
            url: "/apppkg/channel_list?:currentPage?:status",
            templateUrl: "views/apppkg.channel_list.html",
            controller: 'channelListCtrl'
        })
        .state('apppkg/channel_info', {
            url: "/apppkg/channel_info/:name",
            templateUrl: "views/apppkg.channel_info.html",
            controller: 'channelInfoCtrl'
        })
        .state('apppkg/add_channel', {
            url: "/apppkg/add_channel",
            templateUrl: "views/apppkg.channel_info.html",
            controller: 'channelInfoCtrl'
        })
        //应用配置
        .state('appconfig/list', { //apppkgCtrl.js
            url: "/appconfig/list?:currentPage?:platform?:channel",
            templateUrl: "views/appconfig.list.html",
            controller: 'appconfigListCtrl'
        })
        .state('appconfig/update', { //apppkgCtrl.js
            url: "/appconfig/update?:currentPage?:platform?:channel",
            templateUrl: "views/appconfig.update.html",
            controller: 'appconfigUpdateCtrl'
        })
        //数据配置
        .state('dataconfig/update', { //apppkgCtrl.js
            url: "/dataconfig/data_config_create_or_edit?:type",
            templateUrl: "views/dataconfig.update.html",
            controller: 'dataconfigUpdateCtrl'
        })
        //商城管理
        .state('mall/navigation_list', {
            url: "/mall/navigation_list?:currentPage",
            templateUrl: "views/mall.navigation_list.html",
            controller: 'mallNavigationListCtrl'
        })
        .state('mall/navigation_info', {
            url: "/mall/navigation_info/:id?:poster_id?:banner_good_id",
            templateUrl: "views/mall.navigation_info.html",
            controller: 'mallNavigationInfoCtrl'
        })
        .state('mall/add_navigation', {
            url: "/mall/add_navigation",
            templateUrl: "views/mall.navigation_info.html",
            controller: 'mallNavigationInfoCtrl'
        })
        .state('mall/category_list', {
            url: "/mall/category_list/:navigation_id?:currentPage?:sort?:status?:keyword",
            templateUrl: "views/mall.category_list.html",
            controller: 'mallCategoryListCtrl'
        })
        .state('mall/category_info', {
            url: "/mall/category_info/:id",
            templateUrl: "views/mall.category_info.html",
            controller: 'mallCategoryInfoCtrl'
        })
        .state('mall/add_category', {
            url: "/mall/add_category",
            templateUrl: "views/mall.category_info.html",
            controller: 'mallCategoryInfoCtrl'
        })
        .state('mall/good_list', {
            url: "/mall/good_list/:platform?:currentPage?:navigation_id?:category_id?:sort?:keyword?:status",
            templateUrl: "views/mall.good_list.html",
            controller: 'mallGoodListCtrl'
        })
        .state('mall/good_info', {
            url: "/mall/good_info/:id?:_catch",
            templateUrl: "views/mall.good_info.html",
            controller: 'mallGoodInfoCtrl'
        })
        .state('mall/inner_good_info', {
            url: "/mall/inner_good_info/:id?:_catch",
            templateUrl: "views/mall.inner_good_info.html",
            controller: 'mallInnerGoodInfoCtrl'
        })
        .state('mall/add_inner_good', {
            url: "/mall/add_inner_good",
            templateUrl: "views/mall.inner_good_info.html",
            controller: 'mallInnerGoodInfoCtrl'
        })
        .state('mall/add_good', {
            url: "/mall/add_good",
            templateUrl: "views/mall.good_info.html",
            controller: 'mallGoodInfoCtrl'
        })
        .state('mall/task_good', {
            url: "/mall/task_good",
            templateUrl: "views/mall.good_task.html",
            controller: 'mallTaskGoodCtrl'
        })
        .state('mall/taoke_trans_detail', {
            url: "/mall/taoke_trans_detail?:currentPage?:order_status",
            templateUrl: "views/mall.taoke_trans_detail.html",
            controller: 'mallTaokeTransCtrl'
        })
        .state('activity/list', {
            url: "/activity/list?:currentPage?:start_time?:end_time?:status?:keyword",
            templateUrl: "views/mall.activity_list.html",
            controller: 'mallActivityListCtrl'
        })
        .state('activity/info', {
            url: "/activity/info/:id?:_catch",
            templateUrl: "views/mall.activity_info.html",
            controller: 'mallActivityInfoCtrl'
        })
        .state('activity/create', {
            url: "/activity/create?:_catch",
            templateUrl: "views/mall.activity_info.html",
            controller: 'mallActivityInfoCtrl'
        })
        .state('mall/inner_order_list', {
            url: "/mall/inner_order_list?:currentPage?:good_id?:user_id?:keyword?:status?:start_time?:end_time?:keyword_good?:keyword_user",
            templateUrl: "views/mall.inner_order_list.html",
            controller: 'mallInnerOrderListCtrl'
        })
        .state('mall/inner_order_info', {
            url: "/mall/inner_order_info/:id",
            templateUrl: "views/mall.inner_order_info.html",
            controller: 'mallInnerOrderInfoCtrl'
        })
        .state('mall/inner_order_deliver', {
            url: "/mall/inner_order_deliver/:id",
            templateUrl: "views/mall.inner_order_deliver.html",
            controller: 'mallInnerOrderDeliverCtrl'
        })
        .state('mall/coupon_list', {
            url: "/mall/coupon_list?:currentPage?:status?:is_used?:is_usable?:is_expired?:sort?:keyword?:user_id?:by_way",
            templateUrl: "views/mall.coupon_list.html",
            controller: 'mallCouponListCtrl'
        })
        .state('mall/gift_package_list', {
            url: "/mall/gift_package_list?:currentPage",
            templateUrl: "views/mall.gift_package_list.html",
            controller: 'mallGiftPackageListCtrl'
        })
        .state('mall/gift_package_info', {
            url: "/mall/gift_package_info/:id",
            templateUrl: "views/mall.gift_package_info.html",
            controller: 'mallGiftPackageInfoCtrl'
        })
        .state('mall/gift_package_create', {
            url: "/mall/gift_package_create",
            templateUrl: "views/mall.gift_package_info.html",
            controller: 'mallGiftPackageInfoCtrl'
        })
        .state('mall/good_comment_list', {
            url: "/mall/good_comment_list?:currentPage?:good_id?:publisher_id?:is_scored?:keyword_user?:keyword_good",
            templateUrl: "views/mall.good_comment_list.html",
            controller: 'mallGoodCommentListCtrl'
        })
        //意见反馈
        .state('feedback/list', {
            url: "/feedback/list?:currentPage?:submitter_id?:platform?:status",
            templateUrl: "views/feedback.list.html",
            controller: 'feedbackListCtrl'
        })
        .state('feedback/info', {
            url: "/feedback/info/:id",
            templateUrl: "views/feedback.info.html",
            controller: 'feedbackInfoCtrl'
        })
        //内容管理
        .state('audit/report', {
            url: "/audit/report?:currentPage?:object_type?:status",
            templateUrl: "views/audit.report.html",
            controller: 'auditReportCtrl'
        })
        .state('audit/content', {
            url: "/audit/content?:currentPage?:audit_type?:user_id?:audit_id",
            templateUrl: "views/audit.content.html",
            controller: 'auditContentCtrl'
        })
        .state('audit/action', {
            url: "/audit/action?:currentPage?:audit_type?:warn_type?:user_id",
            templateUrl: "views/audit.action.html",
            controller: 'auditActionCtrl'
        })
        //上传文件管理
        .state('storage/files', {
            url: "/storage/files?:currentPage?:sort?:referrer_type?:status?:uploader_id?:keyword",
            templateUrl: "views/storage.files.html",
            controller: 'storageFilesCtrl'
        })
        //上传文件管理
        .state('oplog/list', {
            url: "/oplog/list?:currentPage?:sort?:keyword?:operator_id?:operator_name",
            templateUrl: "views/oplog.list.html",
            controller: 'oplogListCtrl'
        })
        .state('oplog/user_list', {
            url: "/oplog/user_list?:currentPage?:sort?:keyword",
            templateUrl: "views/user_oplog.list.html",
            controller: 'userOplogListCtrl'
        })
        //业务统计管理
        .state('datamining/list', {
            url: "/datamining/list/:object_type/?:currentPage?:section?:time?:sort",
            templateUrl: "views/datamining.list.html",
            controller: 'dataminingCtrl'
        })
        .state('datamining/metric', {
            url: "/datamining/metric/:metric_type?:time_type?:currentPage?:view_type?:start_time?:end_time?:newuser",
            templateUrl: "views/datamining.metric.html",
            controller: 'dataminingMetricCtrl'
        })
        .state('datamining/newuser_metric_percents', {
            url: "/datamining/newuser_metric_percents?:time_type?:metric_type?:currentPage?:start_time?:end_time",
            templateUrl: "views/datamining.newuser_metric_percents.html",
            controller: 'dataminingNewUserMetricPercentsCtrl'
        })
        .state('horn/ad_list', {
            url: "/horn/ad_list?:currentPage",
            templateUrl: "views/horn.ad_list.html",
            controller: 'hornAdListCtrl'
        })
        .state('horn/ad_create', {
            url: "/horn/ad_create",
            templateUrl: "views/horn.ad_create.html",
            controller: 'hornAdCreateCtrl'
        })
        .state('horn/list', {
            url: "/horn/list?:currentPage?:sort?:keyword?:user_id",
            templateUrl: "views/horn.list.html",
            controller: 'hornListCtrl'
        })
        //消息推送管理
        .state('message/push', {
            url: "/message/push?:currentPage?:sort?:keyword?:user_id",
            templateUrl: "views/message.push.html",
            controller: 'messagePushCtrl'
        })
        //时间管理
        .state('timecondition/list', {
            url: "/timecondition/list?:currentPage?:type",
            templateUrl: "views/timecondition.list.html",
            controller: 'timeconditionListCtrl'
        })
        .state('timecondition/info', {
            url: "/timecondition/info/:id",
            templateUrl: "views/timecondition.info.html",
            controller: 'timeconditionInfoCtrl'
        })
        .state('timecondition/add', {
            url: "/timecondition/add",
            templateUrl: "views/timecondition.info.html",
            controller: 'timeconditionInfoCtrl'
        })
        .state('im/p2p_receive', {
            url: "/im/p2p_receive?:currentPage?:user_id?:keyword_user",
            templateUrl: "views/im.p2p_receive.html",
            controller: 'p2pReceiveCtrl'
        })
        .state('cloud/list', {
            url: "/cloud/list?:currentPage?:sort",
            templateUrl: "views/cloud.list.html",
            controller: 'cloudListCtrl'
        })
        .state('cloud/info', {
            url: "/cloud/info/:good_id/:cloud_num/:rewarded",
            templateUrl: "views/cloud.info.html",
            controller: 'cloudInfoCtrl'
        })
        .state('cloud/create', {
            url: "/cloud/create",
            templateUrl: "views/cloud.info.html",
            controller: 'cloudInfoCtrl'
        })
        .state('cloud/reward_list', {
            url: "/cloud/reward_list/:good_id?:sort?:status?:currentPage",
            templateUrl: "views/cloud.reward_list.html",
            controller: 'cloudRewardListCtrl'
        })
        .state('cloud/user_cloud_list', {
            url: "/cloud/user_cloud_list?:good_id?:user_id?:cloud_num?:sort?:currentPage?:keyword_user?:keyword_good",
            templateUrl: "views/cloud.user_cloud_list.html",
            controller: 'cloudUserListCtrl'
        })
        .state('audio/list', {
            url: "/audio/list?:currentPage",
            templateUrl: "views/audio.list.html",
            controller: 'audioListCtrl'
        })
        .state('audio/create', {
            url: "/audio/info",
            templateUrl: "views/audio.info.html",
            controller: 'audioInfoCtrl'
        })
        .state('audio/info', {
            url: "/audio/info/:id",
            templateUrl: "views/audio.info.html",
            controller: 'audioInfoCtrl'
        })
        .state('mall/address_list', {
            url: "/mall/address_list/:user_id?:keyword",
            templateUrl: "views/mall.address_list.html",
            controller: 'addressListCtrl'
        })


});
angular.module('lusirAdmin.controller', []);
