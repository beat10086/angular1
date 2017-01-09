angular.module('lusirAdmin.controller')
    .controller('cloudListCtrl', function($scope, Mall, formatData,DateSv, Filters, $stateParams, $state, Alert) {
        $scope.filter = Filters.pages($stateParams);
        Mall.cloud.list($scope.filter).then(function(data) {
            $scope.data = data.clouds;
            $scope.records = data.total;
        });
        $scope.cloudNext = function(index) {
            $scope.nextData = {
                good_id: $scope.data[index].id,
                is_closing_reward: $scope.data[index].is_closing_reward
            }
            $('.nextPop').modal();
        }
        $scope.nextSubmit=function(){
           if($scope.nextData.start_time) {
            $scope.nextData.start_time= DateSv.utc($scope.nextData.start_time);
           }
          Mall.cloud.gen_next($scope.nextData, true).then(function(data) {
              $state.reload();
          });

        };
        $scope.toggleDelete = function(index) {
            Mall.cloud.edit({
                good_id: $scope.data[index].id,
                is_deleted: $scope.data[index].is_deleted
            }, true);
        };
        $scope.buyFunc = function(index) {
            $scope.buyData = {
                good_id: $scope.data[index].id
            }
            $('.buyPop').modal();
        }
        $scope.buySubmit = function() {
            formatData($scope.buyData, {
                require: {
                    'user_id': '购买用户',
                    'buy_copies': '购买份数'
                }
            }, function(res) {
                Mall.cloud.user_cloud_create(res, true).then(function() {
                    $state.reload();
                });
            });
        }
    })
    .controller('cloudRewardListCtrl', function($scope, Mall, Filters, $stateParams, $state, Alert) {
        $scope.filter = Filters.pages($stateParams);
        Mall.cloud.reward_list($scope.filter).then(function(data) {
            $scope.data = data.clouds;
            $scope.records = data.total;
        });
    })
    .controller('cloudInfoCtrl', function($scope, Mall, PageDataCatch, DateSv, formatData, Filters, $stateParams, $state, Alert) {
        var _catch = false;
        $scope.$on('$stateChangeSuccess', function(event, next, nextParams, prev, prevParams) {
            _catch = prevParams._catch;
            updateGood();
        });
        var _catch_value = PageDataCatch.get('cloud_info' + $stateParams.good_id);
        $scope.filter = Filters.pages($stateParams);
        if ($scope.filter.good_id) {
            $scope.edit = true;
            Mall.cloud.info($scope.filter).then(function(data) {
                $scope.data = data.cloud;
                $scope.data.good_id = $scope.data.id;
                $scope.data.is_auto_cloud = $scope.data.is_auto_cloud ? true : false;
                $scope.data.closing_time = DateSv.local($scope.data.closing_time);
                $scope.data.start_time = DateSv.local($scope.data.start_time);
                updateGood();
            });
        } else {
            $scope.data = {};
            var date = new Date();
            $scope.data.start_time = date.format('yyyy-MM-dd hh:mm:00');
        }
        $scope.updateDate = function(type) {
            if (!($scope.data.start_time)) {
                return;
            }
            if (type != 3 ) {
                if(!$scope.data.closing_hours || !$scope.data.start_time){
                    return;
                }
                $scope.data.closing_time = DateSv.plus($scope.data.start_time, $scope.data.closing_hours);
            } else {
                if (!$scope.data.closing_time) return;
                if (Math.floor(DateSv.apart($scope.data.start_time, $scope.data.closing_time)) < 0) {
                    Alert.error('截止时间不得早于开启时间！');
                    return;
                }
                $scope.data.closing_hours = Math.floor(DateSv.apart($scope.data.start_time, $scope.data.closing_time));
            }
        }

        function updateGood() {
            if (_catch && _catch_value) {
                $scope.data = _catch_value;
                $scope.choseGood();
            }
        }
        $scope.choseGood = function() {
            if (!$scope.data.good_id) {
                return false;
            }
            Mall.good.info({
                id: $scope.data.good_id
            }).then(function(res) {
                var styles = res.good.styles;
                var theGoods;
                if (!styles || !styles.length) {
                    Alert.confirm('该商品没有设置云购款,是否前去设置?', function() {
                        PageDataCatch.add('cloud_info' + $stateParams.good, $scope.data);
                        $state.go('mall/inner_good_info', {
                            id: $scope.data.good_id,
                            _catch: $scope.data.good_id
                        });
                    });
                    return false;
                } else {
                    for (var i in styles) {
                        var item = styles[i];
                        if (item.is_cloud) {
                            theGoods = item;
                            $scope.data.name = res.good.name;
                            $scope.data.searchname = res.good.name;
                            $scope.data.intro = res.good.intro;
                            $scope.data.image_id = theGoods.image_ids[0];
                            $scope.data.image = theGoods.images[0];
                            $scope.data.max_copies = Math.ceil(theGoods.price);
                            return;
                        }
                    }
                    Alert.confirm('该商品没有设置云购款,是否前去设置?', function() {
                        PageDataCatch.add('cloud_info' + $stateParams.good, $scope.data);
                        $state.go('mall/inner_good_info', {
                            id: $scope.data.good_id,
                            _catch: $scope.data.good_id
                        });
                    });
                    return;

                }
            })
        }
        $scope.submit = function(index) {
            $scope.data.closing_time = DateSv.utc($scope.data.closing_time);
            $scope.data.start_time && ($scope.data.start_time = DateSv.utc($scope.data.start_time));
            if ($scope.filter.good_id) {
                formatData($scope.data, {
                    require: {
                        'id': '商品ID'
                    }
                }, function(res) {
                    Mall.cloud.edit(res, true).then(function() {
                        console.log($state);
                        history.back();
                    });
                });
            } else {
                formatData($scope.data, {
                    require: {
                        'good_id': '商品',
                        'name': '商品名称',
                        'image_id': '图片',
                        'max_copies': '份数',
                        'cloud_times': '云购期数',
                        'closing_time':'截止时间',
                        'closing_hours':"有效小时数"
                    }
                }, function(res) {
                    Mall.cloud.add(res, true).then(function() {
                        history.back();
                    });
                });
            }

        }
    })
    .controller('cloudUserListCtrl', function($scope, Mall, Filters, $stateParams, $state, Alert) {
        $scope.filter = Filters.pages($stateParams);
        $scope.params = $.extend({}, $scope.filter);
        Mall.cloud.user_cloud_list($scope.filter).then(function(data) {
            $scope.data = data.user_clouds;
            $scope.records = data.total;
        });
        $scope.cloudNext = function(index) {
            Alert.confirm("是否确定开启下期？", function() {
                Mall.cloud.gen_next({
                    good_id: $scope.data[index].id,
                    is_closing_reward: $scope.data[index].is_closing_reward
                }, true).then(function(data) {
                    $state.reload();
                });
            })
        }
        $scope.toggleDelete = function(index) {
            Mall.cloud.edit({
                good_id: $scope.data[index].id,
                is_deleted: $scope.data[index].is_deleted
            }, true);
        }
    })
