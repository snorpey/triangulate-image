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
            function _interopRequireDefault(obj) {
                return obj && obj.__esModule ? obj : {
                    'default': obj
                };
            }
            Object.defineProperty(exports, '__esModule', {
                value: !0
            });
            var _extends = Object.assign || function(target) {
                for (var i = 1; i < arguments.length; i++) {
                    var source = arguments[i];
                    for (var key in source) {
                        Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
                    }
                }
                return target;
            }, _inputSanitizeInput = _dereq_('./input/sanitizeInput'), _inputSanitizeInput2 = _interopRequireDefault(_inputSanitizeInput), _inputBrowserFromImageToImageData = _dereq_('./input/browser/fromImageToImageData'), _inputBrowserFromImageToImageData2 = _interopRequireDefault(_inputBrowserFromImageToImageData), _outputPolygonsToImageData = _dereq_('./output/polygonsToImageData'), _outputPolygonsToImageData2 = _interopRequireDefault(_outputPolygonsToImageData), _outputPolygonsToDataURL = _dereq_('./output/polygonsToDataURL'), _outputPolygonsToDataURL2 = _interopRequireDefault(_outputPolygonsToDataURL), _outputPolygonsToSVG = _dereq_('./output/polygonsToSVG'), _outputPolygonsToSVG2 = _interopRequireDefault(_outputPolygonsToSVG), _polygonsImageDataToPolygons = _dereq_('./polygons/imageDataToPolygons'), _polygonsImageDataToPolygons2 = _interopRequireDefault(_polygonsImageDataToPolygons);
            exports['default'] = function(params) {
                function getParams() {
                    return params;
                }
                function getInput() {
                    var result = _extends({}, api);
                    return inputFn || _extends(result, inputMethods), result;
                }
                function getOutput() {
                    var result = _extends({}, api);
                    return outputFn || _extends(result, outputMethods), result;
                }
                function fromImageSync(inputParams) {
                    return setInput(_inputBrowserFromImageToImageData2['default'], inputParams);
                }
                function fromImageDataSync(inputParams) {
                    return setInput(function(id) {
                        return id;
                    }, inputParams);
                }
                function toDataSync(outputParams) {
                    return setOutput(function(p) {
                        return p;
                    }, outputParams);
                }
                function toDataURLSync(outputParams) {
                    return setOutput(_outputPolygonsToDataURL2['default'], outputParams);
                }
                function toImageDataSync(outputParams) {
                    return setOutput(_outputPolygonsToImageData2['default'], outputParams);
                }
                function toSVGSync(outputParams) {
                    return setOutput(_outputPolygonsToSVG2['default'], outputParams);
                }
                function setInput(fn, inputParams) {
                    return inputFn = function() {
                        return fn(inputParams);
                    }, isReady() ? getResult() : getOutput();
                }
                function setOutput(fn, outputpParams) {
                    return outputFn = function(polygons, size) {
                        return fn(polygons, size, outputpParams);
                    }, isReady() ? getResult() : getInput();
                }
                function isReady() {
                    return inputFn && outputFn;
                }
                function getResult() {
                    var imageData = inputFn(params), polygonData = (0, _polygonsImageDataToPolygons2['default'])(imageData, params), outputData = outputFn(polygonData, imageData);
                    return outputData;
                }
                params = (0, _inputSanitizeInput2['default'])(params);
                var inputFn = void 0, outputFn = void 0, api = {
                    getParams: getParams,
                    getInput: getInput,
                    getOutput: getOutput
                }, inputMethods = {
                    fromImageSync: fromImageSync,
                    fromImageDataSync: fromImageDataSync
                }, outputMethods = {
                    toDataSync: toDataSync,
                    toDataURLSync: toDataURLSync,
                    toImageDataSync: toImageDataSync,
                    toSVGSync: toSVGSync
                };
                return getInput();
            }, module.exports = exports['default'];
        }, {
            './input/browser/fromImageToImageData': 5,
            './input/sanitizeInput': 7,
            './output/polygonsToDataURL': 8,
            './output/polygonsToImageData': 9,
            './output/polygonsToSVG': 10,
            './polygons/imageDataToPolygons': 14
        } ],
        2: [ function(_dereq_, module, exports) {
            'use strict';
            function _interopRequireDefault(obj) {
                return obj && obj.__esModule ? obj : {
                    'default': obj
                };
            }
            Object.defineProperty(exports, '__esModule', {
                value: !0
            });
            var _canvasBrowserify = _dereq_('canvas-browserify'), _canvasBrowserify2 = _interopRequireDefault(_canvasBrowserify);
            exports['default'] = function(imageData) {
                if ('undefined' == typeof Uint8ClampedArray) {
                    if ('undefined' == typeof window) {
                        throw new Error('Can\'t copy imageData in Webworker without Uint8ClampedArray support.');
                    }
                    var canvas = (0, _canvasBrowserify2['default'])(imageData.width, imageData.height), ctx = canvas.getContext('2d');
                    return ctx.putImageData(imageData, 0, 0), ctx.getImageData(0, 0, imageData.width, imageData.height);
                }
                return {
                    width: imageData.width,
                    height: imageData.height,
                    data: new Uint8ClampedArray(imageData.data)
                };
            }, module.exports = exports['default'];
        }, {
            'canvas-browserify': 18
        } ],
        3: [ function(_dereq_, module, exports) {
            'use strict';
            function getEdgeMatrix(size) {
                var i, matrix = [], side = 2 * size + 1, len = side * side, center = .5 * len | 0;
                for (i = 0; len > i; i++) {
                    matrix[i] = i === center ? -len + 1 : 1;
                }
                return matrix;
            }
            Object.defineProperty(exports, '__esModule', {
                value: !0
            }), exports['default'] = function(imageData, accuracy, edgeSize, divisor) {
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
            }, module.exports = exports['default'];
        }, {} ],
        4: [ function(_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', {
                value: !0
            }), exports['default'] = function(imageData) {
                for (var len = imageData.data.length, data = imageData.data, brightness = void 0, i = 0; len > i; i += 4) {
                    brightness = .34 * data[i] + .5 * data[i + 1] + .16 * data[i + 2], data[i] = brightness, 
                    data[i + 1] = brightness, data[i + 2] = brightness;
                }
                return imageData.data = data, imageData;
            }, module.exports = exports['default'];
        }, {} ],
        5: [ function(_dereq_, module, exports) {
            'use strict';
            function _interopRequireDefault(obj) {
                return obj && obj.__esModule ? obj : {
                    'default': obj
                };
            }
            Object.defineProperty(exports, '__esModule', {
                value: !0
            });
            var _canvasBrowserify = _dereq_('canvas-browserify'), _canvasBrowserify2 = _interopRequireDefault(_canvasBrowserify), Image = _canvasBrowserify2['default'].Image;
            exports['default'] = function(image) {
                if (image instanceof HTMLImageElement) {
                    if (!image.naturalWidth || !image.naturalHeight || image.complete === !1) {
                        throw new Error('This this image hasn\'t finished loading: ' + image.src);
                    }
                    var canvas = new _canvasBrowserify2['default'](image.naturalWidth, image.naturalHeight), ctx = canvas.getContext('2d');
                    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
                    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    return imageData.data && imageData.data.length && ('undefined' == typeof imageData.width && (imageData.width = image.naturalWidth), 
                    'undefined' == typeof imageData.height && (imageData.height = image.naturalHeight)), 
                    imageData;
                }
                throw new Error('This object does not seem to be an image.');
            }, module.exports = exports['default'];
        }, {
            'canvas-browserify': 18
        } ],
        6: [ function(_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', {
                value: !0
            }), exports['default'] = {
                accuracy: .7,
                blur: 40,
                fill: !0,
                stroke: !0,
                strokeWidth: .5,
                lineJoin: 'miter',
                vertexCount: 700
            }, module.exports = exports['default'];
        }, {} ],
        7: [ function(_dereq_, module, exports) {
            'use strict';
            function _interopRequireDefault(obj) {
                return obj && obj.__esModule ? obj : {
                    'default': obj
                };
            }
            Object.defineProperty(exports, '__esModule', {
                value: !0
            });
            var _utilClamp = _dereq_('../util/clamp'), _utilClamp2 = _interopRequireDefault(_utilClamp), _defaultParams = _dereq_('./defaultParams'), _defaultParams2 = _interopRequireDefault(_defaultParams), allowedLineJoins = [ 'miter', 'round', 'bevel' ];
            exports['default'] = function(params) {
                return 'object' != typeof params && (params = {}), 'number' != typeof params.accuracy || isNaN(params.accuracy) ? params.accuracy = _defaultParams2['default'].accuracy : params.accuracy = (0, 
                _utilClamp2['default'])(params.accuracy, 0, 1), ('number' != typeof params.blur || isNaN(params.blur)) && (params.blur = _defaultParams2['default'].blur), 
                params.blur <= 0 && (params.blur = 1), 'string' != typeof params.fill && 'boolean' != typeof params.fill && (params.fill = _defaultParams2['default'].fill), 
                'string' != typeof params.stroke && 'boolean' != typeof params.stroke && (params.stroke = _defaultParams2['default'].stroke), 
                ('number' != typeof params.strokeWidth || isNaN(params.strokeWidth)) && (params.strokeWidth = _defaultParams2['default'].strokeWidth), 
                ('string' != typeof params.lineJoin || -1 === allowedLineJoins.indexOf(params.lineJoin)) && (params.lineJoin = _defaultParams2['default'].lineJoin), 
                ('number' != typeof params.vertexCount || isNaN(params.vertexCount)) && (params.vertexCount = _defaultParams2['default'].vertexCount), 
                params.vertexCount <= 0 && (params.vertexCount = 1), params;
            }, module.exports = exports['default'];
        }, {
            '../util/clamp': 15,
            './defaultParams': 6
        } ],
        8: [ function(_dereq_, module, exports) {
            'use strict';
            function _interopRequireDefault(obj) {
                return obj && obj.__esModule ? obj : {
                    'default': obj
                };
            }
            Object.defineProperty(exports, '__esModule', {
                value: !0
            });
            var _canvasBrowserify = _dereq_('canvas-browserify'), _canvasBrowserify2 = _interopRequireDefault(_canvasBrowserify), _utilDrawPolygonsOnContext = _dereq_('../util/drawPolygonsOnContext'), _utilDrawPolygonsOnContext2 = _interopRequireDefault(_utilDrawPolygonsOnContext);
            exports['default'] = function(polygons, size, options) {
                var dpr = options && options.dpr ? options.dpr : 1, backgroundColor = options && options.backgroundColor ? options.backgroundColor : !1, canvas = new _canvasBrowserify2['default'](size.width * dpr, size.height * dpr), ctx = canvas.getContext('2d');
                return backgroundColor && (ctx.fillStyle = backgroundColor, ctx.fillRect(0, 0, size.width * dpr, size.height * dpr), 
                ctx.fillStyle = 'transparent'), (0, _utilDrawPolygonsOnContext2['default'])(ctx, polygons, size, dpr), 
                canvas.toDataURL();
            }, module.exports = exports['default'];
        }, {
            '../util/drawPolygonsOnContext': 16,
            'canvas-browserify': 18
        } ],
        9: [ function(_dereq_, module, exports) {
            'use strict';
            function _interopRequireDefault(obj) {
                return obj && obj.__esModule ? obj : {
                    'default': obj
                };
            }
            Object.defineProperty(exports, '__esModule', {
                value: !0
            });
            var _canvasBrowserify = _dereq_('canvas-browserify'), _canvasBrowserify2 = _interopRequireDefault(_canvasBrowserify), _utilDrawPolygonsOnContext = _dereq_('../util/drawPolygonsOnContext'), _utilDrawPolygonsOnContext2 = _interopRequireDefault(_utilDrawPolygonsOnContext);
            exports['default'] = function(polygons, size, options) {
                var dpr = options && options.dpr ? options.dpr : 1, backgroundColor = options && options.backgroundColor ? options.backgroundColor : !1, canvas = new _canvasBrowserify2['default'](size.width * dpr, size.height * dpr), ctx = canvas.getContext('2d');
                return backgroundColor && (ctx.fillStyle = backgroundColor, ctx.fillRect(0, 0, size.width * dpr, size.height * dpr), 
                ctx.fillStyle = 'transparent'), (0, _utilDrawPolygonsOnContext2['default'])(ctx, polygons, size, dpr), 
                ctx.getImageData(0, 0, size.width * dpr, size.height * dpr);
            }, module.exports = exports['default'];
        }, {
            '../util/drawPolygonsOnContext': 16,
            'canvas-browserify': 18
        } ],
        10: [ function(_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', {
                value: !0
            }), exports['default'] = function(polygons, size) {
                var svg = '<?xml version="1.0" standalone="yes"?>\n<svg width="' + size.width + '" height="' + size.height + '" xmlns="http://www.w3.org/2000/svg" version="1.1" >\n	';
                return polygons.forEach(function(polygon, index) {
                    var a = polygon.a, b = polygon.b, c = polygon.c;
                    svg += '<polygon points="' + a.x + ',' + a.y + ' ' + b.x + ',' + b.y + ' ' + c.x + ',' + c.y + '"', 
                    svg += polygon.fill ? ' fill="' + polygon.fill + '"' : ' fill="transparent"', polygon.strokeColor && (svg += ' stroke="' + polygon.strokeColor + '" stroke-width="' + polygon.strokeWidth + '" stroke-linejoin="' + polygon.lineJoin + '"'), 
                    svg += '/>\n	';
                }), svg += '\n</svg>';
            }, module.exports = exports['default'];
        }, {} ],
        11: [ function(_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', {
                value: !0
            }), exports['default'] = function(polygons, colorData, params) {
                var pixelIndex = 0, polygonCenterX = void 0, polygonCenterY = void 0, fill = params.fill, fillColor = 'string' == typeof fill ? params.fill : !1, stroke = params.stroke, strokeColor = 'string' == typeof stroke ? params.stroke : !1, strokeWidth = params.strokeWidth, lineJoin = params.lineJoin, r = void 0, g = void 0, b = void 0;
                return polygons.forEach(function(polygon, index) {
                    polygonCenterX = .33333 * (polygon.a.x + polygon.b.x + polygon.c.x), polygonCenterY = .33333 * (polygon.a.y + polygon.b.y + polygon.c.y), 
                    pixelIndex = (0 | polygonCenterX) + (0 | polygonCenterY) * colorData.width << 2, 
                    r = colorData.data[pixelIndex], g = colorData.data[pixelIndex + 1], b = colorData.data[pixelIndex + 2], 
                    fill && (polygon.fill = fillColor || 'rgb(' + r + ', ' + g + ', ' + b + ')'), stroke && (strokeColor ? polygon.strokeColor = strokeColor : polygon.strokeColor = 'rgb(' + r + ', ' + g + ', ' + b + ')', 
                    polygon.strokeWidth = strokeWidth, polygon.lineJoin = lineJoin);
                }), polygons;
            }, module.exports = exports['default'];
        }, {} ],
        12: [ function(_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', {
                value: !0
            }), exports['default'] = function(imageData, sensitivity, accuracy) {
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
            }, module.exports = exports['default'];
        }, {} ],
        13: [ function(_dereq_, module, exports) {
            'use strict';
            function _interopRequireDefault(obj) {
                return obj && obj.__esModule ? obj : {
                    'default': obj
                };
            }
            function sortByArea(a, b) {
                return a.x * a.y - b.y * b.x;
            }
            Object.defineProperty(exports, '__esModule', {
                value: !0
            });
            var _utilClamp = _dereq_('../util/clamp'), _utilClamp2 = _interopRequireDefault(_utilClamp);
            exports['default'] = function(points, maxPointCount, accuracy, width, height) {
                var result = [], sidePointCount = 2 * Math.ceil(width / (100 - accuracy)) + 2 * Math.ceil(height / (100 - accuracy)) + 2, pointCount = Math.max(points.length, maxPointCount), randomPointCount = (0, 
                _utilClamp2['default'])(pointCount - sidePointCount, 0, maxPointCount - sidePointCount), increment = pointCount / randomPointCount, i = 0, x = 0, y = 0, len = 0;
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
            }, module.exports = exports['default'];
        }, {
            '../util/clamp': 15
        } ],
        14: [ function(_dereq_, module, exports) {
            'use strict';
            function _interopRequireDefault(obj) {
                return obj && obj.__esModule ? obj : {
                    'default': obj
                };
            }
            Object.defineProperty(exports, '__esModule', {
                value: !0
            });
            var _stackblurCanvas = _dereq_('stackblur-canvas'), _stackblurCanvas2 = _interopRequireDefault(_stackblurCanvas), _delaunayFast = _dereq_('delaunay-fast'), _delaunayFast2 = _interopRequireDefault(_delaunayFast), _utilIsImageData = _dereq_('../util/isImageData'), _utilIsImageData2 = _interopRequireDefault(_utilIsImageData), _imagedataCopyImageData = _dereq_('../imagedata/copyImageData'), _imagedataCopyImageData2 = _interopRequireDefault(_imagedataCopyImageData), _imagedataGreyscale = _dereq_('../imagedata/greyscale'), _imagedataGreyscale2 = _interopRequireDefault(_imagedataGreyscale), _imagedataDetectEdges = _dereq_('../imagedata/detectEdges'), _imagedataDetectEdges2 = _interopRequireDefault(_imagedataDetectEdges), _getEdgePoints = _dereq_('./getEdgePoints'), _getEdgePoints2 = _interopRequireDefault(_getEdgePoints), _getVerticesFromPoints = _dereq_('./getVerticesFromPoints'), _getVerticesFromPoints2 = _interopRequireDefault(_getVerticesFromPoints), _addColorToPolygons = _dereq_('./addColorToPolygons'), _addColorToPolygons2 = _interopRequireDefault(_addColorToPolygons);
            exports['default'] = function(imageData, params) {
                if ((0, _utilIsImageData2['default'])(imageData)) {
                    var imageSize = {
                        width: imageData.width,
                        height: imageData.height
                    }, tmpImageData = (0, _imagedataCopyImageData2['default'])(imageData), colorImageData = (0, 
                    _imagedataCopyImageData2['default'])(imageData), blurredImageData = _stackblurCanvas2['default'].imageDataRGBA(tmpImageData, 0, 0, imageSize.width, imageSize.height, params.blur), greyscaleImageData = (0, 
                    _imagedataGreyscale2['default'])(blurredImageData), edgesImageData = (0, _imagedataDetectEdges2['default'])(greyscaleImageData), edgePoints = (0, 
                    _getEdgePoints2['default'])(edgesImageData, 50, params.accuracy), edgeVertices = (0, 
                    _getVerticesFromPoints2['default'])(edgePoints, params.vertexCount, params.accuracy, imageSize.width, imageSize.height), polygons = _delaunayFast2['default'].triangulate(edgeVertices);
                    return (0, _addColorToPolygons2['default'])(polygons, colorImageData, params);
                }
                throw new Error('Can\'t work with the imageData provided. It seems to be corrupt: ' + imageData.width + '#' + imageData.height + '#' + imageData.data.length);
            }, module.exports = exports['default'];
        }, {
            '../imagedata/copyImageData': 2,
            '../imagedata/detectEdges': 3,
            '../imagedata/greyscale': 4,
            '../util/isImageData': 17,
            './addColorToPolygons': 11,
            './getEdgePoints': 12,
            './getVerticesFromPoints': 13,
            'delaunay-fast': 19,
            'stackblur-canvas': 20
        } ],
        15: [ function(_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', {
                value: !0
            }), exports['default'] = function(value, min, max) {
                return min > value ? min : value > max ? max : value;
            }, module.exports = exports['default'];
        }, {} ],
        16: [ function(_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', {
                value: !0
            }), exports['default'] = function(ctx, polygons, size, dpr) {
                return dpr = dpr || 1, polygons.forEach(function(polygon, index) {
                    ctx.beginPath(), ctx.moveTo(polygon.a.x * dpr, polygon.a.y * dpr), ctx.lineTo(polygon.b.x * dpr, polygon.b.y * dpr), 
                    ctx.lineTo(polygon.c.x * dpr, polygon.c.y * dpr), ctx.lineTo(polygon.a.x * dpr, polygon.a.y * dpr), 
                    polygon.fill && (ctx.fillStyle = polygon.fill, ctx.fill()), polygon.strokeColor && (ctx.strokeStyle = polygon.strokeColor, 
                    ctx.lineWidth = polygon.strokeWidth * dpr, ctx.lineJoin = polygon.lineJoin, ctx.stroke()), 
                    ctx.closePath();
                }), ctx;
            }, module.exports = exports['default'];
        }, {} ],
        17: [ function(_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', {
                value: !0
            }), exports['default'] = function(imageData) {
                return imageData && 'number' == typeof imageData.width && 'number' == typeof imageData.height && imageData.data && 'number' == typeof imageData.data.length;
            }, module.exports = exports['default'];
        }, {} ],
        18: [ function(_dereq_, module, exports) {
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
        19: [ function(_dereq_, module, exports) {
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
        20: [ function(_dereq_, module, exports) {
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
    }, {}, [ 1 ])(1);
});