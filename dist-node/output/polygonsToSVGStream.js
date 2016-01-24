'use strict';

var readableStream = require('stream').Readable;

module.exports = function (polygons, size) {
	var rs = new readableStream();
	var polygonStr;

	rs._read = function () {
		rs.push('<?xml version="1.0" standalone="yes"?>\n');
		rs.push('<svg width="' + size.width + '" height="' + size.height + '" xmlns="http://www.w3.org/2000/svg" version="1.1" >');

		polygons.forEach(function (polygon, index) {
			var a = polygon.a;
			var b = polygon.b;
			var c = polygon.c;

			polygonStr = '<polygon points="' + a.x + ',' + a.y + ' ' + b.x + ',' + b.y + ' ' + c.x + ',' + c.y + '"';

			if (polygon.fill) {
				polygonStr += ' fill="' + polygon.fill + '"';
			} else {
				polygonStr += ' fill="transparent"';
			}

			if (polygon.strokeColor) {
				polygonStr += ' stroke="' + polygon.strokeColor + '" stroke-width="' + polygon.strokeWidth + '" stroke-linejoin="' + polygon.lineJoin + '"';
			}

			polygonStr += '/>\n\t\t';
			rs.push(polygonStr);
		});

		rs.push('\n\t</svg>');
		rs.push(null);
	};

	return rs;
};