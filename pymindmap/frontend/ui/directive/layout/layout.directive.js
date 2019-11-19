angular.module('kityminderEditor')
	.directive('layout', ['myminder',function(myminder) {
		return {
			restrict: 'E',
			templateUrl: 'ui/directive/layout/layout.html',
			scope: {
				minder: '='
			},
      replace: true,
			link: function(scope) {
				scope.close = function() {
					myminder.clearResultdata()
					myminder.clearResource()
				}
			}
		}
	}]);