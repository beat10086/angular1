angular.module('lusirAdmin.controller')
    .controller('recommendListCtrl', function($scope, Recommends,formatData,$rootScope, Filters, $stateParams, $state, Alert) {
        $scope.filter = Filters.pages($stateParams);
         $scope.$on('$stateChangeStart', function(event, next, nextParams, prev, prevParams) {
            if(nextParams.type!=prevParams.type){
                nextParams.currentPage=null;
            }
        });
         $scope.subtitle=$scope.filter.type.replace(/_/g,' ').toLocaleUpperCase();
         var type=$scope.filter.type;
         if(type.indexOf('_good')>-1){
            type='mall';
         }
         $scope.append=function(){
            $scope.recommendsNow={
                object_type:'good',
                object_id:'',
                type:$scope.filter.type
            }
            $('.recommendPop').modal();
         }
         $scope.editShowWord=function(index){
            $scope.showWordData={
                show_words:$scope.data[index].show_words,
                object_id:$scope.data[index].object_id,
                type:$scope.data[index].type
            }
            $('.showWordPop').modal();
        }
        $scope.showWordSubmit=function(){
            Recommends.edit($scope.showWordData,true).then(function(){
                $('.showWordPop').modal('hide');
                $state.reload();
            })
        }
         $scope.recommendedGood=function(){
            formatData($scope.recommendsNow, {
                only: ['object_id', 'object_type', 'type', 'show_words'],
                require: {
                    'object_id': '商品',
                    'show_words': '展示文字',
                }
            }, function(res) {
               Recommends.add(res,true).then(function(){
                    $state.reload();
               });
            })
         }
         $scope.hide={
            hot_topic:{poster:true,intro:true,img:true},
            good_topic:{poster:true,intro:true,img:true},
            hot_album:{intro:true},
            ad_group_index:{_type:true,_show_words:true,img:true,intro:true},
            novice_must_read:{poster:true,intro:true,img:true},
            today_headline:{poster:true,intro:true,img:true},
            hot_user:{poster:true,intro:true},
            mall:{},
            ad_mall_index:{ad:true},
            cloud:{poster:true},
            banner_topic:{_show_words:true,intro:true,img:true},
            hot_group: {poster:true}
         }[type];
        Recommends.list($scope.filter).then(function(data) {
            $scope.data = data.recommends;
            $scope.records = data.total;
        });
    });