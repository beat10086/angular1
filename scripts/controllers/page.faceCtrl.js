angular.module('lusirAdmin.controller')
 .controller('faceListCtrl', function($scope, Faces, Filters, $stateParams, $state, Alert) {
        $scope.filter = Filters.pages($stateParams);
        Faces.list($scope.filter).then(function(data) {
            $scope.data = data.faces;
            $scope.records = data.total;
        });
        $scope.delete = function(index) {
            Alert.confirm('确定删除吗?', function() {
                Faces.delete($scope.data[index].id, true).then(function() {
                    $scope.data.splice(index, 1);
                });
            })
        }
    })
 .controller('faceRecognizeListCtrl', function($scope, Faces, Filters, $stateParams, $state, Alert) {
        $scope.filter = Filters.pages($stateParams);
        Faces.recognize_list($scope.filter).then(function(data) {
            $scope.data = data.star_recognizes;
            $scope.records = data.total;
        });
        $scope.delete = function(index) {
            Alert.confirm('确定删除吗?', function() {
                Faces.delete($scope.data[index].id, true).then(function() {
                    $scope.data.splice(index, 1);
                });
            })
        }
    })
 