( function () {

angular
	.module( 'jp' )
	.service( 'Helper', ['$rootScope', '$q', Helper] )

	function Helper( $rootScope, $q ) {
		var self = {};
		window.helper = self;

		self.selectPropsFromObject = selectPropsFromObject;

		self.formatNumber = formatNumber;
		self.parseInt = myParseInt;
		self.parseFloat = myParseFloat;

		self.convertToQueryParamFromJSON = convertToQueryParamFromJSON;
		self.ellipsis = ellipsis;
		self.addEventListenerToElementsWithCallBack = addEventListenerToElementsWithCallBack;
		self.splitArrayNTimes = splitArrayNTimes;

		self.getParameterByName = getParameterByName;
		self.getUrlParams = getUrlParams;

		function selectPropsFromObject( template, obj ) {
			var tmp = Object.assign( {}, template );
			for ( var key in tmp ) {
				try {
					tmp[key][key];
					tmp[key] = selectPropsFromObject( tmp[key], obj[key] );
				} catch ( e ) {
					tmp[key] = obj[key];
				}
			}
			return tmp;
		}

		function formatNumber( num, sign, formatZero ) {
			if ( !num && !formatZero ) { return num; }
			num = num.toString();
			var split = num.split( '.' );
			num = split[0];
			var decimal = split.length > 1 ? split[1] : false;
			var str = '';
			for (var i = num.length - 1; i >= 0; i -= 3) {
					if ( i - 2 > 0 ) {
					var chunk = num.slice( i - 2, i + 1 );
				} else {
					var chunk = num.slice( 0, i + 1 );
				}
					if ( str.length >= 3 ) {
					str = chunk +','+ str;
				} else {
					str = chunk;
				}
			}

			if ( decimal ) {
				str = str +'.'+ decimal;
			}

			if ( sign ) {
				str = sign.front + str + sign.back;
			}

			return str;
		}

		function getNumStr( str, combine ) {
			str += '';
			var nums = str.replace( /,/g, '' )
										.match( /-?\d+[\.]?\d*/g );
			if ( nums ) {
				if ( combine ) {
					nums = nums.join('');
				} else {
					nums = nums[0];
				}
				return Number( nums );
			} else {
				return NaN;
			}
		}

		function myParseInt( str, combine ) {
			return Math.floor( getNumStr( str, combine ) );
		}

		function myParseFloat( str, combine ) {
			return getNumStr( str, combine );
		}

		function convertToQueryParamFromJSON( json ) {
			var paramArray = [];
			for ( var key in json ) {
				var value = json[key];
				var tmp = key +'='+ ( typeof value === "string" ? value : JSON.stringify( value ));
				paramArray.push( tmp );
			}

			var str = paramArray.join( '&' );
			return '?'+ str;
		}

		function ellipsis( text, maxChars ) {
			if ( text && text.length >= maxChars ) {
				text = text.substring( 0, maxChars );
				var parts = text.split( ' ' );
				parts.pop();

				text = '';
				for( var i = 0; i < parts.length; i++ ){
					if( i < parts.length - 1 ){
							text += parts[i] + ' ';
					}else{
							text += parts[i];
					}
				}
				return text + '...';
			}

			return text;
		};

		function addEventListenerToElementsWithCallBack( listener, elements, cb ) {
			[].forEach.call( elements, function ( el ) {
				el.addEventListener( listener, cb );
			});
		}

		function splitArrayNTimes( arr, n ) {
			var l = arr.length;
			var step = Math.floor( l / n ) + 1;
			var arrays = [];

			for (var i = 0; i < n; i++) {
				var start = i * step;
				var end = ( i + 1 ) * step;
				var seg = arr.slice( start, end );
				arrays.push( seg );
			}

			return arrays;
		}

		function getParameterByName( name ) {
			var url = window.location.href;
			name = name.replace( /[\[\]]/g, "\\$&" );
			var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
					results = regex.exec( url );
			if ( !results ) return null;
			if ( !results[2] ) return '';
			return decodeURIComponent( results[2].replace( /\+/g, " " ) );
		};

		function getUrlParams() {
			var state = {};
			var urlArray = window.location.href.split( '/' );
			var path = urlArray[urlArray.length - 1];
			var paramsArray = path.split( '?' );
			if ( paramsArray.length > 1 ) {
				var params = paramsArray.slice( 1 ).join( '?' ).split( '&' );
				params.forEach( function ( p ) {
					var split = p.split( '=' );
					var key = split[0];
					var value = split[1];
					state[key] = value;
				});
			}

			return state;
		}

		return self;
	}

})();
