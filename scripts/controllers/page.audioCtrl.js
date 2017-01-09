angular.module('lusirAdmin.controller')
    .controller('audioListCtrl', function($scope, Audio, Topics, formatData, Filters, $stateParams, $state, Alert) {
        $scope.filter = Filters.pages($stateParams);
        Audio.list($scope.filter).then(function(data) {
            $scope.data = data.audio_columns;
            $scope.records = data.total;
        });
        $scope.delete = function(index) {
            var audio_id = $scope.data[index].id;
            var topic_id = $scope.data[index].topic_id;
            Alert.confirm('确定删除吗?', function() {
                Audio.delete(audio_id, true).then(function() {
                    $scope.data.splice(index, 1);
                    Alert.confirm('操作成功！是否同时删除关联话题?', function() {
                        Topics.delete(topic_id, true);
                    });
                });
            });
        };
    }).controller('audioInfoCtrl', function($scope, Audio, $http, $upload, DateSv, formatData,$timeout, Filters, $stateParams, $state, Alert) {
        $scope.filter = Filters.pages($stateParams);
        if ($scope.filter.id) {
            Audio.info($scope.filter).then(function(data) {
                $scope.data = data.audio_column;
                $scope.records = data.total;
                $scope.data.start_time = DateSv.local($scope.data.start_time);
                $timeout(function(){
                    $scope.drawTitle();
                })
            });
            $scope.edit = true;
        } else {
            $scope.data = {};
        }
        $scope.canvas = {
            width: 0,
            left: 195,
            font_size:36
        };
        var maxWidth = 465;

        $scope.drawTitle = function(isUiFirst) {
            function convertCanvasToImage(canvas) {
                var image = new Image();
                image.src = canvas.toDataURL("image/png");
                return image.src;
            }

            function getLen(str) {
                if (!str) return 0;
                return str.replace(/[^\x00-\xFF]/g, '**').length;
            }
            if (!$scope.ctx) {
                var clock = document.getElementById("audioTitle");
                $scope.ctx = clock.getContext("2d");
            }
            if (!isUiFirst) {
                var len = getLen($scope.data.title);
                var w = ($scope.canvas.left || 0) + (len ? 10 + len * $scope.canvas.font_size/2 : 0);
                w = w > maxWidth ? maxWidth : w;
                $scope.canvas.width = w;
            }
            $('#audioTitle').attr('width', $scope.canvas.width);
            ctx = $scope.ctx;
            ctx.clearRect(0, 0, $scope.canvas.width, 36);
            ctx.font = "italic "+$scope.canvas.font_size+"px aidu ";
            ctx.fillStyle = "rgba(255,255,255,0.8)";
            ctx.fillText($scope.data.title, $scope.canvas.left || 0, 31);
            $scope.titleImg = convertCanvasToImage(document.getElementById("audioTitle"));
        };

        $scope.submit = function() {
            if ($scope.filter.id) {
                formatData($scope.data, {}, function(res) {
                    res.start_time = DateSv.utc(res.start_time);
                    Audio.edit(res, true).then(function() {
                        history.back();
                    });
                });
            } else {
                formatData($scope.data, {
                    require: {
                        'image_id': '音频图片',
                        'start_time': '开始时间',
                        'title': '标题',
                        'audio_id': '音频文件'
                    }
                }, function(res) {
                    res.start_time = DateSv.utc(res.start_time);
                    Audio.create(res, true).then(function() {
                        history.back();
                    });
                });
            }
        };
    });
