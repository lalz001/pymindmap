angular.module('kityminderEditor')
	.directive('sidebar', ['$modal','folder','$state','$stateParams',function ($modal,folder,$state,$stateParams) {
		return {
			restrict: 'E',
			templateUrl: 'ui/directive/sidebar/sidebar.html',
			link: function($scope) {

				$scope.kityID = function(){
					return $stateParams.kityID
				};
				console.log($stateParams);
				$scope.collapseAll = function () {
					$scope.$broadcast('angular-ui-tree:collapse-all');
				};
	
				$scope.expandAll = function () {
					$scope.$broadcast('angular-ui-tree:expand-all');
				};
				$scope.download = function(name,path){
					folder.downloadminder(name,path)
				};
				$scope.match = function(path){
					return path===$stateParams.kityID
				};
				$scope.downloadmd = function(name){
					// console.log($stateParams.kityID);
					folder.downloadmd(name)
				};
				
				// $scope.exportsvg = function(){
				// 	console.log
				// }
				$scope.addMinder = function(way,path,sub,type){
					// console.log(addclass)
          if (type ==="folder"&& way==="rename"){
						method = 'renamefolder'
					}
          if (type ==="minder"&& way==="rename"){
						method = 'renameminder'
					}
					if (type ==="folder"&& way==="delete"){
						method = 'delfolder'
					}
					if (type ==="minder"&& way==="delete"){
						method = 'delminder'
					}
					if(way ==="addminder"){
						method ="addminder"
					}
					if(way ==="addfolder"){
						method ="addfolder"
					}
					var hyperlinkModal = $modal.open({
							animation: true,
							templateUrl: 'ui/dialog/folder/folder.tpl.html',
							controller: 'folder.ctrl',
							size: 'md',
							resolve: {
									method: function() {
											return method;
									},
									path: function(){
										return path
									},
									sub: function(){
										return sub
									}
							}
					});

					hyperlinkModal.result.then(function(result) {
						if (result.method === 'addfolder'){
							folder.addfolder(result.name,result.path)
						}
						if (result.method === 'addminder'){
							folder.addminder(result.name,result.path)
						}
						if (result.method ==="renamefolder"){
							folder.renamefolder(result.name,result.path)
						}
						if (result.method === 'renameminder'){
							folder.renameminder(result.name,result.path)
						}
						if (result.method === 'delfolder'){
							folder.delfolder(result.name,result.path)
						}
						if (result.method === 'delminder'){
							folder.delminder(result.name,result.path)
						}
						setTimeout($scope.refresh, 300);
						setTimeout($state.reload,300)
					});
				}	
				$scope.refresh = function(){
					folder.getnodes(function(nodes){
						$scope.nodes = nodes
						$scope.$broadcast('angular-ui-tree:collapse-all');
					})
				}			

				$scope.refresh()
			}
    }
	}]);