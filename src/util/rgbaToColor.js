// https://gist.github.com/oriadam/396a4beaaad465ca921618f2f2444d49
export default function rgbaToColor ( rgbaStr ) {
	// convert 'rgb(R,G,B)' to 'rgb(R,G,B)A' which looks awful but will pass the regxep below
	if ( rgbaStr.indexOf('rgba') === -1 ) {
		rgbaStr += ',1';
	}
	
	const [ r, g, b, a ] = rgbaStr
		.match( /[\.\d]+/g )
		.map( a => {
			return +a;
		} );

	return { r, g, b, a };
}
