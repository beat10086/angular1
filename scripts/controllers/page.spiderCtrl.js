
angular.module('lusirAdmin.controller')
//爬虫控制器
    .controller('taskInfoCtrl', function($scope, $stateParams, Stars, Filters, Spider, LoginUser, formatData, Alert) {
        var id = $stateParams.id;
        if (id) { //详情
            $scope.edit = true;
            Spider.task_info(id).then(function(res) {
                $scope.data = res.task;
            });
            $scope.submit = function() {
                formatData($scope.data, {
                    only: ['is_continue_update', 'id'],
                    require: {
                        'is_continue_update': '是否持续更新'
                    }
                }, function(res) {
                    Spider.task_edit(res, true).then(function() {
                        history.back();
                    })
                })
            }
        } else { //添加
            $scope.data = {};
            LoginUser().then(function(res) {
                $scope.data.creator = res;
            })
            $scope.submit = function() {
                formatData($scope.data, {
                    remove: ['group', 'creator'],
                    require: {
                        'url': '网页链接',
                        'group_id': '小组',
                        'creator_username': '用户'
                    }
                }, function(res) {
                    Spider.task_create(res, true).then(function() {
                        history.back();
                    })
                })
            }
        }

    })
    .controller('spTaskListCtrl', function($scope, $stateParams, $state, Stars, Filters, Spider, LoginUser, formatData, Alert) {
        $scope.filter = Filters.pages($stateParams);
        Spider.sp_task_list($scope.filter).then(function(data) {
            $scope.data = data.sp_tasks;
            $scope.records = data.total;
        });
        $scope.retry = function(index) {
            Spider.sp_task_retry($scope.data[index].id, true).then(function() {
                $state.reload();
            });
        };
        $scope.update = function(index) {
            Spider.sp_task_update($scope.data[index].id, true).then(function() {
                $state.reload();
            });
        }

    })
    .controller('taskListCtrl', function($scope, $stateParams, $state, Stars, Filters, Spider, LoginUser, formatData, Alert) {
        $scope.filter = Filters.pages($stateParams);
        Spider.task_list($scope.filter).then(function(data) {
            $scope.data = data.tasks;
            $scope.records = data.total;
        });
        $scope.retry = function(index) {
            Spider.task_retry($scope.data[index].id, true).then(function() {
                $state.reload();
            });
        };
        $scope.update = function(index) {
            Spider.task_update($scope.data[index].id, true).then(function() {
                $state.reload();
            });
        }
    })
    .controller('spTaskInfoCtrl', function($scope, $stateParams, Stars, Filters, Spider, LoginUser, formatData, Alert) {
        var id = $stateParams.id;
        Spider.sp_task_info(id).then(function(res) {
            $scope.data = res.sp_task;
        });
        $scope.submit = function() {
            formatData($scope.data, {
                only: ['is_continue_update', 'id'],
                require: {
                    'is_continue_update': '是否持续更新'
                }
            }, function(res) {
                Spider.task_edit(res, true).then(function() {
                    history.back();
                })
            })
        }
    })
