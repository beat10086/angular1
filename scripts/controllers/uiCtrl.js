angular.module('lusirAdmin.controller.ui', [])
    .controller('pageCtrl', function($scope, Filters, Pages, $stateParams, $rootScope) {
        var cached = {};
        // $scope.$on('$stateChangeStart', function(event, next, nextParams, prev, prevParams) {
        //     if (next.name == prev.name) {
        //         $rootScope.data = $scope.$parent.data;
        //         $rootScope.pagelist = $scope.pagelist;
        //         // event.preventDefault()
        //     } else {
        //         $rootScope.data = null;
        //         $rootScope.pagelist = null;
        //     }
        // });
        var offWatch = $scope.$watch('records', function(newValue) {
            if (typeof newValue != 'undefined') {
                $scope.pagelist = Pages.getList(newValue, $scope.filter.currentPage);
                offWatch();
            }
        });
        $scope.goto = function(e) {
            $scope.filter.currentPage = $(e.target).data('page');
            Filters.filter($scope.filter)();
        }
    }).controller('filterCtrl', function($scope, $stateParams, Filters) {
        $scope.$parent.search = Filters.filter($scope.filter, {
            currentPage: 1
        });
        $(document).on('keydown', function(e) {
            var event = e || window.event;
            var key = event.keyCode;
            var len = $('input:focus').length;
            if (key == '13' && len) {
                $scope.search();
            }
        })
    }).controller('alertCtrl', function($scope, $rootScope) {
        var icons = {
            "success": 'ok',
            "error": 'remove',
            "confirm": 'exclamation'
        }
        var themes = {
            "success": 'success',
            "error": 'danger',
            "confirm": 'confirm'
        }
        $scope.alerthide = function() {
            $scope.alert = false;
        }
        $scope.$on('alerthide', function(event, msg) {
            if (msg.just && $scope.theme == 'success') {
                return false;
            }
            $scope.alerthide();
        });
        $scope.$on('alert', function(event, msg) {

            $scope.alert = true;
            $scope.icon = icons[msg.type];
            $scope.text = msg.content;
            $scope.theme = themes[msg.type];
            $scope.time=false;
             // $scope.alerthide();
             // clearTimeout($scope.time);
            if (msg.option && msg.option.autohide) {
                $scope.time = setTimeout(function(_scope) {
                    return function() {
                        _scope.$apply(function() {
                            if(_scope.time) {
                                 _scope.alerthide();
                             }
                        });
                    }
                }($scope), (typeof msg.option.autohide == 'number') ? msg.option.autohide : 2000);
            }
            $scope.doConfirm = msg.option && msg.option.callback;
        });
    })
    .controller('viewImagesCtrl', function($scope, $rootScope, ImgView) {
        $scope.$on('viewImages', function(event, msg) {
            $scope.$apply(function() {
                $scope.list = [];
                for (var i in msg.list) {
                    $scope.list.push($(msg.list[i]).attr('src'));
                }
                $scope.index = msg.index;
                $scope.imgNow = $scope.list[$scope.index];
                fixedImg($scope.imgNow, function() {
                    $('.view-img-fixed').addClass('active');
                    $scope.showing = true;
                });
            })

        })
        $(document).on('keydown', function(e) {
            if ($scope.showing) {
                var key = e.keyCode;
                console.log(key);
                switch (key) {
                    case 39:
                        var index = ($scope.index + 1 >= $scope.list.length) ? 0 : $scope.index + 1;
                        $scope.slide(index, e,true);
                        break;
                    case 37:
                        var index = ($scope.index - 1 < 0) ? $scope.list.length - 1 : $scope.index - 1;
                        $scope.slide(index, e,true);
                        break;
                }
            }
        })
        $scope.slide = function(index, event,keybord) {
            $scope.index=index;
            event.stopPropagation();
            $scope.imgNow = $scope.list[index];
            if(keybord){
                $scope.$apply();
            }
            fixedImg($scope.list[index]);
        }

        function getcss(w, h) {
            css = {
                width: w,
                height: h,
                position: 'absolute',
                left: '50%',
                top: '50%',
                'margin-left': -w / 2,
                'margin-top': -h / 2
            };
            return css;
        }

        function fixedImg(src, callback) {
            var img = new Image();
            $(img).css('opacity', 0).attr('no-detail', true);
            $('.load-place').html($(img));
            $(img).on('load', function() {
                var w = $(this).width();
                var h = $(this).height();
                var sw = $(window).width();
                var sh = $(window).height();
                sw -= (180 * (sw / sh));
                sh -= 180;
                console.log(sw);
                console.log(sh);
                var scale = w / h;
                var css = {};
                if (w < sw && h < sh) {
                    $('.view-img-con').css(getcss(w, h));
                } else if (scale < sw / sh) {
                    var tempH = sh;
                    var tempW = tempH * scale;
                    $('.view-img-con').css(getcss(tempW, tempH));
                } else {
                    var tempW = sw;
                    var tempH = tempW / scale;
                    $('.view-img-con').css(getcss(tempW, tempH));
                }
                callback && callback();
            })
            img.src = src;

        }
        $scope.hideView = function() {
            $('.view-img-fixed').removeClass('active');
            $scope.showing = false;
        }
    })
    .controller('globalUiCtrl', function($rootScope, $cookieStore, $scope, $stateParams, Filters) {
        $rootScope.fullpage = $cookieStore.get("fullpage");
        $rootScope.toggleFull = function() {
            $rootScope.fullpage = !$rootScope.fullpage;
            $cookieStore.put("fullpage", $rootScope.fullpage);
            if ($rootScope.fullpage) {
                $('.sidenav .nav-group ul').hide();
            } else {
                $('.sidenav li.active').parents('.nav-group').find('ul').show();
            }

        }
        $rootScope.toggleSlide=function(){
            $(document.body).toggleClass('show-slide');
        }
    })
