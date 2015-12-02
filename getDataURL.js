var Canvas = require( 'canvas' );

function getDataURL ( triangles, size ) {
	console.log( size );
	var canvas = new Canvas( size.width, size.height );
	var ctx = canvas.getContext( '2d' );
	var triangle;

	for ( var i = 0, len = triangles.length; i < len; i++ ) {
		triangle = triangles[i];

		ctx.beginPath();
		ctx.moveTo( triangle.a.x, triangle.a.y );
		ctx.lineTo( triangle.b.x, triangle.b.y );
		ctx.lineTo( triangle.c.x, triangle.c.y );
		ctx.lineTo( triangle.a.x, triangle.a.y );

		ctx.fillStyle = triangle.color;
		ctx.fill();
		ctx.closePath();
	}

	return canvas.toDataURL();
}

module.exports = getDataURL;