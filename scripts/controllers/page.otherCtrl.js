angular.module('lusirAdmin.controller').controller('storageFilesCtrl', function($scope, Storage, ObjectTypes, formatData, Filters, $stateParams, $state, Alert) {
        $scope.filter = Filters.pages($stateParams);
        $scope.objectTypes = ObjectTypes;
        Storage.list($scope.filter).then(function(data) {
            $scope.data = data.files;
            $scope.records = data.total;
        });
        $scope.delete = function(index) {
            Alert.confirm('确定删除吗?', function() {
                Storage.delete($scope.data[index].id, true).then(function() {
                    $scope.data.splice(index, 1);
                });
            })
        }
    }).controller('oplogListCtrl', function($scope, Oplog, formatData, Filters, $stateParams, $state, Alert) {
        $scope.filter = Filters.pages($stateParams);
        Oplog.list($scope.filter).then(function(data) {
            $scope.data = data.oplogs;
            $scope.records = data.total;
        });
    }).controller('userOplogListCtrl', function($scope, Oplog, formatData, Filters, $stateParams, $state, Alert) {
        $scope.filter = Filters.pages($stateParams);
        Oplog.userList($scope.filter).then(function(data) {
            $scope.data = data.oplogs;
            $scope.records = data.total;
        });
        $scope.delete = function(index) {
            Alert.confirm('确定删除吗?', function() {
                Oplog.delete({
                    "topic_id":$scope.data[index].topic_id, 
                    "post_id":$scope.data[index].post_id
                    }, true).then(function() {
                        $state.reload();
                });
            })
        }
        $scope.recovery = function(index) {
            Alert.confirm('确定恢复删除记录吗?', function() {
                Oplog.recovery({
                    "topic_id":$scope.data[index].topic_id, 
                    "post_id":$scope.data[index].post_id
                    }, true).then(function() {
                        $state.reload();
                });
            })
        }
    }).controller('oplogListCtrl', function($scope, Oplog, formatData, Filters, $stateParams, $state, Alert) {
        $scope.filter = Filters.pages($stateParams);
    }).controller('dataminingCtrl', function($scope, Datamining, formatData, Filters, $stateParams, $state, Alert) {
        $scope.filter = Filters.pages($stateParams);
        $scope.filter.section = $scope.filter.section ? $scope.filter.section : 'all'; //默认总和
        $scope.filter.time = formatDatamining($scope.filter.time, $scope.filter.section);
        $scope.filter[$scope.filter.section] = $scope.filter.time;
        if (($scope.filter.object_type == 'order_good' || $scope.filter.object_type == 'order_style') && !$scope.filter.sort) {
            $scope.filter.sort = 'status_0_count';
        }
        formatData($scope.filter, {
            remove: ['section', 'time']
        }, function(res) {
            if (res[$scope.filter.section]) {
                if ($scope.filter.section == 'week') { //周数据转换
                    res[$scope.filter.section] = dateDayToWeek(res[$scope.filter.section]);
                }
                if ($scope.filter.section == 'hour') {
                    res[$scope.filter.section] = res[$scope.filter.section].replace(/00$/, '');
                }
                res[$scope.filter.section] = res[$scope.filter.section].replace(/-/g, '').replace(/ /g, '').replace(/:/g, '');
            }
            Datamining[$scope.filter.section](res).then(function(data) {
                $scope.data = data.stats;
                $scope.records = data.total;
                $scope.counts = data.counts;
            });
        });
    }).controller('dataminingMetricCtrl', function($scope, Datamining, DateSv,formatData, Filters, $stateParams, $state, Alert) {
        var temp = Filters.pages($stateParams);
        $scope.filter= $.extend({},temp);
        if (!($scope.filter.time_type) && !($scope.filter.start_time && $scope.filter.end_time)) {
            $scope.filter.time_type = 'day';
        }
        if ($scope.filter.time_type) {
            $scope.filter.view_type="list";
            Datamining.metric_list($scope.filter).then(function(res) {
                $scope.data = res.metrics;
                $scope.records = res.total;
                $scope.metric_type = res.metric_type;
            });
        }else{
             $scope.filter.view_type="info";
             temp.start_time=DateSv.utc(temp.start_time);
             temp.end_time=DateSv.utc(temp.end_time);
            Datamining.metric_info(temp).then(function(res) {
                $scope.data = [res.metric];
                $scope.records = res.total;
                $scope.metric_type = res.metric_type;
            });
        }
        $scope.datesearch=function(){
            if($scope.filter.start_time && $scope.filter.end_time){
                $scope.filter.time_type=null;
                $scope.search();
            }
        }
         $scope.toggleView=function(){
            if($scope.filter.start_time){
                delete $scope.filter.start_time;
            }
            if($scope.filter.end_time){
                delete $scope.filter.end_time;
            }
            if($scope.filter.time_type){
                delete $scope.filter.time_type;
            }
        }
    }).controller('dataminingNewUserMetricPercentsCtrl', function($scope, Datamining, DateSv,formatData, Filters, $stateParams, $state, Alert) {
        var temp = Filters.pages($stateParams);
        $scope.filter= $.extend({},temp);
        if (!$scope.filter.time_type) {
            $scope.filter.time_type = 'day';
        }
        if (!$scope.filter.metric_type) {
            $scope.filter.metric_type = 'cloud';
        }
        Datamining.newuser_metric_percents($scope.filter).then(function(res) {
            $scope.metric_percents = res.data.metric_percents;
            $scope.records = res.data.metric_percents.length;
            $scope.filter.start_date = res.data.start_date;
            $scope.filter.end_date = res.data.end_date;
        });
        $scope.datesearch=function(){
            if($scope.filter.start_time && $scope.filter.end_time){
                $scope.filter.time_type=null;
                $scope.search();
            }
        }
    }).controller('hornAdListCtrl', function($scope, Horn, formatData, Filters, $stateParams, $state, Alert) {
        $scope.filter = Filters.pages($stateParams);
        Horn.ad_list($scope.filter).then(function(data) {
            $scope.data = data.horn_ads;
            $scope.records = data.total;
        });
        $scope.delete = function(index) {
            Alert.confirm('确定删除吗?', function() {
                Horn.ad_delete($scope.data[index].id, true).then(function() {
                    $scope.data.splice(index, 1);
                });
            })
        }
        $scope.add = function() {
            $scope.addData = {};
            $('.addPop').modal();
        }
        $scope.addSubmit = function() {
            formatData($scope.addData, {
                require: {
                    'msg': '广告内容'
                }
            }, function(res) {
                Horn.ad_create(res, true).then(function(data) {
                    $state.reload();
                });
            });
        }
        $scope.wordfilter = function() {
            $scope.wordfilterData = {};
            $('.wordfilterPop').modal();
        }
        $scope.wordfilterSubmit = function() {
            Horn.filter_words({
                words: $scope.wordfilterData.words
            }).then(function(res) {
                $scope.wordfilterData.filtered = res.words;
            })
        }
    }).controller('hornAdCreateCtrl', function($scope, Horn, formatData, Filters, $stateParams, $state, Alert) {
        $scope.data={
            status:1,
        }
        $scope.submit=function(){
            formatData($scope.data, {
                remove: [],
                require: {
                    'title': '广告标题',
                    'address': '广告链接',
                    'images': '广告图片',
                }
            }, function(res) {
                 Horn.ad_create(res, true).then(function() {
                    history.back();
                })
              });
        }
    }).controller('hornListCtrl', function($scope, Horn, formatData, Filters, $stateParams, $state, Alert) {
        $scope.filter = Filters.pages($stateParams);
        Horn.list($scope.filter).then(function(data) {
            $scope.data = data.horns;
            $scope.records = data.total;
        });
        $scope.delete = function(index) {
            Alert.confirm('确定删除吗?', function() {
                Horn.delete($scope.data[index].id, true).then(function() {
                    $scope.data.splice(index, 1);
                });
            })
        }
    }).controller('messagePushCtrl', function($scope, Message, formatData, Filters, $stateParams, $state, Alert) {
        $scope.data = {}
        $scope.updateType = function() {
            $scope.data.subtype = ''
        }
        $scope.submit = function() {
            formatData($scope.data, {
                require: {
                    'type': '类型',
                    'subtype': '子类型',
                    'send_type': '推送方式'
                }
            }, function(res) {
                Message.push($scope.data, true).then(function(res) {
                    history.back();
                })
            });
        }
    }).controller('timeconditionListCtrl', function($scope, Timecondition, formatData, Filters, $stateParams, $state, Alert) {
        $scope.filter = Filters.pages($stateParams);
        Timecondition.list($scope.filter).then(function(data) {
            $scope.data = data.time_conditions;
            $scope.records = data.total;
        });
        $scope.delete = function(index) {
            Alert.confirm('确定删除吗?', function() {
                Timecondition.delete($scope.data[index].id, true).then(function() {
                    $scope.data.splice(index, 1);
                });
            })
        }
    }).controller('timeconditionInfoCtrl', function($scope, Timecondition, formatData, Filters, $stateParams, $state, Alert) {
        $scope.filter = Filters.pages($stateParams);

        function list(s, e) {
            var list = [];
            for (var i = s; i <= e; i++) {
                list.push(i);
            }
            return list;
        }

        function filter(list) {
            console.log(list);
            if (list.indexOf(-1) > -1) {
                return "";
            } else {
                return list;
            }
        }
        $scope.dayList = list(1, 31);
        $scope.monthList = list(1, 12);
        $scope.weekList = list(0, 6);
        $scope.minuteList = list(0, 59);
        $scope.hourList = list(0, 23);
        if ($scope.filter.id) { //修改
            $scope.edit = true;
            Timecondition.info($scope.filter).then(function(data) {
                $scope.data = data.time_condition;
                $scope.data.month = filter($scope.data.month);
                $scope.data.day = filter($scope.data.day);
                $scope.data.week = filter($scope.data.week);
                $scope.data.minute = filter($scope.data.minute);
                $scope.data.hour = filter($scope.data.hour);
            });

        } else {
            $scope.data = {}
        }
        $scope.addToken = function() {
            if (!$scope.data.obj) {
                $scope.data.obj = {}
            }
            if (!$scope.data.obj.device_tokens) {
                $scope.data.obj.device_tokens = [];
            }
            $scope.data.obj.device_tokens.push('');
        }
        $scope.deleteToken = function(index) {
            $scope.data.obj.device_tokens.splice(index, 1);
        }
        $scope.submit = function() {
            if ($scope.data.audio_id && $scope.data.obj) {
                $scope.data.obj.audio_id = $scope.data.audio_id.join(',');
                if ($scope.data.obj.audio) {
                    delete $scope.data.obj.audio;
                }
            }
            var required = {
                'type': '类型'
            }

            if ($scope.data.type == 1) {
                required = $.extend(required, {
                    'obj.title': '文件标题',
                    'obj.audio_id': '音频文件'
                })
            }
            if ($scope.data.type == 3) {
                required = $.extend(required, {
                    'obj.device_tokens': '相关设备'
                })
            }
            formatData($scope.data, {
                require: required
            }, function(res) {
                if ($scope.filter.id) {
                    Timecondition.edit(res, true).then(function(res) {
                        history.back();
                    })
                } else {
                    Timecondition.add(res, true).then(function(res) {
                        history.back();
                    })
                }
            });
        }
    })
    .controller('p2pReceiveCtrl', function($scope, Im, formatData, Filters, $stateParams, $state, Alert) {
        $scope.filter = Filters.pages($stateParams);
        Im.list($scope.filter).then(function(data) {
            $scope.data = data.imp2ps;
            $scope.records = data.total;
        });
    })
    .controller('dataconfigUpdateCtrl', function($scope, DataConfig, formatData, Filters, $stateParams, $state, Alert) {
        $scope.filter = Filters.pages($stateParams);
        $scope.data = {};
        var lastVal = '';
        $scope.info = function(isAuto) {
            if (isAuto && !$scope.data.type) return false;
            if (isAuto && ($scope.data.type == lastVal)) return false;
            lastVal = $scope.data.type;
            formatData($scope.data, {
                only: ['type'],
                require: {
                    'type': '类型'
                }
            }, function(res) {
                DataConfig.info(res).then(function(data) {
                    if (!data.dataconfig) {
                        $scope.data.text = '';
                        return false;
                    }
                    $scope.data.text = data.dataconfig.text;
                })
            })
        }
        $scope.submit = function() {
            formatData($scope.data, {
                only: ['type', 'text'],
                require: {
                    'type': '类型',
                    'text': '配置内容'
                }
            }, function(res) {
                DataConfig.update(res).then(function(data) {
                    history.back();
                })
            })
        }
    })
