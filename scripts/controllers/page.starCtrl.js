
/**
 * @ngdoc function
 * @name deffileApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the deffileApp
 */
angular.module('lusirAdmin.controller')
.controller('starListCtrl', function($scope, Stars, Filters, $stateParams, $state, Alert) {
        $scope.filter = Filters.pages($stateParams);
        Stars.list($scope.filter).then(function(data) {
            $scope.data = data.stars;
            $scope.records = data.total;
        });
        $scope.delete = function(index) {
            Alert.confirm('确定删除吗?', function() {
                Stars.delete($scope.data[index].id, true).then(function() {
                    $scope.data.splice(index, 1);
                });
            })
        }
    })
    //老师详情、添加控制器
    .controller('starInfoCtrl', function($scope, Stars, Alert, $stateParams, StarTags, $state, formatData) {
        var id = $stateParams.id;
        $scope.star_tags = StarTags;
        if (id) { //修改，载入数据
            $scope.edit = true;
            Stars.info(id).then(function(data) {
                $scope.data = data.star;
            });
        } else { //添加，空数据
            $scope.data = {};
        }
        $scope.delete = function() {
            Alert.confirm('确定删除吗?', function() {
                Stars.delete(id, true).then(function() {
                    history.back();
                });
            })
        }
        $scope.submit = function() {
            formatData($scope.data, {
                remove: ['avatars', 'locale', 'poster', 'small_poster'],
                require: {
                    'names': '老师名称',
                    'avatar_ids': '头像'
                }
            }, function(res) {
                if (id) { //修改
                    Stars.edit(res, true).then(function() {
                        history.back();
                    })
                } else { //添加
                    Stars.add(res, true).then(function() {
                        $state.go('star/list');
                    });
                }
            });
        }
    })
    //老师作品列表控制器
    .controller('starWorkCtrl', function($scope, Stars, Works, Filters, $stateParams, $state, Alert) {
        $scope.filter = Filters.pages($stateParams);

        Works.list($scope.filter).then(function(data) {
            $scope.data = data.works;
            $scope.records = data.total;
        });
        if ($scope.filter.star_id) {
            Stars.info($scope.filter.star_id, 'sub').then(function(data) {
                $scope.subtitle = data.star.names.join(',')
            })
        }
        $scope.changeCoverSex = function(index) {
            Works.edit({
                id: $scope.data[index].id,
                is_cover_sexy: $scope.data[index].is_cover_sexy
            }, true);
        }
        $scope.changeStatus = function(index) {
            Works.edit({
                id: $scope.data[index].id,
                status: $scope.data[index].status
            }, true);
        }
        $scope.delete = function(index) {
            Alert.confirm('确定删除吗?', function() {
                Works.delete($scope.data[index].id, true).then(function() {
                    $scope.data.splice(index, 1);
                });
            })
        }
    })

