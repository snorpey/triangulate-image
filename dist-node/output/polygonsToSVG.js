// http://stackoverflow.com/questions/6918597/convert-canvas-or-control-points-to-svg
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

exports['default'] = function (polygons, size) {
	var defStr = '';

	if (polygons.length && polygons[0].gradient) {
		defStr = '<defs>';
	}

	var polygonStr = '';

	polygons.forEach(function (polygon, index) {
		var a = polygon.a;
		var b = polygon.b;
		var c = polygon.c;

		polygonStr += '<polygon points="' + a.x + ',' + a.y + ' ' + b.x + ',' + b.y + ' ' + c.x + ',' + c.y + '"';

		if (polygon.gradient) {
			(function () {
				var bb = polygon.boundingBox;
				var x1 = ((polygon.gradient.x1 - bb.x) / bb.width * 100).toFixed(3);
				var y1 = ((polygon.gradient.y1 - bb.y) / bb.height * 100).toFixed(3);
				var x2 = ((polygon.gradient.x2 - bb.x) / bb.width * 100).toFixed(3);
				var y2 = ((polygon.gradient.y2 - bb.y) / bb.height * 100).toFixed(3);

				defStr += '\n\t<linearGradient id="gradient-' + index + '" x1="' + x1 + '%" y1="' + y1 + '%" x2="' + x2 + '%" y2="' + y2 + '%">';

				var lastColorIndex = polygon.gradient.colors.length - 1;

				polygon.gradient.colors.forEach(function (color, index) {
					var rgb = 'rgb(' + color.r + ', ' + color.g + ', ' + color.b + ')';
					var offset = (index / lastColorIndex * 100).toFixed(3);
					defStr += '\n\t\t\t\t\t<stop offset="' + offset + '%" stop-color="' + rgb + '"/>\n\t\t\t\t';
				});

				defStr += '</linearGradient>';
				polygonStr += ' fill="url(#gradient-' + index + ')"';

				if (polygon.strokeWidth > 0) {
					polygonStr += ' stroke="url(#gradient-' + index + ')" stroke-width="' + polygon.strokeWidth + '" stroke-linejoin="' + polygon.lineJoin + '"';
				}
			})();
		} else {
			if (polygon.fill) {
				polygonStr += ' fill="' + polygon.fill + '"';
			} else {
				polygonStr += ' fill="transparent"';
			}

			if (polygon.strokeColor) {
				polygonStr += ' stroke="' + polygon.strokeColor + '" stroke-width="' + polygon.strokeWidth + '" stroke-linejoin="' + polygon.lineJoin + '"';
			}
		}

		polygonStr += '/>\n\t';
	});

	if (defStr.length) {
		defStr += '\n\t\t</defs>';
	}

	var svg = '<?xml version="1.0" standalone="yes"?>\n<svg width="' + size.width + '" height="' + size.height + '" xmlns="http://www.w3.org/2000/svg" version="1.1" >\n\t' + defStr + '\n\t' + polygonStr + '\n</svg>';

	return svg;
};

module.exports = exports['default'];
// https://developer.mozilla.org/en-US/docs/SVG/Element/polygon