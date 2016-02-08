export default function ( imageData ) {
	let len = imageData.data.length;
	let brightness;

	for ( let i = 0; i < len; i += 4 ) {
		brightness = 0.34 * imageData.data[i] + 0.5 * imageData.data[i + 1] + 0.16 * imageData.data[i + 2];

		imageData.data[i] = brightness;
		imageData.data[i + 1] = brightness;
		imageData.data[i + 2] = brightness;
	}
		
	return imageData;
}