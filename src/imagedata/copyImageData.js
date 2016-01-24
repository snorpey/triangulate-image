module.exports = function ( imageData ) {
	return {
		width: imageData.width,
		height: imageData.height,
		data: new Uint8ClampedArray( imageData.data )
	};
}