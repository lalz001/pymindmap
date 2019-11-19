angular.module('kityminderEditor')
	.directive('layoutrunall', ['myminder',function(myminder) {
		return {
			restrict: 'E',
			templateUrl: 'ui/directive/layoutrunall/layoutrunall.html',
			scope: {
				minder: '='
			},
      replace: true,
			link: function(scope) {
				scope.runallcode = function() {
					myminder.runallcode()
				}
				scope.killallcode = function() {
					myminder.killallcode()
				}
			}
		}
	}]);