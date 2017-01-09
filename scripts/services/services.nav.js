angular.module('lusirAdmin')
    .factory('NavList', function(Mall) {
        var nav = [{
            name: '老师管理',
            path: 'star',
            icon: 'star',
            permission: 'admin.star',
            sublist: [{
                name: '老师列表',
                path: 'list',
                permission: 'admin.star.list'
            }, {
                name: '添加老师',
                path: 'add',
                permission: 'admin.star.add'
            }, {
                name: '老师作品',
                path: 'work_list',
                permission: 'admin.star.work_list'
            }, {
                name: '老师写真',
                path: 'photo_list',
                permission: 'admin.star.photo_list'
            }, {
                name: '众包写真',
                path: 'crowdsourced_photo_list',
                permission: 'admin.star.crowdsourced_photo_list'
            }, {
                name: '专辑列表',
                path: 'album_list',
                permission: 'admin.star.album_list'
            }, {
                name: '创建专辑',
                path: 'create_album',
                permission: 'admin.star.create_album'
            }]
        }, {
            name: '人脸管理',
            path: 'face',
            icon: 'eye-open',
            permission: 'admin.face',
            sublist: [{
                name: '人脸列表',
                path: 'list',
                permission: 'admin.face.list'
            }, {
                name: '老师识别记录',
                path: 'star_recognize_list',
                permission: 'admin.face.star_recognize_list'
            }]
        }, {
            name: '用户管理',
            path: 'user',
            icon: 'user',
            permission: 'admin.user',
            sublist: [{
                name: '用户列表',
                path: 'list',
                permission: 'admin.user.list'
            }]
        }, {
            name: '小组管理',
            path: 'group',
            icon: 'flag',
            permission: 'admin.group',
            sublist: [{
                name: '小组列表',
                path: 'list',
                permission: 'admin.group.list'
            }, {
                name: '创建小组',
                path: 'create',
                permission: 'admin.group.create'
            }]
        }, {
            name: '话题管理',
            path: 'topic',
            icon: 'comment',
            permission: 'admin.topic',
            sublist: [{
                name: '话题列表',
                path: 'list',
                permission: 'admin.topic.list'
            }, {
                name: '创建话题',
                path: 'create',
                permission: 'admin.topic.create'
            }, {
                name: '帖子列表',
                path: 'post',
                permission: 'admin.post.list'
            }]
        }, {
            name: '内容推荐',
            path: 'recommend',
            icon: 'thumbs-up',
            permission: 'admin.recommend',
            sublist: [{
                name: '部落--小组',
                path: 'list',
                params: {
                    type: "hot_group"
                },
                permission: 'admin.recommend.list'
            }, {
                name: '部落--热门banner',
                path: 'list',
                params: {
                    type: "banner_topic",
                },
                permission: 'admin.recommend.list'
            }, {
                name: '部落--热门',
                path: 'list',
                params: {
                    type: "hot_topic"
                },
                permission: 'admin.recommend.list'
            }, {
                name: '首页置顶话题',
                path: 'list',
                params: {
                    type: "top_topic"
                },
                permission: 'admin.recommend.list'
            }, {
                name: '首页每日之星',
                path: 'list',
                params: {
                    type: "daily_star"
                },
                permission: 'admin.recommend.list'
            }, {
                name: '首页小组推荐',
                path: 'list',
                params: {
                    type: "index_group"
                },
                permission: 'admin.recommend.list'
            }, {
                name: '广场老师推荐',
                path: 'list',
                params: {
                    type: "hot_star"
                },
                permission: 'admin.recommend.list'
            }, {
                name: '广场Banner',
                path: 'list',
                params: {
                    type: "ad_group_index"
                },
                permission: 'admin.recommend.list'
            }, {
                name: '广场新手必读',
                path: 'list',
                params: {
                    type: "novice_must_read"
                },
                permission: 'admin.recommend.list'
            }, {
                name: '广场今日头条',
                path: 'list',
                params: {
                    type: "today_headline"
                },
                permission: 'admin.recommend.list'
            }, {
                name: '广场达人推荐',
                path: 'list',
                params: {
                    type: "hot_user"
                },
                permission: 'admin.recommend.list'
            }, {
                name: '新生代老师',
                path: 'list',
                params: {
                    type: "new_star"
                },
                permission: 'admin.recommend.list'
            }, {
                name: '推荐作品专辑',
                path: 'list',
                params: {
                    type: "hot_album"
                },
                permission: 'admin.recommend.list'
            }]
        }, {
            name: '商城内容推荐',
            path: 'recommend',
            icon: 'tag',
            permission: 'admin.recommend',
            sublist: [{
                name: '云购推荐',
                path: 'list',
                params: {
                    type: "cloud"
                },
                permission: 'admin.recommend.list'
            }, {
                name: '集市--体验报告',
                path: 'list',
                params: {
                    type: "good_topic"
                },
                permission: 'admin.recommend.list'
            }, {
                name: '集市--Banner',
                path: 'goods',
                params: {
                    type: "ad_mall_index"
                },
                permission: 'admin.recommend.list'
            }, {
                name: '商城最新上架',
                path: 'goods',
                params: {
                    type: "new_good"
                },
                permission: 'admin.recommend.list'
            }, {
                name: '商城每日折扣',
                path: 'goods',
                params: {
                    type: "daily_good"
                },
                permission: 'admin.recommend.list'
            }]
        }, {
            name: '商城管理',
            path: 'mall',
            icon: 'shopping-cart',
            permission: 'admin.mall',
            sublist: [{
                name: '导航列表',
                path: 'navigation_list',
                permission: 'admin.mall.navigation_list'
            }, {
                name: '类别列表',
                path: 'category_list',
                permission: 'admin.mall.category_list'
            }, {
                name: '淘客商品',
                path: 'good_list',
                params: {
                    "platform": "1"
                },
                permission: 'admin.mall.goodlist'
            }, {
                name: '自营商品',
                path: 'good_list',
                params: {
                    "platform": "2"
                },
                permission: 'admin.mall.goodlist'
            }, {
                name: '淘宝交易详情',
                path: 'taoke_trans_detail',
                permission: 'admin.mall.taoke_trans_detail'
            }, {
                name: '自营订单',
                path: 'inner_order_list',
                permission: 'admin.mall.inner_order_list'
            }, {
                name: '优惠券列表',
                path: 'coupon_list',
                permission: 'admin.mall.coupon_list'
            }, {
                name: '赠品列表',
                path: 'gift_package_list',
                permission: 'admin.mall.gift_package_list'
            }, {
                name: '商城评论管理',
                path: 'good_comment_list',
                permission: 'admin.mall.good_comment_list'
            }, {
                name: '地址管理',
                path: 'address_list',
                permission: 'admin.mall.address_list'
            }]
        }, {
            name: '云购管理',
            path: 'cloud',
            icon: 'cloud',
            permission: 'admin.mall',
            sublist: [{
                name: '云购列表',
                path: 'list',
                permission: 'admin.mall.cloud_list'
            }, {
                name: '获奖列表',
                path: 'reward_list',
                permission: 'admin.mall.reward_list'
            }, {
                name: '创建云购',
                path: 'create',
                permission: 'admin.mall.cloud_create'
            }, {
                name: '购买记录',
                path: 'user_cloud_list',
                permission: 'admin.mall.user_cloud_list'
            }]
        }, {
            name: '活动管理',
            path: 'activity',
            icon: 'calendar',
            permission: 'admin.mall',
            sublist: [{
                name: '秒杀活动',
                path: 'list',
                permission: 'admin.mall.activity_list'
            }]
        }, {
            name: '电台管理',
            path: 'audio',
            icon: 'headphones',
            permission: 'admin.audio',
            sublist: [{
                name: '音频列表',
                path: 'list',
                permission: 'admin.audio'
            }, {
                name: '创建音频',
                path: 'create',
                permission: 'admin.audio.create'
            }]
        }, {
            name: '爬虫管理',
            path: 'spider',
            icon: 'link',
            permission: 'admin.spider',
            sublist: [{
                name: '抓取话题',
                path: 'task_create',
                permission: 'admin.spider.task_create'
            }, {
                name: '话题任务列表',
                path: 'task_list',
                permission: 'admin.spider.task_list'
            }, {
                name: '单页任务列表',
                path: 'sp_task_list',
                permission: 'admin.spider.sp_task_list'
            }]
        }, {
            name: '意见反馈管理',
            path: 'feedback',
            icon: 'envelope',
            permission: 'admin.feedback',
            sublist: [{
                name: '反馈列表',
                path: 'list',
                permission: 'admin.feedback.list'
            }]
        }, {
            name: '内容审核管理',
            path: 'audit',
            icon: 'warning-sign',
            permission: 'admin.audit',
            sublist: [{
                name: '举报内容',
                path: 'report',
                permission: 'admin.report.list'
            }, {
                name: '重复内容',
                path: 'content',
                permission: 'admin.audit.action_list'
            }, {
                name: '重复行为',
                path: 'action',
                permission: 'admin.audit.content_list'
            }]
        }, {
            name: '小喇叭管理',
            path: 'horn',
            icon: 'volume-up',
            permission: 'admin.horn',
            sublist: [{
                name: '小喇叭广告列表',
                path: 'ad_list',
                permission: 'admin.horn.horn_ad_list'
            }, {
                name: '用户消息列表',
                path: 'list',
                permission: 'admin.horn.horn_list'
            }]
        }, {
            name: '时间条件管理',
            path: 'timecondition',
            icon: 'time',
            permission: 'admin.timecondition',
            sublist: [{
                name: '时间条件对象列表',
                path: 'list',
                permission: 'admin.timecondition.list'

            }]
        }, {
            name: '私信管理',
            path: 'im',
            icon: 'send',
            permission: 'admin.im',
            sublist: [{
                name: '私信列表',
                path: 'p2p_receive',
                permission: 'admin.im.p2p_receive'

            }]
        }, {
            name: '消息推送',
            path: 'message',
            icon: 'bell',
            permission: 'admin.message',
            sublist: [{
                name: '推送消息',
                path: 'push',
                permission: 'admin.message.push'
            }]
        }, {
            name: '安装包管理',
            path: 'apppkg',
            icon: 'th-large',
            permission: 'admin.apppkg',
            sublist: [{
                name: '安装包列表',
                path: 'list',
                permission: 'admin.apppkg.list'
            }, {
                name: '添加新包',
                path: 'add',
                permission: 'admin.apppkg.add'
            }, {
                name: '渠道列表',
                path: 'channel_list',
                permission: 'admin.apppkg.channel_list'
            }, {
                name: '添加渠道',
                path: 'add_channel',
                permission: 'admin.apppkg.add_channel'
            }]
        }, {
            name: '应用配置管理',
            path: 'appconfig',
            icon: 'file',
            permission: 'admin.appconfig',
            sublist: [{
                name: '更新历史',
                path: 'list',
                permission: 'admin.appconfig.config_list'
            }, {
                name: '更新配置',
                path: 'update',
                permission: 'admin.appconfig.update_config'
            }]
        }, {
            name: '数据配置管理',
            path: 'dataconfig',
            icon: 'tag',
            permission: 'admin.dataconfig',
            sublist: [{
                name: '更新配置',
                path: 'update',
                permission: 'admin.dataconfig.data_config_create_or_edit'
            }]
        }, {
            name: '上传文件管理',
            path: 'storage',
            icon: 'open',
            permission: 'admin.storage',
            sublist: [{
                name: '文件列表',
                path: 'files',
                permission: 'admin.storage.file_list'
            }]
        }, {
            name: '操作日志查看',
            path: 'oplog',
            icon: 'list-alt',
            permission: 'admin.oplog',
            sublist: [{
                name: '后台操作日志',
                path: 'list',
                permission: 'admin.oplog.list'
            }, {
                name: '用户操作日志',
                path: 'user_list',
                permission: 'admin.oplog.user_list'
            }]
        }, {
            name: '权限管理',
            path: 'permission',
            icon: 'lock',
            permission: 'admin.auth',
            sublist: [{
                name: '管理员列表',
                path: 'administrators',
                permission: 'admin.auth.administrator_list'
            }, {
                name: '开通权限',
                path: 'set',
                permission: 'admin.auth.set_user_permissions'
            }]
        }, {
            name: '业务对象统计',
            path: 'datamining',
            icon: 'signal',
            permission: 'admin.datamining',
            sublist: [{
                name: '用户统计',
                path: 'list',
                permission: 'admin.datamining',
                params: {
                    object_type: "user"
                }
            }, {
                name: '老师统计',
                path: 'list',
                permission: 'admin.datamining',
                params: {
                    object_type: "star"
                }
            }, {
                name: '小组统计',
                path: 'list',
                permission: 'admin.datamining',
                params: {
                    object_type: "group"
                }
            }, {
                name: '话题统计',
                path: 'list',
                permission: 'admin.datamining',
                params: {
                    object_type: "topic"
                }
            }, {
                name: '订单商品统计',
                path: 'list',
                permission: 'admin.datamining',
                params: {
                    object_type: "order_good"
                }
            }, {
                name: '订单款式统计',
                path: 'list',
                permission: 'admin.datamining',
                params: {
                    object_type: "order_style"
                }
            }]
        }, {
            name: '业务指标统计',
            path: 'datamining',
            icon: 'align-left',
            permission: 'admin.datamining',
            sublist: [{
                name: '云购统计',
                path: 'metric',
                params: {
                    metric_type: "cloud"
                },
                permission: 'admin.datamining',
            }, {
                name: '商城统计',
                path: 'metric',
                params: {
                    metric_type: "good"
                },
                permission: 'admin.datamining'
            }, {
                name: '新增用户分析',
                path: 'newuser_metric_percents',
                params: {},
                permission: 'admin.datamining'
            }]
        }];

        return nav;
    });
