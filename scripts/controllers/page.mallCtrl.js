angular.module('lusirAdmin.controller')
    .controller('mallNavigationListCtrl', function($scope, Mall, MallNavList, $rootScope, Filters, $stateParams, $state, Alert) {
        $scope.filter = Filters.pages($stateParams);
        Mall.navigation.list($scope.filter).then(function(data) {
            $scope.data = data.navigations;
            $scope.records = data.total;
        });
        $scope.changeStatus = function(index) {
            Mall.navigation.edit({
                id: $scope.data[index].id,
                status: $scope.data[index].status
            }, true);
        }
    }).controller('mallNavigationInfoCtrl', function($scope, Mall, MallNavList, formatData, $rootScope, Filters, $stateParams, $state, Alert) {
        $scope.filter = Filters.pages($stateParams);
        if ($scope.filter.id) { //详情
            Mall.navigation.info($scope.filter).then(function(data) {
                $scope.edit = true;
                $scope.data = data.navigation;
            });
        } else { //添加
            $scope.data = {};
        }
        $scope.submit = function() {
            formatData($scope.data, {
                only: ['name', 'status', 'id', 'banner_good_id'],
                require: {
                    'name': '导航名称',
                }
            }, function(res) {
                if ($scope.filter.id) {
                    Mall.navigation.edit(res, true).then(function() {
                        history.back();
                    })
                } else {
                    Mall.navigation.add(res, true).then(function() {
                        history.back();
                    })
                }
            })
        }
    }).controller('mallCategoryListCtrl', function($scope, Mall, MallNavList, $rootScope, Filters, $stateParams, $state, Alert) {
        $scope.filter = Filters.pages($stateParams);
        Mall.category.list($scope.filter).then(function(data) {
            $scope.data = data.categories;
            $scope.records = data.total;
        });
        MallNavList().then(function(data) {
            $scope.filternav = data;
        });
        $scope.updateNav = function() {
            $scope.filter.sort = "position_asc";
            $scope.search();
        }
        $scope.changeRecommend = function(index) {
            var isRecommend = !$scope.data[index].is_recommend;
            var id = $scope.data[index].id;
            Mall.category.edit({
                is_recommend: isRecommend,
                id: id
            }, true).then(function() {
                $scope.data[index].is_recommend = !$scope.data[index].is_recommend;
            })
        }
        $scope.changeStatus = function(index) {
            Mall.category.edit({
                id: $scope.data[index].id,
                status: $scope.data[index].status
            }, true);
        }
    }).controller('mallCategoryInfoCtrl', function($scope, Mall, MallNavList, formatData, $rootScope, Filters, $stateParams, $state, Alert) {
        $scope.filter = Filters.pages($stateParams);
        if ($scope.filter.id) { //详情
            Mall.category.info($scope.filter).then(function(data) {
                $scope.edit = true;
                $scope.data = data.category;
            });
        } else { //添加
            $scope.data = {};
        }
        MallNavList().then(function(data) {
            $scope.filternav = data;
        });
        $scope.submit = function() {
            formatData($scope.data, {
                remove: ['update_time', 'navigation', 'create_time'],
                require: {
                    'name': '导航名称',
                }
            }, function(res) {
                if ($scope.filter.id) {
                    Mall.category.edit(res, true).then(function() {
                        $state.go('mall/category_list', {
                            navigation_id: $scope.data.navigation_id
                        });
                    })
                } else {
                    Mall.category.add(res, true).then(function() {
                        $state.go('mall/category_list', {
                            navigation_id: $scope.data.navigation_id
                        });
                    })
                }
            })
        }
    }).controller('mallGoodListCtrl', function($scope, Mall, Recommends, formatData, DateSv, MallNavList, Spider, $rootScope, Filters, $stateParams, $state, Alert) {
        $scope.filter = Filters.pages($stateParams);
        Mall.good.list($scope.filter).then(function(data) {
            $scope.data = data.goods;
            $scope.records = data.total;
        });
        MallNavList().then(function(data) {
            $scope.filternav = data;
        });
        $scope.changeStatus = function(index) {
            Mall.good.edit({
                id: $scope.data[index].id,
                status: $scope.data[index].status
            }, true)
        }
        $scope.changeNav = function() {
            $scope.filter.category_id = null;
            $scope.filter.sort = "position_asc";
            $scope.search();
        }
        if ($scope.filter.navigation_id) {
            Mall.category.list({
                navigation_id: $scope.filter.navigation_id
            }).then(function(data) {
                // $scope.$apply(function(){
                $scope.filtercate = data.categories;
                // })
            });

        }
        $scope.spider = function(index) {
            var params = {
                object_type: 'good',
                object_id: $scope.data[index].id
            }
            Spider.sp_update_task_by_object(params, true).then(function() {
                $state.reload();
            })
        }
        $scope.delete = function(index) {
            Alert.confirm('确定删除吗?', function() {
                Mall.good.edit({
                    id: $scope.data[index].id,
                    status: 4
                }, true).then(function() {
                    $state.reload();
                });
            })
        }
        $scope.commentGood = function(index) {
            $scope.commentData = {
                good_id: $scope.data[index].id
            }
            $('.commentPop').modal();
        }
        $scope.commentSubmit = function() {
            formatData($scope.commentData, {
                require: {
                    'content': '内容'
                }
            }, function(res) {
                res.create_time = DateSv.utc(res.create_time);
                Mall.good.comment_good(res, true).then(function() {
                    $('.commentPop').modal('hide');
                })
            })
        }
        $scope.recommendNavGood = function(index) {
            good = $scope.data[index];
            nav = good.category && good.category.navigation;
            nav_name = nav && nav.name || '';
            nav_index = nav && nav.index || '';
            $scope.recommendData = {
                type: 'nav_good_'+nav_index,
                object_id: good.id,
                object_type: 'good',
                show_words: good.name,
                nav_name: nav_name
            }
            $('.recommendNavGood').modal();
        }
        $scope.recommendSubmit = function() {
            Recommends.add($scope.recommendData, true).then(function() {
                $('.recommendNavGood').modal('hide');
            })
        }
    }).controller('mallGoodInfoCtrl', function($scope, Mall, MallNavList, formatData, $rootScope, Filters, $stateParams, $state, Alert) {
        $scope.filter = Filters.pages($stateParams);
        if ($scope.filter.id) { //详情
            Mall.good.info($scope.filter).then(function(data) {
                $scope.edit = true;
                $scope.data = data.good;
            });
        } else { //添加
            $scope.data = {
                status: 3,
                month_sales: 0
            };
        }
        $scope.$watch(function() {
            return $scope.data && $scope.data.navigation_id
        }, function(newValue, oldValue, scope) {
            if (newValue) {
                $scope.updateCate();
            }
        });
        MallNavList().then(function(data) {
            $scope.filternav = data;
        });
        $scope.updateCate = function() {
            Mall.category.list({
                navigation_id: $scope.data.navigation_id
            }, 'sub').then(function(data) {
                $scope.filtercate = data.categories;
            })
        }
        $scope.submit = function() {
            formatData($scope.data, {
                remove: ['images', 'poster', 'category', 'is_recommend'],
                require: {
                    'navigation_id': '所属导航',
                    'category_id': '类别ID',
                    'platform': '平台类型',
                    'name': '商品名称',
                    'merchant': '商家名称',
                    'market_price': '市场价格',
                    'status': '商品状态',
                    'image_ids': '商品图片',
                    'platattach.details_url': '商品链接',
                    'platattach.price': '折后价格'
                }
            }, function(res) {
                if ($scope.filter.id) {
                    Mall.good.edit(res, true).then(function() {
                        if ($stateParams._catch) {
                            history.back();
                            return false;
                        }
                        // $state.go('mall/good_list', {
                        //     navigation_id: $scope.data.navigation_id
                        // });
                        history.back();
                    })
                } else {
                    Mall.good.add(res, true).then(function() {
                        // $state.go('mall/good_list', {
                        //     navigation_id: $scope.data.navigation_id
                        // });
                        history.back();
                    })
                }
            })
        }
    }).controller('mallInnerGoodInfoCtrl', function($scope, Mall, MallNavList, formatData, $rootScope, Filters, $stateParams, $state, Alert) {
        $scope.filter = Filters.pages($stateParams);
        if ($scope.filter.id) { //详情
            Mall.good.info($scope.filter).then(function(data) {
                $scope.edit = true;
                $scope.data = data.good;
                $scope.has_cost_permission = data.has_cost_permission;
                if ($scope.data.details_html) {
                    $scope.setUMContent($scope.data.details_html);
                }
                $scope.plist = [];
                for (var i in $scope.data.styles) {
                    $scope.plist[i] = true;
                }
            });

        } else { //添加
            Mall.get_hscode().then(function(res) {
                $scope.data = {
                    status: 3,
                    month_sales: 0,
                    hscode: res.hscode,
                    styles: [{
                        "num": "",
                        "price": "",
                        "image_ids": [],
                        "name": "",
                        "status": 1,
                        "is_secbuy": false
                    }]
                };
                $scope.plist = [];
            })
        }
        MallNavList().then(function(data) {
            $scope.filternav = data;
        });
        $scope.$watch(function() {
            return $scope.data && $scope.data.navigation_id
        }, function(newValue, oldValue, scope) {
            if (newValue) {
                $scope.updateCate();
            }
        });
        $scope.updateCost = function(index) {
            $scope.costData = {
                good_id: $scope.data.id,
                style_index: $scope.data.styles[index].style_index,
                cost_price: $scope.data.styles[index].cost ? $scope.data.styles[index].cost.cost_price : ''
            };
            $scope.tempIndex = index;
            $('.costPop').modal();
        }
        $scope.costSubmit = function() {
            var index = index;
            formatData($scope.costData, {
                require: {
                    'cost_price': '成本价'
                }
            }, function(res) {
                Mall.good.cost_create_or_edit(res, true).then(function(res) {
                    $scope.data.styles[$scope.tempIndex].cost = res.cost;
                    $('.costPop').modal('hide');
                })
            })
        }
        $scope.$watch('data.styles', function(newValue, oldValue, scope) {
            if (newValue) {
                for (var i in newValue) {
                    var img = newValue[i].images;
                    var img_ids = [];
                    for (var j in img) {
                        img_ids.push(img[j].id);
                    }
                    newValue[i].image_ids = img_ids;
                }
            }
        }, true);
        $scope.setP = function(index, forward) {
            $scope.plist = swapItems($scope.plist, index, index + forward);
            $scope.data.styles = swapItems($scope.data.styles, index, index + forward);
        }
        $scope.updateCate = function() {
            Mall.category.list({
                navigation_id: $scope.data.navigation_id
            }, 'sub').then(function(data) {
                $scope.filtercate = data.categories;
            })
        }
        $scope.preview = function() {
            Mall.edit_details_view({
                'details_html': $scope.getUMContent(),
                'hscode': $scope.data.hscode
            }).then(function(res) {
                var url = res.preview_url;
                window.open(url);
                Alert.error('如果未在新窗口显示预览，请检查是否被浏览器拦截！');
            })
        }
        $scope.addStyleRow = function() {
            var temp = {
                "num": "",
                "price": "",
                "image_ids": [],
                "name": "",
                "status": 1,
                "is_secbuy": false
            }
            $scope.data.styles.push(temp);
            $scope.plist.push(false);
        }
        $scope.deleteRow = function(index) {
            $scope.data.styles.splice(index, 1);
        }
        $scope.deleteStyleImg = function(index, i) {
            $scope.data.styles[index].images.splice(i, 1);
            $scope.data.styles[index].image_ids.splice(i, 1);
        }
        $scope.submit = function() {
            $scope.data.details_html = $scope.getUMContent();
            var data = $.extend({}, $scope.data);
            for (var i in data.styles) {
                if (data.styles[i].cost) {
                    delete data.styles[i].cost
                }
            }
            formatData(data, {
                remove: ['images', 'poster', 'category', 'is_recommend'],
                toArrayString: ['styles'],
                require: {
                    'navigation_id': '所属导航',
                    'category_id': '类别ID',
                    'goods_category': '商品范畴',
                    'name': '商品名称',
                    'market_price': '市场价格',
                    'status': '商品状态',
                    'image_ids': '商品图片',
                    'styles': '商品规格'
                }
            }, function(res) {
                if ($scope.filter.id) {
                    Mall.good.edit(res, true).then(function() {
                        if ($stateParams._catch) {
                            history.back();
                            return false;
                        }
                        history.back();
                    })
                } else {
                    Mall.good.add_inner(res, true).then(function() {
                        history.back();
                    })
                }
            })
        }
    }).controller('mallTaskGoodCtrl', function($scope, Mall, MallNavList, Spider, formatData, $rootScope, Filters, $stateParams, $state, Alert) {
        $scope.filter = Filters.pages($stateParams);
        $scope.data = {
            status: 3,
            month_sales: 0
        };
        MallNavList().then(function(data) {
            $scope.filternav = data;
        });
        $scope.updateCate = function() {
            Mall.category.list({
                navigation_id: $scope.data.navigation_id
            }, 'sub').then(function(data) {
                $scope.filtercate = data.categories;
            })
        }
        $scope.submit = function() {
            formatData($scope.data, {
                require: {
                    'navigation_id': '所属导航',
                    'category_id': '所属类别',
                    'platform': '平台',
                    'url': '商品链接',
                }
            }, function(res) {
                Spider.good_task_create(res, true).then(function() {
                    $state.go('mall/good_list', {
                        navigation_id: $scope.data.navigation_id
                    });
                })
            })
        }
    }).controller('mallTaokeTransCtrl', function($scope, Mall, $rootScope, Filters, $stateParams, $state, Alert) {
        $scope.filter = Filters.pages($stateParams);
        Mall.taoke_trans_detail($scope.filter).then(function(data) {
            $scope.data = data.taoke_trans_details;
            $scope.records = data.total;
        });
        $scope.import = function() {
            //上传 
            var files = $scope.data.file;
            if (!files) {
                Alert.error('请选择文件！');
                return false;
            }
            xhr = new XMLHttpRequest();
            xhr.open("post", Mall.upload_taoke_trans_url, true);
            xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
            var fd = new FormData();
            for (var i = 0; i < files.length; i++) {
                //检测文件是不是图片 
                var file = files[i];
                fd.append('local_img', files[i]);
            }
            xhr.addEventListener("load", function(e) {
                var data = jQuery.parseJSON(e.target.responseText);
            });
            xhr.send(fd);
        }
    }).controller('mallActivityListCtrl', function($scope, Mall, DateSv, $rootScope, Filters, $stateParams, $state, Alert) {
        var temp = Filters.pages($stateParams);
        $scope.filter = $.extend({}, temp);
        temp.start_time = DateSv.utc(temp.start_time);
        temp.end_time = DateSv.utc(temp.end_time);
        Mall.activity.list(temp).then(function(data) {
            $scope.data = data.activities;
            $scope.records = data.total;
        });
        $scope.changeStatus = function(index) {
            Mall.activity.edit({
                id: $scope.data[index].id,
                status: $scope.data[index].status
            }, true);
        }
        $scope.datesearch = function() {
            $scope.search();
            return false;
        }
    }).controller('mallActivityInfoCtrl', function($scope, DateSv, formatData, PageDataCatch, Mall, $rootScope, Filters, $stateParams, $state, Alert) {
        // $state.$$stateChangeSuccess
        var _catch = false;
        var changedGood = null;
        $scope.$on('$stateChangeSuccess', function(event, next, nextParams, prev, prevParams) {
            _catch = prevParams._catch;
        });
        var _catch_value = PageDataCatch.get('active_info' + $stateParams.id);
        $scope.filter = $stateParams
        if ($stateParams.id) {
            Mall.activity.info($scope.filter).then(function(data) {
                $scope.data = data.activity;
                $scope.data.start_time = DateSv.local($scope.data.start_time);
                $scope.data.end_time = DateSv.local($scope.data.end_time);
                updateGood();
            });
        } else {
            $scope.data = {};
            updateGood();
        }
        $scope.deleteRow = function(index) {
            $scope.data.goods.splice(index, 1);
            $scope.data.good_ids.splice(index, 1);
        }

        function updateGood() {
            if (_catch && _catch_value) {
                $scope.data = _catch_value
                Mall.good.info(_catch).then(function(res) {
                    changedGood = res.good;
                    for (var i in $scope.data.goods) {
                        if ($scope.data.goods[i].id == changedGood.id) {
                            $scope.data.goods[i] = changedGood;
                        }
                    }
                });
            }
        }
        $scope.submit = function() {
            formatData($scope.data, {
                remove: ['goods', 'banner', 'update_time', 'secbuy_status', 'create_time'],
                require: {
                    'start_time': '开始时间',
                    'end_time': '结束时间',
                    'good_ids': '活动商品',
                    'banner_id': '图片'
                }
            }, function(res) {
                res.start_time = DateSv.utc(res.start_time);
                res.end_time = DateSv.utc(res.end_time);
                if ($stateParams.id) {
                    Mall.activity.edit(res, true).then(function() {
                        history.back();
                    })
                } else {
                    Mall.activity.create(res, true).then(function() {
                        history.back();
                    })
                }
            })
        }
        $scope.editGood = function(index) {
            PageDataCatch.add('active_info' + $stateParams.id, $scope.data);
            var platform = $scope.data.goods[index].platform;
            if (platform == 2) {
                $state.go('mall/inner_good_info', {
                    id: $scope.data.goods[index].id,
                    _catch: $scope.data.goods[index].id
                });
            } else {
                $state.go('mall/good_info', {
                    id: $scope.data.goods[index].id,
                    _catch: $scope.data.goods[index].id
                });
            }
        }
    }).controller('mallInnerOrderListCtrl', function($scope, Mall, DateSv, formatData, multiCheck, $rootScope, Filters, $stateParams, $state, Alert) {
        $scope.filter = Filters.pages($stateParams);
        var params = $.extend({}, $scope.filter);
        params = $.extend(params, {
            start_time: DateSv.utc($scope.filter.start_time),
            end_time: DateSv.utc($scope.filter.end_time)
        });
        Mall.innerOrder.list(params).then(function(data) {
            $scope.data = data.orders;
            $scope.records = data.total;
        });
        $scope.cancel = function(index) {
            $scope.cancelData = {
                id: $scope.data[index].id,
                is_back_coupons: 'false',
                reason: ''
            }
            $('.cancelPop').modal();
        }
        $scope.cancelSubmit = function() {
            formatData($scope.cancelData, {
                require: {
                    'id': '订单ID',
                    'reason': '取消原因'
                }
            }, function(res) {
                Mall.innerOrder.delete($scope.cancelData, true).then(function(res) {
                    if (res.refund && res.refund.url) {
                        window.open(res.refund.url);

                        $state.reload();
                        Alert.error('需要在新窗口中手动验证，请检查是否被浏览器拦截！');
                    } else {
                        $state.reload();
                    }
                })
            });
        }
        $scope.refund = function(index) {
            $scope.refundData = {
                id: $scope.data[index].id
            }
            $('.refundPop').modal();
        }
        $scope.refundSubmit = function(index) {
            formatData($scope.refundData, {
                require: {
                    'id': '订单ID',
                    'refund_amount': '退款金额'
                }
            }, function(res) {
                Mall.innerOrder.refund(res, true).then(function() {
                    $state.reload();
                })
            });
        }
        $scope.cancel_refund = function(index) {
            Alert.confirm('此乃非常规操作,确定取消退款吗?', function() {
                Mall.innerOrder.cancel_refund({
                    id: $scope.data[index].id
                }, true).then(function() {
                    $state.reload();
                })
            })
        }
        $scope.reject = function(index) {
            $scope.rejectData = {
                id: $scope.data[index].id
            }
            $('.rejectPop').modal();
        }
        $scope.rejectSubmit = function(index) {
            formatData($scope.rejectData, {
                require: {
                    'id': '订单ID',
                    'refund_amount': '退款金额'
                }
            }, function(res) {
                Mall.innerOrder.reject(res, true).then(function(res) {
                    if (res.refund && res.refund.url) {
                        window.open(res.refund.url);

                        $state.reload();
                        Alert.error('需要在新窗口中手动验证，请检查是否被浏览器拦截！');
                    } else {
                        $state.reload();
                    }
                })
            });
        }
        $scope.cancel_reject_good = function(index) {
            Alert.confirm('此乃非常规操作,确定取消退货吗?', function() {
                Mall.innerOrder.cancel_reject_good({
                    id: $scope.data[index].id
                }, true).then(function() {
                    $state.reload();
                })
            })
        }
        $scope.receive = function(index) {
            Alert.confirm('此乃非常规操作,确定收货吗?', function() {
                Mall.innerOrder.receive({
                    id: $scope.data[index].id
                }, true).then(function() {
                    $state.reload();
                })
            })
        }
        $scope.finish = function(index) {
            Alert.confirm('此乃非常规操作,确定完成订单吗?', function() {
                Mall.innerOrder.finish({
                    id: $scope.data[index].id
                }, true).then(function() {
                    $state.reload();
                })
            })
        }
        $scope.partial_refunding = function(index) {
            $scope.partialData = {
                id: $scope.data[index].id
            }
            $('.partialPop').modal();
        }
        $scope.partialSubmit = function() {
            formatData($scope.partialData, {
                require: {
                    'id': '订单ID',
                    'amount': '退款金额',
                    'description': '退款原因'
                }
            }, function(res) {
                Mall.innerOrder.partial_refunding(res, true).then(function(res) {
                    if (res.refund && res.refund.url) {
                        $state.reload();
                        Alert.error('需要在新窗口中手动验证，请检查是否被浏览器拦截！');
                        window.open(res.refund.url);
                    } else {
                        $state.reload();
                    }
                })
            });
        }
        $scope.multiCheck = multiCheck($scope, function(res, params) {
            var type = params[0];
            switch (type) {
                case 'details':
                    {
                        Mall.innerOrder.details_xls({
                            order_ids: res
                        })
                    };
                    break;
                case 'deliver':
                    {
                        Mall.innerOrder.deliver_xls({
                            order_ids: res
                        })
                    }
                    break;
                default:
                    return;
            }
        });
    }).controller('mallInnerOrderInfoCtrl', function($scope, Mall, $rootScope, formatData, Filters, $stateParams, $state, Alert) {
        $scope.filter = Filters.pages($stateParams);
        $scope.edit = true;
        Mall.innerOrder.info($scope.filter).then(function(data) {
            $scope.data = data.order;
            $scope.gift_packages = data.gift_packages
        });
        $scope.submit = function(index) {
            var gift_package_ids = []
            for (var i in $scope.data.details) {
                gift_package_ids.push($scope.data.details[i].gift_package_id)
            }
            var params = {
                id: $scope.data.id,
                pay_amount: $scope.data.settlement_detail.pay_amount,
                deliver_id: $scope.data.deliver_id,
                gift_package_ids: JSON.stringify(gift_package_ids),
                detailed_address: $scope.data.address.detailed_address,
                consignee: $scope.data.address.consignee,
                mobile: $scope.data.address.mobile
            }
            formatData(params, {
                require: {
                    'pay_amount': '付款金额'
                }
            }, function(res) {
                if (!res.deliver_id && $scope.data.status == 30) {
                    Alert.error('提交失败,缺少【快递单号】');
                    return false;
                }
                Mall.innerOrder.edit(res, true).then(function() {
                    history.back();
                })
            })
        }
        $scope.deliverXls = function() {
            Mall.innerOrder.deliver_xls({
                order_ids: $scope.data.id
            });
        }
        $scope.detailsXls = function() {
            Mall.innerOrder.details_xls({
                order_ids: $scope.data.id
            });
        }
    }).controller('mallInnerOrderDeliverCtrl', function($scope, Mall, $rootScope, formatData, Filters, $stateParams, $state, Alert) {
        $scope.filter = Filters.pages($stateParams);
        Mall.innerOrder.info($scope.filter).then(function(data) {
            $scope.data = data.order;
            $scope.gift_packages = data.gift_packages
            $scope.data.notify = "亲，你的订单已发货，请注意查收。收到货后在“我的订单”里对商品评分或者写体验报告，均可获得金币打赏。";
        });
        $scope.submit = function() {
            var params = {
                id: $scope.data.id,
                deliver_id: $scope.data.deliver_id,
                gift_package_ids: $scope.gift_package_ids,
                notify: $scope.data.notify
            }
            formatData(params, {
                require: {
                    'deliver_id': '物流单号/激活验证码'
                }
            }, function(res) {
                Mall.innerOrder.deliver(res, true).then(function() {
                    history.back();
                })
            })
        }
        $scope.editGift = function(index) {
            $scope.gift_package_ids = []
            for (var i in $scope.data.details) {
                $scope.gift_package_ids.push($scope.data.details[i].gift_package_id);
            }
            $scope.gift_package_ids = JSON.stringify($scope.gift_package_ids);
            var params = {
                id: $scope.data.id,
                gift_package_ids: $scope.gift_package_ids
            }
            Mall.innerOrder.edit(params, true).then(function() {
                Alert.success('数据已更新');
            });
        }
        $scope.deliverXls = function() {
            Mall.innerOrder.deliver_xls({
                order_ids: $scope.data.id
            });
        }
        $scope.detailsXls = function() {
            Mall.innerOrder.details_xls({
                order_ids: $scope.data.id
            });
        }
    })
    .controller('mallCouponListCtrl', function($scope, Mall, multiCheck, $rootScope, formatData, Filters, $stateParams, $state, Alert) {
        $scope.filter = Filters.pages($stateParams);
        $scope.params = $.extend({}, Filters.pages($stateParams));
        Mall.coupon.list($scope.filter).then(function(data) {
            $scope.data = data.coupons;
            $scope.records = data.total;
        });
        $scope.multiCheck = multiCheck($scope, function(res) {
            Alert.confirm('确定删除吗?', function() {
                Mall.coupon.delete({
                    coupon_ids: res
                }, true).then(function() {
                    $state.reload();
                });
            })
        });
        $scope.delete = function(index) {
            Alert.confirm('确定删除吗?', function() {
                Mall.coupon.delete({
                    coupon_ids: $scope.data[index].id
                }, true).then(function() {
                    $state.reload();
                });
            })
        }
    })
    .controller('mallGiftPackageListCtrl', function($scope, Mall, multiCheck, $rootScope, formatData, Filters, $stateParams, $state, Alert) {
        $scope.filter = Filters.pages($stateParams);
        Mall.gift.list($scope.filter).then(function(data) {
            $scope.data = data.gift_packages;
            $scope.records = data.total;
        });
        $scope.delete = function(index) {
            Alert.confirm('确定删除吗?', function() {
                Mall.gift.delete({
                    id: $scope.data[index].id
                }, true).then(function() {
                    $state.reload();
                });
            })
        }
    })
    .controller('mallGiftPackageInfoCtrl', function($scope, Mall, multiCheck, $rootScope, formatData, Filters, $stateParams, $state, Alert) {
        $scope.filter = Filters.pages($stateParams);
        if ($scope.filter.id) { //详情
            Mall.gift.info($scope.filter).then(function(data) {
                $scope.data = data.gift_package;
            });
        } else { //添加
            $scope.data = {
                gifts: [{
                    "num": '',
                    "name": ""
                }]
            }
        }
        $scope.deleteRow = function(index) {
            $scope.data.gifts.splice(index, 1);
        }
        $scope.addStyleRow = function() {
            var temp = {
                "num": '',
                "name": ""
            }
            if (!$scope.data.gifts) {
                $scope.data.gifts = [];
            }
            $scope.data.gifts.push(temp);
        }
        $scope.setP = function(index, forward) {
            $scope.data.gifts = swapItems($scope.data.gifts, index, index + forward);
        }
        $scope.delete = function(index) {
            Alert.confirm('确定删除吗?', function() {
                Mall.coupon.delete({
                    coupon_ids: $scope.data[index].id
                }, true).then(function() {
                    $state.reload();
                });
            })
        }
        $scope.submit = function() {
            $scope.data.id = $scope.data._id;
            formatData($scope.data, {
                require: {
                    'package_name': '名称'
                },
                toArrayString: ['gifts']
            }, function(res) {
                if ($scope.filter.id) {
                    Mall.gift.edit(res, true).then(function(res) {
                        history.back();
                    })
                } else {
                    Mall.gift.add(res, true).then(function(res) {
                        history.back();
                    })
                }

            })

        }
    })
    .controller('mallGoodCommentListCtrl', function($scope, Mall, DateSv, multiCheck, $rootScope, formatData, Filters, $stateParams, $state, Alert) {
        $scope.filter = Filters.pages($stateParams);
        $scope.params = $.extend({}, Filters.pages($stateParams));
        Mall.good_comment_list($scope.filter).then(function(data) {
            $scope.data = data.comments;
            $scope.records = data.total;
        });
        $scope.updateTime = function(index) {
            $scope.commentData = {
                id: $scope.data[index].id,
                create_time: DateSv.local($scope.data[index].create_time)
            }
            $('.commentPop').modal();
        }
        $scope.updateSubmit = function() {
            formatData($scope.commentData, {
                require: {
                    'create_time': '评论时间'
                }
            }, function(res) {
                res.create_time = DateSv.utc(res.create_time);
                Mall.good_comment_edit(res, true).then(function() {
                    $state.reload();
                })
            });
        };
        $scope.delete = function(index) {
            Alert.confirm('确定删除吗?', function() {
                Mall.delete_good_comment({
                    id: $scope.data[index].id
                }, true).then(function() {
                    $scope.data.splice(index, 1);
                });
            })
        }
    })
    .controller('addressListCtrl', function($scope,Mall, $rootScope, formatData, Filters, $stateParams,$state, Alert) {
         $scope.filter = Filters.pages($stateParams);
         Mall.address_list($scope.filter).then(function(data){
            $scope.data = data.addresses;
            $scope.records = data.total;
         });
    })
