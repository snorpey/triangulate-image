import luminance from '../util/luminance';
import distance from '../util/distance';
import getColorByPos from '../util/getColorByPos';

export default function ( polygons, colorData, params ) {
	polygons.forEach( function ( polygon, polygonIndex ) {
		let data = { };

		'abc'.split( '' ).forEach( function ( key ) {
			let color = getColorByPos( polygon[key], colorData );
			
			data[key] = {
				key: key,
				color: color,
				x: polygon[key].x,
				y: polygon[key].y
			};

			data[key].luminance = luminance( data[key].color );

			let otherKeys = 'abc'.replace( key, '' ).split( '' );

			data[key].median = {
				x: ( polygon[otherKeys[0]].x + polygon[otherKeys[1]].x ) / 2,
				y: ( polygon[otherKeys[0]].y + polygon[otherKeys[1]].y ) / 2
			};

			data[key].medianColor = getColorByPos( data[key].median, colorData );
			data[key].medianLuminance = luminance( data[key].medianColor );
		} );

		// sort by axis of most difference in luminance
		let pointsByDeltaInLuminance = [ data.a, data.b, data.c ].sort ( function ( u, v ) {
			return Math.abs( u.luminance - u.medianLuminance ) - Math.abs( v.luminance - v.medianLuminance );
		} );

		let pointWithMostDeltaInLuminance = pointsByDeltaInLuminance[0];
		let startPoint = pointsByDeltaInLuminance[0];
		let endPoint = pointWithMostDeltaInLuminance.median;

		let gradienStopPositions = [ startPoint ];

		let startToEndDistance = distance( startPoint, endPoint );

		for ( let i = 1, len = params.gradientStops - 2; i < len; i++ ) {
			let pointDistance = i * ( startToEndDistance / params.gradientStops );
			let pointPercent = pointDistance / startToEndDistance;
			
			let point = {
				x: startPoint.x + pointPercent * ( endPoint.x - startPoint.x ), 
				y: startPoint.y + pointPercent * ( endPoint.y - startPoint.y )
			};

			gradienStopPositions.push( point );
		}

		gradienStopPositions.push( endPoint );

		polygon.gradient = {
			x1: pointWithMostDeltaInLuminance.x,
			y1: pointWithMostDeltaInLuminance.y,
			x2: pointWithMostDeltaInLuminance.median.x,
			y2: pointWithMostDeltaInLuminance.median.y,
			colors: gradienStopPositions.map( function ( pos ) { return getColorByPos( pos, colorData ); } )
		};

		if ( params.stroke ) {
			polygon.strokeWidth = params.strokeWidth;
			polygon.lineJoin = params.lineJoin;
		}

		data = null;
	} );

	return polygons;
}