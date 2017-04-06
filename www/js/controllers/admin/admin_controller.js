(function () {
	'use strict'
	angular.module( 'jp' )
		.controller( "AdminController", ['$scope', '$rootScope', '$state', 'Helper', AdminController] )

	/*/
	 *	Constants
	/*/
	// var url = 'http://ec2-54-202-204-95.us-west-2.compute.amazonaws.com'
	var url = 'http://localhost:8080'
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
			'Address'
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
				cell = guest[prop] ? '√' : '-'
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
			$scope.editGuestIndex = $scope.guestList.indexOf(guest)
			console.log(guest)
		}

		$scope.onFormSubmit = function () {
			delete $scope.editGuest.$$hashKey
			$.post(url +'/update_guest', $scope.editGuest).then(
			function (guest) {
				Object.assign($scope.guestList[$scope.editGuestIndex], guest)
				$scope.$apply()
				$('#edit-modal').modal('hide')
			})
		}

		$.get(url +'/get_all_guests').then(
		function (guests) {
			$scope.guestList = guests
			$scope.$apply()
		})

	}
})()
