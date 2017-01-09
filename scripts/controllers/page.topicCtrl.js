angular.module('lusirAdmin.controller')
    .controller('topicListCtrl', function($scope, Recommends,RealtimeSearch, Topics, Coin, Message, formatData, Filters, $stateParams, $state, Alert, multiCheck) {
        $scope.filter = Filters.pages($stateParams);
        if ($scope.filter.keyword) {
            $scope.filter.type = 'topic';
            RealtimeSearch.search($scope.filter).then(function(data) {
                data.hits = data.hits.map(function(item) {
                    console.log(item.object);
                    return item.object;
                })
                $scope.data = data.hits;
                $scope.records = data.total;
            })
        } else {
            Topics.list($scope.filter).then(function(data) {
                $scope.data = data.topics;
                $scope.records = data.total;
            });
        }
        if(!$scope.filter.is_top){
            $scope.filter.is_top = '';
        }
        $scope.delete = function(index) {
            Alert.confirm('确定删除吗?', function() {
                Topics.delete($scope.data[index].id, true).then(function() {
                    $scope.data.splice(index, 1);
                });
            })
        };
        $scope.publish = function(index) {
            Topics.publish({
                id: $scope.data[index].id,
            }, true);
        }
        $scope.changeStatus = function(index) {
            Topics.status({
                id: $scope.data[index].id,
                status: $scope.data[index].status
            }, true);
        }
        $scope.changeSexy = function(index) {
            Topics.edit({
                id: $scope.data[index].id,
                is_sexy: $scope.data[index].is_sexy
            }, true);
        }
        $scope.changeTop = function(index) {
            Topics.edit({
                id: $scope.data[index].id,
                is_top: $scope.data[index].is_top
            }, true);
        }
        $scope.reward = function(index) {
            $scope.rewardData = {
                topic_id: $scope.data[index].id,
                amount: 10,
                limit: 1000
            }
            $('.rewardPop').modal();
        }
        $scope.recommendHot = function(index) {
            //add-recommend data-type="hot_topic" data-object_id="{{topic.id}}" data-object_type="topic"
            $scope.recommendData = {
                type: 'hot_topic',
                object_id: $scope.data[index].id,
                object_type: 'topic',
                reward_coins: 5
            }
            //$('.recommendPop').modal();
            Recommends.add($scope.recommendData, true).then(function() {
            })
        }
        $scope.recommendHotBanner = function(index) {
            $scope.recommendData = {
                type: 'banner_topic',
                object_id: $scope.data[index].id,
                object_type: 'topic',
                show_words: $scope.data[index].title
            }
            $('.recommendPopBanner').modal();
        }
        $scope.recommendSubmit = function() {
            Recommends.add($scope.recommendData, true).then(function() {
                $('.recommendPop').modal('hide');
                $('.recommendPopBanner').modal('hide');
            })
        }
        $scope.rewardSubmit = function(index) {
            if ($scope.rewardData.amount > 10 || $scope.rewardData.amount < 1) {
                Alert.error('金币数必须是1~10的数字！');
                return false;
            }
            Coin.reward_topic($scope.rewardData, true).then(function() {
                $('.rewardPop').modal('hide');
            });
        }
        $scope.topicMessage = function(index) {
            $scope.send = {
                topic_id: $scope.data[index].id,
                target: 'all',
                group_id: $scope.data[index].group_id,
                group_name: $scope.data[index].group.title,
                star_id: $scope.data[index].group.star && $scope.data[index].group.star.id,
                star_name: $scope.data[index].group.star && $scope.data[index].group.star.names.join(',')
            }
            $('.sendAlbum').modal();
        }
        $scope.changeGroup = function(index) {
            $('.changeGrup').modal();
            $scope.change = {
                id: $scope.data[index].id,
                group_id: $scope.data[index].group_id,
                group_name: $scope.data[index].group.title,
            }
        }
        $scope.changeGrupSubmit = function() {
            formatData($scope.change, {
                require: {
                    'group_id': '小组'
                }
            }, function(res) {
                Topics.move(res, true).then(function() {
                    $('.sendAlbum').modal('hide');
                    $state.reload();
                })
            })
        }
        $scope.sendSubmit = function() {
            formatData($scope.send, {
                remove: ['group_name', 'star_name']
            }, function(res) {
                if (res.target == 'specified' && (!(res.group_id || res.star_id))) {
                    Alert.error('提交失败,请指定【小组成员】或【老师粉丝】。');
                    return false;
                }
                Message.send_new_topic_message(res, true).then(function() {
                    $('.sendAlbum').modal('hide');
                })
            })
        }
        $scope.multiCheck = multiCheck($scope, function(res) {
            console.log(res);
            Alert.confirm('确定删除吗?', function() {
                Topics.delete(res, true).then(function() {
                    $state.reload();
                });
            })
        });
    })

