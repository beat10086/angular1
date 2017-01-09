angular.module('lusirAdmin')
    .filter('datetime', function() {
        return function(text) {
            if (!text) return text;
            return $.getLocalTime(text);
        }
    })
    .filter('isnear', function() {
        function _time(time) {
            time = time.replace(/(\s|:)/g, function() {
                return '-';
            }).split('-');
            var date = new Date(time[0], (parseInt(time[1]) - 1), time[2], time[3], time[4], time[5]).getTime();
            return date;
        }
        return function(text) {
            theday = _time(text);
            var now = new Date().getTime();
            if ((theday - now)/1000<86400) {
                return  '【即将截止】'+text ;
            }
            return text;
        }
    })
    .filter('afternow', function() {
        function _time(time) {
            time = time.replace(/(\s|:)/g, function() {
                return '-';
            }).split('-');
            var date = new Date(time[0], (parseInt(time[1]) - 1), time[2], time[3], time[4], time[5]).getTime();
            return date;
        }
        return function(text) {
            if(!text) return text;
            theday = _time(text);
            var now = new Date().getTime();
            if ((theday >now)) {
                return  '【尚未揭晓】'+text ;
            }
            return text;
        }
    })
    
    .filter('display', function() {
        return function(text) {
            switch (text) {
                case 1:
                    return '正常'
                    break;
                default:
                    return '隐藏'
                    break;
            }
        }
    }).filter('disable', function() {
        return function(text) {
            switch (text) {
                case 1:
                    return '正常'
                    break;
                default:
                    return '禁用'
                    break;
            }
        }
    }).filter('task_type', function() {
        return function(text) {
            return {
                'taobao': '淘宝商品',
                'taobaoyao': '淘宝药品',
                'taobaokelinkconvert': '淘宝客链接转换',
                'taokedetail': '淘客报表详情'
            }[text] || text
        }
    }).filter('audit_type', function() {
        return function(text) {
            return {
                '1': '话题标题',
                '2': '话题内容',
                '3': '回帖内容',
                '4': '商品评论',
                '5': '小喇叭',
                '6': '私信'
            }[text] || text
        }
    }).filter('warn_type', function() {
        return function(text) {
            return {
                1: '已禁止发送',
                2: '内容警告'
            }[text] || text;
        }
    })
    .filter('msg_type', function() {
        return function(text) {
            return {
                //1文本 2图片 3打赏金币
                1: '文本',
                2: '图片',
                3: '打赏金币'
            }[text] || text;
        }
    })

