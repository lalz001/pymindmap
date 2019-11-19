angular.module('kityminderEditor')
	.directive('kityminderEditor', ['config','myminder','minder.service','revokeDialog', function(config,myminder,minderService,revokeDialog) {
		return {
			restrict: 'EA',
			templateUrl: 'ui/directive/kityminderEditor/kityminderEditor.html',
			replace: true,
			scope: {
				onInit: '&'
			},
			link: function(scope, element, attributes) {

				var $minderEditor = element.children('.minder-editor')[0];

				function onInit(editor, minder) {
					scope.onInit({
						editor: editor,
						minder: minder
					});
					myminder.setminder(minder)
					//输入了minder后就进入离线模式 
					myminder.setdatabyid(scope.$root.minder)
					// console.log()
					minder.on('contentchange', function() {
						myminder.contentchange()

					});
					
					// minder.setStatus('readonly')
					setTimeout(function() {
						minder.removeAllSelectedNodes().execCommand('hand')
					}, 300);
					minderService.executeCallback();
					// minder.setStatus('normal',true)
					
				}

				if (typeof(seajs) != 'undefined') {
					/* global seajs */
					seajs.config({
						base: './src'
					});

					define('demo', function(require) {
						var Editor = require('editor');

						var editor = window.editor = new Editor($minderEditor);

						// if (window.localStorage.__dev_minder_content) {
						// 	console.log(server.getrootdata(1))
						// 	editor.minder.importJson(JSON.parse(window.localStorage.__dev_minder_content));
						// 	// editor.minder.importJson(JSON.parse(window.localStorage.__dev_minder_content));
						// }

						editor.minder.on('contentchange', function() {
							window.localStorage.__dev_minder_content = JSON.stringify(editor.minder.exportJson());
						});

						window.minder = window.km = editor.minder;

						scope.editor = editor;
						scope.minder = minder;
						scope.config = config.get();
                        //scope.minder.setDefaultOptions(scope.config);
						scope.$apply();

						onInit(editor, minder);
					});

					seajs.use('demo');

				} else if (window.kityminder && window.kityminder.Editor) {
					var editor = new kityminder.Editor($minderEditor);

					window.editor = scope.editor = editor;
					window.minder = scope.minder = editor.minder;

					scope.config = config.get();
					//scope.minder.setDefaultOptions(config.getConfig());
					onInit(editor, editor.minder);

						var hammertime = new Hammer($minderEditor);
						hammertime.get('pinch').set({ enable: true });

						zoom = _.debounce(function(ev){
											if(ev==='pinchin'){
												minder.execCommand('zoomOut');
											}else if(ev==='pinchout'){
												minder.execCommand('zoomIn');
											}
									},100, { 'maxWait': 200 })
						hammertime.on('pinch', function(ev) {
							zoom(ev.additionalEvent)					
						});

					}

			}
		}
	}]);