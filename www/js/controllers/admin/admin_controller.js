(function () {
	'use strict'
	angular.module( 'jp' )
		.controller( "AdminController", ['$scope', '$rootScope', '$state', 'Helper', AdminController] )

	/*/
	 *	Constants
	/*/
	var server = /localhost/i.test(window.location.href)
		? 'http://localhost:8080'
		: 'http://ec2-54-202-204-95.us-west-2.compute.amazonaws.com'
	//var server = 'http://localhost:8080'
	function AdminController( $scope, $rootScope, $state, $anchorScroll, Helper ) {
		if (/localhost/.test(window.location.href)) {
			window.admin = $scope
		}

		$scope.tableHeaders = [
			'#',
			'Inviter',
			'Code',
			'Invitee First Name',
			'Invitee Last Name',
			'Invitation',
			'Invitee Guest First Name',
			'Invitee Guest Last Name',
			'Total',
			'Mammoth',
			'Tanaka Farms',
			'Unsure',
			'Dish',
			'Category',
			'Address',
			'Responded'
		]
		$scope.listProps = $scope.tableHeaders.map(function (prop) {
			return prop.replace(/\s/g, '')
		})
		$scope.dishOptions = ['Beef', 'Fish']
		$scope.categoryOptions = ['Friend', 'Parent']
		$scope.searchText = ''
		$scope.guestList = []
		$scope.orderBy = ''
		$scope.editGuest = {}
		$scope.editGuestIndex = 0

		$scope.onHeadClick = function (head) {
			var property = head.replace(/\s/g, '')
			switch(property) {
				case '#':
					$scope.orderBy = ''
					break
				case $scope.orderBy:
					$scope.orderBy = `-${property}`
					break
				default:
					$scope.orderBy = property
			}
		}

		$scope.getCellValue = function (guest, prop) {
			var cell
			if (prop === '#') {
				cell = $scope.guestList.indexOf(guest) + 1
			} else if (/Mammoth|Tanaka\s?Farms|Unsure/i.test(prop)) {
				cell = guest[prop] ? '\u2713' : '-'
			} else if (/Guest/i.test(prop)) {
				cell = guest.Guest[prop.replace(/(\s|Invitee|Guest)/gi, '')] || '-'
			} else if (/Dish/i.test(prop)) {
				if (guest.Guest.Dish) {
					cell = 'Invitee: '+ guest[prop] +'\n\nGuest: '+ guest.Guest.Dish
				} else {
					cell = guest[prop] || '-'
				}
			} else {
				cell = guest[prop] || '-'
			}
			return cell
		}

		$scope.getInputType = function (prop) {
			var type
			if (/Dish|Category/.test(prop)) {
				type = 'select'
			} else if (/Mammoth|Tanaka\s?Farms|Unsure/i.test(prop)) {
				type = 'checkbox'
			} else if (/Total/i.test(prop)) {
				type = 'number'
			} else {
				type = 'text'
			}
			return type
		}

		$scope.getOptions = function (props) {
			return $scope[props.toLowerCase() + 'Options'] || false
		}

		$scope.onGuestEdit = function (guest) {
			$scope.editGuest = Object.assign({}, guest)
			$scope.editGuest.Total = Number($scope.editGuest.Total)
			$scope.editGuestIndex = $scope.guestList.indexOf(guest)
			$scope.editGuest.InviteeGuestFirstName = $scope.editGuest.Guest.FirstName
			$scope.editGuest.InviteeGuestLastName = $scope.editGuest.Guest.LastName
			console.log(guest)
		}

		$scope.onFormSubmit = function () {
			delete $scope.editGuest.$$hashKey
			if (!!$scope.editGuest['Responded'] === $scope.editGuest['Responded']) {
				$scope.editGuest['Responded'] = moment(new Date()).format('MM/DD/YYYY hh:mm a')
			}
			$scope.dishOptions
			$scope.categoryOptions
			if ($scope.editGuest.InviteeGuestFirstName
					&& $scope.editGuest.InviteeGuestLastName) {
				$scope.editGuest.Guest = {}
				$scope.editGuest.Guest.FirstName = $scope.editGuest.InviteeGuestFirstName
				$scope.editGuest.Guest.LastName = $scope.editGuest.InviteeGuestLastName
				$scope.editGuest.Total = 2
			}
			$.post(server +'/update_guest', $scope.editGuest).then(
			function (guest) {
				Object.assign($scope.guestList[$scope.editGuestIndex], guest)
				$scope.$apply()
				$('#edit-modal').modal('hide')
			})
		}

		$.get(server +'/get_all_guests').then(
		function (guests) {
			$scope.guestList = guests.slice(2)
			$scope.$apply()
		})
	}
})()
