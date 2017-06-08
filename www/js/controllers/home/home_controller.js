(function () {
	'use strict'
	angular.module( 'jp' )
		.controller( "HomeController", ['$scope', '$rootScope', '$state', '$anchorScroll', 'Helper', HomeController] )

	/*/
	 *	Constants
	/*/
	var server = /localhost/i.test(window.location.href)
		? 'http://localhost:8080'
		: 'http://ec2-54-202-204-95.us-west-2.compute.amazonaws.com'
	function HomeController( $scope, $rootScope, $state, $anchorScroll, Helper ) {
		if (/localhost/.test(window.location.href)) {
			window.home = $scope
			window.state = $state
		}

		$scope.enteredPassword = /localhost/i.test(window.location.href);
		if ( !$scope.enteredPassword ) {
			$( '#pw-modal' ).on( 'shown.bs.modal', function () {
				$( '#pw-modal' ).focus()
			})

			$( '#pw-modal' ).modal( 'show' )
		}

		$scope.onPasswordEnter = function ( pw ) {
			$scope.checkRSVPCode(pw).then(function (guests) {
				if (!guests.length) {
					for ( var i = 0; i < CryptoJS.AES.decrypt( "U2FsdGVkX1+2/WInR0Os7up3xzqaZlTKVPfoTEIoUrw=", 'paigeandjared' ).words.length; i++) {
						if ( CryptoJS.AES.decrypt( "U2FsdGVkX1+2/WInR0Os7up3xzqaZlTKVPfoTEIoUrw=", 'paigeandjared' ).words[i] !== CryptoJS.AES.decrypt( CryptoJS.AES.encrypt( pw.toLowerCase(), 'paigeandjared' ).toString(), 'paigeandjared' ).words[i] ) {
							$( '#pw-modal alert' ).removeClass( 'hidden' )
							return false
						}
					}
				} else {
					$scope.rsvpNextStep()
					var link = _.find($scope.navList, {id: 'rsvp'})
					$scope.onToggleFlip(link)
					$scope.$apply()
				}
				$scope.enteredPassword = true; $('#pw-modal').modal('hide'); $('#content').removeClass('hidden')
			})
		}
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
		$scope.rsvpCode = ''
		$scope.currentRSVP = []
		$scope.rsvpStep = 0
		$scope.dishOptions = [
			{ dish: 'Beef', display: 'Beef' },
			{ dish: 'Fish', display: 'Fish' }
		]
		$scope.submittedDish = false


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
			return new Promise(function (resolve, reject) {
				if ( typeof link === 'string' ) {
					link = _.find( $scope.navList, { id : link } )
				}
				link.flipped = !link.flipped
				setTimeout(function () {
					resolve(link)
				}, 600) // css transition duration
			})
		}

		/* RSVP Start */
		$scope.rsvpGoToStep = function (step) {
			$scope.rsvpStep = step
		}

		$scope.rsvpNextStep = function () {
			$scope.rsvpStep++
		}

		$scope.rsvpResetStep = function () {
			$scope.onToggleFlip('rsvp').then(function (flip) {
				$scope.rsvpStep = 0
				$scope.$apply()
			})
		}

		// Step 1
		$scope.checkRSVPCode = function (code) {
			return $.get(server +'/get_guests/'+ code +'/true').then(function (guests) {
				return $scope.currentRSVP = guests.map(function (g) {
					g.Total = Number(g.Total)
					g.InviteeGuestFirstName = ''
					g.InviteeGuestLastName = ''
					g.Going = g.responded ? g.Going : true
					g.Dish = g.Dish || ''
					return g
				})
			})
		}

		$scope.findRSVP = function (code, link) {
			$scope.checkRSVPCode(code).then(function (guests) {
				if (guests.length) {
					$scope.rsvpStep++
					$scope.onToggleFlip(link)
					$scope.$apply()
				}
			})
		}

		$scope.rsvpSelect = function (response) {
			if (response) {
				$scope.rsvpStep++
			} else {
				$scope.rsvpStep = -1
			}
		}

		$scope.rsvpCheckAttendees = function () {
			var attending = $scope.currentRSVP.reduce(function (sum, guest) {
				if (guest.Going) sum++
				return sum
			}, 0)
			if (attending) {
				$scope.rsvpCheckExtras()
			} else {
				$scope.sendRSVP().then(function (guests) {
					console.log('submitted', guests)
					$scope.rsvpGoToStep(-1)
					$scope.$apply()
				})
			}
		}

		// Step 2
		$scope.rsvpCheckExtras = function () {
			$scope.allowedExtras = $scope.currentRSVP.filter(function (guest) {
				if (guest.Going) {
					if (guest.Total < 2) {
						guest.Guest = null
					}
					return guest.Total > 1
				}
			})
			$scope.rsvpNextStep()
			if (!$scope.allowedExtras.length) {
				$scope.rsvpNextStep()
			}
		}

		// Step 3
		$scope.rsvpEvaluateGuests = function () {
			$scope.allowedExtras = $scope.allowedExtras.filter(function (guest) {
				if (guest.Guest
						&& guest.Guest.FirstName.length
						&& guest.Guest.LastName.length) {
					return guest.Guest.FirstName.length && guest.Guest.LastName.length
				} else {
					return guest.Guest = null
				}
			})
			$scope.rsvpNextStep()
		}

		// Step 4
		$scope.rsvpEvaluateDishChoice = function () {
			var allSelectedDishes = Boolean($scope.currentRSVP.length)
			$scope.currentRSVP.forEach(function (guest) {
				if (guest.Going) {
					var selected = Boolean(guest.Dish)
					if (guest.Guest) {
						selected = Boolean(guest.Dish	&& guest.Guest.Dish)
					}
					if (!selected) {
						allSelectedDishes = false
					}
				}
			})
			if (allSelectedDishes) {
				$scope.sendRSVP().then(function (guests) {
					console.log('submitted', guests)
					$scope.rsvpNextStep()
					$scope.$apply()
				})
			} else {
				$scope.submittedDish = true
			}
		}

		//
		$scope.sendRSVP = function () {
			var updates = $scope.currentRSVP.map(function (guest) {
				guest.Responded = moment(new Date()).format('MM/DD/YYYY hh:mm a')
				return $.post(server +'/update_guest', guest)
			})
			return Promise.all(updates)
		}
		/* RSVP End */

		$rootScope.$on('$viewContentLoaded', function() {
			$state.go( $state.current.name )
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
				$scope.animate = true
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
				$scope.animate = false
			}

			requestAnimationFrame( frame )
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

			if ($scope.animate) requestAnimationFrame( frame )
		}
	}
})()
