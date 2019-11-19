angular.module('kityminderEditor', [
    'ui.bootstrap',
	'ui.codemirror',
	'ui.colorpicker',
	'ui.tree',
	'ngWebSocket'
])
	.config(function($sceDelegateProvider) {
		$sceDelegateProvider.resourceUrlWhitelist([
			// Allow same origin resource loads.
			'self',
			// Allow loading from our assets domain.  Notice the difference between * and **.
      'https://p3.ssl.qhimgs1.com/**'
		]);
	});

