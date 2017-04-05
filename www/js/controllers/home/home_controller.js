(function () {
	'use strict'
	angular.module( 'jp' )
		.controller( "HomeController", ['$scope', '$rootScope', '$state', '$anchorScroll', 'Helper', HomeController] )

// opacity: 0;
// overflow-y: hidden;
// height: 0;


	/*/
	 *	Constants
	/*/
	function HomeController( $scope, $rootScope, $state, $anchorScroll, Helper ) {
		$scope.enteredPassword;
		if ( !$scope.enteredPassword ) {
			$( '#pw-modal' ).on( 'shown.bs.modal', function () {
				$( '#pw-modal' ).focus()
			})

			$( '#pw-modal' ).modal( 'show' )
		}

		$scope.onPasswordEnter = function ( pw ) {
			for ( var i = 0; i < CryptoJS.AES.decrypt( "U2FsdGVkX1+2/WInR0Os7up3xzqaZlTKVPfoTEIoUrw=", 'paigeandjared' ).words.length; i++) {
				if ( CryptoJS.AES.decrypt( "U2FsdGVkX1+2/WInR0Os7up3xzqaZlTKVPfoTEIoUrw=", 'paigeandjared' ).words[i] !== CryptoJS.AES.decrypt( CryptoJS.AES.encrypt( pw.toLowerCase(), 'paigeandjared' ).toString(), 'paigeandjared' ).words[i] ) {
					$( '#pw-modal alert' ).removeClass( 'hidden' )
					return false
				}
			}
			$scope.enteredPassword = true; $('#pw-modal').modal('hide'); $('#content').removeClass('hidden') }
		window.home = $scope
		window.state = $state
		/* Properties */
		$scope.navList = [
			{
				id: 'home',
				partial: 'home',
				text: 'Home',
				route: 'home',
				flipped: false,
				bg: ''
			},
			{
				id: 'hello',
				partial: 'hello',
				text: 'Hello!',
				route: 'home.hello',
				flipped: false,
				bg: '../../../../assets/images/mammoth1.jpg'
			},
			{
				id: 'when-where',
				partial: 'when-where',
				text: 'When & Where',
				route: 'home.when-where',
				flipped: false,
				bg: '../../../../assets/images/mammoth2.jpg'
			},
			{
				id: 'stay',
				partial: 'stay',
				text: 'Where to Stay',
				route: 'home.stay',
				flipped: false,
				bg: '../../../../assets/images/mammoth3.jpg'
			},
			{
				id: 'irvine',
				partial: 'irvine',
				text: 'Irvine Celebration',
				route: 'home.irvine',
				flipped: false,
				bg: '../../../../assets/images/mammoth4.jpg'
			},
			// {
			// 	id: 'journey',
			// 	partial: 'journey',
			// 	text: 'Our Journey',
			// 	route: 'home.journey',
			// 	flipped: false,
			// 	bg: '../../../../assets/images/mammoth7.jpg'
			// },
			{
				id: 'registry',
				partial: 'registry',
				text: 'Registry',
				route: 'home.registry',
				flipped: false,
				bg: '../../../../assets/images/mammoth5.jpg'
			},
			{
				id: 'rsvp',
				partial: 'rsvp',
				text: 'RSVP',
				route: 'home.rsvp',
				flipped: false,
				bg: '../../../../assets/images/mammoth6.jpg'
			},
		]

		$scope.currentRoute = $state.current.name
		$scope.currentPanel = _.findIndex( $scope.navList, { route: $scope.currentRoute } )
		$scope.currentBG = "url("+ $scope.navList[2].bg +")"
		$scope.flipWhereToStay = false


		/* Methods */
		$scope.scrollTo = function ( id ) {
			var navbar = $( '#nav' )
			$( 'html, body' ).animate({
				scrollTop: $( '#'+ id ).offset().top - navbar.height()
			}, 1500 );
		}

		$scope.onNavClick = function ( link ) {
			// $state.go( link.route )
			$scope.scrollTo( link.id )
		}

		$scope.onToggleFlip = function ( link ) {
			if ( typeof link === 'string' ) {
				link = _.find( $scope.navList, { id : section } )
			}
			link.flipped = !link.flipped
		}

		$rootScope.$on('$viewContentLoaded', function() {
			$state.go( 'home' )
		})

		/* Watch */
		$rootScope.$on( '$stateChangeStart',
		function( event, toState, toParams, fromState, fromParams ) {
			$scope.currentRoute = toState
			var nextIndex = _.findIndex( $scope.navList, {
				route: toState.name
			})
			var direction = nextIndex - $scope.currentPanel
			$scope.currentPanel = nextIndex
			var i = $scope.currentPanel
			if ( direction === 1 ) {
				// moving down the page
				if ( $scope.currentPanel % 2 ) {
					try {
						i = i + 1
						if ( i >= $scope.navList.length ) {
							i = $scope.navList.length - 1
						}
						$scope.currentBG = "url("+ $scope.navList[i].bg +")"
					} catch ( e ) {}
				}
			} else {
				// moving up the page
				if ( $scope.currentPanel
						&& $scope.currentPanel % 2 === 0 ) {
					try {
						$scope.currentBG = "url("+ $scope.navList[i].bg +")"
					} catch ( e ) {}
				}
			}
		})

		/* Event Listeners */
		$( window ).scroll( function () {
			var navbar = $( '#nav' )
			var vh = window.innerHeight
			var scrollTop = document.documentElement.scrollTop || document.body.scrollTop
			if ( scrollTop > vh - navbar.height() - 1 ) {
				navbar.addClass( 'fixed-top' )
			} else {
				navbar.removeClass( 'fixed-top' )
			}
			var passed = ''
			$scope.navList.forEach( function ( link ) {
				var id = link.id
				var top = $( '#'+ id ).offset().top - navbar.height() - 1
				if ( scrollTop > top ) {
					passed = link.route
				}
			})
			if ( $scope.currentRoute !== passed ) {
				$state.go( passed )
			}

			/* Paige & Jared */
			var paige = document.getElementById( 'paige' )
			var and 	= document.getElementById( 'and' )
			var jared = document.getElementById( 'jared' )
			var mountains = document.getElementsByClassName( 'mountains-wrapper' )[0]
			if ( scrollTop / 10 > 5
					&& scrollTop < vh ) {
				paige.style.visibility = 'visible'
				and.style.visibility = 'visible'
				jared.style.visibility = 'visible'
				var side = Math.min( Math.max( scrollTop / 10, 5 ), 43 )
				paige.left = side +'vw'
				jared.right = side +'vw'

				var deg = Math.min( scrollTop / 10 - 5, 15 ) * -1
				paige.rotate = deg +'deg'
				jared.rotate = deg +'deg'

				/* Mountains */
				mountains.opacity = ( 1 - scrollTop / vh )
			} else if ( scrollTop < vh ) {
				mountains.opacity = 1
			} else {
				paige.style.visibility = 'hidden'
				and.style.visibility = 'hidden'
				jared.style.visibility = 'hidden'
				mountains.opacity = 0
			}

		})

		function frame( time ) {
			var paige = document.getElementById( 'paige' )
			var jared = document.getElementById( 'jared' )
			var mountains = document.getElementsByClassName( 'mountains-wrapper' )[0]
			paige.style.left = paige.left
			jared.style.right = jared.right
			paige.style.transform = 'rotate( '+ paige.rotate +' )'
			jared.style.transform = 'rotate( '+ jared.rotate +' )'

			mountains.style.opacity = mountains.opacity

			requestAnimationFrame( frame )
		}
		requestAnimationFrame( frame )
	}
})()
