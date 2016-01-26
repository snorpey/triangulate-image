export default function ( ctx, polygons, size, dpr ) {
	dpr = dpr || 1;

	polygons.forEach( function ( polygon, index ) {
		ctx.beginPath();
		ctx.moveTo( polygon.a.x * dpr, polygon.a.y * dpr );
		ctx.lineTo( polygon.b.x * dpr, polygon.b.y * dpr );
		ctx.lineTo( polygon.c.x * dpr, polygon.c.y * dpr );
		ctx.lineTo( polygon.a.x * dpr, polygon.a.y * dpr );
		
		if ( polygon.fill ) {
			ctx.fillStyle = polygon.fill;
			ctx.fill();
		}

		if ( polygon.strokeColor ) {
			ctx.strokeStyle = polygon.strokeColor;
			ctx.lineWidth = polygon.strokeWidth * dpr;
			ctx.lineJoin = polygon.lineJoin;
			ctx.stroke();
		}

		ctx.closePath();
	} );

	return ctx;
};