.filter('task_object_type', function() {
        return function(text) {
            return {
                'good': '商城商品',
                'taokedetail': '淘客报表详情',
            }[text] || text
        }
    }).filter('processstatus', function() {
        return function(text) {
            return {
                1: '等待',
                2: '进行中',
                3: '完成'
            }[text] || text
        }
    }).filter('objecttype', function(ObjectTypes) {
        return function(text) {
            for (var i in ObjectTypes) {
                if (text == ObjectTypes[i].key) {
                    return ObjectTypes[i].name
                }
            }
            return text;
        }
    }).filter('objectname', function() {
        return function(item) {
            if (!item) return item;
            return item.title || (item.names && item.names.join(',')) || item.nick || item.username || item.name || item.content
        }
    }).filter('internal', function() {
        return function(obj) {
            if (!obj) return obj;
            var is = '';
            var name = obj.nick || obj.username
            if (obj.is_internal) {
                is = '(内部)'
            }
            return name + is;
        }
    }).filter('verify', function() {
        //0待审核，1审核通过，2审核失败，3隐藏
        return function(text) {
            switch (text) {
                case 0:
                    return '待审核'
                    break;
                case 1:
                    return '审核通过'
                    break;
                case 2:
                    return '审核失败'
                    break;
                case 3:
                    return '隐藏'
                    break;
                default:
                    return '隐藏'
                    break;
            }
        }
    }).filter('subt', function() {
        return function(text) {
            if ($.trim(text) == '') return text;
            return '— ' + text;
        }
    }).filter('arraytostring', function() {
        return function(text) {
            if (typeof text != 'object') return text;
            return text.join(',');
        }
    }).filter('stringtoarray', function() {
        return function(text) {
            if (typeof text != 'string') return text;
            return [text];
        }
    }).filter('starsName', function() {
        return function(obj) {
            if (typeof obj != 'object') return obj;
            var names = [];
            for (var i in obj) {
                names.push(obj[i].names.join(','));
            }
            return names.join('、');
        }
    }).filter('sexfilter', function() {
        return function(text) {
            switch (text) {
                case true:
                case '1':
                    return '是'
                    break;
                case false:
                case '0':
                    return '否'
                default:
                    return '未标记'
                    break;
            }
        }
    }).filter('cut', function() {
        return function(text) {
            return text.split('').splice(0, 20).join('');
        }
    }).filter('booleanfilter', function() {
        return function(text) {
            switch (text) {
                case true:
                case '1':
                    return '是'
                    break;
                case false:
                case '0':
                    return '否'
                default:
                    return '否'
                    break;
            }
        }
    }).filter('genderfilter', function() {
        return function(text) {
            switch (text) {
                case 'm':
                    return '男'
                    break;
                case 'f':
                    return '女';
                    break;
                default:
                    return '中性'
                    break;
            }
        }
    }).filter('filemime', function() {
        return function(text) {
            if (!angular.isString(text)) return text;
            var list = text.split('.');
            return list[list.length - 1];
        }
    }).filter('isrelease', function() {
        return function(text) {
            switch (text) {
                case 0:
                    return '未发布'
                    break;
                case 1:
                    return '已发布';
                    break;
                default:
                    return '未发布'
                    break;
            }
        }
    }).filter('price', function() {
        return function(text) {
            if (typeof text == 'undefined') return text;
            return '￥' + text;
        }
    }).filter('order_status', function() {
        return function(text) {
            return {
                0: '订单创建',
                10: '订单付款',
                50: '订单结算',
                60: '订单失效'
            }[text];
        }
    }).filter('stylesprice', function() {
        return function(text) {
            if (!angular.isArray(text)) return text;
            var plist = [];
            for (var i in text) {
                var p = text[i].price;
                if (p) {
                    plist.push(parseFloat(p));
                }
            }
            plist = plist.sort();
            var min = plist[0];
            var max = plist[plist.length - 1];
            return min == max ? '￥' + min : '￥' + min + '~ ￥' + max;
        }
    }).filter('stylesnum', function() {
        return function(text) {
            if (!angular.isArray(text)) return text;
            var num = 0;
            for (var i in text) {
                var p = text[i].num;
                num += p;
            }
            return num;
        }
    }).filter('totalprice', function() {
        return function(text) {
            if (!angular.isArray(text)) return text;
            var t = 0;
            for (var i in text) {
                var item = parseFloat(text[i].price);
                t += item;
            }
            return '￥' + t;
        }
    })
    .filter('isunlimit', function() {
        return function(text) {
            if (text == -1) {
                return '不限'
            }
            return text;
        }
    })
    .filter('weeklist', function() {
        return function(text) {
            if(typeof text === 'undefined' || text ===  null) return text;
            if (text == -1) {
                return '不限'
            }
            var temp = text.split(',');
            for (var i in temp) {
                temp[i] = parseInt(temp[i]) + 1
            }
            return temp.join(',');
        }
    })
    .filter('cloudstatus', function() {
        return function(text) {
            return {
                '1': '云购中',
                '2': '计算中',
                '3': '已结束',
                '4': '未开始',
            }[text];
        }
    })
    .filter('usercloudstatus', function() {
        return function(text) {
            return {
                '1': '云购中',
                '2': '计算中',
                '3': '已结束',
                '4': '已退款',
                '5': '已揭晓',
                '6': '未开始',
            }[text];
        }
    })
    .filter('rewardstatus', function() {
        return function(text) {
            return {
                '1': '未领取',
                '2': '已领取',
                '3': '已发货'
            }[text];
        }
    })
    .filter('channel', function() {
        return function(text) {
            return {
                'alipay': '支付宝',
                'upacp': '银联',
            }[text]
        }
    })
    .filter('couponway', function() {
        return function(text) {
            return {
                'invite': '邀请',
                'exchange': '兑换',
                'system':'系统'
            }[text]
        }
    })
    .filter('timetype', function(){
        return function(text) {
            return {
                'hour': '日',
                'day': '天',
                'week': '周',
                'month': '月'
            }[text]
        }
    })
