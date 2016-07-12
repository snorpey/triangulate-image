import clamp from './clamp';

export default function getColorByPos ( pos, colorData ) {
	let x = clamp( pos.x, 1, colorData.width - 2 );
	let y = clamp( pos.y, 1, colorData.height - 2 );
	let index = ( ( x | 0 ) + ( y | 0 ) * colorData.width ) << 2;

	if ( index >= colorData.data.length ) {
		index = colorData.data.length - 5;
	}

	return {
		r: colorData.data[index],
		g: colorData.data[index + 1],
		b: colorData.data[index + 2],
		a: colorData.data[index + 3] / 255
	};
}