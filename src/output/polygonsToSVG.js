import toRGBA from '../util/toRGBA';
// http://stackoverflow.com/questions/6918597/convert-canvas-or-control-points-to-svg
// https://developer.mozilla.org/en-US/docs/SVG/Element/polygon
export default ( polygons, size ) => {
	let defStr = '';

	if ( polygons.length && polygons[0].gradient ) {
		defStr = '<defs>';
	}

	let polygonStr = '';

	polygons.forEach( function ( polygon, index ) {
		const { a, b, c } = polygon;

		polygonStr += `<polygon points="${a.x},${a.y} ${b.x},${b.y} ${c.x},${c.y}"`;

		if ( polygon.gradient ) {
			const bb = polygon.boundingBox;
			const x1 = ( ( polygon.gradient.x1 - bb.x ) / bb.width * 100 ).toFixed( 3 );
			const y1 = ( ( polygon.gradient.y1 - bb.y ) / bb.height * 100 ).toFixed( 3 );
			const x2 = ( ( polygon.gradient.x2 - bb.x ) / bb.width * 100 ).toFixed( 3 );
			const y2 = ( ( polygon.gradient.y2 - bb.y ) / bb.height * 100 ).toFixed( 3 );

			defStr += `
	<linearGradient id="gradient-${index}" x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%">`;

			const lastColorIndex = polygon.gradient.colors.length - 1;
			
			polygon.gradient.colors.forEach( ( color, index ) => {
				const rgb = toRGBA( color );
				const offset = ( ( index / lastColorIndex ) * 100 ).toFixed( 3 );
				defStr += `
					<stop offset="${offset}%" stop-color="${rgb}"/>
				`;
			} );
	
			defStr += `</linearGradient>`;
			polygonStr += ` fill="url(#gradient-${index})"`;

			if ( polygon.strokeWidth > 0 ) {
				polygonStr += ` stroke="url(#gradient-${index})" stroke-width="${polygon.strokeWidth}" stroke-linejoin="${polygon.lineJoin}"`;
			}

		} else {
			if ( polygon.fill ) {
				polygonStr += ` fill="${polygon.fill}"`;
			} else {
				polygonStr += ` fill="transparent"`;
			}

			if ( polygon.strokeColor ) {
				polygonStr += ` stroke="${polygon.strokeColor}" stroke-width="${polygon.strokeWidth}" stroke-linejoin="${polygon.lineJoin}"`;
			}
		}


		polygonStr += `/>
	`;
	} );

	if ( defStr.length ) {
		defStr += `
		</defs>`
	}

	const svg = `<?xml version="1.0" standalone="yes"?>
<svg width="${size.width}" height="${size.height}" xmlns="http://www.w3.org/2000/svg" version="1.1" >
	${defStr}
	${polygonStr}
</svg>`;

	return svg;
}