//老师作品详情、添加控制器
.controller('starWorkInfoCtrl', function($state, $scope, Stars, Works, $stateParams, StarTags, formatData) {
        var id = $stateParams.id;
        var star_id = $stateParams.star_id;
        if (id) { //修改，载入数据
            Works.info(id).then(function(data) {
                $scope.data = data.work;
            });
            $scope.edit = true;
        } else { //添加，空数据
            $scope.data = {};
            if (star_id) { //通过老师列表添加
                Stars.info(star_id).then(function(data) {
                    $scope.data.stars = [data.star];
                    $scope.data.star_ids = [data.star.id];
                })
            }
        }
        $scope.removeStar = function(index) {
            $scope.data.stars.splice(index, 1);
            $scope.data.star_ids.splice(index, 1);
        }
        $scope.submit = function() {
            var submitData = formatData($scope.data, {
                remove: ['stars', 'image', 'create_time', 'update_time'],
                require: {
                    "star_ids": "老师",
                    "title": "作品名称",
                    "issue_no": "发行号"
                }
            }, function(res) {
                if (id) { //修改
                    Works.edit(res, true).then(function() {
                        history.back();
                    })
                } else { //添加
                    Works.add(res, true).then(function() {
                        $state.go('star/work_list');
                    });
                }
            });
        }

    })
    //老师写真列表控制器
    .controller('starPhotoCtrl', function($scope, Stars, Photos, Filters, $stateParams, $state, Alert) {
        $scope.filter = Filters.pages($stateParams);
        Photos.list($scope.filter).then(function(data) {
            $scope.data = data.photos;
            $scope.records = data.total;
        });
        if ($scope.filter.star_id) {
            Stars.info($scope.filter.star_id, 'sub').then(function(data) {
                $scope.subtitle = data.star.names.join(',')
            })
        }
        $scope.changeCoverSex = function(index) {
            Photos.edit({
                id: $scope.data[index].id,
                is_image_sexy: $scope.data[index].is_image_sexy
            }, true);
        }
        $scope.changeStatus = function(index) {
            Photos.edit({
                id: $scope.data[index].id,
                status: $scope.data[index].status
            }, true);
        }
        $scope.delete = function(index) {
            Alert.confirm('确定删除吗?', function() {
                Photos.delete($scope.data[index].id, true).then(function() {
                    $scope.data.splice(index, 1);
                });
            })
        }
    })
    //老师写真详情、添加控制器
    .controller('starPhotoInfoCtrl', function($scope, $state, Stars, Photos, $stateParams, formatData) {
        var id = $stateParams.id;
        var star_id = $stateParams.star_id;
        if (id) { //修改，载入数据
            Photos.info(id).then(function(data) {
                $scope.data = data.photo;
            })
            $scope.edit = true;
        } else { //添加，空数据
            $scope.data = {};
            if (star_id) { //通过老师列表添加
                Stars.info(star_id).then(function(data) {
                    $scope.data.star = data.star;
                    $scope.data.star_id = data.star.id;
                })
            }
        }
        $scope.submit = function() {
            var submitData = formatData($scope.data, {
                remove: ['star', 'image', 'create_time', 'update_time'],
                require: {
                    "star_id": "老师ID",
                    "image_id": "图片"
                }
            }, function(res) {
                if (id) { //修改
                    Photos.edit(res, true).then(function() {
                        history.back();
                    })
                } else { //添加
                    Photos.add(res, true).then(function() {
                        $state.go('star/photo_list')
                    });
                }
            });
        }
    })
    //众包写真控制器
    .controller('starCrowdsourcedInfoCtrl', function($scope, Stars, Crowdsourceds, Filters, $stateParams, $state, Alert) {
        $scope.filter = Filters.pages($stateParams);
        Crowdsourceds.list($scope.filter).then(function(data) {
            $scope.data = data.photos;
            $scope.records = data.total;
        });
        $scope.delete = function(index) {
            Alert.confirm('确定删除吗?', function() {
                Crowdsourceds.delete($scope.data[index].id, true).then(function() {
                    $scope.data.splice(index, 1);
                });
            })
        }
    })
    //老师专辑列表控制器
    .controller('starAlbumCtrl', function($scope, Stars, Albums, Filters, $stateParams, $state, Alert) {
        $scope.filter = Filters.pages($stateParams);
        Albums.list($scope.filter).then(function(data) {
            $scope.data = data.albums;
            $scope.records = data.total;
        });
        $scope.changeStatus = function(index) {
            Albums.edit({
                id: $scope.data[index].id,
                status: $scope.data[index].status
            }, true);
        }
        $scope.delete = function(index) {
            Alert.confirm('确定删除吗?', function() {
                Albums.delete($scope.data[index].id, true).then(function() {
                    $scope.data.splice(index, 1);
                });
            })
        }
    })
    //老师专辑详情、添加控制器
    .controller('starAlbumInfoCtrl', function($scope, Stars, Alert, Albums, $stateParams, StarTags, $state, formatData) {
        var id = $stateParams.id;
        if (id) { //修改，载入数据
            $scope.edit = true;
            Albums.info(id).then(function(data) {
                $scope.data = data.album;
            });
        } else { //添加，空数据
            $scope.data = {};
        }
        $scope.delete = function() {
            Alert.confirm('确定删除吗?', function() {
                Albums.delete(id, true).then(function() {
                    history.back();
                });
            })
        }
        $scope.submit = function() {
            formatData($scope.data, {
                remove: ['cover', 'poster'],
                require: {
                    'name': '专辑名称',
                    'cover_id': '封面'
                }
            }, function(res) {
                if (id) { //修改
                    Albums.edit(res, true).then(function() {
                        history.back();
                    })
                } else { //添加
                    Albums.add(res, true).then(function() {
                        $state.go('star/album_list');
                    });
                }
            });
        }
    })
    //老师专辑下作品控制器

.controller('starAlbumWorkCtrl', function($scope, Stars, albumWorks, Albums, formatData, Filters, $stateParams, $state, Alert) {
    $scope.filter = Filters.pages($stateParams);

    if ($scope.filter.album_id) { //专辑下的作品列表
        albumWorks.list($scope.filter).then(function(data) {
            $scope.data = data.items;
            $scope.records = data.total;
        });
    }
    if ($scope.filter.album_id) {
        Albums.info($scope.filter.album_id, 'sub').then(function(data) {
            $scope.subtitle = data.album.name;
        })
    }
    $scope.remove = function(index) {
        var params = {
            work_id: $scope.data[index].work_id,
            album_id: $scope.filter.album_id
        }

        Alert.confirm('确定移除吗?', function() {
            albumWorks.delete(params, true).then(function() {
                // history.back();
                $scope.data.splice(index, 1);
            });
        })
    }
    $scope.addwork = function() {
        $('.addAlbum').modal();
    }
    $scope.add = {
        album_id: $scope.filter.album_id
    }
    $scope.addAlbumSubmit = function() {
        formatData($scope.add, {
            require: {
                'work_id': '作品'
            }
        }, function(res) {
            albumWorks.add(res, true).then(function() {
                $state.reload();
            });
        });
    }
})
