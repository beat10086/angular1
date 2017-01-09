angular.module('lusirAdmin.controller')
    .controller('feedbackListCtrl', function($scope, Feedback, formatData, Filters, $stateParams, $state, Alert) {
        $scope.filter = Filters.pages($stateParams);
        Feedback.list($scope.filter).then(function(data) {
            $scope.data = data.feedbacks;
            $scope.records = data.total;
        });
        $scope.delete = function(index) {
            Alert.confirm('确定删除吗?', function() {
                Feedback.delete($scope.data[index].id, true).then(function() {
                    $scope.data.splice(index, 1);
                });
            })
        }
        $scope.changeStatus = function(index) {
            Feedback.edit({
                id: $scope.data[index].id,
                status: $scope.data[index].status
            }, true);
        }
        $scope.reply = function(index) {
            $scope.replyData = {
                id: $scope.data[index].id,
                reply: $scope.data[index].reply
            }
            $('.replyPop').modal();
        }
        $scope.replySubmit = function() {
            formatData($scope.replyData, {
                require: {
                    'reply': '回复内容'
                }
            }, function(res) {
                Feedback.reply(res, true).then(function() {
                    $state.reload();
                });
            });
        }
    })
    .controller('feedbackInfoCtrl', function($scope, Feedback, formatData, Filters, $stateParams, $state, Alert) {
        $scope.filter = Filters.pages($stateParams);
        Feedback.info($scope.filter).then(function(data) {
            $scope.data = data.feedback;
        });
        $scope.submit = function() {
            Feedback.edit($scope.data, true).then(function() {
                history.back();
            })
        }
    })
