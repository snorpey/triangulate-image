import imageDataToPolygons from '../polygons/imageDataToPolygons';
import clone from '../util/clone';

onmessage = msg => {
	if (msg.data.imageData && msg.data.params) {
		try {
			let imageData = msg.data.imageData;

			// phantomjs seems to have some memory loss so we need to make sure
			if (
				typeof imageData.width === 'undefined' &&
				typeof msg.data.imageDataWidth === 'number'
			) {
				imageData.width = msg.data.imageDataWidth;
			}

			if (
				typeof imageData.height === 'undefined' &&
				typeof msg.data.imageDataHeight === 'number'
			) {
				imageData.height = msg.data.imageDataHeight;
			}

			const polygons = imageDataToPolygons(
				msg.data.imageData,
				msg.data.params
			);

			self.postMessage({
				polygonJSONStr: JSON.stringify(polygons),
			});
		} catch (err) {
			self.postMessage({ err: err.message || err });
		}
	} else {
		if (msg.data.imageData) {
			self.postMessage({ err: 'Parameters are missing.' });
		} else {
			self.postMessage({ err: 'ImageData is missing.' });
		}
	}

	self.close();
};
