var fs = require('fs');
var triangulate = require('../dist-node/index.js');
var imagePath = 'img/lincoln.jpg';

var params = {
	blur: 110,
	vertexCount: 700,
	accuracy: 0.2,
	fill: true,
	stroke: true,
	strokeWidth: 0.5,
	lineJoin: 'miter'
};

fromBufferToSvg();
fromBufferToPng();
fromBufferToData();
fromBufferToSVGStream();
fromBufferToJPGStream();
fromBufferToPNGStream();
fromBufferToPdf();
fromBufferToDataURL();

fromBufferToJPGStream()

function fromBufferToDataURL () {
	fs.readFile( __dirname + '/' + imagePath, function ( err, buffer ) {
		if ( err ) {
			throw err;
		}
		
		console.log( 'fromBufferToDataURL complete. Length of dataURL:', triangulate( params ).fromBuffer( buffer ).toDataURL().length );
	} );
}

function fromBufferToSvg () {
	fs.readFile( __dirname + '/' + imagePath, function ( err, buffer ) {
		if ( err ) {
			throw err;
		}
		
		var svgMarkup = triangulate( params ).fromBuffer( buffer ).toSVG();

		fs.writeFile( __dirname + '/node-output/fromBufferToSvg.svg', svgMarkup, function ( err ) {
			if ( err ) {
				throw err;
			} else {
				console.log( 'fromBufferToSvg complete. File save to', __dirname + '/node-output/fromBufferToSvg.svg' );
			}
		} );
	} );
}

function fromBufferToPng () {
	fs.readFile( __dirname + '/' + imagePath, function ( err, buffer ) {
		if ( err ) {
			throw err;
		}
		
		var imageBuffer = triangulate( params ).fromBuffer( buffer ).toBuffer();

		fs.writeFile( __dirname + '/node-output/fromBufferToPng.png', imageBuffer, function ( err ) {
			if ( err ) {
				throw err;
			} else {
				console.log( 'fromBufferToPng complete. File saved to', __dirname + '/node-output/fromBufferToPng.png' );
			}
		} );
	} );
}

function fromBufferToPdf () {
	fs.readFile( __dirname + '/' + imagePath, function ( err, buffer ) {
		if ( err ) {
			throw err;
		}
		
		var imageBuffer = triangulate( params ).fromBuffer( buffer ).toBuffer( { format: 'pdf' } );

		fs.writeFile( __dirname + '/node-output/fromBufferToPdf.pdf', imageBuffer, function ( err ) {
			if ( err ) {
				throw err;
			} else {
				console.log( 'fromBufferToPdf complete. File saved to', __dirname + '/node-output/fromBufferToPdf.pdf' );
			}
		} );
	} );
}

function fromBufferToData () {
	fs.readFile( __dirname + '/' + imagePath, function ( err, buffer ) {
		if ( err ) {
			throw err;
		}
		
		var data = JSON.stringify( triangulate( params ).fromBuffer( buffer ).toData(), null, '  ' );

		fs.writeFile( __dirname + '/node-output/fromBufferToData.json', data, function ( err ) {
			if ( err ) {
				throw err;
			} else {
				console.log( 'fromBufferToData complete. File saved to', __dirname + '/node-output/fromBufferToData.json' );
			}
		} );
	} );
}

function fromBufferToSVGStream () {
	fs.readFile( __dirname + '/' + imagePath, function ( err, buffer ) {
		if ( err ) {
			throw err;
		}
		
		var svgStream = triangulate( params ).fromBuffer( buffer ).toSVGStream();

		var totalLength = 0;
		
		svgStream.on( 'data', function ( chunk ) { totalLength += chunk.length; } );
		svgStream.on( 'end', function () { console.log( 'fromBufferToSVGStream complete. Total length streamed', totalLength ); } );
	} );
}

function fromBufferToJPGStream () {
	fs.readFile( __dirname + '/' + imagePath, function ( err, buffer ) {
		if ( err ) {
			throw err;
		}

		var fileStream = fs.createWriteStream( __dirname + '/node-output/fromBufferToJPGStream.jpg' );
		var jpgStream = triangulate( params ).fromBuffer( buffer ).toJPGStream( { backgroundColor: 'red' } );
				
		jpgStream.on( 'data', function ( chunk ) { fileStream.write( chunk ); } );
		jpgStream.on( 'end', function () { console.log( 'fromBufferToJPGStream complete. File saved to', __dirname + '/node-output/fromBufferToJPGStream.jpg' ); } );
	} );
}

function fromBufferToPNGStream () {
	fs.readFile( __dirname + '/' + imagePath, function ( err, buffer ) {
		if ( err ) {
			throw err;
		}

		var fileStream = fs.createWriteStream( __dirname + '/node-output/fromBufferToPNGStream.jpg' );
		var pngStream = triangulate( params ).fromBuffer( buffer ).toPNGStream( { backgroundColor: 'rgba(90, 70, 20, 0.1)' } );
				
		pngStream.on( 'data', function ( chunk ) { fileStream.write( chunk ); } );
		pngStream.on( 'end', function () { console.log( 'fromBufferToPNGStream complete. File saved to', __dirname + '/node-output/fromBufferToPNGStream.jpg' ); } );
	} );
}