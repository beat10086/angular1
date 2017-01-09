angular.module('lusirAdmin.controller')
    .controller('groupListCtrl', function($scope, Groups, RealtimeSearch, Filters, $stateParams, $state, Alert) {
        $scope.filter = Filters.pages($stateParams);
        if ($scope.filter.keyword) {
            $scope.filter.type = 'group';
            RealtimeSearch.search($scope.filter).then(function(data) {
                data.hits = data.hits.map(function(item) {
                    console.log(item.object);
                    return item.object;
                })
                $scope.data = data.hits;
                $scope.records = data.total;
            })
        } else {
            Groups.list($scope.filter).then(function(data) {
                $scope.data = data.groups;
                $scope.records = data.total;
            });
        }
        $scope.delete = function(index) {
            Alert.confirm('确定删除吗?', function() {
                Groups.delete($scope.data[index].id, true).then(function() {
                    $scope.data.splice(index, 1);
                });
            })
        }
        $scope.changeCoverSex = function(index) {
            Groups.edit({
                id: $scope.data[index].id,
                is_sexy: $scope.data[index].is_sexy
            }, true);
        }
        $scope.changeStatus = function(index) {
            Groups.edit({
                id: $scope.data[index].id,
                status: $scope.data[index].status
            }, true);
        }
    })
    .controller('groupInfoCtrl', function($scope, Groups, Filters, formatData, $stateParams, $state, Alert) {
        var id = $stateParams.id;
        $scope.filter = Filters.pages($stateParams);
        if (id) { //编辑
            $scope.edit = true;
            Groups.info($scope.filter).then(function(data) {
                $scope.data = data.group;
                $scope.records = data.total;
                $scope.data.is_official = $scope.data.is_official || false;
            });
        } else { //添加
            $scope.data = {};
        }
        $scope.removeStar = function(index) {
            delete $scope.data.star;
            delete $scope.data.star_id;
        }
        $scope.delete = function(index) {
            Alert.confirm('确定删除吗?', function() {
                Groups.delete(id, true).then(function() {
                    history.back();
                });
            })
        }
        $scope.submit = function() {
            formatData($scope.data, {
                remove: ['star', 'creator', 'create_time', 'creator_id'],
                require: {
                    'title': '小组标题'
                }
            }, function(res) {
                if (id) { //修改
                    Groups.edit(res, true).then(function() {
                        history.back();
                    })
                } else { //添加
                    Groups.add(res, true).then(function() {
                        $state.go('group/list');
                    });
                }
            });
        }
    })
