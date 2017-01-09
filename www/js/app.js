( function () {
	angular.module( 'jp', ['ui.router'] )
		.config( ['$stateProvider', '$urlRouterProvider', MainRouter] )
		.run( ['$rootScope', runFunction] )

	function MainRouter( $stateProvider, $urlRouterProvider ) {
		$stateProvider
			.state( 'home', {
				url: '/',
				templateUrl: 'js/controllers/home/home_template.html',
				controller: 'HomeController'
			})
			.state( 'home.hello', {
				url: 'Hello!',
			})
			.state( 'home.when-where', {
				url: 'when-and-where',
			})
			.state( 'home.stay', {
				url: 'where-to-stay',
			})
			.state( 'home.irvine', {
				url: 'irvine-celebration',
			})
			.state( 'home.journey', {
				url: 'our-journey',
			})
			.state( 'home.registry', {
				url: 'registry',
			})
			.state( 'home.rsvp', {
				url: 'rsvp',
			})
		$urlRouterProvider.otherwise( '/Hello!' );
	}

	function runFunction( $rootScope ) {
	}

})()
