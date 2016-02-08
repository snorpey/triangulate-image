import Canvas from 'canvas-browserify';

export default function ( size, options, dpr, format ) {
	let backgroundColor = options && options.backgroundColor ? options.backgroundColor : false;
	let canvas = new Canvas( size.width * dpr, size.height * dpr, format );
	let ctx = canvas.getContext( '2d' );

	if ( backgroundColor ) {
		ctx.fillStyle = backgroundColor;
		ctx.fillRect( 0, 0, size.width * dpr, size.height * dpr );
		ctx.fillStyle = 'transparent';
	}

	return {
		canvas: canvas,
		ctx: ctx
	};
}