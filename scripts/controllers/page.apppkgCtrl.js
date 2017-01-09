
angular.module('lusirAdmin.controller')
//爬虫控制器
    .controller('apppkgListCtrl', function($scope, Apppkg, Channel, Filters, $stateParams, $state, Alert) {
        $scope.filter = Filters.pages($stateParams);
        Apppkg.list($scope.filter).then(function(data) {
            $scope.data = data.packages;
            $scope.records = data.total;
        });
        Channel.list({}, 'sub').then(function(data) {
            $scope.channels = data.channels;
        })
        $scope.delete = function(index) {
            Alert.confirm('确定删除吗?', function() {
                var deleteParams = {
                    platform: $scope.data[index].platform,
                    channel: $scope.data[index].channel,
                    version: $scope.data[index].version
                }
                Apppkg.delete(deleteParams, true).then(function() {
                    $scope.data.splice(index, 1);
                });
            })
        }
    })
    .controller('apppkgInfoCtrl', function($scope, Apppkg, Channel, Filters, formatData, $stateParams, $state, Alert) {
        var platform = $stateParams.platform;
        $scope.filter = Filters.pages($stateParams);
         $scope.uploadConfig = {};
        if (platform) { //编辑
            $scope.edit = true;
            Apppkg.info($scope.filter).then(function(data) {
                $scope.data = data.package;
                if ($scope.data.file && $scope.data.file.place) {
                    $scope.uploadConfig = {
                        place: $scope.data.file.place
                    };
                }
            });
        } else { //添加
            $scope.data = {};
            Channel.list({}, 'sub').then(function(data) {
                $scope.channels = data.channels;
            })
        }
        $scope.delete = function(index) {
            Alert.confirm('确定删除吗?', function() {
                Apppkg.delete($scope.filter, true).then(function() {
                    history.back();
                });
            })
        }
        $scope.submit = function() {
            if (platform) { //修改
                formatData($scope.data, {
                    remove: ['file', 'plist_file', 'create_time'],
                    require: {
                        'changelog': '更新日志',
                        'file_id': '安装包'
                    }
                }, function(res) {
                    Apppkg.edit(res, true).then(function() {
                        history.back();
                    })
                })
            } else { //添加
                formatData($scope.data, {
                    remove: ['file', 'plist_file', 'create_time'],
                    require: {
                        'platform': '平台',
                        'version': '版本',
                        'channel': '渠道',
                        'file_id': '安装包'
                    }
                }, function(res) {
                    Apppkg.add(res, true).then(function() {
                        $state.go('apppkg/list');
                    });
                })
            }

        }
    })
    .controller('channelListCtrl', function($scope, Channel, Filters, $stateParams, $state, Alert) {
        $scope.filter = Filters.pages($stateParams);
        Channel.list($scope.filter).then(function(data) {
            $scope.data = data.channels;
            $scope.records = data.total;
        });
        $scope.delete = function(index) {
            Alert.confirm('确定删除吗?', function() {
                var deleteParams = {
                    name: $scope.data[index].name
                }
                Channel.delete(deleteParams, true).then(function() {
                    $scope.data.splice(index, 1);
                });
            })
        }
        $scope.changeStatus = function(index) {
            Channel.edit({
                name: $scope.data[index].name,
                status: $scope.data[index].status
            }, true);
        }
    })
    .controller('channelInfoCtrl', function($scope, Channel, Filters, formatData, $stateParams, $state, Alert) {
        var name = $stateParams.name;
        $scope.filter = Filters.pages($stateParams);
        if (name) { //编辑
            $scope.edit = true;
            Channel.info($scope.filter).then(function(data) {
                $scope.data = data.channel;
                // $scope.data.is_official = $scope.data.is_official || false;
            });
        } else { //添加
            $scope.data = {};
            Channel.list({}, 'sub').then(function(data) {
                $scope.channels = data.channels;
            })
        }
        $scope.delete = function(index) {
            Alert.confirm('确定删除吗?', function() {
                Channel.delete($scope.filter, true).then(function() {
                    history.back();
                });
            })
        }
        $scope.submit = function() {
            if (name) { //修改
                formatData($scope.data, {
                    only: ['desc', 'status', 'name'],
                    require: {
                        'desc': '渠道描述',
                        'status': '状态'
                    }
                }, function(res) {
                    Channel.edit(res, true).then(function() {
                        history.back();
                    })
                })
            } else { //添加
                formatData($scope.data, {
                    only: ['name', 'status', 'desc'],
                    require: {
                        'name': '平台',
                        'desc': '渠道描述',
                        'status': '状态'
                    }
                }, function(res) {
                    Channel.add(res, true).then(function() {
                        $state.go('apppkg/list');
                    });
                })
            }

        }
    })
    .controller('appconfigListCtrl', function($scope, AppConfig, Filters, $stateParams, $state, Alert) {
        $scope.filter = Filters.pages($stateParams);
        AppConfig.list($scope.filter).then(function(data) {
            $scope.data = data.configs;
            $scope.records = data.total;
        });
        $scope.release = function(index) {
            Alert.confirm('确定发布吗?', function() {
                AppConfig.release_config({
                    platform: $scope.data[index].platform
                }).then(function(data) {
                    history.back();
                })
            });
        }
    })
    .controller('appconfigUpdateCtrl', function($scope, AppConfig, formatData, Filters, $stateParams, $state, Alert) {
        $scope.filter = Filters.pages($stateParams);
        $scope.data = {};
        var lastVal = '';
        $scope.getNewest = function(isAuto) {
            if (isAuto && !$scope.data.platform) return false;
            if (isAuto && ($scope.data.platform == lastVal)) return false;
            lastVal = $scope.data.platform;
            formatData($scope.data, {
                only: ['platform'],
                require: {
                    'platform': '平台'
                }
            }, function(res) {
                AppConfig.newest_config(res).then(function(data) {
                    if (!data.config) {
                        $scope.data.data_ = '';
                        return false;
                    }
                    data.config.data_ = JSON.stringify(data.config.data);
                    $scope.data = data.config;
                })
            })
        }
        $scope.submit = function() {
            formatData($scope.data, {
                only: ['platform', 'data_'],
                require: {
                    'platform': '平台',
                    'data_': '配置内容'
                }
            }, function(res) {
                AppConfig.update(res, true).then(function(data) {
                    history.back();
                })
            })
        }
    })
