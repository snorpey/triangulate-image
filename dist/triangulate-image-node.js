(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('stream')) :
	typeof define === 'function' && define.amd ? define(['stream'], factory) :
	(global.triangulate = factory(global.stream));
}(this, (function (stream) { 'use strict';

stream = stream && stream.hasOwnProperty('default') ? stream['default'] : stream;

var clamp = function ( value, min, max ) {
	return value < min ? min : value > max ? max : value;
};

var clone = function (obj) {
	var result = false;
	
	if ( typeof obj !== 'undefined' ) {
		try {
			result = JSON.parse( JSON.stringify( obj ) );
		} catch ( e ) { }
	}
	
	return result;
};

// var Canvas = require( 'canvas' );;
// import Canvas from './browser.js';
var Canvas = require( 'canvas' );

var makeCanvasAndContext = function ( size, options, dpr, format ) {
	var backgroundColor = options && options.backgroundColor ? options.backgroundColor : false;
	var canvas = new Canvas( size.width * dpr, size.height * dpr, format );
	var ctx = canvas.getContext( '2d' );

	if ( backgroundColor ) {
		ctx.fillStyle = backgroundColor;
		ctx.fillRect( 0, 0, size.width * dpr, size.height * dpr );
		ctx.fillStyle = 'transparent';
	}

	return {
		canvas: canvas,
		ctx: ctx
	};
};

/**
 * Transform CSS color definition to RGBA
 * @param  {String} color CSS color (name,HSL,RGB,HEX..)
 * @return {Object}       RGBA color object
 */
var toColor = function (color) {
	var size = 1;		// single pixel
	var ctx = makeCanvasAndContext( { width: size, height: size }, { }, 1, true ).ctx;
	ctx.fillStyle = color;
	ctx.fillRect( 0, 0, size, size );
	
	// Read the pixel, and get RGBA values
	var data = ctx.getImageData( 0, 0, size, size ).data;
	
	return {
		r: data[0],
		g: data[1],
		b: data[2],
		a: data[3] / 255		// For alpha we scale to 0..1 float
	};
};

var defaultParams = {
	accuracy: 0.7,
	blur: 4,
	fill: true,
	stroke: true,
	strokeWidth: 0.5,
	lineJoin: 'miter',
	vertexCount: 700,
	threshold: 50,
	transparentColor: false
};

var allowedLineJoins = [ 'miter', 'round', 'bevel' ];

var sanitizeInput = function (params) {
	
	params = clone( params );

	if ( typeof params !== 'object' ) {
		params = { };
	}

	if ( typeof params.accuracy !== 'number' || isNaN( params.accuracy ) ) {
		params.accuracy = defaultParams.accuracy;
	} else {
		params.accuracy = clamp( params.accuracy, 0, 1 );
	}

	if ( typeof params.blur !== 'number' || isNaN( params.blur ) ) {
		params.blur = defaultParams.blur;	
	}

	if ( params.blur <= 0 ) {
		params.blur = 1;
	}

	if ( typeof params.fill !== 'string' && typeof params.fill !== 'boolean' ) {
		params.fill = defaultParams.fill;
	}

	if ( typeof params.stroke !== 'string' && typeof params.stroke !== 'boolean' ) {
		params.stroke = defaultParams.stroke;
	}

	if ( typeof params.strokeWidth !== 'number' || isNaN( params.strokeWidth ) ) {
		params.strokeWidth = defaultParams.strokeWidth;
	}

	if ( typeof params.threshold !== 'number' || isNaN( params.threshold ) ) {
		params.threshold = defaultParams.threshold;
	} else {
		params.threshold = clamp( params.threshold, 1, 100 );
	}

	if ( typeof params.lineJoin !== 'string' || allowedLineJoins.indexOf( params.lineJoin ) === -1 ) {
		params.lineJoin = defaultParams.lineJoin;
	}

	if ( params.gradients && params.fill ) {
		params.gradients = true;
	} else {
		params.gradients = false;
	}

	if ( params.gradients ) {
		if (
			typeof params.gradientStops !== 'number' ||
			isNaN( params.gradientStops ) ||
			params.gradientStops < 2
		) {
			params.gradientStops = 2;
		}

		params.gradientStops = Math.round( params.gradientStops );
	}

	if ( typeof params.vertexCount !== 'number' || isNaN( params.vertexCount ) ) {
		params.vertexCount = defaultParams.vertexCount;
	}

	if ( params.vertexCount <= 0 ) {
		params.vertexCount = 1;
	}

	if ( typeof params.transparentColor !== 'string' && typeof params.transparentColor !== 'boolean' ) {
		params.transparentColor = defaultParams.transparentColor;
	}

	// "transparentColor=true" is meaningless
	if ( typeof params.transparentColor === true ) {
		params.transparentColor = false;
	}

	// Transform `transparentColor` string to RGBA color object
	if ( typeof params.transparentColor === 'string' ) {
		params.transparentColor = toColor( params.transparentColor );
	}

	return params;
};

// https://github.com/Automattic/node-canvas#imagesrcbuffer
var Image = Canvas.Image;

var fromBufferToImageData = function (buffer) {
	if ( buffer instanceof Buffer ) {
		var image = new Image;
		image.src = buffer;

		var canvas = new Canvas( image.width, image.height );
		var ctx = canvas.getContext( '2d' );

		ctx.drawImage( image, 0, 0, canvas.width, canvas.height );

		return ctx.getImageData( 0, 0, canvas.width, canvas.height );
	} else {
		throw new Error( "Can't work with the buffer object provided." );
		return;
	}
};

// https://github.com/Automattic/node-canvas#imagesrcbuffer
var Readable = stream.Readable;
var Image$1 = Canvas.Image;

var fromStreamToImageData = function ( stream$$1, resolve, reject ) {
	if ( stream$$1 instanceof Readable ) {
		var bufferContent = [ ];
		
		stream$$1.on( 'data', function (chunk) {
			bufferContent.push( chunk );
		} );
		
		stream$$1.on( 'end', function () {
			try {
				var buffer = Buffer.concat( bufferContent );
				var image = new Image$1;
				image.src = buffer;

				var canvas = new Canvas( image.width, image.height );
				var ctx = canvas.getContext( '2d' );

				ctx.drawImage( image, 0, 0, canvas.width, canvas.height );

				resolve( ctx.getImageData( 0, 0, canvas.width, canvas.height ) );
			} catch ( err ) {
				reject( err );
			}
		} );

	} else {
		reject( new Error( "Can't work with the buffer object provided." ) );
	}
};

// import objectAssign from 'object-assign'
var objectAssign = Object.assign;

/**
 * Transform color object to rgb/a
 * @param  {Object} colorObj RGB(A) color object
 * @return {String}       	 rgba css string
 */

var toRGBA = function (colorObj) {
	var c = objectAssign( { a: 1 }, colorObj );	// rgb-to-rgba:  alpha is optionally set to 1
	return ("rgba(" + (c.r) + ", " + (c.g) + ", " + (c.b) + ", " + (c.a) + ")")
};

var drawPolygonsOnContext = function ( ctx, polygons, size, dpr ) {
	dpr = dpr || 1;

	polygons.forEach( function ( polygon, index ) {
		ctx.beginPath();
		ctx.moveTo( polygon.a.x * dpr, polygon.a.y * dpr );
		ctx.lineTo( polygon.b.x * dpr, polygon.b.y * dpr );
		ctx.lineTo( polygon.c.x * dpr, polygon.c.y * dpr );
		ctx.lineTo( polygon.a.x * dpr, polygon.a.y * dpr );
		
		// http://weblogs.asp.net/dwahlin/rendering-linear-gradients-using-the-html5-canvas
		if ( polygon.gradient ) {
			var gradient = ctx.createLinearGradient(
				polygon.gradient.x1 * dpr,
				polygon.gradient.y1 * dpr,
				polygon.gradient.x2 * dpr,
				polygon.gradient.y2 * dpr
			);

			var lastColorIndex = polygon.gradient.colors.length - 1;
			
			polygon.gradient.colors.forEach( function ( color, index ) {
				var rgb = toRGBA( color );
				gradient.addColorStop( index / lastColorIndex, rgb );
			} );

			ctx.fillStyle = gradient;
			ctx.fill();

			if ( polygon.strokeWidth > 0 ) {
				ctx.strokeStyle = gradient;
				ctx.lineWidth = polygon.strokeWidth * dpr;
				ctx.lineJoin = polygon.lineJoin;
				ctx.stroke();
			}
		} else {
			if ( polygon.fill ) {
				ctx.fillStyle = polygon.fill;
				ctx.fill();
			}

			if ( polygon.strokeColor ) {
				ctx.strokeStyle = polygon.strokeColor;
				ctx.lineWidth = polygon.strokeWidth * dpr;
				ctx.lineJoin = polygon.lineJoin;
				ctx.stroke();
			}
		}

		ctx.closePath();
	} );

	return ctx;
};

// https://github.com/Automattic/node-canvas#pdf-support
var allowedFormats = [ 'svg', 'pdf' ];

var polygonsToBuffer = function ( polygons, size, options ) {
	var dpr = options && options.dpr ? options.dpr : 1;
	var format = options && options.format ? options.format : false;
	
	format = allowedFormats.indexOf( format ) === -1 ? undefined : format;
	
	var canvasData = makeCanvasAndContext( size, options, dpr, format );
	
	drawPolygonsOnContext( canvasData.ctx, polygons, size );

	return canvasData.canvas.toBuffer();
};

var polygonsToImageData = function ( polygons, size, options ) {
	var dpr = options && options.dpr ? options.dpr : 1;	
	var ctx = makeCanvasAndContext( size, options, dpr, true ).ctx;
	
	drawPolygonsOnContext( ctx, polygons, size, dpr );

	return ctx.getImageData( 0, 0, size.width * dpr, size.height * dpr );
};

var polygonsToDataURL = function ( polygons, size, options ) {
	var dpr = options && options.dpr ? options.dpr : 1;	
	var canvasData = makeCanvasAndContext( size, options, dpr );

	drawPolygonsOnContext( canvasData.ctx, polygons, size, dpr );

	return canvasData.canvas.toDataURL();
};

// http://stackoverflow.com/questions/6918597/convert-canvas-or-control-points-to-svg
// https://developer.mozilla.org/en-US/docs/SVG/Element/polygon
var polygonsToSVG = function ( polygons, size ) {
	var defStr = '';

	if ( polygons.length && polygons[0].gradient ) {
		defStr = '<defs>';
	}

	var polygonStr = '';

	polygons.forEach( function ( polygon, index ) {
		var a = polygon.a;
		var b = polygon.b;
		var c = polygon.c;

		polygonStr += "<polygon points=\"" + (a.x) + "," + (a.y) + " " + (b.x) + "," + (b.y) + " " + (c.x) + "," + (c.y) + "\"";

		if ( polygon.gradient ) {
			var bb = polygon.boundingBox;
			var x1 = ( ( polygon.gradient.x1 - bb.x ) / bb.width * 100 ).toFixed( 3 );
			var y1 = ( ( polygon.gradient.y1 - bb.y ) / bb.height * 100 ).toFixed( 3 );
			var x2 = ( ( polygon.gradient.x2 - bb.x ) / bb.width * 100 ).toFixed( 3 );
			var y2 = ( ( polygon.gradient.y2 - bb.y ) / bb.height * 100 ).toFixed( 3 );

			defStr += "\n\t<linearGradient id=\"gradient-" + index + "\" x1=\"" + x1 + "%\" y1=\"" + y1 + "%\" x2=\"" + x2 + "%\" y2=\"" + y2 + "%\">";

			var lastColorIndex = polygon.gradient.colors.length - 1;
			
			polygon.gradient.colors.forEach( function ( color, index ) {
				var rgb = toRGBA( color );
				var offset = ( ( index / lastColorIndex ) * 100 ).toFixed( 3 );
				defStr += "\n\t\t\t\t\t<stop offset=\"" + offset + "%\" stop-color=\"" + rgb + "\"/>\n\t\t\t\t";
			} );
	
			defStr += "</linearGradient>";
			polygonStr += " fill=\"url(#gradient-" + index + ")\"";

			if ( polygon.strokeWidth > 0 ) {
				polygonStr += " stroke=\"url(#gradient-" + index + ")\" stroke-width=\"" + (polygon.strokeWidth) + "\" stroke-linejoin=\"" + (polygon.lineJoin) + "\"";
			}

		} else {
			if ( polygon.fill ) {
				polygonStr += " fill=\"" + (polygon.fill) + "\"";
			} else {
				polygonStr += " fill=\"transparent\"";
			}

			if ( polygon.strokeColor ) {
				polygonStr += " stroke=\"" + (polygon.strokeColor) + "\" stroke-width=\"" + (polygon.strokeWidth) + "\" stroke-linejoin=\"" + (polygon.lineJoin) + "\"";
			}
		}


		polygonStr += "/>\n\t";
	} );

	if ( defStr.length ) {
		defStr += "\n\t\t</defs>";
	}

	var svg = "<?xml version=\"1.0\" standalone=\"yes\"?>\n<svg width=\"" + (size.width) + "\" height=\"" + (size.height) + "\" xmlns=\"http://www.w3.org/2000/svg\" version=\"1.1\" >\n\t" + defStr + "\n\t" + polygonStr + "\n</svg>";

	return svg;
};

var readableStream = stream.Readable;

var polygonsToSVGStream = function ( polygons, size ) {
	var rs = new readableStream();
	var polygonStr;

	rs._read = function () {
		rs.push( "<?xml version=\"1.0\" standalone=\"yes\"?>\n" );
		rs.push( ("<svg width=\"" + (size.width) + "\" height=\"" + (size.height) + "\" xmlns=\"http://www.w3.org/2000/svg\" version=\"1.1\" >") );

		polygons.forEach( function ( polygon, index ) {
			var a = polygon.a;
			var b = polygon.b;
			var c = polygon.c;

			polygonStr = "<polygon points=\"" + (a.x) + "," + (a.y) + " " + (b.x) + "," + (b.y) + " " + (c.x) + "," + (c.y) + "\"";

			if ( polygon.fill ) {
				polygonStr += " fill=\"" + (polygon.fill) + "\"";
			} else {
				polygonStr += " fill=\"transparent\"";
			}

			if ( polygon.strokeColor ) {
				polygonStr += " stroke=\"" + (polygon.strokeColor) + "\" stroke-width=\"" + (polygon.strokeWidth) + "\" stroke-linejoin=\"" + (polygon.lineJoin) + "\"";	
			}

			polygonStr += "/>\n\t\t";
			rs.push( polygonStr );
		} );

		rs.push( "\n\t</svg>" );
		rs.push( null );
	};
	
	return rs;
};

// https://github.com/Automattic/node-canvas#canvaspngstream
var polygonsToPNGStream = function ( polygons, size, options ) {
	var dpr = options && options.dpr ? options.dpr : 1;
	var backgroundColor = options && options.backgroundColor ? options.backgroundColor : false;
	var canvas = new Canvas( size.width * dpr, size.height * dpr );
	var ctx = canvas.getContext( '2d' );

	if ( backgroundColor ) {
		ctx.fillStyle = backgroundColor;
		ctx.fillRect( 0, 0, size.width * dpr, size.height * dpr );
		ctx.fillStyle = 'transparent';
	}
	
	drawPolygonsOnContext( ctx, polygons, size, dpr );

	return canvas.pngStream();
};

// https://github.com/Automattic/node-canvas#canvasjpegstream-and-canvassyncjpegstream
var polygonsToJPGStream = function ( polygons, size, options ) {
	options = options || { };
	
	var dpr = options.dpr || 1;

	var streamParams = {
		bufsize: options.bufsize || 4096,
		quality: options.quality || 75,
		progressive: options.progressive || false
	};

	var backgroundColor = options.backgroundColor || '#ffffff';
	var canvas = new Canvas( size.width * dpr, size.height * dpr );
	var ctx = canvas.getContext( '2d' );

	ctx.fillStyle = backgroundColor;
	ctx.fillRect( 0, 0, size.width * dpr, size.height * dpr );
	ctx.fillStyle = 'transparent';

	drawPolygonsOnContext( ctx, polygons, size, dpr );

	return canvas.jpegStream( streamParams );
};

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};





function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var delaunay = createCommonjsModule(function (module) {
function Triangle(a, b, c) {
  this.a = a;
  this.b = b;
  this.c = c;

  var A = b.x - a.x,
      B = b.y - a.y,
      C = c.x - a.x,
      D = c.y - a.y,
      E = A * (a.x + b.x) + B * (a.y + b.y),
      F = C * (a.x + c.x) + D * (a.y + c.y),
      G = 2 * (A * (c.y - b.y) - B * (c.x - b.x)),
      minx, miny, dx, dy;

  /* If the points of the triangle are collinear, then just find the
   * extremes and use the midpoint as the center of the circumcircle. */
  if(Math.abs(G) < 0.000001) {
    minx = Math.min(a.x, b.x, c.x);
    miny = Math.min(a.y, b.y, c.y);
    dx   = (Math.max(a.x, b.x, c.x) - minx) * 0.5;
    dy   = (Math.max(a.y, b.y, c.y) - miny) * 0.5;

    this.x = minx + dx;
    this.y = miny + dy;
    this.r = dx * dx + dy * dy;
  }

  else {
    this.x = (D*E - B*F) / G;
    this.y = (A*F - C*E) / G;
    dx = this.x - a.x;
    dy = this.y - a.y;
    this.r = dx * dx + dy * dy;
  }
}

Triangle.prototype.draw = function(ctx) {
  ctx.beginPath();
  ctx.moveTo(this.a.x, this.a.y);
  ctx.lineTo(this.b.x, this.b.y);
  ctx.lineTo(this.c.x, this.c.y);
  ctx.closePath();
  ctx.stroke();
};

function byX(a, b) {
  return b.x - a.x
}

function dedup(edges) {
  var j = edges.length,
      a, b, i, m, n;

  outer: while(j) {
    b = edges[--j];
    a = edges[--j];
    i = j;
    while(i) {
      n = edges[--i];
      m = edges[--i];
      if((a === m && b === n) || (a === n && b === m)) {
        edges.splice(j, 2);
        edges.splice(i, 2);
        j -= 2;
        continue outer
      }
    }
  }
}

function triangulate(vertices) {
  /* Bail if there aren't enough vertices to form any triangles. */
  if(vertices.length < 3)
    { return [] }

  /* Ensure the vertex array is in order of descending X coordinate
   * (which is needed to ensure a subquadratic runtime), and then find
   * the bounding box around the points. */
  vertices.sort(byX);

  var i    = vertices.length - 1,
      xmin = vertices[i].x,
      xmax = vertices[0].x,
      ymin = vertices[i].y,
      ymax = ymin;

  while(i--) {
    if(vertices[i].y < ymin) { ymin = vertices[i].y; }
    if(vertices[i].y > ymax) { ymax = vertices[i].y; }
  }

  /* Find a supertriangle, which is a triangle that surrounds all the
   * vertices. This is used like something of a sentinel value to remove
   * cases in the main algorithm, and is removed before we return any
   * results.
   *
   * Once found, put it in the "open" list. (The "open" list is for
   * triangles who may still need to be considered; the "closed" list is
   * for triangles which do not.) */
  var dx     = xmax - xmin,
      dy     = ymax - ymin,
      dmax   = (dx > dy) ? dx : dy,
      xmid   = (xmax + xmin) * 0.5,
      ymid   = (ymax + ymin) * 0.5,
      open   = [
        new Triangle(
          {x: xmid - 20 * dmax, y: ymid -      dmax, __sentinel: true},
          {x: xmid            , y: ymid + 20 * dmax, __sentinel: true},
          {x: xmid + 20 * dmax, y: ymid -      dmax, __sentinel: true}
        )
      ],
      closed = [],
      edges = [],
      j, a, b;

  /* Incrementally add each vertex to the mesh. */
  i = vertices.length;
  while(i--) {
    /* For each open triangle, check to see if the current point is
     * inside it's circumcircle. If it is, remove the triangle and add
     * it's edges to an edge list. */
    edges.length = 0;
    j = open.length;
    while(j--) {
      /* If this point is to the right of this triangle's circumcircle,
       * then this triangle should never get checked again. Remove it
       * from the open list, add it to the closed list, and skip. */
      dx = vertices[i].x - open[j].x;
      if(dx > 0 && dx * dx > open[j].r) {
        closed.push(open[j]);
        open.splice(j, 1);
        continue
      }

      /* If not, skip this triangle. */
      dy = vertices[i].y - open[j].y;
      if(dx * dx + dy * dy > open[j].r)
        { continue }

      /* Remove the triangle and add it's edges to the edge list. */
      edges.push(
        open[j].a, open[j].b,
        open[j].b, open[j].c,
        open[j].c, open[j].a
      );
      open.splice(j, 1);
    }

    /* Remove any doubled edges. */
    dedup(edges);

    /* Add a new triangle for each edge. */
    j = edges.length;
    while(j) {
      b = edges[--j];
      a = edges[--j];
      open.push(new Triangle(a, b, vertices[i]));
    }
  }

  /* Copy any remaining open triangles to the closed list, and then
   * remove any triangles that share a vertex with the supertriangle. */
  Array.prototype.push.apply(closed, open);

  i = closed.length;
  while(i--)
    { if(closed[i].a.__sentinel ||
       closed[i].b.__sentinel ||
       closed[i].c.__sentinel)
      { closed.splice(i, 1); } }

  /* Yay, we're done! */
  return closed
}

{
    module.exports = {
        Triangle: Triangle,
        triangulate: triangulate
    };
}
});

var delaunay_1 = delaunay.Triangle;
var delaunay_2 = delaunay.triangulate;

var sobel = createCommonjsModule(function (module, exports) {
(function(root) {
  function Sobel(imageData) {
    if (!(this instanceof Sobel)) {
      return new Sobel(imageData);
    }

    var width = imageData.width;
    var height = imageData.height;

    var kernelX = [
      [-1,0,1],
      [-2,0,2],
      [-1,0,1]
    ];

    var kernelY = [
      [-1,-2,-1],
      [0,0,0],
      [1,2,1]
    ];

    var sobelData = [];
    var grayscaleData = [];

    function bindPixelAt(data) {
      return function(x, y, i) {
        i = i || 0;
        return data[((width * y) + x) * 4 + i];
      };
    }

    var data = imageData.data;
    var pixelAt = bindPixelAt(data);
    var x, y;

    for (y = 0; y < height; y++) {
      for (x = 0; x < width; x++) {
        var r = pixelAt(x, y, 0);
        var g = pixelAt(x, y, 1);
        var b = pixelAt(x, y, 2);

        var avg = (r + g + b) / 3;
        grayscaleData.push(avg, avg, avg, 255);
      }
    }

    pixelAt = bindPixelAt(grayscaleData);

    for (y = 0; y < height; y++) {
      for (x = 0; x < width; x++) {
        var pixelX = (
            (kernelX[0][0] * pixelAt(x - 1, y - 1)) +
            (kernelX[0][1] * pixelAt(x, y - 1)) +
            (kernelX[0][2] * pixelAt(x + 1, y - 1)) +
            (kernelX[1][0] * pixelAt(x - 1, y)) +
            (kernelX[1][1] * pixelAt(x, y)) +
            (kernelX[1][2] * pixelAt(x + 1, y)) +
            (kernelX[2][0] * pixelAt(x - 1, y + 1)) +
            (kernelX[2][1] * pixelAt(x, y + 1)) +
            (kernelX[2][2] * pixelAt(x + 1, y + 1))
        );

        var pixelY = (
          (kernelY[0][0] * pixelAt(x - 1, y - 1)) +
          (kernelY[0][1] * pixelAt(x, y - 1)) +
          (kernelY[0][2] * pixelAt(x + 1, y - 1)) +
          (kernelY[1][0] * pixelAt(x - 1, y)) +
          (kernelY[1][1] * pixelAt(x, y)) +
          (kernelY[1][2] * pixelAt(x + 1, y)) +
          (kernelY[2][0] * pixelAt(x - 1, y + 1)) +
          (kernelY[2][1] * pixelAt(x, y + 1)) +
          (kernelY[2][2] * pixelAt(x + 1, y + 1))
        );

        var magnitude = Math.sqrt((pixelX * pixelX) + (pixelY * pixelY))>>>0;

        sobelData.push(magnitude, magnitude, magnitude, 255);
      }
    }

    var clampedArray = sobelData;

    if (typeof Uint8ClampedArray === 'function') {
      clampedArray = new Uint8ClampedArray(sobelData);
    }

    clampedArray.toImageData = function() {
      return Sobel.toImageData(clampedArray, width, height);
    };

    return clampedArray;
  }

  Sobel.toImageData = function toImageData(data, width, height) {
    if (typeof ImageData === 'function' && Object.prototype.toString.call(data) === '[object Uint16Array]') {
      return new ImageData(data, width, height);
    } else {
      if (typeof window === 'object' && typeof window.document === 'object') {
        var canvas = document.createElement('canvas');

        if (typeof canvas.getContext === 'function') {
          var context = canvas.getContext('2d');
          var imageData = context.createImageData(width, height);
          imageData.data.set(data);
          return imageData;
        } else {
          return new FakeImageData(data, width, height);
        }
      } else {
        return new FakeImageData(data, width, height);
      }
    }
  };

  function FakeImageData(data, width, height) {
    return {
      width: width,
      height: height,
      data: data
    };
  }

  {
    if ('object' !== 'undefined' && module.exports) {
      exports = module.exports = Sobel;
    }
    exports.Sobel = Sobel;
  }

})(commonjsGlobal);
});

var sobel_1 = sobel.Sobel;

var isImageData = function (imageData) {
	return (
		imageData && 
		typeof imageData.width === 'number' &&
		typeof imageData.height === 'number' &&
		imageData.data &&
		typeof imageData.data.length === 'number' &&
		typeof imageData.data === 'object'
	);
};

var copyImageData = function (imageData) {
	if ( isImageData ( imageData ) ) {
		if ( typeof Uint8ClampedArray === 'undefined' ) {
			if ( typeof window === 'undefined' ) {
				throw new Error( "Can't copy imageData in webworker without Uint8ClampedArray support." );
				return imageData;
			} else {
				return copyImageDataWithCanvas( imageData );
			}
		} else {
			var clampedArray = new Uint8ClampedArray( imageData.data );

			if ( typeof ImageData === 'undefined' ) {
				// http://stackoverflow.com/a/15238036/229189
				return {
					width: imageData.width,
					height: imageData.height,
					data: clampedArray
				};
			} else {
				// http://stackoverflow.com/a/15908922/229189#comment57192591_15908922
				var result;

				try {
					result = new ImageData( clampedArray, imageData.width, imageData.height );
				} catch ( err ) {
					if ( typeof window === 'undefined' ) {
						throw new Error( "Can't copy imageData in webworker without proper ImageData() support." );
						result = imageData;
					} else {
						result = copyImageDataWithCanvas( imageData );
					}
				}

				return result;
			}
		}
	} else {
		throw new Error( 'Given imageData object is not useable.' );
		return;
	}
};

// http://stackoverflow.com/a/11918126/229189
function copyImageDataWithCanvas ( imageData ) {
	var canvas = new Canvas( imageData.width, imageData.height );
	var ctx = canvas.getContext( '2d' );

	ctx.putImageData( imageData, 0, 0 );
				
	return ctx.getImageData( 0, 0, imageData.width, imageData.height );
}

/*
    StackBlur - a fast almost Gaussian Blur For Canvas

    Version:     0.5
    Author:        Mario Klingemann
    Contact:     mario@quasimondo.com
    Website:    http://www.quasimondo.com/StackBlurForCanvas
    Twitter:    @quasimondo

    In case you find this class useful - especially in commercial projects -
    I am not totally unhappy for a small donation to my PayPal account
    mario@quasimondo.de

    Or support me on flattr:
    https://flattr.com/thing/72791/StackBlur-a-fast-almost-Gaussian-Blur-Effect-for-CanvasJavascript

    Copyright (c) 2010 Mario Klingemann

    Permission is hereby granted, free of charge, to any person
    obtaining a copy of this software and associated documentation
    files (the "Software"), to deal in the Software without
    restriction, including without limitation the rights to use,
    copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the
    Software is furnished to do so, subject to the following
    conditions:

    The above copyright notice and this permission notice shall be
    included in all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
    OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
    NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
    HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
    WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
    FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
    OTHER DEALINGS IN THE SOFTWARE.
    */

var mul_table = [
    512,512,456,512,328,456,335,512,405,328,271,456,388,335,292,512,
    454,405,364,328,298,271,496,456,420,388,360,335,312,292,273,512,
    482,454,428,405,383,364,345,328,312,298,284,271,259,496,475,456,
    437,420,404,388,374,360,347,335,323,312,302,292,282,273,265,512,
    497,482,468,454,441,428,417,405,394,383,373,364,354,345,337,328,
    320,312,305,298,291,284,278,271,265,259,507,496,485,475,465,456,
    446,437,428,420,412,404,396,388,381,374,367,360,354,347,341,335,
    329,323,318,312,307,302,297,292,287,282,278,273,269,265,261,512,
    505,497,489,482,475,468,461,454,447,441,435,428,422,417,411,405,
    399,394,389,383,378,373,368,364,359,354,350,345,341,337,332,328,
    324,320,316,312,309,305,301,298,294,291,287,284,281,278,274,271,
    268,265,262,259,257,507,501,496,491,485,480,475,470,465,460,456,
    451,446,442,437,433,428,424,420,416,412,408,404,400,396,392,388,
    385,381,377,374,370,367,363,360,357,354,350,347,344,341,338,335,
    332,329,326,323,320,318,315,312,310,307,304,302,299,297,294,292,
    289,287,285,282,280,278,275,273,271,269,267,265,263,261,259];


var shg_table = [
    9, 11, 12, 13, 13, 14, 14, 15, 15, 15, 15, 16, 16, 16, 16, 17,
    17, 17, 17, 17, 17, 17, 18, 18, 18, 18, 18, 18, 18, 18, 18, 19,
    19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 20, 20,
    20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 21,
    21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21,
    21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 22, 22, 22, 22, 22, 22,
    22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22,
    22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 23,
    23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
    23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
    23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
    23, 23, 23, 23, 23, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
    24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
    24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
    24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
    24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24 ];

function BlurStack () {
	this.r = 0;
	this.g = 0;
	this.b = 0;
	this.a = 0;
	this.next = null;
}

var stackblur = function ( imageData, top_x, top_y, width, height, radius ) {
	var pixels = imageData.data;

	var x, y, i, p, yp, yi, yw, r_sum, g_sum, b_sum, a_sum,
		r_out_sum, g_out_sum, b_out_sum, a_out_sum,
		r_in_sum, g_in_sum, b_in_sum, a_in_sum,
		pr, pg, pb, pa, rbs;

	var div = radius + radius + 1;
	var widthMinus1  = width - 1;
	var heightMinus1 = height - 1;
	var radiusPlus1  = radius + 1;
	var sumFactor = radiusPlus1 * ( radiusPlus1 + 1 ) / 2;

	var stackStart = new BlurStack();
	var stack = stackStart;
	
	for ( i = 1; i < div; i++ ) {
		stack = stack.next = new BlurStack();
		if (i == radiusPlus1) { var stackEnd = stack; }
	}
	stack.next = stackStart;
	
	var stackIn = null;
	var stackOut = null;

	yw = yi = 0;

	var mul_sum = mul_table[radius];
	var shg_sum = shg_table[radius];

	for ( y = 0; y < height; y++ ) {
		r_in_sum = g_in_sum = b_in_sum = a_in_sum = r_sum = g_sum = b_sum = a_sum = 0;

		r_out_sum = radiusPlus1 * ( pr = pixels[yi] );
		g_out_sum = radiusPlus1 * ( pg = pixels[yi+1] );
		b_out_sum = radiusPlus1 * ( pb = pixels[yi+2] );
		a_out_sum = radiusPlus1 * ( pa = pixels[yi+3] );

		r_sum += sumFactor * pr;
		g_sum += sumFactor * pg;
		b_sum += sumFactor * pb;
		a_sum += sumFactor * pa;

		stack = stackStart;

		for ( i = 0; i < radiusPlus1; i++ ) {
			stack.r = pr;
			stack.g = pg;
			stack.b = pb;
			stack.a = pa;
			stack = stack.next;
		}

		for ( i = 1; i < radiusPlus1; i++ ) {
			p = yi + ( ( widthMinus1 < i ? widthMinus1 : i ) << 2 );
			r_sum += ( stack.r = ( pr = pixels[p] ) ) * ( rbs = radiusPlus1 - i );
			g_sum += ( stack.g = ( pg = pixels[p+1] ) ) * rbs;
			b_sum += ( stack.b = ( pb = pixels[p+2] ) ) * rbs;
			a_sum += ( stack.a = ( pa = pixels[p+3] ) ) * rbs;

			r_in_sum += pr;
			g_in_sum += pg;
			b_in_sum += pb;
			a_in_sum += pa;

			stack = stack.next;
		}


		stackIn = stackStart;
		stackOut = stackEnd;

		for (x = 0; x < width; x++) {
			pixels[yi+3] = pa = (a_sum * mul_sum) >> shg_sum;
			
			if (pa != 0) {
				pa = 255 / pa;
				pixels[yi]   = ( ( r_sum * mul_sum ) >> shg_sum ) * pa;
				pixels[yi+1] = ( ( g_sum * mul_sum ) >> shg_sum ) * pa;
				pixels[yi+2] = ( ( b_sum * mul_sum ) >> shg_sum ) * pa;
			} else {
				pixels[yi] = pixels[yi+1] = pixels[yi+2] = 0;
			}

			r_sum -= r_out_sum;
			g_sum -= g_out_sum;
			b_sum -= b_out_sum;
			a_sum -= a_out_sum;

			r_out_sum -= stackIn.r;
			g_out_sum -= stackIn.g;
			b_out_sum -= stackIn.b;
			a_out_sum -= stackIn.a;

			p =  ( yw + ( ( p = x + radius + 1 ) < widthMinus1 ? p : widthMinus1 ) ) << 2;

			r_in_sum += ( stackIn.r = pixels[p] );
			g_in_sum += ( stackIn.g = pixels[p+1] );
			b_in_sum += ( stackIn.b = pixels[p+2] );
			a_in_sum += ( stackIn.a = pixels[p+3] );

			r_sum += r_in_sum;
			g_sum += g_in_sum;
			b_sum += b_in_sum;
			a_sum += a_in_sum;

			stackIn = stackIn.next;

			r_out_sum += ( pr = stackOut.r );
			g_out_sum += ( pg = stackOut.g );
			b_out_sum += ( pb = stackOut.b );
			a_out_sum += ( pa = stackOut.a );

			r_in_sum -= pr;
			g_in_sum -= pg;
			b_in_sum -= pb;
			a_in_sum -= pa;

			stackOut = stackOut.next;

			yi += 4;
		}
		yw += width;
	}


	for ( x = 0; x < width; x++ ) {
		g_in_sum = b_in_sum = a_in_sum = r_in_sum = g_sum = b_sum = a_sum = r_sum = 0;

		yi = x << 2;
		r_out_sum = radiusPlus1 * ( pr = pixels[yi] );
		g_out_sum = radiusPlus1 * ( pg = pixels[yi+1] );
		b_out_sum = radiusPlus1 * ( pb = pixels[yi+2] );
		a_out_sum = radiusPlus1 * ( pa = pixels[yi+3] );

		r_sum += sumFactor * pr;
		g_sum += sumFactor * pg;
		b_sum += sumFactor * pb;
		a_sum += sumFactor * pa;

		stack = stackStart;

		for ( i = 0; i < radiusPlus1; i++) {
			stack.r = pr;
			stack.g = pg;
			stack.b = pb;
			stack.a = pa;
			stack = stack.next;
		}

		yp = width;

		for ( i = 1; i <= radius; i++ ) {
			yi = ( yp + x ) << 2;

			r_sum += ( stack.r = ( pr = pixels[yi] ) ) * (rbs = radiusPlus1 - i);
			g_sum += ( stack.g = ( pg = pixels[yi+1] ) ) * rbs;
			b_sum += ( stack.b = ( pb = pixels[yi+2] ) ) * rbs;
			a_sum += ( stack.a = ( pa = pixels[yi+3] ) ) * rbs;

			r_in_sum += pr;
			g_in_sum += pg;
			b_in_sum += pb;
			a_in_sum += pa;

			stack = stack.next;

			if ( i < heightMinus1 ) {
				yp += width;
			}
		}

		yi = x;
		stackIn = stackStart;
		stackOut = stackEnd;

		for ( y = 0; y < height; y++ ) {
			p = yi << 2;
			pixels[p+3] = pa = ( a_sum * mul_sum ) >> shg_sum;
			
			if ( pa > 0 ) {
				pa = 255 / pa;
				pixels[p]   = ( ( r_sum * mul_sum ) >> shg_sum) * pa;
				pixels[p+1] = ( ( g_sum * mul_sum ) >> shg_sum) * pa;
				pixels[p+2] = ( ( b_sum * mul_sum ) >> shg_sum) * pa;
			} else {
				pixels[p] = pixels[p+1] = pixels[p+2] = 0;
			}

			r_sum -= r_out_sum;
			g_sum -= g_out_sum;
			b_sum -= b_out_sum;
			a_sum -= a_out_sum;

			r_out_sum -= stackIn.r;
			g_out_sum -= stackIn.g;
			b_out_sum -= stackIn.b;
			a_out_sum -= stackIn.a;

			p = ( x + ( ( ( p = y + radiusPlus1 ) < heightMinus1 ? p : heightMinus1 ) * width ) ) << 2;

			r_sum += ( r_in_sum += ( stackIn.r = pixels[p] ) );
			g_sum += ( g_in_sum += ( stackIn.g = pixels[p+1] ) );
			b_sum += ( b_in_sum += ( stackIn.b = pixels[p+2] ) );
			a_sum += ( a_in_sum += ( stackIn.a = pixels[p+3] ) );

			stackIn = stackIn.next;

			r_out_sum += ( pr = stackOut.r );
			g_out_sum += ( pg = stackOut.g );
			b_out_sum += ( pb = stackOut.b );
			a_out_sum += ( pa = stackOut.a );

			r_in_sum -= pr;
			g_in_sum -= pg;
			b_in_sum -= pb;
			a_in_sum -= pa;

			stackOut = stackOut.next;

			yi += width;
		}
	}

	return imageData;
};

var greyscale = function (imageData) {
	var len = imageData.data.length;
	var brightness;

	for ( var i = 0; i < len; i += 4 ) {
		brightness = 0.34 * imageData.data[i] + 0.5 * imageData.data[i + 1] + 0.16 * imageData.data[i + 2];

		imageData.data[i] = brightness;
		imageData.data[i + 1] = brightness;
		imageData.data[i + 2] = brightness;
	}
		
	return imageData;
};

// most parts taken from http://jsdo.it/akm2/xoYx
// (starting line 293++)
var getEdgePoints = function ( imageData, threshold ) {
	// only check every 2nd pixel in imageData to save some time.
	var multiplier = 2;
	var width = imageData.width;
	var height = imageData.height;
	var data = imageData.data;
	var points = [ ];
	var x, y, row, col, sx, sy, step, sum, total;

	for ( y = 0; y < height; y += multiplier ) {
		for ( x = 0; x < width; x += multiplier ) {
			sum = total = 0;

			for ( row = -1; row <= 1; row++ ) {
				sy = y + row;
				step = sy * width;

				if ( sy >= 0 && sy < height ) {
					for ( col = -1; col <= 1; col++ ) {
						sx = x + col;

						if ( sx >= 0 && sx < width ) {
							sum += data[( sx + step ) << 2];
							total++;
						}
					}
				}
			}

			if ( total ) {
				sum /= total;
			}

			if ( sum > threshold ) {
				points.push( { x: x, y: y } );
			}
		}
	}

	return points;
};

function addVertex ( x, y, hash ) {
	var resultKey = x + '|' + y;

	if ( ! hash[resultKey] ) {
		hash[resultKey] = { x: x, y: y };
	}

	resultKey = null;
}

var getVerticesFromPoints = function ( points, maxPointCount, accuracy, width, height ) {
	// using hash for all points to make sure we have a set of unique vertices.
	var resultHash = { };

	// use 25% of max point count to create a background grid.
	// this avoids having too many "big" triangles in areas of the image with low contrast 
	// next to very small ones in areas with high contrast
	// for every other row, start the x value at > 0, so the grid doesn't look too regular
	var gridPointCount = Math.max( ~~( maxPointCount * ( 1 - accuracy ) ), 5 );

	// http://stackoverflow.com/a/4107092/229189
	var gridColumns = Math.round( Math.sqrt( gridPointCount ) );
	var gridRows = Math.round( Math.ceil( gridPointCount / gridColumns ) );
	
	var xIncrement = ~~( width / gridColumns );
	var yIncrement = ~~( height / gridRows );

	var rowIndex = 0;
	var startX = 0;

	var x = 0;
	var y = 0;

	for ( y = 0; y < height; y+= yIncrement ) {
		rowIndex++;

		startX = rowIndex % 2 === 0 ? ~~( xIncrement / 2 ) : 0; 

		for ( x = startX; x < width; x += xIncrement ) {
			if ( x < width && y < height ) {
				// "distorting" the grid a little bit so that the
				// background vertices don't appear to be on a straight line (which looks boring)
				addVertex(
					~~( x + ( Math.cos( y ) * ( yIncrement ) ) ),
					~~( y + ( Math.sin( x ) * ( xIncrement ) ) ),
					resultHash
				);
			}
		}
	}
	
	// add points in the corners
	addVertex( 0, 0, resultHash );
	addVertex( width - 1, 0, resultHash );
	addVertex( width - 1, height - 1, resultHash );
	addVertex( 0, height - 1, resultHash );

	// add points from all edge points
	var remainingPointCount = maxPointCount - Object.keys( resultHash ).length;
	var edgePointCount = points.length;
	var increment = ~~( edgePointCount / remainingPointCount );

	if ( maxPointCount > 0 && increment > 0 ) {
		var i = 0;

		for ( i = 0; i < edgePointCount; i += increment ) {
			addVertex( points[i].x, points[i].y, resultHash );
		}
	}

	points = null;

	return Object.keys( resultHash ).map( function (key) {
		return resultHash[key];
	} );
};

var getBoundingBox = function (points) {
	var xMin = Infinity;
	var xMax = -Infinity;
	var yMin = Infinity;
	var yMax = -Infinity;

	points.forEach( function (p) {
		if ( p.x < xMin ) {
			xMin = p.x;
		}

		if ( p.y < yMin ) {
			yMin = p.y;
		}

		if ( p.x > xMax ) {
			xMax = p.x;
		}

		if ( p.y > yMax ) {
			yMax = p.y;
		}
	} );

	return {
		x: xMin,
		y: yMin,
		width: xMax - xMin,
		height: yMax - yMin
	};
};

var addBoundingBoxesToPolygons = function ( polygons, colorData, params ) {
	polygons.forEach( function (polygon) {
		polygon.boundingBox = getBoundingBox( [ polygon.a, polygon.b, polygon.c ] );
	} );

	return polygons.filter( function (polygon) {
		return polygon.boundingBox.width > 0 && polygon.boundingBox.height > 0;
	} );
};

/**
 * Get color object by position
 * @param  {Object} pos         {x,y} object
 * @param  {Object} colorData   Image color data object
 * @param  {Object} [transparentColor] (optional) RGBA color object. Used to set specific color to transparent pixels
 * @return {Object}             RGBA color object
 */
var getColorByPos = function ( pos, colorData, transparentColor ) {
	var x = clamp( pos.x, 1, colorData.width - 2 );
	var y = clamp( pos.y, 1, colorData.height - 2 );
	var index = ( ( x | 0 ) + ( y | 0 ) * colorData.width ) << 2;

	if ( index >= colorData.data.length ) {
		index = colorData.data.length - 5;
	}

	var alpha = colorData.data[index + 3] / 255;

	// Return RGBA color object
	return ( transparentColor && alpha === 0 ) ? transparentColor : {
		r: colorData.data[index],
		g: colorData.data[index + 1],
		b: colorData.data[index + 2],
		a: alpha
	};
};

/**
 * Get polygon's center point
 * @param  {Object} polygon Polygon object
 * @return {Object}         Point coordinates {x,y}
 */
var polygonCenter = function (polygon) {
	return {
		x: ( polygon.a.x + polygon.b.x + polygon.c.x ) * 0.33333,
		y: ( polygon.a.y + polygon.b.y + polygon.c.y ) * 0.33333
	};
};

/**
 * Is color transparent ?
 * @param  {Object} color Color object
 * @return {Boolean}      Is transparent?
 */
var isTransparent = function (color) {
	return color.a === 0;
};

var addColorToPolygons = function ( polygons, colorData, params ) {
	var fill = params.fill;
	var stroke = params.stroke;
	var strokeWidth = params.strokeWidth;
	var lineJoin = params.lineJoin;
	var transparentColor = params.transparentColor;
	var fillColor = typeof fill === 'string' ? fill : false;
	var strokeColor = typeof stroke === 'string' ? stroke : false;

	/**
	 * Color override logic
	 * @param  {Object} color    Color object
	 * @param  {String} override Override color (fillColor/strokeColor)
	 * @return {String}          CSS formatted color (rgba,..)
	 */
	var getColor = function ( color, override ) {
		var t = ( isTransparent(color) && transparentColor );	// Color is transparent, and transparentColor override is defined
		var c = t ? transparentColor : color;
		return ( override && !t ) ? override : toRGBA( c );		// Priority: transparentColor -> override -> supplied color
	};

	polygons.forEach( function (polygon) {
		var color = getColorByPos( polygonCenter( polygon ), colorData );

		if ( fill ) {
			polygon.fill = getColor( color, fillColor );
		}

		if ( stroke ) {
			polygon.strokeColor = getColor(color, strokeColor);
			polygon.strokeWidth = strokeWidth;
			polygon.lineJoin = lineJoin;
		}
	} );

	return polygons;
};

//  http://stackoverflow.com/a/9733420/229189
var luminance = function (color) {
	var a = [ color.r, color.g, color.b ].map( function (v) {
		v /= 255;
		return ( v <= 0.03928 ) ? v / 12.92 : Math.pow( ( ( v + 0.055 ) / 1.055 ), 2.4 );
	} );

	return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
};

var distance = function ( a, b ) {
	var dx = b.x - a.x;
	var dy = b.y - a.y;

	return Math.sqrt( ( dx * dx ) + ( dy * dy ) );
};

var addGradientsToPolygons = function ( polygons, colorData, params ) {
	polygons.forEach( function (polygon) {
		var data = { };

		'abc'.split( '' ).forEach( function (key) {
			var color = getColorByPos( polygon[key], colorData, params.transparentColor );
			
			data[key] = {
				key: key,
				color: color,
				x: polygon[key].x,
				y: polygon[key].y
			};

			data[key].luminance = luminance( data[key].color );

			var otherKeys = 'abc'.replace( key, '' ).split( '' );

			data[key].median = {
				x: ( polygon[otherKeys[0]].x + polygon[otherKeys[1]].x ) / 2,
				y: ( polygon[otherKeys[0]].y + polygon[otherKeys[1]].y ) / 2
			};

			data[key].medianColor = getColorByPos( data[key].median, colorData, params.transparentColor );
			data[key].medianLuminance = luminance( data[key].medianColor );
		} );

		// sort by axis of most difference in luminance
		var pointsByDeltaInLuminance = [ data.a, data.b, data.c ].sort( function ( u, v ) {
			return Math.abs( u.luminance - u.medianLuminance ) - Math.abs( v.luminance - v.medianLuminance );
		} );

		var pointWithMostDeltaInLuminance = pointsByDeltaInLuminance[0];
		var startPoint = pointsByDeltaInLuminance[0];
		var endPoint = pointWithMostDeltaInLuminance.median;

		var gradienStopPositions = [ startPoint ];

		var startToEndDistance = distance( startPoint, endPoint );

		for ( var i = 1, len = params.gradientStops - 2; i < len; i++ ) {
			var pointDistance = i * ( startToEndDistance / params.gradientStops );
			var pointPercent = pointDistance / startToEndDistance;
			
			var point = {
				x: startPoint.x + pointPercent * ( endPoint.x - startPoint.x ), 
				y: startPoint.y + pointPercent * ( endPoint.y - startPoint.y )
			};

			gradienStopPositions.push( point );
		}

		gradienStopPositions.push( endPoint );

		polygon.gradient = {
			x1: pointWithMostDeltaInLuminance.x,
			y1: pointWithMostDeltaInLuminance.y,
			x2: pointWithMostDeltaInLuminance.median.x,
			y2: pointWithMostDeltaInLuminance.median.y,
			colors: gradienStopPositions.map( function (pos) {
				return getColorByPos( pos, colorData, params.transparentColor );
			} )
		};

		if ( params.stroke ) {
			polygon.strokeWidth = params.strokeWidth;
			polygon.lineJoin = params.lineJoin;
		}

		data = null;
	} );

	return polygons;
};

/**
 * Filter polygons with transparent color
 * @param  {Array} polygons    Polygons array
 * @param  {Object} colorData  Color data
 * @return {Array}             Filtered polygons array
 */
var filterTransparentPolygons = function ( polygons, colorData ) {
	return polygons.filter( function (polygon) {
		var color = getColorByPos( polygonCenter( polygon ), colorData );
		return ! isTransparent( color );
	});
};

var imageDataToPolygons = function ( imageData, params ) {
	if ( isImageData( imageData ) ) {
		var imageSize = { width: imageData.width, height: imageData.height };
		var tmpImageData = copyImageData( imageData );
		var colorImageData = copyImageData( imageData );
		var blurredImageData = stackblur( tmpImageData, 0, 0, imageSize.width, imageSize.height, params.blur );
		var greyscaleImageData = greyscale( blurredImageData );
		var edgesImageData = sobel( greyscaleImageData ).toImageData();
		var edgePoints = getEdgePoints( edgesImageData, params.threshold );
		var edgeVertices = getVerticesFromPoints( edgePoints, params.vertexCount, params.accuracy, imageSize.width, imageSize.height );
		var polygons = delaunay_2( edgeVertices );
		
		polygons = addBoundingBoxesToPolygons( polygons );
		
		if ( ! params.transparentColor ) {
			polygons = filterTransparentPolygons( polygons, colorImageData );
		}
		
		if ( params.fill === true && params.gradients === true ) {
			polygons = addGradientsToPolygons( polygons, colorImageData, params );
		} else {
			polygons = addColorToPolygons( polygons, colorImageData, params );
		}

		return polygons;
	} else {
		throw new Error( "Can't work with the imageData provided. It seems to be corrupt." );
		return;
	}
};

// constructing an object that allows for a chained interface.
// for example stuff like:
// 
// triangulate( params )
//     .fromBuffer( buffer )
//     .toImageData()
// 
// etc...

var index = function ( params ) {
	params = sanitizeInput( params );

	var isInputSync = false;
	var isOutputSync = false;

	var inputFn;
	var outputFn;
	
	var api = {
		getParams: getParams,
		getInput: getInput,
		getOutput: getOutput
	};

	var inputMethods = {
		fromBuffer: fromBuffer,
		fromBufferSync: fromBufferSync,
		fromImageData: fromImageData,
		fromImageDataSync: fromImageDataSync,
		fromStream: fromStream
	};

	var outputMethods = {
		toBuffer: toBuffer,
		toBufferSync: toBufferSync,
		toData: toData,
		toDataSync: toDataSync,
		toDataURL: toDataURL,
		toDataURLSync: toDataURLSync,
		toImageData: toImageData,
		toImageDataSync: toImageDataSync,
		toSVG: toSVG,
		toSVGSync: toSVGSync,
		toSVGStream: toSVGStream,
		toPNGStream: toPNGStream,
		toJPGStream: toJPGStream,
		toJPEGStream: toJPEGStream
	};

	function getParams () {
		return params;
	}

	function getInput () {
		var result = objectAssign( { }, api );

		if ( ! inputFn ) {
			objectAssign( result, inputMethods );
		}

		return result;
	}

	function getOutput () {
		var result = objectAssign( { }, api );

		if ( ! outputFn ) {
			objectAssign( result, outputMethods );
		}

		return result;
	}

	function fromBuffer ( inputParams ) { return setInput( fromBufferToImageData, inputParams ); }
	function fromStream ( inputParams ) { return setInput( fromStreamToImageData, inputParams, false, true ); }
	function fromBufferSync ( inputParams ) { return setInput( fromBufferToImageData, inputParams, true ); }
	function fromImageData ( inputParams ) { return setInput( function ( id ) { return id; }, inputParams ); }
	function fromImageDataSync ( inputParams ) { return setInput( function ( id ) { return id; }, inputParams, true ); }

	function toBuffer ( outputParams ) { return setOutput( polygonsToBuffer, outputParams ); }
	function toBufferSync ( outputParams ) { return setOutput( polygonsToBuffer, outputParams, true ); }
	function toData ( outputParams ) { return setOutput( function ( p ) { return p; }, outputParams ); }
	function toDataSync ( outputParams ) { return setOutput( function ( p ) { return p; }, outputParams, true ); }
	function toDataURL ( outputParams ) { return setOutput( polygonsToDataURL, outputParams ); }
	function toDataURLSync ( outputParams ) { return setOutput( polygonsToDataURL, outputParams, true ); }
	function toImageData ( outputParams ) { return setOutput( polygonsToImageData, outputParams ); }
	function toImageDataSync ( outputParams ) { return setOutput( polygonsToImageData, outputParams, true ); }
	function toSVG ( outputParams ) { return setOutput( polygonsToSVG, outputParams ); }
	function toSVGSync ( outputParams ) { return setOutput( polygonsToSVG, outputParams, true ); }
	function toSVGStream ( outputParams ) { return setOutput( polygonsToSVGStream, outputParams, true ); }
	function toPNGStream ( outputParams ) { return setOutput( polygonsToPNGStream, outputParams, true ); }
	function toJPGStream ( outputParams ) { return setOutput( polygonsToJPGStream, outputParams, true ); }
	function toJPEGStream ( outputParams ) { return setOutput( polygonsToJPGStream, outputParams, true ); }

	function setInput ( fn, inputParams, isSync, canResolve ) {
		isInputSync = !! isSync;
		
		inputFn = function () {
			if ( isInputSync ) {
				return fn( inputParams );
			} else {
				return new Promise( function ( resolve, reject ) {
					if ( canResolve ) {
						fn( inputParams, resolve, reject );
					} else {
						try {
							var imageData = fn( inputParams );
							resolve( imageData );
						} catch ( err ) {
							console.log( 'ERROR', err );
							reject( err );
						}
					}
				} );
			}
		};

		if ( isReady() ) {
			return getResult();
		} else {
			return getOutput();
		}
	}

	function setOutput ( fn, outputParams, isSync ) {
		isOutputSync = !! isSync;

		outputFn = function ( polygons, size ) {
			if ( isOutputSync ) {
				return fn( polygons, size, outputParams );
			} else {
				return new Promise( function ( resolve, reject ) {
					try {
						var outputData = fn( polygons, size, outputParams );
						resolve( outputData );
					} catch ( err ) {
						reject( err );
					}
				} );
			}
		};

		if ( isReady() ) {
			return getResult();
		} else {
			return getInput();
		}
	}

	function isReady () {
		return inputFn && outputFn;
	}

	function getResult () {
		if ( isInputSync && isOutputSync ) {
			var imageData = inputFn( params );
			var polygonData = imageDataToPolygons( imageData, params );
			var outputData = outputFn( polygonData, imageData );

			return outputData;
		} else {
			return new Promise( function ( resolve, reject ) {
				var imageData;
				makeInput()
					.then( function (imgData) {
						imageData = imgData;
						return makePolygons( imageData, params );
					}, reject )
					.then( function (polygonData) {
						return makeOutput( polygonData, imageData );
					}, reject )
					.then( resolve, reject );
			} );
		}
	}

	function makeInput ( inputParams ) {
		return new Promise( function ( resolve, reject ) {
			if ( isInputSync ) {
				try {
					var imageData = inputFn( inputParams );
					resolve( imageData );
				} catch ( err ) {
					reject( err );
				}
			} else {
				inputFn( inputParams )
					.then( resolve, reject );
			}
		} );
	}

	function makePolygons ( imageData, params ) {
		return new Promise( function ( resolve, reject ) {
			try {
				var polygons = imageDataToPolygons( imageData, params );
				resolve( polygons );
			} catch( err ) {
				reject( err );
			}
		} );
	}

	function makeOutput ( polygonData, imageData ) {
		return new Promise( function ( resolve, reject ) {
			if ( isOutputSync ) {
				try {
					var outputData = outputFn( polygonData, imageData );
					resolve( outputData );
				} catch ( err ) {
					reject( err );
				}
			} else {
				outputFn( polygonData, imageData )
					.then( function (outputData) {
						resolve( outputData );
					}, reject );
			}
		} );
	}

	return getInput();
};

return index;

})));
