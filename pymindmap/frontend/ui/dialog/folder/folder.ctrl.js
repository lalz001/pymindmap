angular.module('kityminderEditor')
    .controller('folder.ctrl', ['$scope', '$modalInstance','folder','method','path','sub',function ($scope, $modalInstance,folder, method,path,sub) {
        // console.log(path,sub)
        $scope.method = method
        $scope.path = path || ""
        $scope.sub = sub || ""
        $scope.editsub = false;
        $scope.editpath = false
        if (method === 'addfolder'){
            $scope.title = "新建文件夹"
        }
        if(method === 'addminder'){
            $scope.title ="新建导图"
        }
        if(method ==="renamefolder"){
            $scope.title ="重命名文件夹"
            $scope.editpath = true
        }
        if(method === 'renameminder'){
            $scope.title ="重命名导图"
            $scope.editpath = true
        }
        if(method === 'delfolder'){
            $scope.title ="删除文件夹"
            $scope.editsub = true
            $scope.editpath = true
        }
        if(method === 'delminder'){
            $scope.title ="删除导图"
            $scope.editsub = true
            $scope.editpath = true
        }
        // console.log($scope.method,$scope.path,$scope.sub,$scope.editpath)
        folder.getplaces(function(places){
            $scope.places = places
            $scope.selectedplace = {selected:$scope.places[0]}
        })
        
        setTimeout(function() {
            var $linkUrl = $('#link-name');
            $linkUrl.focus();
            $linkUrl[0].setSelectionRange(0, $scope.sub.length);
        }, 30);


        $scope.ok = function () {
            // console.log($scope.path,"*****",$scope.selectedplace,"*****",$scope.path || $scope.selectedplace)
            $modalInstance.close({
                method: $scope.method,
                name: $scope.sub,
                path: $scope.path || $scope.selectedplace.selected
            });
            // $modalInstance.dismiss('cancel');
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

    }]);