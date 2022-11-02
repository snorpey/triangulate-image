// https://gist.githubusercontent.com/oriadam/396a4beaaad465ca921618f2f2444d49/raw/76b0de6caffaac59f8af2b4dfa0e0b6397cf447d/colorValues.js
// return array of [r,g,b,a] from any valid color. if failed returns undefined
function strToColorArr(color) {
	if (typeof color === 'string') {
		let result = [0, 0, 0, 0];

		if (color[0] === '#') {
			// convert #RGB and #RGBA to #RRGGBB and #RRGGBBAA
			if (color.length < 7) {
				color = `#${color[1]}${color[1]}${color[2]}${color[2]}${
					color[3]
				}${color[3]}${color.length > 4 ? color[4] + color[4] : ''}`;
			}

			result = [
				parseInt(color.substr(1, 2), 16),
				parseInt(color.substr(3, 2), 16),
				parseInt(color.substr(5, 2), 16),
				color.length > 7 ? parseInt(color.substr(7, 2), 16) / 255 : 1,
			];
		}

		if (color.indexOf('rgb') === 0) {
			// convert 'rgb(R,G,B)' to 'rgb(R,G,B)A' which looks awful but will pass the regxep below
			if (!color.includes('rgba')) {
				color += ',1';
			}

			result = color.match(/[\.\d]+/g).map(a => +a);
		}

		return result;
	} else {
		return;
	}
}

export default function strToColor(str) {
	const color = strToColorArr(str);

	if (color) {
		const [r, g, b, a] = color;
		return { r, g, b, a };
	} else {
		return;
	}
}
