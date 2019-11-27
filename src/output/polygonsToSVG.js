import toHex from '../util/toHex.js';
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
				const hex = toHex( color );
				const opacityStr = color.a < 1 ? ' stop-opacity="' + color.a + '"' : '';
				const offset = ( ( index / lastColorIndex ) * 100 ).toFixed( 3 );
				defStr += `
					<stop offset="${offset}%" stop-color="${hex}"${opacityStr}/>
				`;
			} );
	
			defStr += `</linearGradient>`;
			polygonStr += ` fill="url(#gradient-${index})"`;

			if ( polygon.strokeWidth > 0 ) {
				polygonStr += ` stroke="url(#gradient-${index})" stroke-width="${polygon.strokeWidth}" stroke-linejoin="${polygon.lineJoin}"`;
			}

		} else {
			if ( polygon.fill ) {
				const hexColor = toHex( polygon.fill );
				const opacityStr = polygon.fill.a < 1 ? ` fill-opacity="${polygon.fill.a}"` : '';
				polygonStr += ` fill="${hexColor}"${opacityStr}`;
			} else {
				polygonStr += ` fill="transparent"`;
			}

			if ( polygon.strokeColor ) {
				const hexColor = toHex( polygon.strokeColor );
				const opacityStr = polygon.strokeColor.a < 1 ? ` stroke-opacity="${polygon.strokeColor.a}"` : '';

				polygonStr += ` stroke="${hexColor}" stroke-width="${polygon.strokeWidth}" stroke-linejoin="${polygon.lineJoin}"${opacityStr}`;
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