.controller('topicInfoCtrl', function($scope, Topics, Groups, Recommends, LoginUser, Filters, formatData, $stateParams, $state, Alert) {
        var id = $stateParams.id;
        $scope.filter = Filters.pages($stateParams);
        if (id) { //编辑
            $scope.edit = true;
            Topics.info($scope.filter).then(function(data) {
                $scope.data = data.topic;
                $scope.records = data.total;
                // $scope.data.is_official = $scope.data.is_official || false;
            });
        } else { //添加
            $scope.data = {};
            if ($scope.filter.group_id) { //通过小组添加
                $scope.data.group_id = $scope.filter.group_id;
                Groups.info($scope.filter.group_id).then(function(res) {
                    $scope.data.group = res.group;
                });
            }
        }
        $scope.changeGroup = function() {
            $('.changeGrup').modal();
            $scope.change = {
                id: $scope.data.id,
                group_id: $scope.data.group_id,
                group_name: $scope.data.group.title,
            }
        }
        $scope.changeGrupSubmit = function() {
            formatData($scope.change, {
                require: {
                    'group_id': '小组'
                }
            }, function(res) {
                Topics.move(res, true).then(function() {
                    $('.sendAlbum').modal('hide');
                    $state.reload();
                })
            })
        }
        $scope.delete = function(index) {
            Alert.confirm('确定删除吗?', function() {
                Topics.delete(id, true).then(function() {
                    history.back();
                });
            })
        }
        $scope.recommendHot = function() {
            //add-recommend data-type="hot_topic" data-object_id="{{topic.id}}" data-object_type="topic"
            $scope.recommendData = {
                type: 'hot_topic',
                object_id: $scope.data.id,
                object_type: 'topic',
                reward_coins: 10
            }
            $('.recommendPop').modal();
        }
        $scope.recommendSubmit = function() {
            Recommends.add($scope.recommendData, true).then(function() {
                $('.recommendPop').modal('hide');
            })
        }
        $scope.submit = function() {
            if (id) { //修改
                formatData($scope.data, {
                    remove: ['star', 'creator', 'create_time', 'creator_id', 'group', 'latest_post_time'],
                    require: {
                        'title': '标题',
                        'content': '帖子内容',
                        'group_id': '所属小组'
                    }
                }, function(res) {
                    Topics.edit(res, true).then(function() {
                        history.back();
                    })
                })
            } else { //添加
                formatData($scope.data, {
                    remove: ['star', 'creator', 'create_time', 'creator_id', 'group', 'latest_post_time'],
                    require: {
                        'title': '标题',
                        'content': '帖子内容',
                        'group_id': '所属小组',
                        'creator_username': '创建者'
                    }
                }, function(res) {
                    Topics.add(res, true).then(function() {
                        $state.go('topic/list');
                    });
                })
            }

        }
    })
    .controller('postListCtrl', function($scope, postView,Coin, Posts, Topics, Filters, formatData, multiCheck, LoginUser, $stateParams, $state, Alert) {
        var topic_id = $stateParams.topic_id;
        if (postView.value && !topic_id) {
            return false;
        }
        $scope.filter = Filters.pages($stateParams);
        $scope.reply = {
            topic_id: topic_id,
        };
        $scope.uploadConfig = {
            is_watermark: true
        }
        Posts.list($scope.filter).then(function(data) {
            $scope.data = data.posts;
            $scope.records = data.total;
            if (topic_id) {
                $scope.topic = $scope.data && $scope.data[0].topic;
                $scope.subtitle = $scope.topic && $scope.topic.title;
            }

        });
        $scope.delete = function(index) {
            if ($scope.data[index].floor == 1) {
                Alert.confirm('删除一楼将删除该话题，确定删除?', function() {
                    Topics.delete(topic_id, true).then(function() {
                        $state.go('post/list');
                    });
                });
            } else {
                Alert.confirm('确定删除吗?', function() {
                    Posts.delete($scope.data[index].id, true).then(function() {
                        $scope.data.splice(index, 1);
                    });
                });
            }

        };
        $scope.multiCheck = multiCheck($scope, function(res) {
            console.log(res);
            Alert.confirm('确定删除吗?', function() {
                Posts.delete(res, true).then(function() {
                    $state.reload();
                });
            })
        });
        $scope.changeStatus = function(index) {
            Posts.status({
                id: $scope.data[index].id,
                status: $scope.data[index].status
            }, true);
        }
        $scope.replayFocus = function(index) {
            if (typeof index != 'undefined') {
                $scope.reply.replied_floor = $scope.data[index].floor;
                var username = $scope.data[index].publisher.nick;
                $scope.reply.content = '@' + username + ' ';
            }
            $('.reply-content').focus();
        }
        $scope.replyPost = function() {
            formatData($scope.reply, {
                require: {
                    'publisher_username': '发表者用户名'
                }
            }, function(res) {
                if (!(res.content || res.image_ids)) {
                    Alert.error('提交失败,【内容】与【图片】不能同时为空。');
                    return false;
                }
                Posts.reply(res, true).then(function() {
                    $state.reload();
                });
            })

        }
        $scope.rewardPost=function(index){
            $scope.rewardData={
                post_id:$scope.data[index].id
            }
            $('.rewardPop').modal();
        }
        $scope.rewardSubmit=function(){
            formatData($scope.rewardData, {
                require: {
                    'amount': '金币数'
                }
            },function(res){
                Coin.reward_post(res,true).then(function(res){
                    $('.rewardPop').modal('hide');
                });
            });
        }
    })
    .controller('postInfoCtrl', function($scope, Posts, Filters, formatData, $stateParams, $state, Alert) {
        var id = $stateParams.id;
        $scope.filter = Filters.pages($stateParams);
        $scope.edit = true;
        Posts.info($scope.filter).then(function(data) {
            $scope.data = data.post;
            $scope.records = data.total;
            // $scope.data.is_official = $scope.data.is_official || false;
        });
        $scope.delete = function(index) {
            Alert.confirm('确定删除吗?', function() {
                Posts.delete(id, true).then(function() {
                    history.back();
                });
            })
        }
        $scope.submit = function() {
            formatData($scope.data, {
                remove: ['publisher', 'create_time', 'publisher_id', 'images', 'topic', 'topic_id', 'latest_post_time'],
                require: {
                    'content': '帖子内容'
                }
            }, function(res) {
                Posts.edit(res, true).then(function() {
                    history.back();
                })
            })

        }
    })
