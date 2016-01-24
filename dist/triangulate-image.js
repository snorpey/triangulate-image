(function(f) {
    if (typeof exports === 'object' && typeof module !== 'undefined') {
        module.exports = f();
    } else {
        if (typeof define === 'function' && define.amd) {
            define([], f);
        } else {
            var g;
            if (typeof window !== 'undefined') {
                g = window;
            } else {
                if (typeof global !== 'undefined') {
                    g = global;
                } else {
                    if (typeof self !== 'undefined') {
                        g = self;
                    } else {
                        g = this;
                    }
                }
            }
            g.triangulate = f();
        }
    }
})(function() {
    var define, module, exports;
    return function e(t, n, r) {
        function s(o, u) {
            if (!n[o]) {
                if (!t[o]) {
                    var a = typeof require == 'function' && require;
                    if (!u && a) {
                        return a(o, !0);
                    }
                    if (i) {
                        return i(o, !0);
                    }
                    var f = new Error('Cannot find module \'' + o + '\'');
                    throw f.code = 'MODULE_NOT_FOUND', f;
                }
                var l = n[o] = {
                    exports: {}
                };
                t[o][0].call(l.exports, function(e) {
                    var n = t[o][1][e];
                    return s(n ? n : e);
                }, l, l.exports, e, t, n, r);
            }
            return n[o].exports;
        }
        var i = typeof require == 'function' && require;
        for (var o = 0; o < r.length; o++) {
            s(r[o]);
        }
        return s;
    }({
        1: [ function(_dereq_, module, exports) {
            'use strict';
            module.exports = {
                accuracy: .7,
                blur: 40,
                fill: !0,
                stroke: !0,
                strokeWidth: .5,
                lineJoin: 'miter',
                vertexCount: 700
            };
        }, {} ],
        2: [ function(_dereq_, module, exports) {
            'use strict';
            function checkParams(params) {
                return 'object' != typeof params && (params = {}), 'number' != typeof params.accuracy || isNaN(params.accuracy) ? params.accuracy = defaultParams.accuracy : params.accuracy = clamp(params.accuracy, 0, 1), 
                ('number' != typeof params.blur || isNaN(params.blur)) && (params.blur = defaultParams.blur), 
                'string' != typeof params.fill && 'boolean' != typeof params.fill && (params.fill = defaultParams.fill), 
                'string' != typeof params.stroke && 'boolean' != typeof params.stroke && (params.stroke = defaultParams.stroke), 
                ('number' != typeof params.strokeWidth || isNaN(params.strokeWidth)) && (params.strokeWidth = defaultParams.strokeWidth), 
                ('string' != typeof params.lineJoin || -1 === allowedLineJoins.indexOf(params.lineJoin)) && (params.lineJoin = defaultParams.lineJoin), 
                ('number' != typeof params.vertexCount || isNaN(params.vertexCount)) && (params.vertexCount = defaultParams.vertexCount), 
                params;
            }
            var clamp = _dereq_('./util/clamp.js'), defaultParams = _dereq_('./defaultParams.js'), fromImageToImageData = _dereq_('./input/fromImageToImageData.js'), fromBufferToImageData = _dereq_('./input/fromBufferToImageData.js'), polygonsToImageData = _dereq_('./output/polygonsToImageData.js'), polygonsToDataURL = _dereq_('./output/polygonsToDataURL.js'), polygonsToSVG = _dereq_('./output/polygonsToSVG.js'), polygonsToBuffer, polygonsToPNGStream, polygonsToJPGStream, polygonsToSVGStream, allowedLineJoins = [ 'miter', 'round', 'bevel' ];
            module.exports = function(params, callback) {
                function getInput() {
                    return input;
                }
                function getOutput() {
                    return output;
                }
                function canStart() {
                    return inputFn && outputFn && params;
                }
                function getParams() {
                    return params;
                }
                function go(fn) {
                    return canStart() ? start() : fn();
                }
                function start() {
                    var imageData = inputFn(), polygons = callback(imageData, params);
                    return outputFn(polygons, imageData);
                }
                params = checkParams(params);
                var inputFn, outputFn, input = {
                    getParams: getParams
                }, output = {
                    getParams: getParams
                };
                return input.fromImageData = function(imageData) {
                    return inputFn = function() {
                        return imageData;
                    }, go(getOutput);
                }, output.toDataURL = function(dataUrlParams) {
                    return outputFn = function(polygons, size) {
                        return polygonsToDataURL(polygons, size, dataUrlParams);
                    }, go(getInput);
                }, output.toImageData = function(imageDataParams) {
                    return outputFn = function(polygons, size) {
                        return polygonsToImageData(polygons, size, imageDataParams);
                    }, go(getInput);
                }, output.toSVG = function() {
                    return outputFn = polygonsToSVG, go(getInput);
                }, output.toData = function() {
                    return outputFn = function(polygons) {
                        return polygons;
                    }, go(getInput);
                }, input.fromImage = function(imageEl) {
                    return inputFn = function() {
                        return fromImageToImageData(imageEl);
                    }, go(getOutput);
                }, getInput();
            };
        }, {
            './defaultParams.js': 1,
            './input/fromBufferToImageData.js': 6,
            './input/fromImageToImageData.js': 7,
            './output/polygonsToDataURL.js': 8,
            './output/polygonsToImageData.js': 9,
            './output/polygonsToSVG.js': 10,
            './util/clamp.js': 15
        } ],
        3: [ function(_dereq_, module, exports) {
            'use strict';
            var Canvas = _dereq_('canvas-browserify');
            module.exports = function(imageData) {
                if ('undefined' == typeof Uint8ClampedArray) {
                    var canvas = Canvas(imageData.width, imageData.height), ctx = canvas.getContext('2d');
                    return ctx.putImageData(imageData, 0, 0), ctx.getImageData(0, 0, imageData.width, imageData.height);
                }
                return {
                    width: imageData.width,
                    height: imageData.height,
                    data: new Uint8ClampedArray(imageData.data)
                };
            };
        }, {
            'canvas-browserify': 22
        } ],
        4: [ function(_dereq_, module, exports) {
            'use strict';
            function detectEdges(imageData, accuracy, edgeSize, divisor) {
                var matrix = getEdgeMatrix(edgeSize).slice(), multiplier = parseInt(10 * (accuracy || .5), 10) || 1;
                divisor = divisor || 1;
                var k, len, divscalar = divisor ? 1 / divisor : 0;
                if (1 !== divscalar) {
                    for (k = 0, len = matrix.length; k < matrix.length; k++) {
                        matrix[k] *= divscalar;
                    }
                }
                var data = imageData.data;
                len = data.length >> 2;
                var copy = new Uint8Array(len);
                for (i = 0; len > i; i++) {
                    copy[i] = data[i << 2];
                }
                var x, y, r, g, b, v, col, row, sx, sy, i, istep, jstep, kstep, width = 0 | imageData.width, height = 0 | imageData.height, size = Math.sqrt(matrix.length), range = .5 * size | 0;
                for (y = 0; height > y; y += multiplier) {
                    for (istep = y * width, x = 0; width > x; x += multiplier) {
                        for (r = g = b = 0, row = -range; range >= row; row++) {
                            if (sy = y + row, jstep = sy * width, kstep = (row + range) * size, sy >= 0 && height > sy) {
                                for (col = -range; range >= col; col++) {
                                    sx = x + col, sx >= 0 && width > sx && (v = matrix[col + range + kstep]) && (r += copy[sx + jstep] * v);
                                }
                            }
                        }
                        0 > r ? r = 0 : r > 255 && (r = 255), data[x + istep << 2] = 255 & r;
                    }
                }
                return imageData;
            }
            function getEdgeMatrix(size) {
                var i, matrix = [], side = 2 * size + 1, len = side * side, center = .5 * len | 0;
                for (i = 0; len > i; i++) {
                    matrix[i] = i === center ? -len + 1 : 1;
                }
                return matrix;
            }
            module.exports = detectEdges;
        }, {} ],
        5: [ function(_dereq_, module, exports) {
            'use strict';
            function greyscale(imageData) {
                for (var len = imageData.data.length, data = imageData.data, brightness = void 0, i = 0; len > i; i += 4) {
                    brightness = .34 * data[i] + .5 * data[i + 1] + .16 * data[i + 2], data[i] = brightness, 
                    data[i + 1] = brightness, data[i + 2] = brightness;
                }
                return imageData.data = data, imageData;
            }
            module.exports = greyscale;
        }, {} ],
        6: [ function(_dereq_, module, exports) {
            (function(Buffer) {
                'use strict';
                var Canvas = _dereq_('canvas-browserify'), Image = Canvas.Image;
                module.exports = function(buffer) {
                    if (buffer instanceof Buffer) {
                        var image = new Image();
                        image.src = buffer;
                        var canvas = new Canvas(image.width, image.height), ctx = canvas.getContext('2d');
                        return ctx.drawImage(image, 0, 0, canvas.width, canvas.height), ctx.getImageData(0, 0, canvas.width, canvas.height);
                    }
                    throw new Error('Can\'t work with the buffer object provided.');
                };
            }).call(this, _dereq_('buffer').Buffer);
        }, {
            buffer: 20,
            'canvas-browserify': 22
        } ],
        7: [ function(_dereq_, module, exports) {
            'use strict';
            var Canvas = _dereq_('canvas-browserify'), Image = Canvas.Image;
            module.exports = function(image) {
                if (image instanceof HTMLImageElement) {
                    if (0 === image.naturalWidth || 0 === image.naturalHeight || image.complete === !1) {
                        throw new Error('This this image hasn\'t finished loading: ' + image.src);
                    }
                    var canvas = new Canvas(image.naturalWidth, image.naturalHeight), ctx = canvas.getContext('2d');
                    return ctx.drawImage(image, 0, 0, canvas.width, canvas.height), ctx.getImageData(0, 0, canvas.width, canvas.height);
                }
                throw new Error('This object does not seem to be an image.');
            };
        }, {
            'canvas-browserify': 22
        } ],
        8: [ function(_dereq_, module, exports) {
            'use strict';
            var Canvas = _dereq_('canvas-browserify'), drawPolygonsOnContext = _dereq_('../util/drawPolygonsOnContext.js');
            module.exports = function(polygons, size, options) {
                var dpr = options && options.dpr ? options.dpr : 1, backgroundColor = options && options.backgroundColor ? options.backgroundColor : !1, canvas = new Canvas(size.width * dpr, size.height * dpr), ctx = canvas.getContext('2d');
                return backgroundColor && (ctx.fillStyle = backgroundColor, ctx.fillRect(0, 0, size.width * dpr, size.height * dpr), 
                ctx.fillStyle = 'transparent'), drawPolygonsOnContext(ctx, polygons, size, dpr), 
                canvas.toDataURL();
            };
        }, {
            '../util/drawPolygonsOnContext.js': 16,
            'canvas-browserify': 22
        } ],
        9: [ function(_dereq_, module, exports) {
            'use strict';
            var Canvas = _dereq_('canvas-browserify'), drawPolygonsOnContext = _dereq_('../util/drawPolygonsOnContext.js');
            module.exports = function(polygons, size, options) {
                var dpr = options && options.dpr ? options.dpr : 1, backgroundColor = options && options.backgroundColor ? options.backgroundColor : !1, canvas = new Canvas(size.width * dpr, size.height * dpr), ctx = canvas.getContext('2d');
                return backgroundColor && (ctx.fillStyle = backgroundColor, ctx.fillRect(0, 0, size.width * dpr, size.height * dpr), 
                ctx.fillStyle = 'transparent'), drawPolygonsOnContext(ctx, polygons, size, dpr), 
                ctx.getImageData(0, 0, size.width * dpr, size.height * dpr);
            };
        }, {
            '../util/drawPolygonsOnContext.js': 16,
            'canvas-browserify': 22
        } ],
        10: [ function(_dereq_, module, exports) {
            'use strict';
            module.exports = function(polygons, size) {
                var svg = '<?xml version="1.0" standalone="yes"?>\n<svg width="' + size.width + '" height="' + size.height + '" xmlns="http://www.w3.org/2000/svg" version="1.1" >\n	';
                return polygons.forEach(function(polygon, index) {
                    var a = polygon.a, b = polygon.b, c = polygon.c;
                    svg += '<polygon points="' + a.x + ',' + a.y + ' ' + b.x + ',' + b.y + ' ' + c.x + ',' + c.y + '"', 
                    svg += polygon.fill ? ' fill="' + polygon.fill + '"' : ' fill="transparent"', polygon.strokeColor && (svg += ' stroke="' + polygon.strokeColor + '" stroke-width="' + polygon.strokeWidth + '" stroke-linejoin="' + polygon.lineJoin + '"'), 
                    svg += '/>\n	';
                }), svg += '\n</svg>';
            };
        }, {} ],
        11: [ function(_dereq_, module, exports) {
            'use strict';
            function addColorToPolygons(polygons, colorData, params) {
                var pixelIndex = 0, polygonCenterX = void 0, polygonCenterY = void 0, fill = params.fill, fillColor = 'string' == typeof fill ? params.fill : !1, stroke = params.stroke, strokeColor = 'string' == typeof stroke ? params.stroke : !1, strokeWidth = params.strokeWidth, lineJoin = params.lineJoin, r = void 0, g = void 0, b = void 0;
                return polygons.forEach(function(polygon, index) {
                    polygonCenterX = .33333 * (polygon.a.x + polygon.b.x + polygon.c.x), polygonCenterY = .33333 * (polygon.a.y + polygon.b.y + polygon.c.y), 
                    pixelIndex = (0 | polygonCenterX) + (0 | polygonCenterY) * colorData.width << 2, 
                    r = colorData.data[pixelIndex], g = colorData.data[pixelIndex + 1], b = colorData.data[pixelIndex + 2], 
                    fill && (polygon.fill = fillColor || 'rgb(' + r + ', ' + g + ', ' + b + ')'), stroke && (strokeColor ? polygon.strokeColor = strokeColor : polygon.strokeColor = 'rgb(' + r + ', ' + g + ', ' + b + ')', 
                    polygon.strokeWidth = strokeWidth, polygon.lineJoin = lineJoin);
                }), polygons;
            }
            module.exports = addColorToPolygons;
        }, {} ],
        12: [ function(_dereq_, module, exports) {
            'use strict';
            function getEdgePoints(imageData, sensitivity, accuracy) {
                var x, y, row, col, sx, sy, step, sum, total, multiplier = parseInt(10 * (accuracy || .1), 10) || 1, edgeDetectValue = sensitivity, width = imageData.width, height = imageData.height, data = imageData.data, points = [];
                for (y = 0; height > y; y += multiplier) {
                    for (x = 0; width > x; x += multiplier) {
                        for (sum = total = 0, row = -1; 1 >= row; row++) {
                            if (sy = y + row, step = sy * width, sy >= 0 && height > sy) {
                                for (col = -1; 1 >= col; col++) {
                                    sx = x + col, sx >= 0 && width > sx && (sum += data[sx + step << 2], total++);
                                }
                            }
                        }
                        total && (sum /= total), sum > edgeDetectValue && points.push({
                            x: x,
                            y: y
                        });
                    }
                }
                return points;
            }
            module.exports = getEdgePoints;
        }, {} ],
        13: [ function(_dereq_, module, exports) {
            'use strict';
            function sortByArea(a, b) {
                return a.x * a.y - b.y * b.x;
            }
            function getVerticesFromPoints(points, maxPointCount, accuracy, width, height) {
                var result = [], sidePointCount = 2 * Math.ceil(width / (100 - accuracy)) + 2 * Math.ceil(height / (100 - accuracy)) + 2, pointCount = Math.max(points.length, maxPointCount), randomPointCount = clamp(pointCount - sidePointCount, 0, maxPointCount - sidePointCount), increment = pointCount / randomPointCount, i = 0, x = 0, y = 0, len = 0;
                for (points.sort(sortByArea), i = 0, len = pointCount; len > i; i += increment) {
                    result.push({
                        x: points[~~i].x,
                        y: points[~~i].y
                    });
                }
                for (x = 0; width > x; x += 100 - accuracy) {
                    result.push({
                        x: ~~x,
                        y: 0
                    }), result.push({
                        x: ~~x,
                        y: height
                    });
                }
                for (y = 0; height > y; y += 100 - accuracy) {
                    result.push({
                        x: 0,
                        y: ~~y
                    }), result.push({
                        x: width,
                        y: ~~y
                    });
                }
                return result.push({
                    x: 0,
                    y: height
                }), result.push({
                    x: width,
                    y: height
                }), points = null, result;
            }
            var clamp = _dereq_('../util/clamp.js');
            module.exports = getVerticesFromPoints;
        }, {
            '../util/clamp.js': 15
        } ],
        14: [ function(_dereq_, module, exports) {
            'use strict';
            var stackBlur = _dereq_('stackblur-canvas'), delaunay = _dereq_('delaunay-fast'), isImageData = _dereq_('../util/isImageData.js'), copyImageData = _dereq_('../imagedata/copyImageData.js'), greyscale = _dereq_('../imagedata/greyscale'), detectEdges = _dereq_('../imagedata/detectEdges'), getEdgePoints = _dereq_('./getEdgePoints.js'), getVerticesFromPoints = _dereq_('./getVerticesFromPoints.js'), addColorToPolygons = _dereq_('./addColorToPolygons.js');
            module.exports = function(imageData, params) {
                if (isImageData(imageData)) {
                    var imageSize = {
                        width: imageData.width,
                        height: imageData.height
                    }, tmpImageData = copyImageData(imageData), colorImageData = copyImageData(imageData);
                    'undefined' != typeof Uint8ClampedArray ? (tmpImageData = copyImageData(imageData), 
                    colorImageData = copyImageData(imageData)) : (tmpImageData = imageData, colorImageData = imageData);
                    var blurredImageData = stackBlur.imageDataRGBA(tmpImageData, 0, 0, imageSize.width, imageSize.height, params.blur), greyscaleImageData = greyscale(blurredImageData), edgesImageData = detectEdges(greyscaleImageData), edgePoints = getEdgePoints(edgesImageData, 50, params.accuracy), edgeVertices = getVerticesFromPoints(edgePoints, params.vertexCount, params.accuracy, imageSize.width, imageSize.height), polygons = delaunay.triangulate(edgeVertices);
                    return addColorToPolygons(polygons, colorImageData, params);
                }
                throw new Error('Can\'t work with the imageData provided. It seems to be corrupt');
            };
        }, {
            '../imagedata/copyImageData.js': 3,
            '../imagedata/detectEdges': 4,
            '../imagedata/greyscale': 5,
            '../util/isImageData.js': 17,
            './addColorToPolygons.js': 11,
            './getEdgePoints.js': 12,
            './getVerticesFromPoints.js': 13,
            'delaunay-fast': 23,
            'stackblur-canvas': 25
        } ],
        15: [ function(_dereq_, module, exports) {
            'use strict';
            function clamp(value, min, max) {
                return min > value ? min : value > max ? max : value;
            }
            module.exports = clamp;
        }, {} ],
        16: [ function(_dereq_, module, exports) {
            'use strict';
            module.exports = function(ctx, polygons, size, dpr) {
                return dpr = dpr || 1, polygons.forEach(function(polygon, index) {
                    ctx.beginPath(), ctx.moveTo(polygon.a.x * dpr, polygon.a.y * dpr), ctx.lineTo(polygon.b.x * dpr, polygon.b.y * dpr), 
                    ctx.lineTo(polygon.c.x * dpr, polygon.c.y * dpr), ctx.lineTo(polygon.a.x * dpr, polygon.a.y * dpr), 
                    polygon.fill && (ctx.fillStyle = polygon.fill, ctx.fill()), polygon.strokeColor && (ctx.strokeStyle = polygon.strokeColor, 
                    ctx.lineWidth = polygon.strokeWidth * dpr, ctx.lineJoin = polygon.lineJoin, ctx.stroke()), 
                    ctx.closePath();
                }), ctx;
            };
        }, {} ],
        17: [ function(_dereq_, module, exports) {
            'use strict';
            module.exports = function(imageData) {
                return imageData && 'number' == typeof imageData.width && 'number' == typeof imageData.height && imageData.data && 'number' == typeof imageData.data.length;
            };
        }, {} ],
        18: [ function(_dereq_, module, exports) {
            'use strict';
            function triangulate(params) {
                return getInterfaceObj(params, imageDataToPolygons);
            }
            Object.defineProperty(exports, '__esModule', {
                value: !0
            }), exports['default'] = triangulate;
            var getInterfaceObj = _dereq_('./getInterfaceObj'), imageDataToPolygons = _dereq_('./polygons/imageDataToPolygons.js');
            module.exports = exports['default'];
        }, {
            './getInterfaceObj': 2,
            './polygons/imageDataToPolygons.js': 14
        } ],
        19: [ function(_dereq_, module, exports) {
            var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
            (function(exports) {
                'use strict';
                var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;
                var PLUS = '+'.charCodeAt(0);
                var SLASH = '/'.charCodeAt(0);
                var NUMBER = '0'.charCodeAt(0);
                var LOWER = 'a'.charCodeAt(0);
                var UPPER = 'A'.charCodeAt(0);
                var PLUS_URL_SAFE = '-'.charCodeAt(0);
                var SLASH_URL_SAFE = '_'.charCodeAt(0);
                function decode(elt) {
                    var code = elt.charCodeAt(0);
                    if (code === PLUS || code === PLUS_URL_SAFE) {
                        return 62;
                    }
                    if (code === SLASH || code === SLASH_URL_SAFE) {
                        return 63;
                    }
                    if (code < NUMBER) {
                        return -1;
                    }
                    if (code < NUMBER + 10) {
                        return code - NUMBER + 26 + 26;
                    }
                    if (code < UPPER + 26) {
                        return code - UPPER;
                    }
                    if (code < LOWER + 26) {
                        return code - LOWER + 26;
                    }
                }
                function b64ToByteArray(b64) {
                    var i, j, l, tmp, placeHolders, arr;
                    if (b64.length % 4 > 0) {
                        throw new Error('Invalid string. Length must be a multiple of 4');
                    }
                    var len = b64.length;
                    placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0;
                    arr = new Arr(b64.length * 3 / 4 - placeHolders);
                    l = placeHolders > 0 ? b64.length - 4 : b64.length;
                    var L = 0;
                    function push(v) {
                        arr[L++] = v;
                    }
                    for (i = 0, j = 0; i < l; i += 4, j += 3) {
                        tmp = decode(b64.charAt(i)) << 18 | decode(b64.charAt(i + 1)) << 12 | decode(b64.charAt(i + 2)) << 6 | decode(b64.charAt(i + 3));
                        push((tmp & 16711680) >> 16);
                        push((tmp & 65280) >> 8);
                        push(tmp & 255);
                    }
                    if (placeHolders === 2) {
                        tmp = decode(b64.charAt(i)) << 2 | decode(b64.charAt(i + 1)) >> 4;
                        push(tmp & 255);
                    } else {
                        if (placeHolders === 1) {
                            tmp = decode(b64.charAt(i)) << 10 | decode(b64.charAt(i + 1)) << 4 | decode(b64.charAt(i + 2)) >> 2;
                            push(tmp >> 8 & 255);
                            push(tmp & 255);
                        }
                    }
                    return arr;
                }
                function uint8ToBase64(uint8) {
                    var i, extraBytes = uint8.length % 3, output = '', temp, length;
                    function encode(num) {
                        return lookup.charAt(num);
                    }
                    function tripletToBase64(num) {
                        return encode(num >> 18 & 63) + encode(num >> 12 & 63) + encode(num >> 6 & 63) + encode(num & 63);
                    }
                    for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
                        temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + uint8[i + 2];
                        output += tripletToBase64(temp);
                    }
                    switch (extraBytes) {
                      case 1:
                        temp = uint8[uint8.length - 1];
                        output += encode(temp >> 2);
                        output += encode(temp << 4 & 63);
                        output += '==';
                        break;

                      case 2:
                        temp = (uint8[uint8.length - 2] << 8) + uint8[uint8.length - 1];
                        output += encode(temp >> 10);
                        output += encode(temp >> 4 & 63);
                        output += encode(temp << 2 & 63);
                        output += '=';
                        break;
                    }
                    return output;
                }
                exports.toByteArray = b64ToByteArray;
                exports.fromByteArray = uint8ToBase64;
            })(typeof exports === 'undefined' ? this.base64js = {} : exports);
        }, {} ],
        20: [ function(_dereq_, module, exports) {
            (function(global) {
                'use strict';
                var base64 = _dereq_('base64-js');
                var ieee754 = _dereq_('ieee754');
                var isArray = _dereq_('isarray');
                exports.Buffer = Buffer;
                exports.SlowBuffer = SlowBuffer;
                exports.INSPECT_MAX_BYTES = 50;
                Buffer.poolSize = 8192;
                var rootParent = {};
                Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined ? global.TYPED_ARRAY_SUPPORT : typedArraySupport();
                function typedArraySupport() {
                    function Bar() {}
                    try {
                        var arr = new Uint8Array(1);
                        arr.foo = function() {
                            return 42;
                        };
                        arr.constructor = Bar;
                        return arr.foo() === 42 && arr.constructor === Bar && typeof arr.subarray === 'function' && arr.subarray(1, 1).byteLength === 0;
                    } catch (e) {
                        return false;
                    }
                }
                function kMaxLength() {
                    return Buffer.TYPED_ARRAY_SUPPORT ? 2147483647 : 1073741823;
                }
                function Buffer(arg) {
                    if (!(this instanceof Buffer)) {
                        if (arguments.length > 1) {
                            return new Buffer(arg, arguments[1]);
                        }
                        return new Buffer(arg);
                    }
                    if (!Buffer.TYPED_ARRAY_SUPPORT) {
                        this.length = 0;
                        this.parent = undefined;
                    }
                    if (typeof arg === 'number') {
                        return fromNumber(this, arg);
                    }
                    if (typeof arg === 'string') {
                        return fromString(this, arg, arguments.length > 1 ? arguments[1] : 'utf8');
                    }
                    return fromObject(this, arg);
                }
                function fromNumber(that, length) {
                    that = allocate(that, length < 0 ? 0 : checked(length) | 0);
                    if (!Buffer.TYPED_ARRAY_SUPPORT) {
                        for (var i = 0; i < length; i++) {
                            that[i] = 0;
                        }
                    }
                    return that;
                }
                function fromString(that, string, encoding) {
                    if (typeof encoding !== 'string' || encoding === '') {
                        encoding = 'utf8';
                    }
                    var length = byteLength(string, encoding) | 0;
                    that = allocate(that, length);
                    that.write(string, encoding);
                    return that;
                }
                function fromObject(that, object) {
                    if (Buffer.isBuffer(object)) {
                        return fromBuffer(that, object);
                    }
                    if (isArray(object)) {
                        return fromArray(that, object);
                    }
                    if (object == null) {
                        throw new TypeError('must start with number, buffer, array or string');
                    }
                    if (typeof ArrayBuffer !== 'undefined') {
                        if (object.buffer instanceof ArrayBuffer) {
                            return fromTypedArray(that, object);
                        }
                        if (object instanceof ArrayBuffer) {
                            return fromArrayBuffer(that, object);
                        }
                    }
                    if (object.length) {
                        return fromArrayLike(that, object);
                    }
                    return fromJsonObject(that, object);
                }
                function fromBuffer(that, buffer) {
                    var length = checked(buffer.length) | 0;
                    that = allocate(that, length);
                    buffer.copy(that, 0, 0, length);
                    return that;
                }
                function fromArray(that, array) {
                    var length = checked(array.length) | 0;
                    that = allocate(that, length);
                    for (var i = 0; i < length; i += 1) {
                        that[i] = array[i] & 255;
                    }
                    return that;
                }
                function fromTypedArray(that, array) {
                    var length = checked(array.length) | 0;
                    that = allocate(that, length);
                    for (var i = 0; i < length; i += 1) {
                        that[i] = array[i] & 255;
                    }
                    return that;
                }
                function fromArrayBuffer(that, array) {
                    if (Buffer.TYPED_ARRAY_SUPPORT) {
                        array.byteLength;
                        that = Buffer._augment(new Uint8Array(array));
                    } else {
                        that = fromTypedArray(that, new Uint8Array(array));
                    }
                    return that;
                }
                function fromArrayLike(that, array) {
                    var length = checked(array.length) | 0;
                    that = allocate(that, length);
                    for (var i = 0; i < length; i += 1) {
                        that[i] = array[i] & 255;
                    }
                    return that;
                }
                function fromJsonObject(that, object) {
                    var array;
                    var length = 0;
                    if (object.type === 'Buffer' && isArray(object.data)) {
                        array = object.data;
                        length = checked(array.length) | 0;
                    }
                    that = allocate(that, length);
                    for (var i = 0; i < length; i += 1) {
                        that[i] = array[i] & 255;
                    }
                    return that;
                }
                if (Buffer.TYPED_ARRAY_SUPPORT) {
                    Buffer.prototype.__proto__ = Uint8Array.prototype;
                    Buffer.__proto__ = Uint8Array;
                } else {
                    Buffer.prototype.length = undefined;
                    Buffer.prototype.parent = undefined;
                }
                function allocate(that, length) {
                    if (Buffer.TYPED_ARRAY_SUPPORT) {
                        that = Buffer._augment(new Uint8Array(length));
                        that.__proto__ = Buffer.prototype;
                    } else {
                        that.length = length;
                        that._isBuffer = true;
                    }
                    var fromPool = length !== 0 && length <= Buffer.poolSize >>> 1;
                    if (fromPool) {
                        that.parent = rootParent;
                    }
                    return that;
                }
                function checked(length) {
                    if (length >= kMaxLength()) {
                        throw new RangeError('Attempt to allocate Buffer larger than maximum ' + 'size: 0x' + kMaxLength().toString(16) + ' bytes');
                    }
                    return length | 0;
                }
                function SlowBuffer(subject, encoding) {
                    if (!(this instanceof SlowBuffer)) {
                        return new SlowBuffer(subject, encoding);
                    }
                    var buf = new Buffer(subject, encoding);
                    delete buf.parent;
                    return buf;
                }
                Buffer.isBuffer = function isBuffer(b) {
                    return !!(b != null && b._isBuffer);
                };
                Buffer.compare = function compare(a, b) {
                    if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
                        throw new TypeError('Arguments must be Buffers');
                    }
                    if (a === b) {
                        return 0;
                    }
                    var x = a.length;
                    var y = b.length;
                    var i = 0;
                    var len = Math.min(x, y);
                    while (i < len) {
                        if (a[i] !== b[i]) {
                            break;
                        }
                        ++i;
                    }
                    if (i !== len) {
                        x = a[i];
                        y = b[i];
                    }
                    if (x < y) {
                        return -1;
                    }
                    if (y < x) {
                        return 1;
                    }
                    return 0;
                };
                Buffer.isEncoding = function isEncoding(encoding) {
                    switch (String(encoding).toLowerCase()) {
                      case 'hex':
                      case 'utf8':
                      case 'utf-8':
                      case 'ascii':
                      case 'binary':
                      case 'base64':
                      case 'raw':
                      case 'ucs2':
                      case 'ucs-2':
                      case 'utf16le':
                      case 'utf-16le':
                        return true;

                      default:
                        return false;
                    }
                };
                Buffer.concat = function concat(list, length) {
                    if (!isArray(list)) {
                        throw new TypeError('list argument must be an Array of Buffers.');
                    }
                    if (list.length === 0) {
                        return new Buffer(0);
                    }
                    var i;
                    if (length === undefined) {
                        length = 0;
                        for (i = 0; i < list.length; i++) {
                            length += list[i].length;
                        }
                    }
                    var buf = new Buffer(length);
                    var pos = 0;
                    for (i = 0; i < list.length; i++) {
                        var item = list[i];
                        item.copy(buf, pos);
                        pos += item.length;
                    }
                    return buf;
                };
                function byteLength(string, encoding) {
                    if (typeof string !== 'string') {
                        string = '' + string;
                    }
                    var len = string.length;
                    if (len === 0) {
                        return 0;
                    }
                    var loweredCase = false;
                    for (;;) {
                        switch (encoding) {
                          case 'ascii':
                          case 'binary':
                          case 'raw':
                          case 'raws':
                            return len;

                          case 'utf8':
                          case 'utf-8':
                            return utf8ToBytes(string).length;

                          case 'ucs2':
                          case 'ucs-2':
                          case 'utf16le':
                          case 'utf-16le':
                            return len * 2;

                          case 'hex':
                            return len >>> 1;

                          case 'base64':
                            return base64ToBytes(string).length;

                          default:
                            if (loweredCase) {
                                return utf8ToBytes(string).length;
                            }
                            encoding = ('' + encoding).toLowerCase();
                            loweredCase = true;
                        }
                    }
                }
                Buffer.byteLength = byteLength;
                function slowToString(encoding, start, end) {
                    var loweredCase = false;
                    start = start | 0;
                    end = end === undefined || end === Infinity ? this.length : end | 0;
                    if (!encoding) {
                        encoding = 'utf8';
                    }
                    if (start < 0) {
                        start = 0;
                    }
                    if (end > this.length) {
                        end = this.length;
                    }
                    if (end <= start) {
                        return '';
                    }
                    while (true) {
                        switch (encoding) {
                          case 'hex':
                            return hexSlice(this, start, end);

                          case 'utf8':
                          case 'utf-8':
                            return utf8Slice(this, start, end);

                          case 'ascii':
                            return asciiSlice(this, start, end);

                          case 'binary':
                            return binarySlice(this, start, end);

                          case 'base64':
                            return base64Slice(this, start, end);

                          case 'ucs2':
                          case 'ucs-2':
                          case 'utf16le':
                          case 'utf-16le':
                            return utf16leSlice(this, start, end);

                          default:
                            if (loweredCase) {
                                throw new TypeError('Unknown encoding: ' + encoding);
                            }
                            encoding = (encoding + '').toLowerCase();
                            loweredCase = true;
                        }
                    }
                }
                Buffer.prototype.toString = function toString() {
                    var length = this.length | 0;
                    if (length === 0) {
                        return '';
                    }
                    if (arguments.length === 0) {
                        return utf8Slice(this, 0, length);
                    }
                    return slowToString.apply(this, arguments);
                };
                Buffer.prototype.equals = function equals(b) {
                    if (!Buffer.isBuffer(b)) {
                        throw new TypeError('Argument must be a Buffer');
                    }
                    if (this === b) {
                        return true;
                    }
                    return Buffer.compare(this, b) === 0;
                };
                Buffer.prototype.inspect = function inspect() {
                    var str = '';
                    var max = exports.INSPECT_MAX_BYTES;
                    if (this.length > 0) {
                        str = this.toString('hex', 0, max).match(/.{2}/g).join(' ');
                        if (this.length > max) {
                            str += ' ... ';
                        }
                    }
                    return '<Buffer ' + str + '>';
                };
                Buffer.prototype.compare = function compare(b) {
                    if (!Buffer.isBuffer(b)) {
                        throw new TypeError('Argument must be a Buffer');
                    }
                    if (this === b) {
                        return 0;
                    }
                    return Buffer.compare(this, b);
                };
                Buffer.prototype.indexOf = function indexOf(val, byteOffset) {
                    if (byteOffset > 2147483647) {
                        byteOffset = 2147483647;
                    } else {
                        if (byteOffset < -2147483648) {
                            byteOffset = -2147483648;
                        }
                    }
                    byteOffset >>= 0;
                    if (this.length === 0) {
                        return -1;
                    }
                    if (byteOffset >= this.length) {
                        return -1;
                    }
                    if (byteOffset < 0) {
                        byteOffset = Math.max(this.length + byteOffset, 0);
                    }
                    if (typeof val === 'string') {
                        if (val.length === 0) {
                            return -1;
                        }
                        return String.prototype.indexOf.call(this, val, byteOffset);
                    }
                    if (Buffer.isBuffer(val)) {
                        return arrayIndexOf(this, val, byteOffset);
                    }
                    if (typeof val === 'number') {
                        if (Buffer.TYPED_ARRAY_SUPPORT && Uint8Array.prototype.indexOf === 'function') {
                            return Uint8Array.prototype.indexOf.call(this, val, byteOffset);
                        }
                        return arrayIndexOf(this, [ val ], byteOffset);
                    }
                    function arrayIndexOf(arr, val, byteOffset) {
                        var foundIndex = -1;
                        for (var i = 0; byteOffset + i < arr.length; i++) {
                            if (arr[byteOffset + i] === val[foundIndex === -1 ? 0 : i - foundIndex]) {
                                if (foundIndex === -1) {
                                    foundIndex = i;
                                }
                                if (i - foundIndex + 1 === val.length) {
                                    return byteOffset + foundIndex;
                                }
                            } else {
                                foundIndex = -1;
                            }
                        }
                        return -1;
                    }
                    throw new TypeError('val must be string, number or Buffer');
                };
                Buffer.prototype.get = function get(offset) {
                    console.log('.get() is deprecated. Access using array indexes instead.');
                    return this.readUInt8(offset);
                };
                Buffer.prototype.set = function set(v, offset) {
                    console.log('.set() is deprecated. Access using array indexes instead.');
                    return this.writeUInt8(v, offset);
                };
                function hexWrite(buf, string, offset, length) {
                    offset = Number(offset) || 0;
                    var remaining = buf.length - offset;
                    if (!length) {
                        length = remaining;
                    } else {
                        length = Number(length);
                        if (length > remaining) {
                            length = remaining;
                        }
                    }
                    var strLen = string.length;
                    if (strLen % 2 !== 0) {
                        throw new Error('Invalid hex string');
                    }
                    if (length > strLen / 2) {
                        length = strLen / 2;
                    }
                    for (var i = 0; i < length; i++) {
                        var parsed = parseInt(string.substr(i * 2, 2), 16);
                        if (isNaN(parsed)) {
                            throw new Error('Invalid hex string');
                        }
                        buf[offset + i] = parsed;
                    }
                    return i;
                }
                function utf8Write(buf, string, offset, length) {
                    return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length);
                }
                function asciiWrite(buf, string, offset, length) {
                    return blitBuffer(asciiToBytes(string), buf, offset, length);
                }
                function binaryWrite(buf, string, offset, length) {
                    return asciiWrite(buf, string, offset, length);
                }
                function base64Write(buf, string, offset, length) {
                    return blitBuffer(base64ToBytes(string), buf, offset, length);
                }
                function ucs2Write(buf, string, offset, length) {
                    return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length);
                }
                Buffer.prototype.write = function write(string, offset, length, encoding) {
                    if (offset === undefined) {
                        encoding = 'utf8';
                        length = this.length;
                        offset = 0;
                    } else {
                        if (length === undefined && typeof offset === 'string') {
                            encoding = offset;
                            length = this.length;
                            offset = 0;
                        } else {
                            if (isFinite(offset)) {
                                offset = offset | 0;
                                if (isFinite(length)) {
                                    length = length | 0;
                                    if (encoding === undefined) {
                                        encoding = 'utf8';
                                    }
                                } else {
                                    encoding = length;
                                    length = undefined;
                                }
                            } else {
                                var swap = encoding;
                                encoding = offset;
                                offset = length | 0;
                                length = swap;
                            }
                        }
                    }
                    var remaining = this.length - offset;
                    if (length === undefined || length > remaining) {
                        length = remaining;
                    }
                    if (string.length > 0 && (length < 0 || offset < 0) || offset > this.length) {
                        throw new RangeError('attempt to write outside buffer bounds');
                    }
                    if (!encoding) {
                        encoding = 'utf8';
                    }
                    var loweredCase = false;
                    for (;;) {
                        switch (encoding) {
                          case 'hex':
                            return hexWrite(this, string, offset, length);

                          case 'utf8':
                          case 'utf-8':
                            return utf8Write(this, string, offset, length);

                          case 'ascii':
                            return asciiWrite(this, string, offset, length);

                          case 'binary':
                            return binaryWrite(this, string, offset, length);

                          case 'base64':
                            return base64Write(this, string, offset, length);

                          case 'ucs2':
                          case 'ucs-2':
                          case 'utf16le':
                          case 'utf-16le':
                            return ucs2Write(this, string, offset, length);

                          default:
                            if (loweredCase) {
                                throw new TypeError('Unknown encoding: ' + encoding);
                            }
                            encoding = ('' + encoding).toLowerCase();
                            loweredCase = true;
                        }
                    }
                };
                Buffer.prototype.toJSON = function toJSON() {
                    return {
                        type: 'Buffer',
                        data: Array.prototype.slice.call(this._arr || this, 0)
                    };
                };
                function base64Slice(buf, start, end) {
                    if (start === 0 && end === buf.length) {
                        return base64.fromByteArray(buf);
                    } else {
                        return base64.fromByteArray(buf.slice(start, end));
                    }
                }
                function utf8Slice(buf, start, end) {
                    end = Math.min(buf.length, end);
                    var res = [];
                    var i = start;
                    while (i < end) {
                        var firstByte = buf[i];
                        var codePoint = null;
                        var bytesPerSequence = firstByte > 239 ? 4 : firstByte > 223 ? 3 : firstByte > 191 ? 2 : 1;
                        if (i + bytesPerSequence <= end) {
                            var secondByte, thirdByte, fourthByte, tempCodePoint;
                            switch (bytesPerSequence) {
                              case 1:
                                if (firstByte < 128) {
                                    codePoint = firstByte;
                                }
                                break;

                              case 2:
                                secondByte = buf[i + 1];
                                if ((secondByte & 192) === 128) {
                                    tempCodePoint = (firstByte & 31) << 6 | secondByte & 63;
                                    if (tempCodePoint > 127) {
                                        codePoint = tempCodePoint;
                                    }
                                }
                                break;

                              case 3:
                                secondByte = buf[i + 1];
                                thirdByte = buf[i + 2];
                                if ((secondByte & 192) === 128 && (thirdByte & 192) === 128) {
                                    tempCodePoint = (firstByte & 15) << 12 | (secondByte & 63) << 6 | thirdByte & 63;
                                    if (tempCodePoint > 2047 && (tempCodePoint < 55296 || tempCodePoint > 57343)) {
                                        codePoint = tempCodePoint;
                                    }
                                }
                                break;

                              case 4:
                                secondByte = buf[i + 1];
                                thirdByte = buf[i + 2];
                                fourthByte = buf[i + 3];
                                if ((secondByte & 192) === 128 && (thirdByte & 192) === 128 && (fourthByte & 192) === 128) {
                                    tempCodePoint = (firstByte & 15) << 18 | (secondByte & 63) << 12 | (thirdByte & 63) << 6 | fourthByte & 63;
                                    if (tempCodePoint > 65535 && tempCodePoint < 1114112) {
                                        codePoint = tempCodePoint;
                                    }
                                }
                            }
                        }
                        if (codePoint === null) {
                            codePoint = 65533;
                            bytesPerSequence = 1;
                        } else {
                            if (codePoint > 65535) {
                                codePoint -= 65536;
                                res.push(codePoint >>> 10 & 1023 | 55296);
                                codePoint = 56320 | codePoint & 1023;
                            }
                        }
                        res.push(codePoint);
                        i += bytesPerSequence;
                    }
                    return decodeCodePointsArray(res);
                }
                var MAX_ARGUMENTS_LENGTH = 4096;
                function decodeCodePointsArray(codePoints) {
                    var len = codePoints.length;
                    if (len <= MAX_ARGUMENTS_LENGTH) {
                        return String.fromCharCode.apply(String, codePoints);
                    }
                    var res = '';
                    var i = 0;
                    while (i < len) {
                        res += String.fromCharCode.apply(String, codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH));
                    }
                    return res;
                }
                function asciiSlice(buf, start, end) {
                    var ret = '';
                    end = Math.min(buf.length, end);
                    for (var i = start; i < end; i++) {
                        ret += String.fromCharCode(buf[i] & 127);
                    }
                    return ret;
                }
                function binarySlice(buf, start, end) {
                    var ret = '';
                    end = Math.min(buf.length, end);
                    for (var i = start; i < end; i++) {
                        ret += String.fromCharCode(buf[i]);
                    }
                    return ret;
                }
                function hexSlice(buf, start, end) {
                    var len = buf.length;
                    if (!start || start < 0) {
                        start = 0;
                    }
                    if (!end || end < 0 || end > len) {
                        end = len;
                    }
                    var out = '';
                    for (var i = start; i < end; i++) {
                        out += toHex(buf[i]);
                    }
                    return out;
                }
                function utf16leSlice(buf, start, end) {
                    var bytes = buf.slice(start, end);
                    var res = '';
                    for (var i = 0; i < bytes.length; i += 2) {
                        res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
                    }
                    return res;
                }
                Buffer.prototype.slice = function slice(start, end) {
                    var len = this.length;
                    start = ~~start;
                    end = end === undefined ? len : ~~end;
                    if (start < 0) {
                        start += len;
                        if (start < 0) {
                            start = 0;
                        }
                    } else {
                        if (start > len) {
                            start = len;
                        }
                    }
                    if (end < 0) {
                        end += len;
                        if (end < 0) {
                            end = 0;
                        }
                    } else {
                        if (end > len) {
                            end = len;
                        }
                    }
                    if (end < start) {
                        end = start;
                    }
                    var newBuf;
                    if (Buffer.TYPED_ARRAY_SUPPORT) {
                        newBuf = Buffer._augment(this.subarray(start, end));
                    } else {
                        var sliceLen = end - start;
                        newBuf = new Buffer(sliceLen, undefined);
                        for (var i = 0; i < sliceLen; i++) {
                            newBuf[i] = this[i + start];
                        }
                    }
                    if (newBuf.length) {
                        newBuf.parent = this.parent || this;
                    }
                    return newBuf;
                };
                function checkOffset(offset, ext, length) {
                    if (offset % 1 !== 0 || offset < 0) {
                        throw new RangeError('offset is not uint');
                    }
                    if (offset + ext > length) {
                        throw new RangeError('Trying to access beyond buffer length');
                    }
                }
                Buffer.prototype.readUIntLE = function readUIntLE(offset, byteLength, noAssert) {
                    offset = offset | 0;
                    byteLength = byteLength | 0;
                    if (!noAssert) {
                        checkOffset(offset, byteLength, this.length);
                    }
                    var val = this[offset];
                    var mul = 1;
                    var i = 0;
                    while (++i < byteLength && (mul *= 256)) {
                        val += this[offset + i] * mul;
                    }
                    return val;
                };
                Buffer.prototype.readUIntBE = function readUIntBE(offset, byteLength, noAssert) {
                    offset = offset | 0;
                    byteLength = byteLength | 0;
                    if (!noAssert) {
                        checkOffset(offset, byteLength, this.length);
                    }
                    var val = this[offset + --byteLength];
                    var mul = 1;
                    while (byteLength > 0 && (mul *= 256)) {
                        val += this[offset + --byteLength] * mul;
                    }
                    return val;
                };
                Buffer.prototype.readUInt8 = function readUInt8(offset, noAssert) {
                    if (!noAssert) {
                        checkOffset(offset, 1, this.length);
                    }
                    return this[offset];
                };
                Buffer.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
                    if (!noAssert) {
                        checkOffset(offset, 2, this.length);
                    }
                    return this[offset] | this[offset + 1] << 8;
                };
                Buffer.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
                    if (!noAssert) {
                        checkOffset(offset, 2, this.length);
                    }
                    return this[offset] << 8 | this[offset + 1];
                };
                Buffer.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
                    if (!noAssert) {
                        checkOffset(offset, 4, this.length);
                    }
                    return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + this[offset + 3] * 16777216;
                };
                Buffer.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
                    if (!noAssert) {
                        checkOffset(offset, 4, this.length);
                    }
                    return this[offset] * 16777216 + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
                };
                Buffer.prototype.readIntLE = function readIntLE(offset, byteLength, noAssert) {
                    offset = offset | 0;
                    byteLength = byteLength | 0;
                    if (!noAssert) {
                        checkOffset(offset, byteLength, this.length);
                    }
                    var val = this[offset];
                    var mul = 1;
                    var i = 0;
                    while (++i < byteLength && (mul *= 256)) {
                        val += this[offset + i] * mul;
                    }
                    mul *= 128;
                    if (val >= mul) {
                        val -= Math.pow(2, 8 * byteLength);
                    }
                    return val;
                };
                Buffer.prototype.readIntBE = function readIntBE(offset, byteLength, noAssert) {
                    offset = offset | 0;
                    byteLength = byteLength | 0;
                    if (!noAssert) {
                        checkOffset(offset, byteLength, this.length);
                    }
                    var i = byteLength;
                    var mul = 1;
                    var val = this[offset + --i];
                    while (i > 0 && (mul *= 256)) {
                        val += this[offset + --i] * mul;
                    }
                    mul *= 128;
                    if (val >= mul) {
                        val -= Math.pow(2, 8 * byteLength);
                    }
                    return val;
                };
                Buffer.prototype.readInt8 = function readInt8(offset, noAssert) {
                    if (!noAssert) {
                        checkOffset(offset, 1, this.length);
                    }
                    if (!(this[offset] & 128)) {
                        return this[offset];
                    }
                    return (255 - this[offset] + 1) * -1;
                };
                Buffer.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
                    if (!noAssert) {
                        checkOffset(offset, 2, this.length);
                    }
                    var val = this[offset] | this[offset + 1] << 8;
                    return val & 32768 ? val | 4294901760 : val;
                };
                Buffer.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
                    if (!noAssert) {
                        checkOffset(offset, 2, this.length);
                    }
                    var val = this[offset + 1] | this[offset] << 8;
                    return val & 32768 ? val | 4294901760 : val;
                };
                Buffer.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
                    if (!noAssert) {
                        checkOffset(offset, 4, this.length);
                    }
                    return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
                };
                Buffer.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
                    if (!noAssert) {
                        checkOffset(offset, 4, this.length);
                    }
                    return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
                };
                Buffer.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
                    if (!noAssert) {
                        checkOffset(offset, 4, this.length);
                    }
                    return ieee754.read(this, offset, true, 23, 4);
                };
                Buffer.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
                    if (!noAssert) {
                        checkOffset(offset, 4, this.length);
                    }
                    return ieee754.read(this, offset, false, 23, 4);
                };
                Buffer.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
                    if (!noAssert) {
                        checkOffset(offset, 8, this.length);
                    }
                    return ieee754.read(this, offset, true, 52, 8);
                };
                Buffer.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
                    if (!noAssert) {
                        checkOffset(offset, 8, this.length);
                    }
                    return ieee754.read(this, offset, false, 52, 8);
                };
                function checkInt(buf, value, offset, ext, max, min) {
                    if (!Buffer.isBuffer(buf)) {
                        throw new TypeError('buffer must be a Buffer instance');
                    }
                    if (value > max || value < min) {
                        throw new RangeError('value is out of bounds');
                    }
                    if (offset + ext > buf.length) {
                        throw new RangeError('index out of range');
                    }
                }
                Buffer.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength, noAssert) {
                    value = +value;
                    offset = offset | 0;
                    byteLength = byteLength | 0;
                    if (!noAssert) {
                        checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0);
                    }
                    var mul = 1;
                    var i = 0;
                    this[offset] = value & 255;
                    while (++i < byteLength && (mul *= 256)) {
                        this[offset + i] = value / mul & 255;
                    }
                    return offset + byteLength;
                };
                Buffer.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength, noAssert) {
                    value = +value;
                    offset = offset | 0;
                    byteLength = byteLength | 0;
                    if (!noAssert) {
                        checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0);
                    }
                    var i = byteLength - 1;
                    var mul = 1;
                    this[offset + i] = value & 255;
                    while (--i >= 0 && (mul *= 256)) {
                        this[offset + i] = value / mul & 255;
                    }
                    return offset + byteLength;
                };
                Buffer.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
                    value = +value;
                    offset = offset | 0;
                    if (!noAssert) {
                        checkInt(this, value, offset, 1, 255, 0);
                    }
                    if (!Buffer.TYPED_ARRAY_SUPPORT) {
                        value = Math.floor(value);
                    }
                    this[offset] = value & 255;
                    return offset + 1;
                };
                function objectWriteUInt16(buf, value, offset, littleEndian) {
                    if (value < 0) {
                        value = 65535 + value + 1;
                    }
                    for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; i++) {
                        buf[offset + i] = (value & 255 << 8 * (littleEndian ? i : 1 - i)) >>> (littleEndian ? i : 1 - i) * 8;
                    }
                }
                Buffer.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
                    value = +value;
                    offset = offset | 0;
                    if (!noAssert) {
                        checkInt(this, value, offset, 2, 65535, 0);
                    }
                    if (Buffer.TYPED_ARRAY_SUPPORT) {
                        this[offset] = value & 255;
                        this[offset + 1] = value >>> 8;
                    } else {
                        objectWriteUInt16(this, value, offset, true);
                    }
                    return offset + 2;
                };
                Buffer.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
                    value = +value;
                    offset = offset | 0;
                    if (!noAssert) {
                        checkInt(this, value, offset, 2, 65535, 0);
                    }
                    if (Buffer.TYPED_ARRAY_SUPPORT) {
                        this[offset] = value >>> 8;
                        this[offset + 1] = value & 255;
                    } else {
                        objectWriteUInt16(this, value, offset, false);
                    }
                    return offset + 2;
                };
                function objectWriteUInt32(buf, value, offset, littleEndian) {
                    if (value < 0) {
                        value = 4294967295 + value + 1;
                    }
                    for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; i++) {
                        buf[offset + i] = value >>> (littleEndian ? i : 3 - i) * 8 & 255;
                    }
                }
                Buffer.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
                    value = +value;
                    offset = offset | 0;
                    if (!noAssert) {
                        checkInt(this, value, offset, 4, 4294967295, 0);
                    }
                    if (Buffer.TYPED_ARRAY_SUPPORT) {
                        this[offset + 3] = value >>> 24;
                        this[offset + 2] = value >>> 16;
                        this[offset + 1] = value >>> 8;
                        this[offset] = value & 255;
                    } else {
                        objectWriteUInt32(this, value, offset, true);
                    }
                    return offset + 4;
                };
                Buffer.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
                    value = +value;
                    offset = offset | 0;
                    if (!noAssert) {
                        checkInt(this, value, offset, 4, 4294967295, 0);
                    }
                    if (Buffer.TYPED_ARRAY_SUPPORT) {
                        this[offset] = value >>> 24;
                        this[offset + 1] = value >>> 16;
                        this[offset + 2] = value >>> 8;
                        this[offset + 3] = value & 255;
                    } else {
                        objectWriteUInt32(this, value, offset, false);
                    }
                    return offset + 4;
                };
                Buffer.prototype.writeIntLE = function writeIntLE(value, offset, byteLength, noAssert) {
                    value = +value;
                    offset = offset | 0;
                    if (!noAssert) {
                        var limit = Math.pow(2, 8 * byteLength - 1);
                        checkInt(this, value, offset, byteLength, limit - 1, -limit);
                    }
                    var i = 0;
                    var mul = 1;
                    var sub = value < 0 ? 1 : 0;
                    this[offset] = value & 255;
                    while (++i < byteLength && (mul *= 256)) {
                        this[offset + i] = (value / mul >> 0) - sub & 255;
                    }
                    return offset + byteLength;
                };
                Buffer.prototype.writeIntBE = function writeIntBE(value, offset, byteLength, noAssert) {
                    value = +value;
                    offset = offset | 0;
                    if (!noAssert) {
                        var limit = Math.pow(2, 8 * byteLength - 1);
                        checkInt(this, value, offset, byteLength, limit - 1, -limit);
                    }
                    var i = byteLength - 1;
                    var mul = 1;
                    var sub = value < 0 ? 1 : 0;
                    this[offset + i] = value & 255;
                    while (--i >= 0 && (mul *= 256)) {
                        this[offset + i] = (value / mul >> 0) - sub & 255;
                    }
                    return offset + byteLength;
                };
                Buffer.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
                    value = +value;
                    offset = offset | 0;
                    if (!noAssert) {
                        checkInt(this, value, offset, 1, 127, -128);
                    }
                    if (!Buffer.TYPED_ARRAY_SUPPORT) {
                        value = Math.floor(value);
                    }
                    if (value < 0) {
                        value = 255 + value + 1;
                    }
                    this[offset] = value & 255;
                    return offset + 1;
                };
                Buffer.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
                    value = +value;
                    offset = offset | 0;
                    if (!noAssert) {
                        checkInt(this, value, offset, 2, 32767, -32768);
                    }
                    if (Buffer.TYPED_ARRAY_SUPPORT) {
                        this[offset] = value & 255;
                        this[offset + 1] = value >>> 8;
                    } else {
                        objectWriteUInt16(this, value, offset, true);
                    }
                    return offset + 2;
                };
                Buffer.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
                    value = +value;
                    offset = offset | 0;
                    if (!noAssert) {
                        checkInt(this, value, offset, 2, 32767, -32768);
                    }
                    if (Buffer.TYPED_ARRAY_SUPPORT) {
                        this[offset] = value >>> 8;
                        this[offset + 1] = value & 255;
                    } else {
                        objectWriteUInt16(this, value, offset, false);
                    }
                    return offset + 2;
                };
                Buffer.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
                    value = +value;
                    offset = offset | 0;
                    if (!noAssert) {
                        checkInt(this, value, offset, 4, 2147483647, -2147483648);
                    }
                    if (Buffer.TYPED_ARRAY_SUPPORT) {
                        this[offset] = value & 255;
                        this[offset + 1] = value >>> 8;
                        this[offset + 2] = value >>> 16;
                        this[offset + 3] = value >>> 24;
                    } else {
                        objectWriteUInt32(this, value, offset, true);
                    }
                    return offset + 4;
                };
                Buffer.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
                    value = +value;
                    offset = offset | 0;
                    if (!noAssert) {
                        checkInt(this, value, offset, 4, 2147483647, -2147483648);
                    }
                    if (value < 0) {
                        value = 4294967295 + value + 1;
                    }
                    if (Buffer.TYPED_ARRAY_SUPPORT) {
                        this[offset] = value >>> 24;
                        this[offset + 1] = value >>> 16;
                        this[offset + 2] = value >>> 8;
                        this[offset + 3] = value & 255;
                    } else {
                        objectWriteUInt32(this, value, offset, false);
                    }
                    return offset + 4;
                };
                function checkIEEE754(buf, value, offset, ext, max, min) {
                    if (value > max || value < min) {
                        throw new RangeError('value is out of bounds');
                    }
                    if (offset + ext > buf.length) {
                        throw new RangeError('index out of range');
                    }
                    if (offset < 0) {
                        throw new RangeError('index out of range');
                    }
                }
                function writeFloat(buf, value, offset, littleEndian, noAssert) {
                    if (!noAssert) {
                        checkIEEE754(buf, value, offset, 4, 3.4028234663852886e38, -3.4028234663852886e38);
                    }
                    ieee754.write(buf, value, offset, littleEndian, 23, 4);
                    return offset + 4;
                }
                Buffer.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
                    return writeFloat(this, value, offset, true, noAssert);
                };
                Buffer.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
                    return writeFloat(this, value, offset, false, noAssert);
                };
                function writeDouble(buf, value, offset, littleEndian, noAssert) {
                    if (!noAssert) {
                        checkIEEE754(buf, value, offset, 8, 1.7976931348623157e308, -1.7976931348623157e308);
                    }
                    ieee754.write(buf, value, offset, littleEndian, 52, 8);
                    return offset + 8;
                }
                Buffer.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
                    return writeDouble(this, value, offset, true, noAssert);
                };
                Buffer.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
                    return writeDouble(this, value, offset, false, noAssert);
                };
                Buffer.prototype.copy = function copy(target, targetStart, start, end) {
                    if (!start) {
                        start = 0;
                    }
                    if (!end && end !== 0) {
                        end = this.length;
                    }
                    if (targetStart >= target.length) {
                        targetStart = target.length;
                    }
                    if (!targetStart) {
                        targetStart = 0;
                    }
                    if (end > 0 && end < start) {
                        end = start;
                    }
                    if (end === start) {
                        return 0;
                    }
                    if (target.length === 0 || this.length === 0) {
                        return 0;
                    }
                    if (targetStart < 0) {
                        throw new RangeError('targetStart out of bounds');
                    }
                    if (start < 0 || start >= this.length) {
                        throw new RangeError('sourceStart out of bounds');
                    }
                    if (end < 0) {
                        throw new RangeError('sourceEnd out of bounds');
                    }
                    if (end > this.length) {
                        end = this.length;
                    }
                    if (target.length - targetStart < end - start) {
                        end = target.length - targetStart + start;
                    }
                    var len = end - start;
                    var i;
                    if (this === target && start < targetStart && targetStart < end) {
                        for (i = len - 1; i >= 0; i--) {
                            target[i + targetStart] = this[i + start];
                        }
                    } else {
                        if (len < 1e3 || !Buffer.TYPED_ARRAY_SUPPORT) {
                            for (i = 0; i < len; i++) {
                                target[i + targetStart] = this[i + start];
                            }
                        } else {
                            target._set(this.subarray(start, start + len), targetStart);
                        }
                    }
                    return len;
                };
                Buffer.prototype.fill = function fill(value, start, end) {
                    if (!value) {
                        value = 0;
                    }
                    if (!start) {
                        start = 0;
                    }
                    if (!end) {
                        end = this.length;
                    }
                    if (end < start) {
                        throw new RangeError('end < start');
                    }
                    if (end === start) {
                        return;
                    }
                    if (this.length === 0) {
                        return;
                    }
                    if (start < 0 || start >= this.length) {
                        throw new RangeError('start out of bounds');
                    }
                    if (end < 0 || end > this.length) {
                        throw new RangeError('end out of bounds');
                    }
                    var i;
                    if (typeof value === 'number') {
                        for (i = start; i < end; i++) {
                            this[i] = value;
                        }
                    } else {
                        var bytes = utf8ToBytes(value.toString());
                        var len = bytes.length;
                        for (i = start; i < end; i++) {
                            this[i] = bytes[i % len];
                        }
                    }
                    return this;
                };
                Buffer.prototype.toArrayBuffer = function toArrayBuffer() {
                    if (typeof Uint8Array !== 'undefined') {
                        if (Buffer.TYPED_ARRAY_SUPPORT) {
                            return new Buffer(this).buffer;
                        } else {
                            var buf = new Uint8Array(this.length);
                            for (var i = 0, len = buf.length; i < len; i += 1) {
                                buf[i] = this[i];
                            }
                            return buf.buffer;
                        }
                    } else {
                        throw new TypeError('Buffer.toArrayBuffer not supported in this browser');
                    }
                };
                var BP = Buffer.prototype;
                Buffer._augment = function _augment(arr) {
                    arr.constructor = Buffer;
                    arr._isBuffer = true;
                    arr._set = arr.set;
                    arr.get = BP.get;
                    arr.set = BP.set;
                    arr.write = BP.write;
                    arr.toString = BP.toString;
                    arr.toLocaleString = BP.toString;
                    arr.toJSON = BP.toJSON;
                    arr.equals = BP.equals;
                    arr.compare = BP.compare;
                    arr.indexOf = BP.indexOf;
                    arr.copy = BP.copy;
                    arr.slice = BP.slice;
                    arr.readUIntLE = BP.readUIntLE;
                    arr.readUIntBE = BP.readUIntBE;
                    arr.readUInt8 = BP.readUInt8;
                    arr.readUInt16LE = BP.readUInt16LE;
                    arr.readUInt16BE = BP.readUInt16BE;
                    arr.readUInt32LE = BP.readUInt32LE;
                    arr.readUInt32BE = BP.readUInt32BE;
                    arr.readIntLE = BP.readIntLE;
                    arr.readIntBE = BP.readIntBE;
                    arr.readInt8 = BP.readInt8;
                    arr.readInt16LE = BP.readInt16LE;
                    arr.readInt16BE = BP.readInt16BE;
                    arr.readInt32LE = BP.readInt32LE;
                    arr.readInt32BE = BP.readInt32BE;
                    arr.readFloatLE = BP.readFloatLE;
                    arr.readFloatBE = BP.readFloatBE;
                    arr.readDoubleLE = BP.readDoubleLE;
                    arr.readDoubleBE = BP.readDoubleBE;
                    arr.writeUInt8 = BP.writeUInt8;
                    arr.writeUIntLE = BP.writeUIntLE;
                    arr.writeUIntBE = BP.writeUIntBE;
                    arr.writeUInt16LE = BP.writeUInt16LE;
                    arr.writeUInt16BE = BP.writeUInt16BE;
                    arr.writeUInt32LE = BP.writeUInt32LE;
                    arr.writeUInt32BE = BP.writeUInt32BE;
                    arr.writeIntLE = BP.writeIntLE;
                    arr.writeIntBE = BP.writeIntBE;
                    arr.writeInt8 = BP.writeInt8;
                    arr.writeInt16LE = BP.writeInt16LE;
                    arr.writeInt16BE = BP.writeInt16BE;
                    arr.writeInt32LE = BP.writeInt32LE;
                    arr.writeInt32BE = BP.writeInt32BE;
                    arr.writeFloatLE = BP.writeFloatLE;
                    arr.writeFloatBE = BP.writeFloatBE;
                    arr.writeDoubleLE = BP.writeDoubleLE;
                    arr.writeDoubleBE = BP.writeDoubleBE;
                    arr.fill = BP.fill;
                    arr.inspect = BP.inspect;
                    arr.toArrayBuffer = BP.toArrayBuffer;
                    return arr;
                };
                var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g;
                function base64clean(str) {
                    str = stringtrim(str).replace(INVALID_BASE64_RE, '');
                    if (str.length < 2) {
                        return '';
                    }
                    while (str.length % 4 !== 0) {
                        str = str + '=';
                    }
                    return str;
                }
                function stringtrim(str) {
                    if (str.trim) {
                        return str.trim();
                    }
                    return str.replace(/^\s+|\s+$/g, '');
                }
                function toHex(n) {
                    if (n < 16) {
                        return '0' + n.toString(16);
                    }
                    return n.toString(16);
                }
                function utf8ToBytes(string, units) {
                    units = units || Infinity;
                    var codePoint;
                    var length = string.length;
                    var leadSurrogate = null;
                    var bytes = [];
                    for (var i = 0; i < length; i++) {
                        codePoint = string.charCodeAt(i);
                        if (codePoint > 55295 && codePoint < 57344) {
                            if (!leadSurrogate) {
                                if (codePoint > 56319) {
                                    if ((units -= 3) > -1) {
                                        bytes.push(239, 191, 189);
                                    }
                                    continue;
                                } else {
                                    if (i + 1 === length) {
                                        if ((units -= 3) > -1) {
                                            bytes.push(239, 191, 189);
                                        }
                                        continue;
                                    }
                                }
                                leadSurrogate = codePoint;
                                continue;
                            }
                            if (codePoint < 56320) {
                                if ((units -= 3) > -1) {
                                    bytes.push(239, 191, 189);
                                }
                                leadSurrogate = codePoint;
                                continue;
                            }
                            codePoint = (leadSurrogate - 55296 << 10 | codePoint - 56320) + 65536;
                        } else {
                            if (leadSurrogate) {
                                if ((units -= 3) > -1) {
                                    bytes.push(239, 191, 189);
                                }
                            }
                        }
                        leadSurrogate = null;
                        if (codePoint < 128) {
                            if ((units -= 1) < 0) {
                                break;
                            }
                            bytes.push(codePoint);
                        } else {
                            if (codePoint < 2048) {
                                if ((units -= 2) < 0) {
                                    break;
                                }
                                bytes.push(codePoint >> 6 | 192, codePoint & 63 | 128);
                            } else {
                                if (codePoint < 65536) {
                                    if ((units -= 3) < 0) {
                                        break;
                                    }
                                    bytes.push(codePoint >> 12 | 224, codePoint >> 6 & 63 | 128, codePoint & 63 | 128);
                                } else {
                                    if (codePoint < 1114112) {
                                        if ((units -= 4) < 0) {
                                            break;
                                        }
                                        bytes.push(codePoint >> 18 | 240, codePoint >> 12 & 63 | 128, codePoint >> 6 & 63 | 128, codePoint & 63 | 128);
                                    } else {
                                        throw new Error('Invalid code point');
                                    }
                                }
                            }
                        }
                    }
                    return bytes;
                }
                function asciiToBytes(str) {
                    var byteArray = [];
                    for (var i = 0; i < str.length; i++) {
                        byteArray.push(str.charCodeAt(i) & 255);
                    }
                    return byteArray;
                }
                function utf16leToBytes(str, units) {
                    var c, hi, lo;
                    var byteArray = [];
                    for (var i = 0; i < str.length; i++) {
                        if ((units -= 2) < 0) {
                            break;
                        }
                        c = str.charCodeAt(i);
                        hi = c >> 8;
                        lo = c % 256;
                        byteArray.push(lo);
                        byteArray.push(hi);
                    }
                    return byteArray;
                }
                function base64ToBytes(str) {
                    return base64.toByteArray(base64clean(str));
                }
                function blitBuffer(src, dst, offset, length) {
                    for (var i = 0; i < length; i++) {
                        if (i + offset >= dst.length || i >= src.length) {
                            break;
                        }
                        dst[i + offset] = src[i];
                    }
                    return i;
                }
            }).call(this, typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : {});
        }, {
            'base64-js': 19,
            ieee754: 24,
            isarray: 21
        } ],
        21: [ function(_dereq_, module, exports) {
            var toString = {}.toString;
            module.exports = Array.isArray || function(arr) {
                return toString.call(arr) == '[object Array]';
            };
        }, {} ],
        22: [ function(_dereq_, module, exports) {
            var Canvas = module.exports = function Canvas(w, h) {
                var canvas = document.createElement('canvas');
                canvas.width = w || 300;
                canvas.height = h || 150;
                return canvas;
            };
            Canvas.Image = function() {
                var img = document.createElement('img');
                return img;
            };
        }, {} ],
        23: [ function(_dereq_, module, exports) {
            function Triangle(a, b, c) {
                this.a = a;
                this.b = b;
                this.c = c;
                var A = b.x - a.x, B = b.y - a.y, C = c.x - a.x, D = c.y - a.y, E = A * (a.x + b.x) + B * (a.y + b.y), F = C * (a.x + c.x) + D * (a.y + c.y), G = 2 * (A * (c.y - b.y) - B * (c.x - b.x)), minx, miny, dx, dy;
                if (Math.abs(G) < 1e-6) {
                    minx = Math.min(a.x, b.x, c.x);
                    miny = Math.min(a.y, b.y, c.y);
                    dx = (Math.max(a.x, b.x, c.x) - minx) * .5;
                    dy = (Math.max(a.y, b.y, c.y) - miny) * .5;
                    this.x = minx + dx;
                    this.y = miny + dy;
                    this.r = dx * dx + dy * dy;
                } else {
                    this.x = (D * E - B * F) / G;
                    this.y = (A * F - C * E) / G;
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
                return b.x - a.x;
            }
            function dedup(edges) {
                var j = edges.length, a, b, i, m, n;
                outer: while (j) {
                    b = edges[--j];
                    a = edges[--j];
                    i = j;
                    while (i) {
                        n = edges[--i];
                        m = edges[--i];
                        if (a === m && b === n || a === n && b === m) {
                            edges.splice(j, 2);
                            edges.splice(i, 2);
                            j -= 2;
                            continue outer;
                        }
                    }
                }
            }
            function triangulate(vertices) {
                if (vertices.length < 3) {
                    return [];
                }
                vertices.sort(byX);
                var i = vertices.length - 1, xmin = vertices[i].x, xmax = vertices[0].x, ymin = vertices[i].y, ymax = ymin;
                while (i--) {
                    if (vertices[i].y < ymin) {
                        ymin = vertices[i].y;
                    }
                    if (vertices[i].y > ymax) {
                        ymax = vertices[i].y;
                    }
                }
                var dx = xmax - xmin, dy = ymax - ymin, dmax = dx > dy ? dx : dy, xmid = (xmax + xmin) * .5, ymid = (ymax + ymin) * .5, open = [ new Triangle({
                    x: xmid - 20 * dmax,
                    y: ymid - dmax,
                    __sentinel: true
                }, {
                    x: xmid,
                    y: ymid + 20 * dmax,
                    __sentinel: true
                }, {
                    x: xmid + 20 * dmax,
                    y: ymid - dmax,
                    __sentinel: true
                }) ], closed = [], edges = [], j, a, b;
                i = vertices.length;
                while (i--) {
                    edges.length = 0;
                    j = open.length;
                    while (j--) {
                        dx = vertices[i].x - open[j].x;
                        if (dx > 0 && dx * dx > open[j].r) {
                            closed.push(open[j]);
                            open.splice(j, 1);
                            continue;
                        }
                        dy = vertices[i].y - open[j].y;
                        if (dx * dx + dy * dy > open[j].r) {
                            continue;
                        }
                        edges.push(open[j].a, open[j].b, open[j].b, open[j].c, open[j].c, open[j].a);
                        open.splice(j, 1);
                    }
                    dedup(edges);
                    j = edges.length;
                    while (j) {
                        b = edges[--j];
                        a = edges[--j];
                        open.push(new Triangle(a, b, vertices[i]));
                    }
                }
                Array.prototype.push.apply(closed, open);
                i = closed.length;
                while (i--) {
                    if (closed[i].a.__sentinel || closed[i].b.__sentinel || closed[i].c.__sentinel) {
                        closed.splice(i, 1);
                    }
                }
                return closed;
            }
            if (typeof module !== 'undefined') {
                module.exports = {
                    Triangle: Triangle,
                    triangulate: triangulate
                };
            }
        }, {} ],
        24: [ function(_dereq_, module, exports) {
            exports.read = function(buffer, offset, isLE, mLen, nBytes) {
                var e, m;
                var eLen = nBytes * 8 - mLen - 1;
                var eMax = (1 << eLen) - 1;
                var eBias = eMax >> 1;
                var nBits = -7;
                var i = isLE ? nBytes - 1 : 0;
                var d = isLE ? -1 : 1;
                var s = buffer[offset + i];
                i += d;
                e = s & (1 << -nBits) - 1;
                s >>= -nBits;
                nBits += eLen;
                for (;nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}
                m = e & (1 << -nBits) - 1;
                e >>= -nBits;
                nBits += mLen;
                for (;nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}
                if (e === 0) {
                    e = 1 - eBias;
                } else {
                    if (e === eMax) {
                        return m ? NaN : (s ? -1 : 1) * Infinity;
                    } else {
                        m = m + Math.pow(2, mLen);
                        e = e - eBias;
                    }
                }
                return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
            };
            exports.write = function(buffer, value, offset, isLE, mLen, nBytes) {
                var e, m, c;
                var eLen = nBytes * 8 - mLen - 1;
                var eMax = (1 << eLen) - 1;
                var eBias = eMax >> 1;
                var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
                var i = isLE ? 0 : nBytes - 1;
                var d = isLE ? 1 : -1;
                var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
                value = Math.abs(value);
                if (isNaN(value) || value === Infinity) {
                    m = isNaN(value) ? 1 : 0;
                    e = eMax;
                } else {
                    e = Math.floor(Math.log(value) / Math.LN2);
                    if (value * (c = Math.pow(2, -e)) < 1) {
                        e--;
                        c *= 2;
                    }
                    if (e + eBias >= 1) {
                        value += rt / c;
                    } else {
                        value += rt * Math.pow(2, 1 - eBias);
                    }
                    if (value * c >= 2) {
                        e++;
                        c /= 2;
                    }
                    if (e + eBias >= eMax) {
                        m = 0;
                        e = eMax;
                    } else {
                        if (e + eBias >= 1) {
                            m = (value * c - 1) * Math.pow(2, mLen);
                            e = e + eBias;
                        } else {
                            m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
                            e = 0;
                        }
                    }
                }
                for (;mLen >= 8; buffer[offset + i] = m & 255, i += d, m /= 256, mLen -= 8) {}
                e = e << mLen | m;
                eLen += mLen;
                for (;eLen > 0; buffer[offset + i] = e & 255, i += d, e /= 256, eLen -= 8) {}
                buffer[offset + i - d] |= s * 128;
            };
        }, {} ],
        25: [ function(_dereq_, module, exports) {
            var mul_table = [ 512, 512, 456, 512, 328, 456, 335, 512, 405, 328, 271, 456, 388, 335, 292, 512, 454, 405, 364, 328, 298, 271, 496, 456, 420, 388, 360, 335, 312, 292, 273, 512, 482, 454, 428, 405, 383, 364, 345, 328, 312, 298, 284, 271, 259, 496, 475, 456, 437, 420, 404, 388, 374, 360, 347, 335, 323, 312, 302, 292, 282, 273, 265, 512, 497, 482, 468, 454, 441, 428, 417, 405, 394, 383, 373, 364, 354, 345, 337, 328, 320, 312, 305, 298, 291, 284, 278, 271, 265, 259, 507, 496, 485, 475, 465, 456, 446, 437, 428, 420, 412, 404, 396, 388, 381, 374, 367, 360, 354, 347, 341, 335, 329, 323, 318, 312, 307, 302, 297, 292, 287, 282, 278, 273, 269, 265, 261, 512, 505, 497, 489, 482, 475, 468, 461, 454, 447, 441, 435, 428, 422, 417, 411, 405, 399, 394, 389, 383, 378, 373, 368, 364, 359, 354, 350, 345, 341, 337, 332, 328, 324, 320, 316, 312, 309, 305, 301, 298, 294, 291, 287, 284, 281, 278, 274, 271, 268, 265, 262, 259, 257, 507, 501, 496, 491, 485, 480, 475, 470, 465, 460, 456, 451, 446, 442, 437, 433, 428, 424, 420, 416, 412, 408, 404, 400, 396, 392, 388, 385, 381, 377, 374, 370, 367, 363, 360, 357, 354, 350, 347, 344, 341, 338, 335, 332, 329, 326, 323, 320, 318, 315, 312, 310, 307, 304, 302, 299, 297, 294, 292, 289, 287, 285, 282, 280, 278, 275, 273, 271, 269, 267, 265, 263, 261, 259 ];
            var shg_table = [ 9, 11, 12, 13, 13, 14, 14, 15, 15, 15, 15, 16, 16, 16, 16, 17, 17, 17, 17, 17, 17, 17, 18, 18, 18, 18, 18, 18, 18, 18, 18, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24 ];
            function processImage(img, canvas, radius, blurAlphaChannel) {
                if (typeof img == 'string') {
                    var img = document.getElementById(img);
                } else {
                    if (!img instanceof HTMLImageElement) {
                        return;
                    }
                }
                var w = img.naturalWidth;
                var h = img.naturalHeight;
                if (typeof canvas == 'string') {
                    var canvas = document.getElementById(canvas);
                } else {
                    if (!canvas instanceof HTMLCanvasElement) {
                        return;
                    }
                }
                canvas.style.width = w + 'px';
                canvas.style.height = h + 'px';
                canvas.width = w;
                canvas.height = h;
                var context = canvas.getContext('2d');
                context.clearRect(0, 0, w, h);
                context.drawImage(img, 0, 0);
                if (isNaN(radius) || radius < 1) {
                    return;
                }
                if (blurAlphaChannel) {
                    processCanvasRGBA(canvas, 0, 0, w, h, radius);
                } else {
                    processCanvasRGB(canvas, 0, 0, w, h, radius);
                }
            }
            function getImageDataFromCanvas(canvas, top_x, top_y, width, height) {
                if (typeof canvas == 'string') {
                    var canvas = document.getElementById(canvas);
                } else {
                    if (!canvas instanceof HTMLCanvasElement) {
                        return;
                    }
                }
                var context = canvas.getContext('2d');
                var imageData;
                try {
                    try {
                        imageData = context.getImageData(top_x, top_y, width, height);
                    } catch (e) {
                        try {
                            netscape.security.PrivilegeManager.enablePrivilege('UniversalBrowserRead');
                            imageData = context.getImageData(top_x, top_y, width, height);
                        } catch (e) {
                            alert('Cannot access local image');
                            throw new Error('unable to access local image data: ' + e);
                            return;
                        }
                    }
                } catch (e) {
                    alert('Cannot access image');
                    throw new Error('unable to access image data: ' + e);
                }
                return imageData;
            }
            function processCanvasRGBA(canvas, top_x, top_y, width, height, radius) {
                if (isNaN(radius) || radius < 1) {
                    return;
                }
                radius |= 0;
                var imageData = getImageDataFromCanvas(canvas, top_x, top_y, width, height);
                imageData = processImageDataRGBA(imageData, top_x, top_y, width, height, radius);
                canvas.getContext('2d').putImageData(imageData, top_x, top_y);
            }
            function processImageDataRGBA(imageData, top_x, top_y, width, height, radius) {
                var pixels = imageData.data;
                var x, y, i, p, yp, yi, yw, r_sum, g_sum, b_sum, a_sum, r_out_sum, g_out_sum, b_out_sum, a_out_sum, r_in_sum, g_in_sum, b_in_sum, a_in_sum, pr, pg, pb, pa, rbs;
                var div = radius + radius + 1;
                var w4 = width << 2;
                var widthMinus1 = width - 1;
                var heightMinus1 = height - 1;
                var radiusPlus1 = radius + 1;
                var sumFactor = radiusPlus1 * (radiusPlus1 + 1) / 2;
                var stackStart = new BlurStack();
                var stack = stackStart;
                for (i = 1; i < div; i++) {
                    stack = stack.next = new BlurStack();
                    if (i == radiusPlus1) {
                        var stackEnd = stack;
                    }
                }
                stack.next = stackStart;
                var stackIn = null;
                var stackOut = null;
                yw = yi = 0;
                var mul_sum = mul_table[radius];
                var shg_sum = shg_table[radius];
                for (y = 0; y < height; y++) {
                    r_in_sum = g_in_sum = b_in_sum = a_in_sum = r_sum = g_sum = b_sum = a_sum = 0;
                    r_out_sum = radiusPlus1 * (pr = pixels[yi]);
                    g_out_sum = radiusPlus1 * (pg = pixels[yi + 1]);
                    b_out_sum = radiusPlus1 * (pb = pixels[yi + 2]);
                    a_out_sum = radiusPlus1 * (pa = pixels[yi + 3]);
                    r_sum += sumFactor * pr;
                    g_sum += sumFactor * pg;
                    b_sum += sumFactor * pb;
                    a_sum += sumFactor * pa;
                    stack = stackStart;
                    for (i = 0; i < radiusPlus1; i++) {
                        stack.r = pr;
                        stack.g = pg;
                        stack.b = pb;
                        stack.a = pa;
                        stack = stack.next;
                    }
                    for (i = 1; i < radiusPlus1; i++) {
                        p = yi + ((widthMinus1 < i ? widthMinus1 : i) << 2);
                        r_sum += (stack.r = pr = pixels[p]) * (rbs = radiusPlus1 - i);
                        g_sum += (stack.g = pg = pixels[p + 1]) * rbs;
                        b_sum += (stack.b = pb = pixels[p + 2]) * rbs;
                        a_sum += (stack.a = pa = pixels[p + 3]) * rbs;
                        r_in_sum += pr;
                        g_in_sum += pg;
                        b_in_sum += pb;
                        a_in_sum += pa;
                        stack = stack.next;
                    }
                    stackIn = stackStart;
                    stackOut = stackEnd;
                    for (x = 0; x < width; x++) {
                        pixels[yi + 3] = pa = a_sum * mul_sum >> shg_sum;
                        if (pa != 0) {
                            pa = 255 / pa;
                            pixels[yi] = (r_sum * mul_sum >> shg_sum) * pa;
                            pixels[yi + 1] = (g_sum * mul_sum >> shg_sum) * pa;
                            pixels[yi + 2] = (b_sum * mul_sum >> shg_sum) * pa;
                        } else {
                            pixels[yi] = pixels[yi + 1] = pixels[yi + 2] = 0;
                        }
                        r_sum -= r_out_sum;
                        g_sum -= g_out_sum;
                        b_sum -= b_out_sum;
                        a_sum -= a_out_sum;
                        r_out_sum -= stackIn.r;
                        g_out_sum -= stackIn.g;
                        b_out_sum -= stackIn.b;
                        a_out_sum -= stackIn.a;
                        p = yw + ((p = x + radius + 1) < widthMinus1 ? p : widthMinus1) << 2;
                        r_in_sum += stackIn.r = pixels[p];
                        g_in_sum += stackIn.g = pixels[p + 1];
                        b_in_sum += stackIn.b = pixels[p + 2];
                        a_in_sum += stackIn.a = pixels[p + 3];
                        r_sum += r_in_sum;
                        g_sum += g_in_sum;
                        b_sum += b_in_sum;
                        a_sum += a_in_sum;
                        stackIn = stackIn.next;
                        r_out_sum += pr = stackOut.r;
                        g_out_sum += pg = stackOut.g;
                        b_out_sum += pb = stackOut.b;
                        a_out_sum += pa = stackOut.a;
                        r_in_sum -= pr;
                        g_in_sum -= pg;
                        b_in_sum -= pb;
                        a_in_sum -= pa;
                        stackOut = stackOut.next;
                        yi += 4;
                    }
                    yw += width;
                }
                for (x = 0; x < width; x++) {
                    g_in_sum = b_in_sum = a_in_sum = r_in_sum = g_sum = b_sum = a_sum = r_sum = 0;
                    yi = x << 2;
                    r_out_sum = radiusPlus1 * (pr = pixels[yi]);
                    g_out_sum = radiusPlus1 * (pg = pixels[yi + 1]);
                    b_out_sum = radiusPlus1 * (pb = pixels[yi + 2]);
                    a_out_sum = radiusPlus1 * (pa = pixels[yi + 3]);
                    r_sum += sumFactor * pr;
                    g_sum += sumFactor * pg;
                    b_sum += sumFactor * pb;
                    a_sum += sumFactor * pa;
                    stack = stackStart;
                    for (i = 0; i < radiusPlus1; i++) {
                        stack.r = pr;
                        stack.g = pg;
                        stack.b = pb;
                        stack.a = pa;
                        stack = stack.next;
                    }
                    yp = width;
                    for (i = 1; i <= radius; i++) {
                        yi = yp + x << 2;
                        r_sum += (stack.r = pr = pixels[yi]) * (rbs = radiusPlus1 - i);
                        g_sum += (stack.g = pg = pixels[yi + 1]) * rbs;
                        b_sum += (stack.b = pb = pixels[yi + 2]) * rbs;
                        a_sum += (stack.a = pa = pixels[yi + 3]) * rbs;
                        r_in_sum += pr;
                        g_in_sum += pg;
                        b_in_sum += pb;
                        a_in_sum += pa;
                        stack = stack.next;
                        if (i < heightMinus1) {
                            yp += width;
                        }
                    }
                    yi = x;
                    stackIn = stackStart;
                    stackOut = stackEnd;
                    for (y = 0; y < height; y++) {
                        p = yi << 2;
                        pixels[p + 3] = pa = a_sum * mul_sum >> shg_sum;
                        if (pa > 0) {
                            pa = 255 / pa;
                            pixels[p] = (r_sum * mul_sum >> shg_sum) * pa;
                            pixels[p + 1] = (g_sum * mul_sum >> shg_sum) * pa;
                            pixels[p + 2] = (b_sum * mul_sum >> shg_sum) * pa;
                        } else {
                            pixels[p] = pixels[p + 1] = pixels[p + 2] = 0;
                        }
                        r_sum -= r_out_sum;
                        g_sum -= g_out_sum;
                        b_sum -= b_out_sum;
                        a_sum -= a_out_sum;
                        r_out_sum -= stackIn.r;
                        g_out_sum -= stackIn.g;
                        b_out_sum -= stackIn.b;
                        a_out_sum -= stackIn.a;
                        p = x + ((p = y + radiusPlus1) < heightMinus1 ? p : heightMinus1) * width << 2;
                        r_sum += r_in_sum += stackIn.r = pixels[p];
                        g_sum += g_in_sum += stackIn.g = pixels[p + 1];
                        b_sum += b_in_sum += stackIn.b = pixels[p + 2];
                        a_sum += a_in_sum += stackIn.a = pixels[p + 3];
                        stackIn = stackIn.next;
                        r_out_sum += pr = stackOut.r;
                        g_out_sum += pg = stackOut.g;
                        b_out_sum += pb = stackOut.b;
                        a_out_sum += pa = stackOut.a;
                        r_in_sum -= pr;
                        g_in_sum -= pg;
                        b_in_sum -= pb;
                        a_in_sum -= pa;
                        stackOut = stackOut.next;
                        yi += width;
                    }
                }
                return imageData;
            }
            function processCanvasRGB(canvas, top_x, top_y, width, height, radius) {
                if (isNaN(radius) || radius < 1) {
                    return;
                }
                radius |= 0;
                var imageData = getImageDataFromCanvas(canvas, top_x, top_y, width, height);
                imageData = processImageDataRGB(imageData, top_x, top_y, width, height, radius);
                canvas.getContext('2d').putImageData(imageData, top_x, top_y);
            }
            function processImageDataRGB(imageData, top_x, top_y, width, height, radius) {
                var pixels = imageData.data;
                var x, y, i, p, yp, yi, yw, r_sum, g_sum, b_sum, r_out_sum, g_out_sum, b_out_sum, r_in_sum, g_in_sum, b_in_sum, pr, pg, pb, rbs;
                var div = radius + radius + 1;
                var w4 = width << 2;
                var widthMinus1 = width - 1;
                var heightMinus1 = height - 1;
                var radiusPlus1 = radius + 1;
                var sumFactor = radiusPlus1 * (radiusPlus1 + 1) / 2;
                var stackStart = new BlurStack();
                var stack = stackStart;
                for (i = 1; i < div; i++) {
                    stack = stack.next = new BlurStack();
                    if (i == radiusPlus1) {
                        var stackEnd = stack;
                    }
                }
                stack.next = stackStart;
                var stackIn = null;
                var stackOut = null;
                yw = yi = 0;
                var mul_sum = mul_table[radius];
                var shg_sum = shg_table[radius];
                for (y = 0; y < height; y++) {
                    r_in_sum = g_in_sum = b_in_sum = r_sum = g_sum = b_sum = 0;
                    r_out_sum = radiusPlus1 * (pr = pixels[yi]);
                    g_out_sum = radiusPlus1 * (pg = pixels[yi + 1]);
                    b_out_sum = radiusPlus1 * (pb = pixels[yi + 2]);
                    r_sum += sumFactor * pr;
                    g_sum += sumFactor * pg;
                    b_sum += sumFactor * pb;
                    stack = stackStart;
                    for (i = 0; i < radiusPlus1; i++) {
                        stack.r = pr;
                        stack.g = pg;
                        stack.b = pb;
                        stack = stack.next;
                    }
                    for (i = 1; i < radiusPlus1; i++) {
                        p = yi + ((widthMinus1 < i ? widthMinus1 : i) << 2);
                        r_sum += (stack.r = pr = pixels[p]) * (rbs = radiusPlus1 - i);
                        g_sum += (stack.g = pg = pixels[p + 1]) * rbs;
                        b_sum += (stack.b = pb = pixels[p + 2]) * rbs;
                        r_in_sum += pr;
                        g_in_sum += pg;
                        b_in_sum += pb;
                        stack = stack.next;
                    }
                    stackIn = stackStart;
                    stackOut = stackEnd;
                    for (x = 0; x < width; x++) {
                        pixels[yi] = r_sum * mul_sum >> shg_sum;
                        pixels[yi + 1] = g_sum * mul_sum >> shg_sum;
                        pixels[yi + 2] = b_sum * mul_sum >> shg_sum;
                        r_sum -= r_out_sum;
                        g_sum -= g_out_sum;
                        b_sum -= b_out_sum;
                        r_out_sum -= stackIn.r;
                        g_out_sum -= stackIn.g;
                        b_out_sum -= stackIn.b;
                        p = yw + ((p = x + radius + 1) < widthMinus1 ? p : widthMinus1) << 2;
                        r_in_sum += stackIn.r = pixels[p];
                        g_in_sum += stackIn.g = pixels[p + 1];
                        b_in_sum += stackIn.b = pixels[p + 2];
                        r_sum += r_in_sum;
                        g_sum += g_in_sum;
                        b_sum += b_in_sum;
                        stackIn = stackIn.next;
                        r_out_sum += pr = stackOut.r;
                        g_out_sum += pg = stackOut.g;
                        b_out_sum += pb = stackOut.b;
                        r_in_sum -= pr;
                        g_in_sum -= pg;
                        b_in_sum -= pb;
                        stackOut = stackOut.next;
                        yi += 4;
                    }
                    yw += width;
                }
                for (x = 0; x < width; x++) {
                    g_in_sum = b_in_sum = r_in_sum = g_sum = b_sum = r_sum = 0;
                    yi = x << 2;
                    r_out_sum = radiusPlus1 * (pr = pixels[yi]);
                    g_out_sum = radiusPlus1 * (pg = pixels[yi + 1]);
                    b_out_sum = radiusPlus1 * (pb = pixels[yi + 2]);
                    r_sum += sumFactor * pr;
                    g_sum += sumFactor * pg;
                    b_sum += sumFactor * pb;
                    stack = stackStart;
                    for (i = 0; i < radiusPlus1; i++) {
                        stack.r = pr;
                        stack.g = pg;
                        stack.b = pb;
                        stack = stack.next;
                    }
                    yp = width;
                    for (i = 1; i <= radius; i++) {
                        yi = yp + x << 2;
                        r_sum += (stack.r = pr = pixels[yi]) * (rbs = radiusPlus1 - i);
                        g_sum += (stack.g = pg = pixels[yi + 1]) * rbs;
                        b_sum += (stack.b = pb = pixels[yi + 2]) * rbs;
                        r_in_sum += pr;
                        g_in_sum += pg;
                        b_in_sum += pb;
                        stack = stack.next;
                        if (i < heightMinus1) {
                            yp += width;
                        }
                    }
                    yi = x;
                    stackIn = stackStart;
                    stackOut = stackEnd;
                    for (y = 0; y < height; y++) {
                        p = yi << 2;
                        pixels[p] = r_sum * mul_sum >> shg_sum;
                        pixels[p + 1] = g_sum * mul_sum >> shg_sum;
                        pixels[p + 2] = b_sum * mul_sum >> shg_sum;
                        r_sum -= r_out_sum;
                        g_sum -= g_out_sum;
                        b_sum -= b_out_sum;
                        r_out_sum -= stackIn.r;
                        g_out_sum -= stackIn.g;
                        b_out_sum -= stackIn.b;
                        p = x + ((p = y + radiusPlus1) < heightMinus1 ? p : heightMinus1) * width << 2;
                        r_sum += r_in_sum += stackIn.r = pixels[p];
                        g_sum += g_in_sum += stackIn.g = pixels[p + 1];
                        b_sum += b_in_sum += stackIn.b = pixels[p + 2];
                        stackIn = stackIn.next;
                        r_out_sum += pr = stackOut.r;
                        g_out_sum += pg = stackOut.g;
                        b_out_sum += pb = stackOut.b;
                        r_in_sum -= pr;
                        g_in_sum -= pg;
                        b_in_sum -= pb;
                        stackOut = stackOut.next;
                        yi += width;
                    }
                }
                return imageData;
            }
            function BlurStack() {
                this.r = 0;
                this.g = 0;
                this.b = 0;
                this.a = 0;
                this.next = null;
            }
            module.exports = {
                image: processImage,
                canvasRGBA: processCanvasRGBA,
                canvasRGB: processCanvasRGB,
                imageDataRGBA: processImageDataRGBA,
                imageDataRGB: processImageDataRGB
            };
        }, {} ]
    }, {}, [ 18 ])(18);
});
