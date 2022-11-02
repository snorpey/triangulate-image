import luminance from '../util/luminance';
import distance from '../util/distance';
import getColorByPos from '../util/getColorByPos';

export default function (polygons, colorData, params) {
	polygons.forEach(polygon => {
		let data = {};

		'abc'.split('').forEach(key => {
			const color = getColorByPos(
				polygon[key],
				colorData,
				params.transparentColor
			);

			data[key] = {
				key: key,
				color: color,
				x: polygon[key].x,
				y: polygon[key].y,
			};

			data[key].luminance = luminance(data[key].color);

			const otherKeys = 'abc'.replace(key, '').split('');

			data[key].median = {
				x: (polygon[otherKeys[0]].x + polygon[otherKeys[1]].x) / 2,
				y: (polygon[otherKeys[0]].y + polygon[otherKeys[1]].y) / 2,
			};

			data[key].medianColor = getColorByPos(
				data[key].median,
				colorData,
				params.transparentColor
			);
			data[key].medianLuminance = luminance(data[key].medianColor);
		});

		// sort by axis of most difference in luminance
		const pointsByDeltaInLuminance = [data.a, data.b, data.c].sort(
			(u, v) => {
				return (
					Math.abs(u.luminance - u.medianLuminance) -
					Math.abs(v.luminance - v.medianLuminance)
				);
			}
		);

		const pointWithMostDeltaInLuminance = pointsByDeltaInLuminance[0];
		const startPoint = pointsByDeltaInLuminance[0];
		const endPoint = pointWithMostDeltaInLuminance.median;

		const gradienStopPositions = [startPoint];

		const startToEndDistance = distance(startPoint, endPoint);

		for (let i = 1, len = params.gradientStops - 2; i < len; i++) {
			const pointDistance =
				i * (startToEndDistance / params.gradientStops);
			const pointPercent = pointDistance / startToEndDistance;

			const point = {
				x: startPoint.x + pointPercent * (endPoint.x - startPoint.x),
				y: startPoint.y + pointPercent * (endPoint.y - startPoint.y),
			};

			gradienStopPositions.push(point);
		}

		gradienStopPositions.push(endPoint);

		polygon.gradient = {
			x1: pointWithMostDeltaInLuminance.x,
			y1: pointWithMostDeltaInLuminance.y,
			x2: pointWithMostDeltaInLuminance.median.x,
			y2: pointWithMostDeltaInLuminance.median.y,
			colors: gradienStopPositions.map(pos => {
				return getColorByPos(pos, colorData, params.transparentColor);
			}),
		};

		if (params.stroke) {
			polygon.strokeWidth = params.strokeWidth;
			polygon.lineJoin = params.lineJoin;
		}

		data = null;
	});

	return polygons;
}
