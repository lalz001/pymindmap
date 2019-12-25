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
					// setTimeout(function() {
					// 	minder.removeAllSelectedNodes().execCommand('hand')
					// }, 300);

					var browser={  
						versions:function(){   
									 var u = navigator.userAgent, app = navigator.appVersion;   
									 return {//移动终端浏览器版本信息   
												trident: u.indexOf('Trident') > -1, //IE内核  
												presto: u.indexOf('Presto') > -1, //opera内核  
												webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核  
												gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核  
												mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端  
												ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端  
												android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器  
												iPhone: u.indexOf('iPhone') > -1 , //是否为iPhone或者QQHD浏览器  
												iPad: u.indexOf('iPad') > -1, //是否iPad    
												webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部  
												weixin: u.indexOf('MicroMessenger') > -1, //是否微信   
												qq: u.match(/\sQQ/i) == " qq" //是否QQ  
										};  
								 }(),  
								 language:(navigator.browserLanguage || navigator.language).toLowerCase()  
				}   
				
					if(browser.versions.mobile || browser.versions.ios || browser.versions.android ||   
						browser.versions.iPhone || browser.versions.iPad){   
						setTimeout(function() {
							minder.removeAllSelectedNodes().execCommand('hand')
						}, 300);
						scope.$root.viewmode = !scope.$root.viewmode
								
					}else if(browser.versions.weixin){
								 //微信打开
								 console.log('wx')
					}else{
								//PC端打开
								console.log('pc')
					}



					
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