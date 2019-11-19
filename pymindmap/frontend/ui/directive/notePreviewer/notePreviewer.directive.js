// TODO: 使用一个 div 容器作为 previewer，而不是两个
angular.module('kityminderEditor')

	.directive('notePreviewer', ['$sce', 'valueTransfer','myminder', function($sce, valueTransfer,myminder) {
		return {
			restrict: 'A',
			templateUrl: 'ui/directive/notePreviewer/notePreviewer.html',
			link: function(scope, element) {
				var minder = scope.minder;
				var $container = element.parent();
				var $previewer = element.children();
				scope.showNotePreviewer = false;

				marked.setOptions({
                    gfm: true,
                    tables: true,
                    breaks: true,
                    pedantic: false,
                    sanitize: true,
                    smartLists: true,
                    smartypants: false
                });


				var previewTimer,selectid;
				minder.on('shownoterequest', function(e) {
					selectid= e.node.data.id
					previewTimer = setTimeout(function() {
						preview(e.node, e.keyword);
					}, 300);
				});
				minder.on('hidenoterequest', function() {
					// clearTimeout(previewTimer);
          scope.showNotePreviewer = false;
                    //scope.$apply();
				});
				minder.on('editnoterequest', function() {
					if(_.intersection(minder.getNodeById(selectid).data.resource,["code","waiting","running","err","finish","timeout"]).length !== 0){
						myminder.runcode(selectid)	
					}
				});
				
				var previewLive = false;
				$(document).on('mousedown mousewheel DOMMouseScroll', function() {
					if (!previewLive) return;
					// console.log(123)
					scope.showNotePreviewer = false;
					scope.$apply();
				});

				element.on('mousedown mousewheel DOMMouseScroll', function(e) {
					e.stopPropagation();
				});

				function preview(node, keyword) {
					var icon = node.getRenderer('NoteIconRenderer').getRenderShape();
					var b = icon.getRenderBox('screen');
					//增加程序返回这
					var note = myminder.getResultdataById(selectid) || node.getData('note');
					$previewer[0].scrollTop = 0;
					var html = marked(note);

					if (keyword) {
						html = html.replace(new RegExp('(' + keyword + ')', 'ig'), '<span class="highlight">$1</span>');
					}
					scope.noteContent = $sce.trustAsHtml(html);
					scope.$apply(); // 让浏览器重新渲染以获取 previewer 提示框的尺寸

					var cw = $($container[0]).width();
					var ch = $($container[0]).height();
					var pw = $($previewer).outerWidth();
					var ph = $($previewer).outerHeight();
          //获得相对位置
					var top=$('#content').offset().top
					var left=$('#content').offset().left
          
					var x = b.cx - pw / 2 - $container[0].offsetLeft - left;
					var y = b.bottom + 10 - $container[0].offsetTop -top; //没有顶到头所以加80的页头

					if (x < 0) x = 10;
					if (x + pw > cw) x = b.left - pw - 10 - $container[0].offsetLeft;
					if (y + ph > ch) y = b.top - ph - 10 - $container[0].offsetTop;


					scope.previewerStyle = {
						'left': Math.round(x) + 'px',
						'top': Math.round(y) + 'px'
					};

					scope.showNotePreviewer = true;

					var view = $previewer[0].querySelector('.highlight');
					if (view) {
						view.scrollIntoView();
					}
					previewLive = true;

					scope.$apply();
				}
			}
		}
}]);