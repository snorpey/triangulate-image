var getInterfaceObj = require('./getInterfaceObj');

// fyi: this file is where all the important stuff happens...
var imageDataToPolygons = require('./polygons/imageDataToPolygons.js');

export default function triangulate ( params ) {
	return getInterfaceObj( params, imageDataToPolygons );
}
