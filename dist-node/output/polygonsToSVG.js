// http://stackoverflow.com/questions/6918597/convert-canvas-or-control-points-to-svg
// https://developer.mozilla.org/en-US/docs/SVG/Element/polygon
"use strict";

module.exports = function (polygons, size) {
	var svg = "<?xml version=\"1.0\" standalone=\"yes\"?>\n<svg width=\"" + size.width + "\" height=\"" + size.height + "\" xmlns=\"http://www.w3.org/2000/svg\" version=\"1.1\" >\n\t";

	polygons.forEach(function (polygon, index) {
		var a = polygon.a;
		var b = polygon.b;
		var c = polygon.c;

		svg += "<polygon points=\"" + a.x + "," + a.y + " " + b.x + "," + b.y + " " + c.x + "," + c.y + "\"";

		if (polygon.fill) {
			svg += " fill=\"" + polygon.fill + "\"";
		} else {
			svg += " fill=\"transparent\"";
		}

		if (polygon.strokeColor) {
			svg += " stroke=\"" + polygon.strokeColor + "\" stroke-width=\"" + polygon.strokeWidth + "\" stroke-linejoin=\"" + polygon.lineJoin + "\"";
		}

		svg += "/>\n\t";
	});

	svg += "\n</svg>";

	return svg;
};