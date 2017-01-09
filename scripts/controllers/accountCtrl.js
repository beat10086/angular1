angular.module('lusirAdmin')
    .controller('menuCtrl', function($scope, $rootScope, MallNavList, LoginUser, Mall, Permissions, NavList, $timeout) {
        var n = NavList;
        $scope.menulist = n;
         /*group.active = true;
       LoginUser({}, 'sub').then(function(data) {
            if (data) {
                var username = data.username;
                Permissions.get_user_permissions({
                    'username': username
                }, 'sub').then(function(data) {
                    if (angular.isArray(data.permissions)) {
                        var p_list = data.permissions;
                        for (var i in n) {
                            var group = n[i];
                            var g_p = group.permission;
                            var itemactive = false;
                            for (var j in group.sublist) {
                                var item = group.sublist[j];
                                var i_p = item.permission;
                                for (var p in p_list) {
                                    var check = p_list[p].replace('.*', '').replace('*', '');
                                    if (i_p.indexOf(check) > -1) {
                                        item.active = true;
                                        itemactive = true;
                                        break;
                                    }
                                }
                            }
                            if (itemactive) {
                                group.active = true;
                            }
                        }
                        $scope.menulist = n;
                        MallNavList({}).then(function(nav) {
                            if (nav) {
                                // var nav = res.navigations;
                                var r = $scope.menulist[10].sublist;
                                for (var i in $scope.menulist) {
                                    if ($scope.menulist[i].name == '商城内容推荐') {
                                        r = $scope.menulist[i].sublist;
                                    }
                                }
                                var limitList = ["nav_good_1", "nav_good_2", "nav_good_3", "nav_good_4", "nav_good_5", "nav_good_6"];
                                for (var i in nav) {
                                    var item = nav[i];
                                    var template = {
                                        active: true,
                                        name: '集市--' + item.name,
                                        params: {
                                            type: 'nav_good_' + item.index
                                        },
                                        path: "goods",
                                    }
                                    if (limitList.indexOf(template.params.type) > -1) {
                                        r.push(template);
                                    }
                                    $timeout(function() {
                                        var index = $('.sidenav li.active').parents('.nav-group').index();
                                        $('.sidenav li.active').parents('.nav-group').addClass('active').siblings().removeClass('active')
                                        $scope.navToggle(index, true);
                                    })
                                }
                            }
                        })
                        $timeout(function() {
                            var index = $('.sidenav li.active').parents('.nav-group').index();
                            $('.sidenav li.active').parents('.nav-group').addClass('active').siblings().removeClass('active')
                            $scope.navToggle(index, true);
                        })
                    }
                });
            }
        })*/
        $scope.navToggle = function(index, justshow, speed, isFull) {

            if ($rootScope.fullpage && !isFull) return false;

            if (index == -1) {
                return false;
            }
            var t = $('.sidenav').children('.nav-group').eq(index);
            if (justshow) {
                t.find('ul').slideDown('fast');
            } else {

                if (isFull) {
                    t.find('ul').fadeIn('fast');
                } else {
                    t.find('ul').slideToggle('fast');
                }
            }
            if (isFull) {
                t.siblings('.nav-group').find('ul').fadeOut('fast');
            } else {
                t.siblings('.nav-group').find('ul').slideUp('fast');
            }
        }
        $scope.navShow = function(index) {
            if (!$rootScope.fullpage) {
                return false;
            } else {
                $scope.navToggle(index, false, 100, true);
            }
        }
        $scope.navHide = function() {
            if (!$rootScope.fullpage) {
                return false;
            }
            $('.nav-group').find('ul').hide('fast');
        }
        $scope.$on('$stateChangeSuccess', function(event, next, nextParams, prev, prevParams) {
            $timeout(function() {
                var index = $('.sidenav li.active').parents('.nav-group').index();
                $('.sidenav li.active').parents('.nav-group').addClass('active').siblings().removeClass('active')
                $scope.navToggle(index, true);
            })
        });
    }).controller('userCtrl', function($scope, LoginUser) {
        LoginUser().then(function(data) {
            if (data) {
                $scope.user = data;
            }
        })
    }).controller('permissionCtrl', function($scope, $stateParams, $timeout, Permissions, formatData, LoginUser) {
        var username = $scope.username = $stateParams.username;
        $scope.checked = [];
        $scope.chosedList = {};
        $scope.activelist = {};
        $scope.getPer = function() {
            Permissions.get_user_permissions({
                username: $scope.username
            }).then(function(_data) {
                var userP = _data.permissions;
                $scope.checked = userP;
                for (var i in userP) {
                    $scope.chosedList[userP[i]] = true;
                }
                $timeout(function() {
                    $('label.active').children('input').prop('checked', true);
                    $('label.active').parent('h2,h3,h4,h5').next('ul').addClass('active').find('input').prop('checked', false).attr('disabled', true);
                })
            });
        }
        Permissions.permission_list().then(function(data) {
            if ($scope.username) {
                $scope.getPer();
            }
            $scope.data = data.permissions;
        });
        var choseForamt = { in : function(value) {
                for (var i in $scope.chosedList) {
                    var check = value.replace('.*', '').replace('*', '');
                    if ($scope.chosedList[i] && (i.indexOf(check) > -1)) {
                        $scope.chosedList[i] = false;
                    }
                    var temp = i.replace('.*', '').replace('*', '');
                    if ($scope.chosedList[i] && (check.indexOf(temp) > -1)) {
                        return false;
                    }
                }
                $scope.chosedList[value] = true;
            },
            out: function(value) {
                $scope.chosedList[value] = false;
            }
        }
        $scope.chose = function(event) {
            var obj = $(event.target);
            var value = obj.val();
            var title = obj.parents('h1,h2,h3,h4,h5');
            var checked = obj.prop('checked');
            if (checked) {
                title.find('label').addClass('active');
                title.next('ul').addClass('active').find('input').prop('checked', false).attr('disabled', true);
                choseForamt.in(value);
            } else {
                title.find('label').removeClass('active');
                title.next('ul').removeClass('active').find('label,ul').removeClass('active').find('input').attr('disabled', false);
                choseForamt.out(value);
            }
            $scope.checked = [];
            for (var i in $scope.chosedList) {
                if ($scope.chosedList[i]) {
                    $scope.checked.push(i);
                }
            }
            $scope.checked.sort();
        }

        $scope.submit = function() {
            var data = {
                username: $scope.username,
                permissions: $scope.checked.join(',') || ''
            }
            formatData(data, {
                require: {
                    'username': '用户'
                }
            }, function(res) {
                Permissions.set_user_permissions(res, true);
            });
        }
    })
