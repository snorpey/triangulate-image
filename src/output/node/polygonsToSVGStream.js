import stream from 'stream';

let readableStream = stream.Readable

export default ( polygons, size ) => {
	var rs = new readableStream();
	var polygonStr;

	rs._read = () => {
		rs.push( `<?xml version="1.0" standalone="yes"?>
` );
		rs.push( `<svg width="${size.width}" height="${size.height}" xmlns="http://www.w3.org/2000/svg" version="1.1" >` );

		polygons.forEach( ( polygon, index ) => {
			const { a, b, c } = polygon;

			polygonStr = `<polygon points="${a.x},${a.y} ${b.x},${b.y} ${c.x},${c.y}"`;

			if ( polygon.fill ) {
				polygonStr += ` fill="${polygon.fill}"`;
			} else {
				polygonStr += ` fill="transparent"`;
			}

			if ( polygon.strokeColor ) {
				polygonStr += ` stroke="${polygon.strokeColor}" stroke-width="${polygon.strokeWidth}" stroke-linejoin="${polygon.lineJoin}"`;	
			}

			polygonStr += `/>
		`;
			rs.push( polygonStr );
		} );

		rs.push( `
	</svg>` );
		rs.push( null );
	};
	
	return rs;
};