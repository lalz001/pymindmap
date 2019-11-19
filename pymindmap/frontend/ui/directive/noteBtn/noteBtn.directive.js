angular.module('kityminderEditor')
    .directive('noteBtn', ['valueTransfer','myminder', function(valueTransfer,myminder) {
        return {
            restrict: 'E',
            templateUrl: 'ui/directive/noteBtn/noteBtn.html',
            scope: {
                minder: '='
            },
            replace: true,
            link: function($scope) {
                var minder = $scope.minder;

                $scope.addNote =function() {
                    valueTransfer.noteEditorOpen = true;
                };
                $scope.runNote =function() {
                    var id = minder.getSelectedNode().data.id
                    myminder.runcode(id)
                    // runcode
                };
                $scope.killNote =function() {
                    var id = minder.getSelectedNode().data.id
                    myminder.killcode(id)
                };
            }
        }
    }]);