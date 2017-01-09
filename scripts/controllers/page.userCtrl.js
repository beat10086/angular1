angular.module('lusirAdmin.controller')
    .controller('userListCtrl', function($scope, RealtimeSearch, User, Filters, $stateParams, $state, Alert) {
        $scope.filter = Filters.pages($stateParams);
        if ($scope.filter.keyword) {
            $scope.filter.type = 'user';
            RealtimeSearch.search($scope.filter).then(function(data) {
                data.hits=data.hits.map(function(item){
                    console.log(item.object);
                    return item.object;
                })
                $scope.data = data.hits;
                $scope.records = data.total;
            })
        } else {
            User.list($scope.filter).then(function(data) {
                $scope.data = data.users;
                $scope.records = data.total;
            });
        }
        // User.list($scope.filter).then(function(data) {
        //     $scope.data = data.users;
        //     $scope.records = data.total;
        // });
        $scope.muteUser = function(index) {
            $scope.mute = {
                id: $scope.data[index].id,
                reason: '违反社区规定',
                duration: 1
            };
            $('.mutebox').modal();
        }
        $scope.userHonor = function(index) {
            $scope.honor = {
                id: $scope.data[index].id,
                select: $scope.data[index].honor,
            };
           $('.honorbox').modal();
        }
        
        $scope.changeCoverSex = function(index) {
            User.edit({
                id: $scope.data[index].id,
                is_sexy: $scope.data[index].is_sexy
            }, true);
        }
        $scope.muteSubmit = function() {
            if (!/^\d+$/.test($scope.mute.duration)) {
                Alert.error('请输入有效天数');
                return false;
            }
            $scope.mute.duration = $scope.mute.duration * 24 * 3600;
            User.mute($scope.mute, true).then(function() {
                $state.reload();
            });
            $('.mutebox').modal('hide');
        }
        $scope.honorSubmit=function() {
            User.honor($scope.honor, true).then(function() {
                $state.reload();
            });
            $('.honorbox').modal('hide');
        }
    })
    .controller('userInfoCtrl', function($scope, User, formatData, Filters, $stateParams, $state, Alert) {
        var id = $stateParams.id;
        var honor = $stateParams.honor;
        if (id) { //修改，载入数据
            User.info(id, honor).then(function(data) {
                $scope.data = data.user;
                if (!$scope.data.is_internal) {
                    $scope.data.is_internal = false;
                }
            });
        }
        $scope.submit = function() {
            if ($scope.data.password) {
                if ($scope.data.password != $scope.data.rePassword) {
                    Alert.error('两次输入密码不一致！');
                    return false;
                }
            }
            var submitData = formatData($scope.data, {
                remove: ['rePassword']
            }, function(res) {
                User.edit(res, true).then(function() {
                    history.back();
                })

            });
        }
        $scope.muteUser = function(index) {
            $scope.mute = {
                id: id,
                reason: '违反社区规定',
                duration: 1
            };
            $('.mutebox').modal();
        }
        $scope.muteSubmit = function() {
            if (!/^\d+$/.test($scope.mute.duration)) {
                Alert.error('请输入有效天数');
                return false;
            }
            $scope.mute.duration = $scope.mute.duration * 24 * 3600;
            User.mute($scope.mute, true).then(function() {
                $state.reload();
            });
            $('.mutebox').modal('hide');
        }
        $scope.userHonor = function(index) {
            $scope.honor = {
                id: id,
                select: honor,
            };
           $('.honorbox').modal();
        }
        $scope.honorSubmit=function() {
            User.honor($scope.honor, true).then(function() {
                $state.reload();
            });
            $('.honorbox').modal('hide');
        }
    })
    .controller('administratorCtrl', function($scope, Permissions, Filters, $stateParams, $state, Alert) {
        $scope.filter = Filters.pages($stateParams);
        Permissions.administrator_list($scope.filter).then(function(data) {
            $scope.data = data.users;
            $scope.records = data.total;
        });
        // $scope.muteUser = function(index) {
        //     $scope.mute = {
        //         id: $scope.data[index].id,
        //         reason: '违反社区规定',
        //         duration: 1
        //     };
        //     $('.mutebox').modal();
        // }
        // $scope.muteSubmit = function() {
        //     if (!/^\d+$/.test($scope.mute.duration)) {
        //         Alert.error('请输入有效天数');
        //         return false;
        //     }
        //     $scope.mute.duration = $scope.mute.duration * 24 * 3600;
        //     User.mute($scope.mute, true).then(function() {
        //         $state.reload();
        //     });
        //     $('.mutebox').modal('hide');
        // }
    })
    .controller('privateMsgCtrl', function($scope, User, formatData, Filters, $stateParams, $state, Alert) {
        var id = $stateParams.id;
        if (id) { //修改，载入数据
            User.historyMsg(id).then(function(data) {
                $scope.msg = data.msg;
                $scope.nick = $stateParams.nick;
                $scope.chat= {id: id};
                }
           )
        }
        /*
        $scope.msgInfo = function(index) {
            $scope.msginfo = {
                id: $scope.data[index].id,
                msg: $scope.data[index].pmsg,
            };
        }
        */
        $scope.useMsgSubmit=function() {
            User.sendmsg($scope.chat, true).then(function() {
               $state.reload();
               /*var time = new Date()
               time = time.pattern("yyyy-MM-dd hh:mm:ss")
               var para = '<div><div class="chat_right ng-scope" ng-if="!record.mine"><p class="time_right ng-binding">'+time+'</p><p class="msg_right ng-binding">'+$scope.chat.reply+'</p></div></div>';
               $(".chat_history").append(para);

               $(".send_txt").val("");
              */
            });
        }
   })
