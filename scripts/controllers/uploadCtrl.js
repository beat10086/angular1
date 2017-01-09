var app = angular.module('fileUpload', ['angularFileUpload'])
    .controller('uploadCtrl', ['$scope', '$upload', function($scope, $upload, Alert) {
        $scope.$watch('files', function(newValue) {
            var temp = [];
            for (var i in newValue) {
                var id = newValue[i].id;
                temp.push(id);
            }
            $scope.updateFiles(temp);
            if(!$scope[$scope.root||'data']) return false;
            $scope[$scope.root||'data'][$scope.key]=temp;
        },true);
        $scope.upload = function(files) {
            var progressStack={};
            var successNum=0;
            var progressNum=0;
            var fields=$.extend($scope.fileds,$scope.uploadConfig);
            if (files && files.length) {
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    console.log(file);
                    $upload.upload({
                        url: '/storage/upload',
                        fields: fields,
                        file: file
                    }).progress(function(evt) {
                        $scope.progressing=true;
                        if(!progressStack[evt.config.file.name]){
                            progressNum++;
                        }
                        progressStack[evt.config.file.name]={loaded:evt.loaded,total:evt.total}
                        var loaded=0,total=0;
                        for (var i in progressStack){
                            loaded+=progressStack[i].loaded;
                            total+=progressStack[i].total;
                        }
                        $scope.progressPercentage = parseInt(100.0 * loaded / total)+'%' ;
                    }).success(function(data, status, headers, config) {
                        if (data.code){
                            alert(data.message);
                            return;
                        }
                        successNum++;
                        if($scope.multiple){
                            if(!$scope.files) $scope.files=[];
                            $scope.files=$scope.files.concat(data.files);
                        }else{
                            $scope.files = data.files;
                        }
                        if(successNum==progressNum){
                             $scope.progressing=false;
                        }
                    });
                }
            }
        }
        $scope.deleteFile = function(index) {
            $scope.files.splice(index, 1);
        }
    }]);
