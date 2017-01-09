angular.module('lusirAdmin.controller')
    .controller('auditReportCtrl', function($scope, Report, formatData, Filters, $stateParams, $state, Alert) {
        $scope.filter = Filters.pages($stateParams);
        Report.list($scope.filter).then(function(data) {
            $scope.data = data.reports;
            $scope.records = data.total;
        });
        $scope.delete = function(index) {
            Alert.confirm('确定删除吗?', function() {
                Report.delete($scope.data[index].id, true).then(function() {
                    $scope.data.splice(index, 1);
                });
            })
        }
        $scope.changeStatus = function(index) {
            Report.edit({
                id: $scope.data[index].id,
                status: $scope.data[index].status
            }, true);
        }
    })
    .controller('auditContentCtrl', function($scope, Audit, Topics, Posts, formatData, Filters, $stateParams, $state, Alert) {
        $scope.filter = Filters.pages($stateParams);
        Audit.content.list($scope.filter).then(function(data) {
            $scope.data = data.contents;
            $scope.records = data.total;
        });
        $scope.delete = function(index) {
            Alert.confirm('确定删除吗?', function() {
                Audit.content.delete($scope.data[index].id, true).then(function() {
                   $scope.data.splice(index, 1);
                });
            })
        }
        $scope.deleteTopic = function(index) {
            Alert.confirm('确定删除吗?', function() {
                Topics.delete({
                    id: $scope.data[index].object_id
                }, true).then(function() {
                    $state.reload();
                });
            })
        }
        $scope.deletePost = function(index) {
            Alert.confirm('确定删除吗?', function() {
                Posts.delete({
                    id: $scope.data[index].object_id
                }, true).then(function() {
                    $state.reload();
                });
            })
        }
        $scope.changeStatus = function(index) {
            Audit.content.edit({
                id: $scope.data[index].id,
                status: $scope.data[index].status
            }, true);
        }
    })
    .controller('auditActionCtrl', function($scope, Audit,formatData, Filters, $stateParams, $state, Alert) {
        $scope.filter = Filters.pages($stateParams);
        Audit.action.list($scope.filter).then(function(data) {
            $scope.data = data.actions;
            $scope.records = data.total;
        });
        $scope.delete = function(index) {
            Alert.confirm('确定删除吗?', function() {
                Audit.action.delete($scope.data[index].id, true).then(function() {
                    $scope.data.splice(index, 1);
                });
            })
        }
    })
