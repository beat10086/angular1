angular.module('lusirAdmin.directives', []).directive('forminput', function() {
    return {
        restrict: 'A',
        template: '<div class="form-group">' + '<label for="names" class="col-sm-2 control-label"></label>' + '<div class="col-sm-10" ng-transclude>' + '</div>' + '</div>',
        replace: true,
        transclude: true,
        link: function($scope, iElm, iAttrs, controller) {
            iElm.find('div').find('input,textarea').addClass('form-control');
            iElm.find('div').find('input[type=checkbox]').removeClass('form-control');
            var required = iElm.attr('required');
            if (required) {
                iElm.children('label').append('<span class="red mr5" ng-if="required">*</span>');
            }
            if (iAttrs.con) {
                iElm.children('.col-sm-10 ').addClass('form-con');
            }
            iElm.children('label').append(iAttrs.forminput);
        }
    };
}).directive('pages', function($timeout) {
    return {
        restrict: 'A',
        templateUrl: 'views/templates/page.html',
        link: function($scope, iElm, iAttrs, controller) {
            if (iAttrs.pageType) {
                iElm.find('.minihide').hide();
            }
        }
    };
}).directive('selectvalue', function($timeout) {
    return {
        template: '<li ><a ng-transclude ></a></li>',
        replace: true,
        transclude: true,
        link: function($scope, iElm, iAttrs, controller) {
            $scope.select = function(index, e) {
                if ($scope.$parent.select) {
                    $scope.$parent.select(index, e);
                } else if ($scope.$parent.$parent.select) {
                    $scope.$parent.$parent.select(index, e);
                }
            }
            iElm.on('click', function(e) {
                var index = iElm.index();
                $scope.select(index, e);
            })
            if ($scope.$last === true) {
                $timeout(function() {
                    $scope.$parent && $scope.$parent.$parent && $scope.$parent.$parent.onFinishRender && $scope.$parent.$parent.onFinishRender();
                });
            }
        }
    };
}).directive('selectcon', function($timeout) {
    return {
        scope: {},
        require: 'ngModel',
        restrict: 'A',
        templateUrl: 'views/templates/select.html',
        replace: true,
        transclude: true,
        link: function($scope, iElm, iAttrs, ngModel, $timeout) {
            $scope.onFinishRender = function(isInit) {
                if (!isInit) {
                    $scope.onFinishRender = null;
                }
                var options = iElm.find('li');

                function getText(value) {
                    var text = '请选择';
                    options.each(function() {
                        var att=$(this).attr('selectvalue');
                        var _value=(typeof value=='undefined')?false:value;

                        if (att == value||att == _value + '') {
                            text = $(this).find('span').html();
                            console.log(text+'=='+_value+'=='+att);
                             $(this).addClass('active').siblings().removeClass('active');
                            return text;
                        } 
                    });
                    return text;
                }
                ngModel.$render = function() {
                    initValue();
                };

                function initValue() {
                    var options = iElm.find('li');
                    $scope.selected = [getText(ngModel.$viewValue)];
                }
                $timeout(function() {
                    initValue();
                })
                $scope.option = [];
                options.each(function() {
                    $scope.option.push({
                        text: $(this).find('span').html(),
                        value: $(this).attr('selectvalue')
                    });
                });

                $scope.select = function(index) {
                    var options = iElm.find('li');
                    var value = options.eq(index).attr('selectvalue');
                    options.eq(index).addClass('active').siblings().removeClass('active');
                    if (value == 'true') {
                        value = true;
                    } else if (value == 'false') {
                        value = false;
                    }
                    ngModel.$setViewValue(value);
                    $scope.$apply(function() {
                        $scope.selected = [getText(ngModel.$viewValue)];
                    })
                }
            }
            $scope.onFinishRender(true);
        }
    };
}).directive('multiselect', function() {
    return {
        scope: {},
        require: 'ngModel',
        restrict: 'A',
        templateUrl: 'views/templates/select.html',
        replace: true,
        transclude: true,
        transclude: true,
        link: function($scope, iElm, iAttrs, ngModel, $timeout) {
            $scope.onFinishRender = function(isInit) {
                if (!isInit) {
                    $scope.onFinishRender = null;
                }

                function getText(value) {
                    var text = '';
                    options.each(function() {
                        if ($(this).attr('selectvalue') == (value + '')) {
                            text = $(this).find('span').html();
                            return text;
                        } else if ((typeof value == 'undefined') && ($.trim($(this).attr('selectvalue')) == '')) {
                            text = $(this).find('span').html();
                            return text;
                        }
                    });
                    return text;
                }
                var options = iElm.find('li');
                ngModel.$render = function() {
                    initValue();
                }
                function initValue() {
                    var options = iElm.find('li');
                    var value = ngModel.$viewValue;
                    if (typeof value == 'undefined' || value == 'NaN') {
                        return false;
                    } else {
                        if (value.split) {
                            value = value.split(',');
                        }
                    }
                    $scope.selected = [];
                    $scope.viewValue = [];
                    for (var i in value) {
                        if (!getText(value[i])) continue;
                        $scope.selected.push(getText(value[i]));
                        $scope.viewValue.push(value[i]);
                    }
                    if (!$scope.selected.length) {
                        $scope.selected = ['请选择'];
                    }
                    for (var i in $scope.option) {
                        for (var j in $scope.viewValue) {
                            if ($scope.option[i].value == $scope.viewValue[j]) {
                                options.eq(i).addClass('active');
                            }
                        }
                    }
                }
                // $timeout(function() {
                    initValue();
                // })
                $scope.option = [];
                options.each(function() {
                    $scope.option.push({
                        text: $(this).find('span').html(),
                        value: $(this).attr('selectvalue'),
                        obj: $(this)
                    });
                });
                $scope.select = function(index, e) {
                    e.stopPropagation();
                    var value = $scope.option[index].value;
                    $scope.$apply(function() {
                        for (var i in $scope.viewValue) {
                            if ($scope.viewValue[i] == value) {
                                $scope.selected.splice(i, 1);
                                $scope.viewValue.splice(i, 1);
                                options.eq(index).removeClass('active');
                                if (!$scope.selected.length) {
                                    $scope.selected = ['请选择'];
                                }
                                return false;
                                break;
                            }
                        }
                        options.eq(index).addClass('active');
                        if ($scope.selected[0] == '请选择') $scope.selected = [];
                        $scope.selected.push(getText(value));
                        $scope.viewValue.push(value);
                    });
                    ngModel.$setViewValue($scope.viewValue);
                }
            }
            $scope.onFinishRender(true);
        }
    };
}).directive('uploadfile', function() {
    return {
        require: '^ngModel',
        restrict: 'A',
        templateUrl: 'views/templates/upload.html',
        replace: true,
        transclude: true,
        link: function($scope, iElm, iAttrs, controller) {
            $scope.fileds=$(iElm).data();
            $(iElm).attr({
                accept: 'mage/*;capture=camera'
            });
            for(var i in $scope.fileds){
                if(i.indexOf('$')>-1){
                    delete $scope.fileds[i];
                }
            }
            $scope.multiple = iAttrs.multiple;
            $scope.root = iAttrs.root || 'data';
            $scope.preview = !iAttrs.nopreview;
            controller.$render = function() {
                if (angular.isArray(controller.$viewValue)) {
                    $scope.files = controller.$viewValue;
                } else if (angular.isObject(controller.$viewValue)) {
                    $scope.files = [controller.$viewValue];
                }
            }
            $scope.updateFiles = function(files) {
                controller.$setViewValue($scope.files);
            }
            $scope.key = iAttrs.key;
        }
    };
}).directive('facepp', function() {
    return {
        scope: {},
        controller: function($scope, $element, $attrs, $transclude, Faces) {
            $scope.face = function() {
                Faces.detect_face($scope.params, true);
            }
        },
        restrict: 'A',
        templateUrl: 'views/templates/face.html',
        replace: true,
        transclude: true,
        link: function($scope, iElm, iAttrs, controller) {
            $scope.params = {
                image_id: iAttrs.imageId,
                star_ids: iAttrs.starIds
            }
            $scope.pid = iAttrs.imageId
        }
    };
}).directive('realtime', function() {
    return {
        scope: {},
        controller: function($scope, $element, $attrs, $transclude, Stars, RealtimeSearch) {
            $scope.search = function(value, type) {
                if (!value) return false;
                RealtimeSearch.search({
                    type: type,
                    keyword: value
                }).then(function(data) {
                    $scope.searchdata = data.hits;
                    $scope.type = type;
                });
            }
        },
        require: 'ngModel',
        restrict: 'A',
        templateUrl: 'views/templates/realtimeSearch.html',
        replace: true,
        transclude: true,
        link: function($scope, iElm, iAttrs, controller) {
            var multiple = iAttrs.multiple;
            var linkObj = iAttrs.linkObj;
            var type = iAttrs.searchType;
            var saveKey = iAttrs.saveKey || 'id';
            var input = iElm.find('input').addClass('form-control');
            if (!type) return false;
            input.on('input propertychange', function() {
                var temp = $(this).val();
                var _this = this;
                setTimeout(function(temp) {
                    return function() {
                        if (temp != $(_this).val()) return false;
                        $scope.search($(_this).val(), type);
                        $scope.changed = true;
                    }
                }(temp), 500);
                if ($.trim(input.val()) == '') {
                    if (iAttrs.trimclear) {
                        controller.$setViewValue('');
                        $scope.nowid = ''
                        $scope.nowname = '';
                    }
                }
            });
            input.on('focus', function(e) {
                $scope.$apply(function() {
                    $scope.show = true;
                })
            });
            input.on('blur', function() {

            });
            input.on('click', function(e) {
                e.stopPropagation();
            })
            controller.$render = function() {
                $scope.nowid = controller.$viewValue;
            }
            $(document).on('click', function() {
                $scope.$apply(function() {
                    $scope.show = false;
                })
            })
            $scope.pickup = function(index, event) {
                event.stopPropagation();
                $scope.show = false;
                if (multiple) {
                    if (typeof $scope.nowid != 'object') {
                        $scope.nowid = $scope.nowid ? [$scope.nowid] : [];
                    }
                    $scope.nowid.push($scope.searchdata[index].object[saveKey]);
                    controller.$setViewValue($scope.nowid);
                } else {
                    $scope.nowid = $scope.searchdata[index].object[saveKey];
                    controller.$setViewValue($scope.nowid);
                }
                $scope.nowname = ($scope.searchdata[index].object.names && $scope.searchdata[index].object.names) || $scope.searchdata[index].object.name || $scope.searchdata[index].object.username || $scope.searchdata[index].object.title;
                input.val($scope.nowname).trigger('change');
                var root = $scope.$parent && $scope.$parent.$parent && $scope.$parent.$parent.data && $scope.$parent.$parent.data
                if (root && linkObj) {
                    if (multiple) {
                        if (!root[linkObj]) {
                            root[linkObj] = [];
                        }
                        root[linkObj].push($scope.searchdata[index].object);
                    } else {
                        root[linkObj] = ($scope.searchdata[index].object);
                    }
                }
            }
        }
    };
}).directive('dateselect', function() {
    return {
        require: '?ngModel',
        restrict: 'A',
        link: function($scope, iElm, iAttrs, controller) {
            var option = {
                minView: iAttrs.minView,
                maxView: iAttrs.maxView,
                format: iAttrs.format,
                startView: iAttrs.startView,
                minuteStep:parseInt(iAttrs.minuteStep)
            }
            console.log(iAttrs);
            var def = $.extend({
                minView: 2,
                autoclose: true,
                language: 'zh',
            }, option)
            $(iElm).datetimepicker(def);
        }
    };
}).directive('goback', function($state) {
    return {
        restrict: 'A',
        templateUrl: 'views/templates/back.html',
        replace: true,
        transclude: true,
        link: function($scope, iElm, iAttrs, controller) {
            iElm.on('click', '.back', function() {
                history.back();
            })
            iElm.on('click', '.reload', function() {
                $state.reload();
            })
            if (typeof iAttrs.backKey == 'undefined') {
                $scope.needback = true;
            } else if (iAttrs.backKey) {
                $scope.needback = true;
            }
        }
    };
}).directive('pagetitle', function($timeout, $stateParams) {
    return {
        restrict: 'A',
        template: '<span class="subtitle"><span ng-transclude></span><span> {{subtitle|subt}}<span></span>',
        replace: true,
        transclude: true,
        link: function($scope, iElm, iAttrs, controller) {
            var offwatch = $scope.$watch('data', function(newValue) {
                if ($scope.subtitle) {
                    offwatch();
                    return false;
                }
                var l = 0;
                for (var i in $stateParams) {
                    if ($stateParams[i]) l++;
                }
                if (!l) return false;

                function f(text) {
                    if (angular.isArray(text)) {
                        return text.join(',');
                    }
                    return text;
                    alert(text);
                }
                var sub = '';
                var v = newValue;
                if (typeof v != 'undefined') {
                    sub = angular.isObject(v) ? (v.extern_order_id || v.title || v.name || v.nick || v.username || f(v.names) || (v.star && f(v.star.names)) || (v.stars && v.stars[0] && f(v.stars[0].names))) : '';
                    offwatch();
                    $timeout(function() {
                        $scope.subtitle = sub;
                    })
                }
            }, true)
        }
    };
}).directive('positions', function(Persition, $state, $timeout) {
    return {
        restrict: 'A',
        templateUrl: 'views/templates/position.html',
        link: function($scope, iElm, iAttrs, controller) {
            $timeout(function() {
                var now = iAttrs.positionNow;
                if (now == 1) {
                    $scope.isFirst = true;
                }
                if ($scope.$parent && (now == $scope.$parent.records)) {
                    $scope.isLast = true;
                }
                var data = iElm.data();
                var type = iAttrs.positions;
                $scope.now = now;
                if (data.$scope) delete data.$scope;
                $scope.setFinal = function(index) {
                    var temp = $.extend(data, {
                        position: index
                    });
                    Persition[type](temp, true).then(function(data) {
                        if (!data) return false;
                        $state.reload();
                    });
                }
                $scope.setPosition = function(index) {
                    $scope.defposition = now;
                    $('.positionPop' + index).modal();
                }
                $scope.setDown = function() {
                    $scope.setFinal(++now);
                }
                $scope.setUp = function() {
                    $scope.setFinal(--now);
                }
                $scope.setCustom = function(index) {
                    $scope.setFinal($scope.currentposition);
                    $('.positionPop' + index).modal('hide')
                }
            })
        }
    };
}).directive('nodata', function() {
    return {
        restrict: 'A',
        template: '<div class="no-data" ng-if="!ajaxing&&(!data||!data.length)"><span><span class="glyphicon glyphicon-remove"></span> 无相关数据</span></div>',
        replace: true,
        link: function($scope, iElm, iAttrs, controller) {}
    };
}).directive('addRecommend', function(Recommends, $state) {
    return {
        link: function($scope, iElm, iAttrs, controller) {
            $(iElm).on('click', function() {
                var params = $(iElm).data();
                Recommends.add(params, true).then(function(res) {})
            })
        }
    };
}).directive('deleteRecommend', function(Recommends, $state, Alert) {
    return {
        link: function($scope, iElm, iAttrs, controller) {
            $(iElm).on('click', function() {
                var params = $(iElm).data();
                $scope.$apply(function() {
                    Alert.confirm('确定取消推荐吗?', function() {
                        Recommends.delete(params, true).then(function() {
                            $state.reload();
                        });
                    })
                });
            })
        }
    };
}).directive('umEdit', function($timeout) {
    return {
        // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
        template: ' <div id="container" name="content"  style="width:753px;height:480px;"></div>',
        replace: true,
        link: function($scope, iElm, iAttrs, ngModel) {
            var ue = UM.getEditor(iAttrs.id, {
                autoHeightEnabled: false,
                autoFloatEnabled: false
            });
            $scope.$parent.getUMContent = function() {
                return ue.getContent();
            }
            $scope.$parent.setUMContent = function(value) {
                return ue.setContent(value);
            }
        }
    };
}).directive('getstyle', function() {
    return {
        require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
        link: function($scope, iElm, iAttrs, controller) {
            var index = iAttrs.index;
            var key = iAttrs.key;
            controller.$render = function() {
                var styles = controller.$viewValue;
                for (var i in styles) {
                    if (styles[i].style_index == index) {
                        iElm.html(styles[i][key]);
                    }
                }
            }
        }
    };
}).directive('getstyleimg', function() {
    return {
        require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
        link: function($scope, iElm, iAttrs, controller) {
            var index = iAttrs.index;
            controller.$render = function() {
                var styles = controller.$viewValue;
                for (var i in styles) {
                    if (styles[i].style_index == index) {
                        iElm.attr('src', styles[i].images[0].url);
                    }
                }
            }
        }
    };
}).directive('deliver', function(AdminConfig) {
    return {
        template: '<a target="_blank">查看物流</a>',
        replace: true,
        link: function($scope, iElm, iAttrs, controller) {
            var id = iAttrs.deliver;
            AdminConfig().then(function(res) {
                var href = 'http://' + res.domain.web + '/deliver_info?deliver_id=' + id;
                iElm.attr('href', href);
            });
        }
    };
}).directive('formTitle', function() {
    return {
        template: '<div class="form-group"><label for="names" class="col-sm-2 control-label"><h4 ng-transclude ></h4></label><div class="col-sm-10" ><div class="form-line ng-scope"><hr></div></div></div>',
        replace: true,
        transclude: true,
        link: function($scope, iElm, iAttrs, controller) {}
    };
}).directive('img', function(ImgView) {
    return {
        restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
        link: function($scope, iElm, iAttrs, controller) {
            if (iAttrs.noDetail) return false;
            var index = ImgView.list.length;
            ImgView.list.push(iElm);
            iElm.on('click', function(e) {
                e.stopPropagation();
                ImgView.show(index);
            })
        }
    };
}).directive('uiModal', function($timeout) {
    // Runs during compile
    return {
        // name: '',
        // priority: 1,
        // terminal: true,
        // scope: {}, // {} = isolate, true = child, false/undefined = no change
        // controller: function($scope, $element, $attrs, $transclude) {},
        // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
        // restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
        // template: '',
        templateUrl: 'views/templates/modal.html',
        replace: true,
        transclude: true,
        // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
        link: function($scope, iElm, iAttrs, controller) {
            $timeout(function() {
                var title = iAttrs.title;
                $(iElm).find('.modal-title').html(title);
            })
        }
    };
}).directive('table',  function(){
    // Runs during compile
    return {
        // name: '',
        // priority: 1,
        // terminal: true,
        // scope: {}, // {} = isolate, true = child, false/undefined = no change
        // controller: function($scope, $element, $attrs, $transclude) {},
        // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
        restrict: 'C', // E = Element, A = Attribute, C = Class, M = Comment
        // template: '',
        // templateUrl: '',
        // replace: true,
        // transclude: true,
        // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
        link: function($scope, iElm, iAttrs, controller) {
            $(iElm).wrap($('<div>',{class:"table-cover"}));
        }
    };
});
