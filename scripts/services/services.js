angular.module('lusirAdmin.services', [])


.factory('Ajaxing', function($rootScope) {
        return {
            start: function() {
                $rootScope.ajaxing = true;
            },
            stop: function() {
                $rootScope.ajaxing = false;
            }
        }
    }).factory('Alert', function($rootScope) {
        function _alert(content, type, option) {
            var msg = {
                content: content,
                type: type,
                option: option
            }
            $rootScope.$broadcast('alert', msg);
        };
        return {
            success: function(content) {
                _alert(content, 'success', {
                    autohide: true
                })
            },
            error: function(content) {
                _alert(content, 'error', {
                    autohide: 4000,
                    btn: 'ok'
                })
            },
            confirm: function(content, callback) {
                _alert(content, 'confirm', {
                    autohide: false,
                    btn: 'confirm',
                    callback: callback
                })
            },
            warmming: function(content, callback) {
                _alert(content, 'error', {
                    autohide: false,
                    callback: callback
                })
            },
            stop: function(is) {
                $rootScope.$broadcast('alerthide', {
                    just: true
                });
            }
        }
    })
    .factory('LoginState', function($rootScope) {
        var logined = false;
        return {
            success: function() {
                logined = true;
                $rootScope.logined = true;
            },
            get: function() {
                return logined;
            }
        }
    })
    .factory('LoginUser', function(User, $q) {
        var loginedUser = null;
        var ajaxing = false;
        var deferredlist = [];
        return function() {
            var deferred = $q.defer();
            deferredlist.push(deferred);
            if (loginedUser) {
                deferred.resolve(loginedUser);
            } else {
                if (!ajaxing) {
                    ajaxing = true;
                    User.logined_user().then(function(data) {
                        for (var i in deferredlist) {
                            loginedUser = data.user;
                            deferredlist[i].resolve(loginedUser);
                            ajaxing = false;
                        }
                        deferredlist = [];
                    });
                }
            }
            return deferred.promise;
        }
    })
    .factory('AdminConfig', function(AppConfig, $q) {
        var ConfigCatch = null;
        var ajaxing = false;
        var deferredlist = [];
        return function() {
            var deferred = $q.defer();
            deferredlist.push(deferred);
            if (ConfigCatch) {
                deferred.resolve(ConfigCatch);
            } else {
                if (!ajaxing) {
                    ajaxing = true;
                    AppConfig.newest_config({
                        platform: 'admin'
                    }, 'sub').then(function(data) {
                        for (var i in deferredlist) {
                            ConfigCatch = data.config.data;
                            deferredlist[i].resolve(ConfigCatch);
                            ajaxing = false;
                        }
                        deferredlist = [];
                    });
                }
            }
            return deferred.promise;
        }
    })
    .factory('Pages', function() {
        var _p = {
            limit: 10,
            showlen: 5
        }
        _p.getList = function(records, currentPage) {
            var total = Math.ceil(records / _p.limit);
            var current = parseInt(currentPage) || 1;
            var root = [];
            var size = _p.showlen;
            var pre = Math.floor(size / 2);
            var after = size - pre - 1;
            if (current < Math.ceil(size / 2)) {
                var pre = current - 1;
                var after = size - pre - 1;
            } else if (current > (total - Math.ceil(size / 2))) {
                var after = total - current;
                var pre = size < total ? size - after - 1 : total - after - 1;
            }
            for (var i = current - pre; i < current && i <= total; i++) {
                root.push(i);
            }
            var temp = root.push(current);;
            for (var i = current + 1;
                (i <= current + after) && i <= total; i++) {
                root.push(i);
            }
            return {
                currentPage: current,
                limit: _p.limit,
                total: total,
                pages: root,
                records: records,
                ispre: (current != 1),
                isnext: (current != total),
                isfirst: (current > Math.floor(size / 2)),
                islast: (current < (total - Math.ceil(size / 2)))
            }
        }
        _p.format = function(params) {
            return $.extend(params, {
                limit: _p.limit,
                currentPage: params.currentPage ? params.currentPage : 1,
                skip: _p.limit * (params.currentPage ? params.currentPage - 1 : 0)
            });
        }
        return _p;
    }).factory('Filters', function($state, Pages) {
        var _f = {};
        _f.pages = Pages.format;
        _f.filter = function name(params, setup) {
            return function() {
                params = $.extend(params, setup);
                $state.go($state.current.name, params, {
                    reload: true
                });
            }
        };
        return _f;
    }).factory('formatData', function(Alert) {
        return function(obj, option, callback) {
            var required = [];
            var object = $.extend({}, obj);
            var successtag = true;
            if (typeof object != 'object') return object;
            for (var i in option.toArrayJson) {
                var key = option.toArrayJson[i];
                object[key] = angular.toJson(object[key]);
                console.log(object[key]);
            }
            for (var i in object) {
                if (angular.isArray(object[i])) {
                    var temparray = [];
                    for (var j in object[i]) {
                        temparray.push(object[i][j]);
                        if (angular.isObject(temparray[j])) {
                            temparray[j] = angular.toJson(temparray[j]);
                        }
                    }
                    object[i] = temparray.join(',');
                }
            }
            for (var i in option.toArrayString) {
                var key = option.toArrayString[i];
                object[key] = '[' + object[key] + ']';
            }
            for (var i in option.remove) {
                var key = option.remove[i];
                if (typeof object[key] != 'undefined') {
                    delete object[key]
                }
            }
            for (var i in option.require) {
                if (i.indexOf('.') > -1) {
                    var list = i.split('.');
                    var temp = object;
                    for (var j in list) {
                        temp = temp[list[j]];
                        if (!temp) {
                            required.push(option.require[i]);
                            successtag = false;
                            break;
                        }
                    }
                } else if (typeof object[i] == 'undefined' || $.trim(object[i]) == '') {
                    required.push(option.require[i]);
                    successtag = false;
                }
            }
            for (var i in object) {
                if (angular.isObject(object[i])) {
                    object[i] = angular.toJson(object[i]);
                }
            }
            if (successtag) {
                if (option.only) {
                    var temp = {};
                    for (var i in option.only) {
                        var key = option.only[i];
                        if (typeof object[key] != 'undefined') {
                            temp[key] = object[key];
                        }
                    }
                    callback && callback(temp);
                    return temp;
                }
                callback && callback(object);
            } else {
                Alert.error('操作失败，缺少【' + required.join('】,【') + '】');
            }
            return object;
        }
    })
    .factory('PageDataCatch', function() {
        var _catch = {};
        return {
            add: function(key, value) {
                _catch[key] = value;
            },
            get: function(key) {
                return _catch[key]
            }
        };

    })
    .factory('multiCheck', function(Alert) {
        return function name($scope, callback) {
            var checkedlen = 0;
            var mutiList = {};
            return {
                toggleCheck: function(index, event) {
                    // return false;
                    var length = $scope.data.length;
                    if ($scope.data[index].check == true) {
                        checkedlen++;
                        // mutiList[index] = event.target.value;
                    } else {
                        checkedlen--;
                        // mutiList[index] = false;
                        // delete mutiList[index];
                    }
                    if (checkedlen == length) {
                        $scope.checkedAll = true;
                    } else {
                        $scope.checkedAll = false;
                    }
                },
                checkAll: function() {
                    if ($scope.checkedAll) {
                        for (var i in $scope.data) {
                            $scope.data[i].check = true;
                            checkedlen = $scope.data.length;
                        }
                    } else {
                        for (var i in $scope.data) {
                            $scope.data[i].check = false;
                            checkedlen = 0;
                        }
                    }
                },
                mutiSubmit: function() {
                    var res = [];
                    for (var i in $scope.data) {
                        if ($scope.data[i].check) {
                            res.push($scope.data[i].id);
                        }
                    }
                    if (!res.length) {
                        Alert.error('未选择任何项。');
                        return false;
                    }
                    callback && callback(res.join(','), arguments);
                }
            }
        };
    })
    .factory('ImgView', function($rootScope) {
        var obj = {
            list: []
        }
        obj.show = function(index) {
            var msg = {
                index: index,
                list: obj.list
            }
            $rootScope.$broadcast('viewImages', msg);
        }
        $rootScope.$on('$stateChangeStart', function(event, next, nextParams, prev, prevParams) {
            obj.list = [];
        });
        return obj;
    })
    .factory('DateSv', function() {
        return {
            utc: function(dstr) {
                return $.getUTCTime(dstr);
            },
            local: function(dstr) {
                return $.getLocalTime(dstr);
            },
            plus:function(dstr,hours){
                var date = new Date(new Date(dstr.replace(/-/g,'/')).getTime()+hours*3600*1000);
                return date.format('yyyy-MM-dd hh:mm:ss');
            },
            apart:function(dstr,dstr2){
                 return (new Date(dstr2.replace(/-/g,'/')) - new Date(dstr.replace(/-/g,'/')))/(3600*1000);
            }
        }
    })
