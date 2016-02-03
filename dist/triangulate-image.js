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
            };
            _dereq_('babel-polyfill');
            var _inputSanitizeInput = _dereq_('./input/sanitizeInput'), _inputSanitizeInput2 = _interopRequireDefault(_inputSanitizeInput), _inputBrowserFromImageToImageData = _dereq_('./input/browser/fromImageToImageData'), _inputBrowserFromImageToImageData2 = _interopRequireDefault(_inputBrowserFromImageToImageData), _outputPolygonsToImageData = _dereq_('./output/polygonsToImageData'), _outputPolygonsToImageData2 = _interopRequireDefault(_outputPolygonsToImageData), _outputPolygonsToDataURL = _dereq_('./output/polygonsToDataURL'), _outputPolygonsToDataURL2 = _interopRequireDefault(_outputPolygonsToDataURL), _outputPolygonsToSVG = _dereq_('./output/polygonsToSVG'), _outputPolygonsToSVG2 = _interopRequireDefault(_outputPolygonsToSVG), _polygonsImageDataToPolygons = _dereq_('./polygons/imageDataToPolygons'), _polygonsImageDataToPolygons2 = _interopRequireDefault(_polygonsImageDataToPolygons), _webworkify = _dereq_('webworkify'), _webworkify2 = _interopRequireDefault(_webworkify), _workersTriangulationWorker = _dereq_('./workers/triangulationWorker'), _workersTriangulationWorker2 = _interopRequireDefault(_workersTriangulationWorker);
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
                function fromImage(inputParams) {
                    return setInput(_inputBrowserFromImageToImageData2['default'], inputParams);
                }
                function fromImageSync(inputParams) {
                    return setInput(_inputBrowserFromImageToImageData2['default'], inputParams, !0);
                }
                function fromImageData(inputParams) {
                    return setInput(function(id) {
                        return id;
                    }, inputParams);
                }
                function fromImageDataSync(inputParams) {
                    return setInput(function(id) {
                        return id;
                    }, inputParams, !0);
                }
                function toData(outputParams) {
                    return setOutput(function(p) {
                        return p;
                    }, outputParams);
                }
                function toDataSync(outputParams) {
                    return setOutput(function(p) {
                        return p;
                    }, outputParams, !0);
                }
                function toDataURL(outputParams) {
                    return setOutput(_outputPolygonsToDataURL2['default'], outputParams);
                }
                function toDataURLSync(outputParams) {
                    return setOutput(_outputPolygonsToDataURL2['default'], outputParams, !0);
                }
                function toImageData(outputParams) {
                    return setOutput(_outputPolygonsToImageData2['default'], outputParams);
                }
                function toImageDataSync(outputParams) {
                    return setOutput(_outputPolygonsToImageData2['default'], outputParams, !0);
                }
                function toSVG(outputParams) {
                    return setOutput(_outputPolygonsToSVG2['default'], outputParams);
                }
                function toSVGSync(outputParams) {
                    return setOutput(_outputPolygonsToSVG2['default'], outputParams, !0);
                }
                function setInput(fn, inputParams, isSync) {
                    return isInputSync = !!isSync, inputFn = function() {
                        return isInputSync ? fn(inputParams) : new Promise(function(resolve, reject) {
                            try {
                                var imageData = fn(inputParams);
                                resolve(imageData);
                            } catch (err) {
                                reject(err);
                            }
                        });
                    }, isReady() ? getResult() : getOutput();
                }
                function setOutput(fn, outputpParams, isSync) {
                    return isOutputSync = !!isSync, outputFn = function(polygons, size) {
                        return isOutputSync ? fn(polygons, size, outputpParams) : new Promise(function(resolve, reject) {
                            try {
                                var outputData = fn(polygons, size, outputpParams);
                                resolve(outputData);
                            } catch (err) {
                                reject(err);
                            }
                        });
                    }, isReady() ? getResult() : getInput();
                }
                function isReady() {
                    return inputFn && outputFn;
                }
                function getResult() {
                    if (isInputSync && isOutputSync) {
                        var imageData = inputFn(params), polygonData = (0, _polygonsImageDataToPolygons2['default'])(imageData, params), outputData = outputFn(polygonData, imageData);
                        return outputData;
                    }
                    return new Promise(function(resolve, reject) {
                        var imageData;
                        makeInput().then(function(imgData) {
                            return imageData = imgData, makePolygonsInWorker(imageData, params);
                        }, reject).then(function(polygonData) {
                            return makeOutput(polygonData, imageData);
                        }, reject).then(function(outputData) {
                            resolve(outputData);
                        }, reject);
                    });
                }
                function makeInput(inputParams) {
                    return new Promise(function(resolve, reject) {
                        if (isInputSync) {
                            try {
                                var imageData = inputFn(inputParams);
                                resolve(imageData);
                            } catch (err) {
                                reject(err);
                            }
                        } else {
                            inputFn(inputParams).then(resolve, reject);
                        }
                    });
                }
                function makePolygonsInWorker(imageData, params) {
                    return new Promise(function(resolve, reject) {
                        worker.addEventListener('message', function(event) {
                            if (event.data && event.data.polygonJSONStr) {
                                var polygonData = JSON.parse(event.data.polygonJSONStr);
                                resolve(polygonData);
                            } else {
                                reject(event.data && event.data.err ? event.data.err : event);
                            }
                        }), worker.postMessage({
                            params: params,
                            imageData: imageData,
                            imageDataWidth: imageData.width,
                            imageDataHeight: imageData.height
                        });
                    });
                }
                function makeOutput(polygonData, imageData) {
                    return new Promise(function(resolve, reject) {
                        if (isOutputSync) {
                            try {
                                var outputData = outputFn(polygonData, imageData);
                                resolve(outputData);
                            } catch (e) {
                                reject(e);
                            }
                        } else {
                            outputFn(polygonData, imageData).then(resolve, reject);
                        }
                    });
                }
                params = (0, _inputSanitizeInput2['default'])(params);
                var isInputSync = !1, isOutputSync = !1, worker = (0, _webworkify2['default'])(_workersTriangulationWorker2['default']), inputFn = void 0, outputFn = void 0, api = {
                    getParams: getParams,
                    getInput: getInput,
                    getOutput: getOutput
                }, inputMethods = {
                    fromImage: fromImage,
                    fromImageSync: fromImageSync,
                    fromImageData: fromImageData,
                    fromImageDataSync: fromImageDataSync
                }, outputMethods = {
                    toData: toData,
                    toDataSync: toDataSync,
                    toDataURL: toDataURL,
                    toDataURLSync: toDataURLSync,
                    toImageData: toImageData,
                    toImageDataSync: toImageDataSync,
                    toSVG: toSVG,
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
            './polygons/imageDataToPolygons': 14,
            './workers/triangulationWorker': 18,
            'babel-polyfill': 19,
            webworkify: 212
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
            'canvas-browserify': 21
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
            'canvas-browserify': 21
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
            'canvas-browserify': 21
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
            'canvas-browserify': 21
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
            'delaunay-fast': 209,
            'stackblur-canvas': 211
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
            'use strict';
            function _interopRequireDefault(obj) {
                return obj && obj.__esModule ? obj : {
                    'default': obj
                };
            }
            function worker(self) {
                self.addEventListener('message', function(msg) {
                    if (msg.data.imageData && msg.data.params) {
                        try {
                            var imageData = msg.data.imageData;
                            'undefined' == typeof imageData.width && 'number' == typeof msg.data.imageDataWidth && (imageData.width = msg.data.imageDataWidth), 
                            'undefined' == typeof imageData.height && 'number' == typeof msg.data.imageDataHeight && (imageData.height = msg.data.imageDataHeight);
                            var polygons = (0, _polygonsImageDataToPolygons2['default'])(msg.data.imageData, msg.data.params);
                            self.postMessage({
                                polygonJSONStr: JSON.stringify(polygons)
                            });
                        } catch (err) {
                            self.postMessage({
                                err: err.message || err
                            });
                        }
                    } else {
                        msg.data.imageData ? self.postMessage({
                            err: 'Parameters are missing.'
                        }) : self.postMessage({
                            err: 'ImageData is missing.'
                        });
                    }
                    self.close();
                });
            }
            Object.defineProperty(exports, '__esModule', {
                value: !0
            }), exports['default'] = worker;
            var _polygonsImageDataToPolygons = _dereq_('../polygons/imageDataToPolygons'), _polygonsImageDataToPolygons2 = _interopRequireDefault(_polygonsImageDataToPolygons);
            module.exports = exports['default'];
        }, {
            '../polygons/imageDataToPolygons': 14
        } ],
        19: [ function(_dereq_, module, exports) {
            (function(global) {
                'use strict';
                _dereq_('core-js/shim');
                _dereq_('babel-regenerator-runtime');
                if (global._babelPolyfill) {
                    throw new Error('only one instance of babel-polyfill is allowed');
                }
                global._babelPolyfill = true;
            }).call(this, typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : {});
        }, {
            'babel-regenerator-runtime': 20,
            'core-js/shim': 208
        } ],
        20: [ function(_dereq_, module, exports) {
            (function(process, global) {
                !function(global) {
                    'use strict';
                    var hasOwn = Object.prototype.hasOwnProperty;
                    var undefined;
                    var iteratorSymbol = typeof Symbol === 'function' && Symbol.iterator || '@@iterator';
                    var inModule = typeof module === 'object';
                    var runtime = global.regeneratorRuntime;
                    if (runtime) {
                        if (inModule) {
                            module.exports = runtime;
                        }
                        return;
                    }
                    runtime = global.regeneratorRuntime = inModule ? module.exports : {};
                    function wrap(innerFn, outerFn, self, tryLocsList) {
                        var generator = Object.create((outerFn || Generator).prototype);
                        var context = new Context(tryLocsList || []);
                        generator._invoke = makeInvokeMethod(innerFn, self, context);
                        return generator;
                    }
                    runtime.wrap = wrap;
                    function tryCatch(fn, obj, arg) {
                        try {
                            return {
                                type: 'normal',
                                arg: fn.call(obj, arg)
                            };
                        } catch (err) {
                            return {
                                type: 'throw',
                                arg: err
                            };
                        }
                    }
                    var GenStateSuspendedStart = 'suspendedStart';
                    var GenStateSuspendedYield = 'suspendedYield';
                    var GenStateExecuting = 'executing';
                    var GenStateCompleted = 'completed';
                    var ContinueSentinel = {};
                    function Generator() {}
                    function GeneratorFunction() {}
                    function GeneratorFunctionPrototype() {}
                    var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype;
                    GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
                    GeneratorFunctionPrototype.constructor = GeneratorFunction;
                    GeneratorFunction.displayName = 'GeneratorFunction';
                    function defineIteratorMethods(prototype) {
                        [ 'next', 'throw', 'return' ].forEach(function(method) {
                            prototype[method] = function(arg) {
                                return this._invoke(method, arg);
                            };
                        });
                    }
                    runtime.isGeneratorFunction = function(genFun) {
                        var ctor = typeof genFun === 'function' && genFun.constructor;
                        return ctor ? ctor === GeneratorFunction || (ctor.displayName || ctor.name) === 'GeneratorFunction' : false;
                    };
                    runtime.mark = function(genFun) {
                        if (Object.setPrototypeOf) {
                            Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
                        } else {
                            genFun.__proto__ = GeneratorFunctionPrototype;
                        }
                        genFun.prototype = Object.create(Gp);
                        return genFun;
                    };
                    runtime.awrap = function(arg) {
                        return new AwaitArgument(arg);
                    };
                    function AwaitArgument(arg) {
                        this.arg = arg;
                    }
                    function AsyncIterator(generator) {
                        function invoke(method, arg) {
                            var result = generator[method](arg);
                            var value = result.value;
                            return value instanceof AwaitArgument ? Promise.resolve(value.arg).then(invokeNext, invokeThrow) : Promise.resolve(value).then(function(unwrapped) {
                                result.value = unwrapped;
                                return result;
                            });
                        }
                        if (typeof process === 'object' && process.domain) {
                            invoke = process.domain.bind(invoke);
                        }
                        var invokeNext = invoke.bind(generator, 'next');
                        var invokeThrow = invoke.bind(generator, 'throw');
                        var invokeReturn = invoke.bind(generator, 'return');
                        var previousPromise;
                        function enqueue(method, arg) {
                            function callInvokeWithMethodAndArg() {
                                return invoke(method, arg);
                            }
                            return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : new Promise(function(resolve) {
                                resolve(callInvokeWithMethodAndArg());
                            });
                        }
                        this._invoke = enqueue;
                    }
                    defineIteratorMethods(AsyncIterator.prototype);
                    runtime.async = function(innerFn, outerFn, self, tryLocsList) {
                        var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList));
                        return runtime.isGeneratorFunction(outerFn) ? iter : iter.next().then(function(result) {
                            return result.done ? result.value : iter.next();
                        });
                    };
                    function makeInvokeMethod(innerFn, self, context) {
                        var state = GenStateSuspendedStart;
                        return function invoke(method, arg) {
                            if (state === GenStateExecuting) {
                                throw new Error('Generator is already running');
                            }
                            if (state === GenStateCompleted) {
                                if (method === 'throw') {
                                    throw arg;
                                }
                                return doneResult();
                            }
                            while (true) {
                                var delegate = context.delegate;
                                if (delegate) {
                                    if (method === 'return' || method === 'throw' && delegate.iterator[method] === undefined) {
                                        context.delegate = null;
                                        var returnMethod = delegate.iterator['return'];
                                        if (returnMethod) {
                                            var record = tryCatch(returnMethod, delegate.iterator, arg);
                                            if (record.type === 'throw') {
                                                method = 'throw';
                                                arg = record.arg;
                                                continue;
                                            }
                                        }
                                        if (method === 'return') {
                                            continue;
                                        }
                                    }
                                    var record = tryCatch(delegate.iterator[method], delegate.iterator, arg);
                                    if (record.type === 'throw') {
                                        context.delegate = null;
                                        method = 'throw';
                                        arg = record.arg;
                                        continue;
                                    }
                                    method = 'next';
                                    arg = undefined;
                                    var info = record.arg;
                                    if (info.done) {
                                        context[delegate.resultName] = info.value;
                                        context.next = delegate.nextLoc;
                                    } else {
                                        state = GenStateSuspendedYield;
                                        return info;
                                    }
                                    context.delegate = null;
                                }
                                if (method === 'next') {
                                    context._sent = arg;
                                    if (state === GenStateSuspendedYield) {
                                        context.sent = arg;
                                    } else {
                                        context.sent = undefined;
                                    }
                                } else {
                                    if (method === 'throw') {
                                        if (state === GenStateSuspendedStart) {
                                            state = GenStateCompleted;
                                            throw arg;
                                        }
                                        if (context.dispatchException(arg)) {
                                            method = 'next';
                                            arg = undefined;
                                        }
                                    } else {
                                        if (method === 'return') {
                                            context.abrupt('return', arg);
                                        }
                                    }
                                }
                                state = GenStateExecuting;
                                var record = tryCatch(innerFn, self, context);
                                if (record.type === 'normal') {
                                    state = context.done ? GenStateCompleted : GenStateSuspendedYield;
                                    var info = {
                                        value: record.arg,
                                        done: context.done
                                    };
                                    if (record.arg === ContinueSentinel) {
                                        if (context.delegate && method === 'next') {
                                            arg = undefined;
                                        }
                                    } else {
                                        return info;
                                    }
                                } else {
                                    if (record.type === 'throw') {
                                        state = GenStateCompleted;
                                        method = 'throw';
                                        arg = record.arg;
                                    }
                                }
                            }
                        };
                    }
                    defineIteratorMethods(Gp);
                    Gp[iteratorSymbol] = function() {
                        return this;
                    };
                    Gp.toString = function() {
                        return '[object Generator]';
                    };
                    function pushTryEntry(locs) {
                        var entry = {
                            tryLoc: locs[0]
                        };
                        if (1 in locs) {
                            entry.catchLoc = locs[1];
                        }
                        if (2 in locs) {
                            entry.finallyLoc = locs[2];
                            entry.afterLoc = locs[3];
                        }
                        this.tryEntries.push(entry);
                    }
                    function resetTryEntry(entry) {
                        var record = entry.completion || {};
                        record.type = 'normal';
                        delete record.arg;
                        entry.completion = record;
                    }
                    function Context(tryLocsList) {
                        this.tryEntries = [ {
                            tryLoc: 'root'
                        } ];
                        tryLocsList.forEach(pushTryEntry, this);
                        this.reset(true);
                    }
                    runtime.keys = function(object) {
                        var keys = [];
                        for (var key in object) {
                            keys.push(key);
                        }
                        keys.reverse();
                        return function next() {
                            while (keys.length) {
                                var key = keys.pop();
                                if (key in object) {
                                    next.value = key;
                                    next.done = false;
                                    return next;
                                }
                            }
                            next.done = true;
                            return next;
                        };
                    };
                    function values(iterable) {
                        if (iterable) {
                            var iteratorMethod = iterable[iteratorSymbol];
                            if (iteratorMethod) {
                                return iteratorMethod.call(iterable);
                            }
                            if (typeof iterable.next === 'function') {
                                return iterable;
                            }
                            if (!isNaN(iterable.length)) {
                                var i = -1, next = function next() {
                                    while (++i < iterable.length) {
                                        if (hasOwn.call(iterable, i)) {
                                            next.value = iterable[i];
                                            next.done = false;
                                            return next;
                                        }
                                    }
                                    next.value = undefined;
                                    next.done = true;
                                    return next;
                                };
                                return next.next = next;
                            }
                        }
                        return {
                            next: doneResult
                        };
                    }
                    runtime.values = values;
                    function doneResult() {
                        return {
                            value: undefined,
                            done: true
                        };
                    }
                    Context.prototype = {
                        constructor: Context,
                        reset: function(skipTempReset) {
                            this.prev = 0;
                            this.next = 0;
                            this.sent = undefined;
                            this.done = false;
                            this.delegate = null;
                            this.tryEntries.forEach(resetTryEntry);
                            if (!skipTempReset) {
                                for (var name in this) {
                                    if (name.charAt(0) === 't' && hasOwn.call(this, name) && !isNaN(+name.slice(1))) {
                                        this[name] = undefined;
                                    }
                                }
                            }
                        },
                        stop: function() {
                            this.done = true;
                            var rootEntry = this.tryEntries[0];
                            var rootRecord = rootEntry.completion;
                            if (rootRecord.type === 'throw') {
                                throw rootRecord.arg;
                            }
                            return this.rval;
                        },
                        dispatchException: function(exception) {
                            if (this.done) {
                                throw exception;
                            }
                            var context = this;
                            function handle(loc, caught) {
                                record.type = 'throw';
                                record.arg = exception;
                                context.next = loc;
                                return !!caught;
                            }
                            for (var i = this.tryEntries.length - 1; i >= 0; --i) {
                                var entry = this.tryEntries[i];
                                var record = entry.completion;
                                if (entry.tryLoc === 'root') {
                                    return handle('end');
                                }
                                if (entry.tryLoc <= this.prev) {
                                    var hasCatch = hasOwn.call(entry, 'catchLoc');
                                    var hasFinally = hasOwn.call(entry, 'finallyLoc');
                                    if (hasCatch && hasFinally) {
                                        if (this.prev < entry.catchLoc) {
                                            return handle(entry.catchLoc, true);
                                        } else {
                                            if (this.prev < entry.finallyLoc) {
                                                return handle(entry.finallyLoc);
                                            }
                                        }
                                    } else {
                                        if (hasCatch) {
                                            if (this.prev < entry.catchLoc) {
                                                return handle(entry.catchLoc, true);
                                            }
                                        } else {
                                            if (hasFinally) {
                                                if (this.prev < entry.finallyLoc) {
                                                    return handle(entry.finallyLoc);
                                                }
                                            } else {
                                                throw new Error('try statement without catch or finally');
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        abrupt: function(type, arg) {
                            for (var i = this.tryEntries.length - 1; i >= 0; --i) {
                                var entry = this.tryEntries[i];
                                if (entry.tryLoc <= this.prev && hasOwn.call(entry, 'finallyLoc') && this.prev < entry.finallyLoc) {
                                    var finallyEntry = entry;
                                    break;
                                }
                            }
                            if (finallyEntry && (type === 'break' || type === 'continue') && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc) {
                                finallyEntry = null;
                            }
                            var record = finallyEntry ? finallyEntry.completion : {};
                            record.type = type;
                            record.arg = arg;
                            if (finallyEntry) {
                                this.next = finallyEntry.finallyLoc;
                            } else {
                                this.complete(record);
                            }
                            return ContinueSentinel;
                        },
                        complete: function(record, afterLoc) {
                            if (record.type === 'throw') {
                                throw record.arg;
                            }
                            if (record.type === 'break' || record.type === 'continue') {
                                this.next = record.arg;
                            } else {
                                if (record.type === 'return') {
                                    this.rval = record.arg;
                                    this.next = 'end';
                                } else {
                                    if (record.type === 'normal' && afterLoc) {
                                        this.next = afterLoc;
                                    }
                                }
                            }
                        },
                        finish: function(finallyLoc) {
                            for (var i = this.tryEntries.length - 1; i >= 0; --i) {
                                var entry = this.tryEntries[i];
                                if (entry.finallyLoc === finallyLoc) {
                                    this.complete(entry.completion, entry.afterLoc);
                                    resetTryEntry(entry);
                                    return ContinueSentinel;
                                }
                            }
                        },
                        'catch': function(tryLoc) {
                            for (var i = this.tryEntries.length - 1; i >= 0; --i) {
                                var entry = this.tryEntries[i];
                                if (entry.tryLoc === tryLoc) {
                                    var record = entry.completion;
                                    if (record.type === 'throw') {
                                        var thrown = record.arg;
                                        resetTryEntry(entry);
                                    }
                                    return thrown;
                                }
                            }
                            throw new Error('illegal catch attempt');
                        },
                        delegateYield: function(iterable, resultName, nextLoc) {
                            this.delegate = {
                                iterator: values(iterable),
                                resultName: resultName,
                                nextLoc: nextLoc
                            };
                            return ContinueSentinel;
                        }
                    };
                }(typeof global === 'object' ? global : typeof window === 'object' ? window : typeof self === 'object' ? self : this);
            }).call(this, _dereq_('_process'), typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : {});
        }, {
            _process: 210
        } ],
        21: [ function(_dereq_, module, exports) {
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
        22: [ function(_dereq_, module, exports) {
            module.exports = function(it) {
                if (typeof it != 'function') {
                    throw TypeError(it + ' is not a function!');
                }
                return it;
            };
        }, {} ],
        23: [ function(_dereq_, module, exports) {
            var UNSCOPABLES = _dereq_('./$.wks')('unscopables'), ArrayProto = Array.prototype;
            if (ArrayProto[UNSCOPABLES] == undefined) {
                _dereq_('./$.hide')(ArrayProto, UNSCOPABLES, {});
            }
            module.exports = function(key) {
                ArrayProto[UNSCOPABLES][key] = true;
            };
        }, {
            './$.hide': 51,
            './$.wks': 103
        } ],
        24: [ function(_dereq_, module, exports) {
            var isObject = _dereq_('./$.is-object');
            module.exports = function(it) {
                if (!isObject(it)) {
                    throw TypeError(it + ' is not an object!');
                }
                return it;
            };
        }, {
            './$.is-object': 58
        } ],
        25: [ function(_dereq_, module, exports) {
            'use strict';
            var toObject = _dereq_('./$.to-object'), toIndex = _dereq_('./$.to-index'), toLength = _dereq_('./$.to-length');
            module.exports = [].copyWithin || function copyWithin(target, start) {
                var O = toObject(this), len = toLength(O.length), to = toIndex(target, len), from = toIndex(start, len), $$ = arguments, end = $$.length > 2 ? $$[2] : undefined, count = Math.min((end === undefined ? len : toIndex(end, len)) - from, len - to), inc = 1;
                if (from < to && to < from + count) {
                    inc = -1;
                    from += count - 1;
                    to += count - 1;
                }
                while (count-- > 0) {
                    if (from in O) {
                        O[to] = O[from];
                    } else {
                        delete O[to];
                    }
                    to += inc;
                    from += inc;
                }
                return O;
            };
        }, {
            './$.to-index': 96,
            './$.to-length': 99,
            './$.to-object': 100
        } ],
        26: [ function(_dereq_, module, exports) {
            'use strict';
            var toObject = _dereq_('./$.to-object'), toIndex = _dereq_('./$.to-index'), toLength = _dereq_('./$.to-length');
            module.exports = [].fill || function fill(value) {
                var O = toObject(this), length = toLength(O.length), $$ = arguments, $$len = $$.length, index = toIndex($$len > 1 ? $$[1] : undefined, length), end = $$len > 2 ? $$[2] : undefined, endPos = end === undefined ? length : toIndex(end, length);
                while (endPos > index) {
                    O[index++] = value;
                }
                return O;
            };
        }, {
            './$.to-index': 96,
            './$.to-length': 99,
            './$.to-object': 100
        } ],
        27: [ function(_dereq_, module, exports) {
            var toIObject = _dereq_('./$.to-iobject'), toLength = _dereq_('./$.to-length'), toIndex = _dereq_('./$.to-index');
            module.exports = function(IS_INCLUDES) {
                return function($this, el, fromIndex) {
                    var O = toIObject($this), length = toLength(O.length), index = toIndex(fromIndex, length), value;
                    if (IS_INCLUDES && el != el) {
                        while (length > index) {
                            value = O[index++];
                            if (value != value) {
                                return true;
                            }
                        }
                    } else {
                        for (;length > index; index++) {
                            if (IS_INCLUDES || index in O) {
                                if (O[index] === el) {
                                    return IS_INCLUDES || index;
                                }
                            }
                        }
                    }
                    return !IS_INCLUDES && -1;
                };
            };
        }, {
            './$.to-index': 96,
            './$.to-iobject': 98,
            './$.to-length': 99
        } ],
        28: [ function(_dereq_, module, exports) {
            var ctx = _dereq_('./$.ctx'), IObject = _dereq_('./$.iobject'), toObject = _dereq_('./$.to-object'), toLength = _dereq_('./$.to-length'), asc = _dereq_('./$.array-species-create');
            module.exports = function(TYPE) {
                var IS_MAP = TYPE == 1, IS_FILTER = TYPE == 2, IS_SOME = TYPE == 3, IS_EVERY = TYPE == 4, IS_FIND_INDEX = TYPE == 6, NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
                return function($this, callbackfn, that) {
                    var O = toObject($this), self = IObject(O), f = ctx(callbackfn, that, 3), length = toLength(self.length), index = 0, result = IS_MAP ? asc($this, length) : IS_FILTER ? asc($this, 0) : undefined, val, res;
                    for (;length > index; index++) {
                        if (NO_HOLES || index in self) {
                            val = self[index];
                            res = f(val, index, O);
                            if (TYPE) {
                                if (IS_MAP) {
                                    result[index] = res;
                                } else {
                                    if (res) {
                                        switch (TYPE) {
                                          case 3:
                                            return true;

                                          case 5:
                                            return val;

                                          case 6:
                                            return index;

                                          case 2:
                                            result.push(val);
                                        }
                                    } else {
                                        if (IS_EVERY) {
                                            return false;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
                };
            };
        }, {
            './$.array-species-create': 29,
            './$.ctx': 37,
            './$.iobject': 54,
            './$.to-length': 99,
            './$.to-object': 100
        } ],
        29: [ function(_dereq_, module, exports) {
            var isObject = _dereq_('./$.is-object'), isArray = _dereq_('./$.is-array'), SPECIES = _dereq_('./$.wks')('species');
            module.exports = function(original, length) {
                var C;
                if (isArray(original)) {
                    C = original.constructor;
                    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) {
                        C = undefined;
                    }
                    if (isObject(C)) {
                        C = C[SPECIES];
                        if (C === null) {
                            C = undefined;
                        }
                    }
                }
                return new (C === undefined ? Array : C)(length);
            };
        }, {
            './$.is-array': 56,
            './$.is-object': 58,
            './$.wks': 103
        } ],
        30: [ function(_dereq_, module, exports) {
            var cof = _dereq_('./$.cof'), TAG = _dereq_('./$.wks')('toStringTag'), ARG = cof(function() {
                return arguments;
            }()) == 'Arguments';
            module.exports = function(it) {
                var O, T, B;
                return it === undefined ? 'Undefined' : it === null ? 'Null' : typeof (T = (O = Object(it))[TAG]) == 'string' ? T : ARG ? cof(O) : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
            };
        }, {
            './$.cof': 31,
            './$.wks': 103
        } ],
        31: [ function(_dereq_, module, exports) {
            var toString = {}.toString;
            module.exports = function(it) {
                return toString.call(it).slice(8, -1);
            };
        }, {} ],
        32: [ function(_dereq_, module, exports) {
            'use strict';
            var $ = _dereq_('./$'), hide = _dereq_('./$.hide'), redefineAll = _dereq_('./$.redefine-all'), ctx = _dereq_('./$.ctx'), strictNew = _dereq_('./$.strict-new'), defined = _dereq_('./$.defined'), forOf = _dereq_('./$.for-of'), $iterDefine = _dereq_('./$.iter-define'), step = _dereq_('./$.iter-step'), ID = _dereq_('./$.uid')('id'), $has = _dereq_('./$.has'), isObject = _dereq_('./$.is-object'), setSpecies = _dereq_('./$.set-species'), DESCRIPTORS = _dereq_('./$.descriptors'), isExtensible = Object.isExtensible || isObject, SIZE = DESCRIPTORS ? '_s' : 'size', id = 0;
            var fastKey = function(it, create) {
                if (!isObject(it)) {
                    return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
                }
                if (!$has(it, ID)) {
                    if (!isExtensible(it)) {
                        return 'F';
                    }
                    if (!create) {
                        return 'E';
                    }
                    hide(it, ID, ++id);
                }
                return 'O' + it[ID];
            };
            var getEntry = function(that, key) {
                var index = fastKey(key), entry;
                if (index !== 'F') {
                    return that._i[index];
                }
                for (entry = that._f; entry; entry = entry.n) {
                    if (entry.k == key) {
                        return entry;
                    }
                }
            };
            module.exports = {
                getConstructor: function(wrapper, NAME, IS_MAP, ADDER) {
                    var C = wrapper(function(that, iterable) {
                        strictNew(that, C, NAME);
                        that._i = $.create(null);
                        that._f = undefined;
                        that._l = undefined;
                        that[SIZE] = 0;
                        if (iterable != undefined) {
                            forOf(iterable, IS_MAP, that[ADDER], that);
                        }
                    });
                    redefineAll(C.prototype, {
                        clear: function clear() {
                            for (var that = this, data = that._i, entry = that._f; entry; entry = entry.n) {
                                entry.r = true;
                                if (entry.p) {
                                    entry.p = entry.p.n = undefined;
                                }
                                delete data[entry.i];
                            }
                            that._f = that._l = undefined;
                            that[SIZE] = 0;
                        },
                        'delete': function(key) {
                            var that = this, entry = getEntry(that, key);
                            if (entry) {
                                var next = entry.n, prev = entry.p;
                                delete that._i[entry.i];
                                entry.r = true;
                                if (prev) {
                                    prev.n = next;
                                }
                                if (next) {
                                    next.p = prev;
                                }
                                if (that._f == entry) {
                                    that._f = next;
                                }
                                if (that._l == entry) {
                                    that._l = prev;
                                }
                                that[SIZE]--;
                            }
                            return !!entry;
                        },
                        forEach: function forEach(callbackfn) {
                            var f = ctx(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3), entry;
                            while (entry = entry ? entry.n : this._f) {
                                f(entry.v, entry.k, this);
                                while (entry && entry.r) {
                                    entry = entry.p;
                                }
                            }
                        },
                        has: function has(key) {
                            return !!getEntry(this, key);
                        }
                    });
                    if (DESCRIPTORS) {
                        $.setDesc(C.prototype, 'size', {
                            get: function() {
                                return defined(this[SIZE]);
                            }
                        });
                    }
                    return C;
                },
                def: function(that, key, value) {
                    var entry = getEntry(that, key), prev, index;
                    if (entry) {
                        entry.v = value;
                    } else {
                        that._l = entry = {
                            i: index = fastKey(key, true),
                            k: key,
                            v: value,
                            p: prev = that._l,
                            n: undefined,
                            r: false
                        };
                        if (!that._f) {
                            that._f = entry;
                        }
                        if (prev) {
                            prev.n = entry;
                        }
                        that[SIZE]++;
                        if (index !== 'F') {
                            that._i[index] = entry;
                        }
                    }
                    return that;
                },
                getEntry: getEntry,
                setStrong: function(C, NAME, IS_MAP) {
                    $iterDefine(C, NAME, function(iterated, kind) {
                        this._t = iterated;
                        this._k = kind;
                        this._l = undefined;
                    }, function() {
                        var that = this, kind = that._k, entry = that._l;
                        while (entry && entry.r) {
                            entry = entry.p;
                        }
                        if (!that._t || !(that._l = entry = entry ? entry.n : that._t._f)) {
                            that._t = undefined;
                            return step(1);
                        }
                        if (kind == 'keys') {
                            return step(0, entry.k);
                        }
                        if (kind == 'values') {
                            return step(0, entry.v);
                        }
                        return step(0, [ entry.k, entry.v ]);
                    }, IS_MAP ? 'entries' : 'values', !IS_MAP, true);
                    setSpecies(NAME);
                }
            };
        }, {
            './$': 66,
            './$.ctx': 37,
            './$.defined': 38,
            './$.descriptors': 39,
            './$.for-of': 47,
            './$.has': 50,
            './$.hide': 51,
            './$.is-object': 58,
            './$.iter-define': 62,
            './$.iter-step': 64,
            './$.redefine-all': 80,
            './$.set-species': 85,
            './$.strict-new': 89,
            './$.uid': 102
        } ],
        33: [ function(_dereq_, module, exports) {
            var forOf = _dereq_('./$.for-of'), classof = _dereq_('./$.classof');
            module.exports = function(NAME) {
                return function toJSON() {
                    if (classof(this) != NAME) {
                        throw TypeError(NAME + '#toJSON isn\'t generic');
                    }
                    var arr = [];
                    forOf(this, false, arr.push, arr);
                    return arr;
                };
            };
        }, {
            './$.classof': 30,
            './$.for-of': 47
        } ],
        34: [ function(_dereq_, module, exports) {
            'use strict';
            var hide = _dereq_('./$.hide'), redefineAll = _dereq_('./$.redefine-all'), anObject = _dereq_('./$.an-object'), isObject = _dereq_('./$.is-object'), strictNew = _dereq_('./$.strict-new'), forOf = _dereq_('./$.for-of'), createArrayMethod = _dereq_('./$.array-methods'), $has = _dereq_('./$.has'), WEAK = _dereq_('./$.uid')('weak'), isExtensible = Object.isExtensible || isObject, arrayFind = createArrayMethod(5), arrayFindIndex = createArrayMethod(6), id = 0;
            var frozenStore = function(that) {
                return that._l || (that._l = new FrozenStore());
            };
            var FrozenStore = function() {
                this.a = [];
            };
            var findFrozen = function(store, key) {
                return arrayFind(store.a, function(it) {
                    return it[0] === key;
                });
            };
            FrozenStore.prototype = {
                get: function(key) {
                    var entry = findFrozen(this, key);
                    if (entry) {
                        return entry[1];
                    }
                },
                has: function(key) {
                    return !!findFrozen(this, key);
                },
                set: function(key, value) {
                    var entry = findFrozen(this, key);
                    if (entry) {
                        entry[1] = value;
                    } else {
                        this.a.push([ key, value ]);
                    }
                },
                'delete': function(key) {
                    var index = arrayFindIndex(this.a, function(it) {
                        return it[0] === key;
                    });
                    if (~index) {
                        this.a.splice(index, 1);
                    }
                    return !!~index;
                }
            };
            module.exports = {
                getConstructor: function(wrapper, NAME, IS_MAP, ADDER) {
                    var C = wrapper(function(that, iterable) {
                        strictNew(that, C, NAME);
                        that._i = id++;
                        that._l = undefined;
                        if (iterable != undefined) {
                            forOf(iterable, IS_MAP, that[ADDER], that);
                        }
                    });
                    redefineAll(C.prototype, {
                        'delete': function(key) {
                            if (!isObject(key)) {
                                return false;
                            }
                            if (!isExtensible(key)) {
                                return frozenStore(this)['delete'](key);
                            }
                            return $has(key, WEAK) && $has(key[WEAK], this._i) && delete key[WEAK][this._i];
                        },
                        has: function has(key) {
                            if (!isObject(key)) {
                                return false;
                            }
                            if (!isExtensible(key)) {
                                return frozenStore(this).has(key);
                            }
                            return $has(key, WEAK) && $has(key[WEAK], this._i);
                        }
                    });
                    return C;
                },
                def: function(that, key, value) {
                    if (!isExtensible(anObject(key))) {
                        frozenStore(that).set(key, value);
                    } else {
                        $has(key, WEAK) || hide(key, WEAK, {});
                        key[WEAK][that._i] = value;
                    }
                    return that;
                },
                frozenStore: frozenStore,
                WEAK: WEAK
            };
        }, {
            './$.an-object': 24,
            './$.array-methods': 28,
            './$.for-of': 47,
            './$.has': 50,
            './$.hide': 51,
            './$.is-object': 58,
            './$.redefine-all': 80,
            './$.strict-new': 89,
            './$.uid': 102
        } ],
        35: [ function(_dereq_, module, exports) {
            'use strict';
            var global = _dereq_('./$.global'), $export = _dereq_('./$.export'), redefine = _dereq_('./$.redefine'), redefineAll = _dereq_('./$.redefine-all'), forOf = _dereq_('./$.for-of'), strictNew = _dereq_('./$.strict-new'), isObject = _dereq_('./$.is-object'), fails = _dereq_('./$.fails'), $iterDetect = _dereq_('./$.iter-detect'), setToStringTag = _dereq_('./$.set-to-string-tag');
            module.exports = function(NAME, wrapper, methods, common, IS_MAP, IS_WEAK) {
                var Base = global[NAME], C = Base, ADDER = IS_MAP ? 'set' : 'add', proto = C && C.prototype, O = {};
                var fixMethod = function(KEY) {
                    var fn = proto[KEY];
                    redefine(proto, KEY, KEY == 'delete' ? function(a) {
                        return IS_WEAK && !isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
                    } : KEY == 'has' ? function has(a) {
                        return IS_WEAK && !isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
                    } : KEY == 'get' ? function get(a) {
                        return IS_WEAK && !isObject(a) ? undefined : fn.call(this, a === 0 ? 0 : a);
                    } : KEY == 'add' ? function add(a) {
                        fn.call(this, a === 0 ? 0 : a);
                        return this;
                    } : function set(a, b) {
                        fn.call(this, a === 0 ? 0 : a, b);
                        return this;
                    });
                };
                if (typeof C != 'function' || !(IS_WEAK || proto.forEach && !fails(function() {
                    new C().entries().next();
                }))) {
                    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
                    redefineAll(C.prototype, methods);
                } else {
                    var instance = new C(), HASNT_CHAINING = instance[ADDER](IS_WEAK ? {} : -0, 1) != instance, THROWS_ON_PRIMITIVES = fails(function() {
                        instance.has(1);
                    }), ACCEPT_ITERABLES = $iterDetect(function(iter) {
                        new C(iter);
                    }), BUGGY_ZERO;
                    if (!ACCEPT_ITERABLES) {
                        C = wrapper(function(target, iterable) {
                            strictNew(target, C, NAME);
                            var that = new Base();
                            if (iterable != undefined) {
                                forOf(iterable, IS_MAP, that[ADDER], that);
                            }
                            return that;
                        });
                        C.prototype = proto;
                        proto.constructor = C;
                    }
                    IS_WEAK || instance.forEach(function(val, key) {
                        BUGGY_ZERO = 1 / key === -Infinity;
                    });
                    if (THROWS_ON_PRIMITIVES || BUGGY_ZERO) {
                        fixMethod('delete');
                        fixMethod('has');
                        IS_MAP && fixMethod('get');
                    }
                    if (BUGGY_ZERO || HASNT_CHAINING) {
                        fixMethod(ADDER);
                    }
                    if (IS_WEAK && proto.clear) {
                        delete proto.clear;
                    }
                }
                setToStringTag(C, NAME);
                O[NAME] = C;
                $export($export.G + $export.W + $export.F * (C != Base), O);
                if (!IS_WEAK) {
                    common.setStrong(C, NAME, IS_MAP);
                }
                return C;
            };
        }, {
            './$.export': 42,
            './$.fails': 44,
            './$.for-of': 47,
            './$.global': 49,
            './$.is-object': 58,
            './$.iter-detect': 63,
            './$.redefine': 81,
            './$.redefine-all': 80,
            './$.set-to-string-tag': 86,
            './$.strict-new': 89
        } ],
        36: [ function(_dereq_, module, exports) {
            var core = module.exports = {
                version: '1.2.6'
            };
            if (typeof __e == 'number') {
                __e = core;
            }
        }, {} ],
        37: [ function(_dereq_, module, exports) {
            var aFunction = _dereq_('./$.a-function');
            module.exports = function(fn, that, length) {
                aFunction(fn);
                if (that === undefined) {
                    return fn;
                }
                switch (length) {
                  case 1:
                    return function(a) {
                        return fn.call(that, a);
                    };

                  case 2:
                    return function(a, b) {
                        return fn.call(that, a, b);
                    };

                  case 3:
                    return function(a, b, c) {
                        return fn.call(that, a, b, c);
                    };
                }
                return function() {
                    return fn.apply(that, arguments);
                };
            };
        }, {
            './$.a-function': 22
        } ],
        38: [ function(_dereq_, module, exports) {
            module.exports = function(it) {
                if (it == undefined) {
                    throw TypeError('Can\'t call method on  ' + it);
                }
                return it;
            };
        }, {} ],
        39: [ function(_dereq_, module, exports) {
            module.exports = !_dereq_('./$.fails')(function() {
                return Object.defineProperty({}, 'a', {
                    get: function() {
                        return 7;
                    }
                }).a != 7;
            });
        }, {
            './$.fails': 44
        } ],
        40: [ function(_dereq_, module, exports) {
            var isObject = _dereq_('./$.is-object'), document = _dereq_('./$.global').document, is = isObject(document) && isObject(document.createElement);
            module.exports = function(it) {
                return is ? document.createElement(it) : {};
            };
        }, {
            './$.global': 49,
            './$.is-object': 58
        } ],
        41: [ function(_dereq_, module, exports) {
            var $ = _dereq_('./$');
            module.exports = function(it) {
                var keys = $.getKeys(it), getSymbols = $.getSymbols;
                if (getSymbols) {
                    var symbols = getSymbols(it), isEnum = $.isEnum, i = 0, key;
                    while (symbols.length > i) {
                        if (isEnum.call(it, key = symbols[i++])) {
                            keys.push(key);
                        }
                    }
                }
                return keys;
            };
        }, {
            './$': 66
        } ],
        42: [ function(_dereq_, module, exports) {
            var global = _dereq_('./$.global'), core = _dereq_('./$.core'), hide = _dereq_('./$.hide'), redefine = _dereq_('./$.redefine'), ctx = _dereq_('./$.ctx'), PROTOTYPE = 'prototype';
            var $export = function(type, name, source) {
                var IS_FORCED = type & $export.F, IS_GLOBAL = type & $export.G, IS_STATIC = type & $export.S, IS_PROTO = type & $export.P, IS_BIND = type & $export.B, target = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE], exports = IS_GLOBAL ? core : core[name] || (core[name] = {}), expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {}), key, own, out, exp;
                if (IS_GLOBAL) {
                    source = name;
                }
                for (key in source) {
                    own = !IS_FORCED && target && key in target;
                    out = (own ? target : source)[key];
                    exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
                    if (target && !own) {
                        redefine(target, key, out);
                    }
                    if (exports[key] != out) {
                        hide(exports, key, exp);
                    }
                    if (IS_PROTO && expProto[key] != out) {
                        expProto[key] = out;
                    }
                }
            };
            global.core = core;
            $export.F = 1;
            $export.G = 2;
            $export.S = 4;
            $export.P = 8;
            $export.B = 16;
            $export.W = 32;
            module.exports = $export;
        }, {
            './$.core': 36,
            './$.ctx': 37,
            './$.global': 49,
            './$.hide': 51,
            './$.redefine': 81
        } ],
        43: [ function(_dereq_, module, exports) {
            var MATCH = _dereq_('./$.wks')('match');
            module.exports = function(KEY) {
                var re = /./;
                try {
                    '/./'[KEY](re);
                } catch (e) {
                    try {
                        re[MATCH] = false;
                        return !'/./'[KEY](re);
                    } catch (f) {}
                }
                return true;
            };
        }, {
            './$.wks': 103
        } ],
        44: [ function(_dereq_, module, exports) {
            module.exports = function(exec) {
                try {
                    return !!exec();
                } catch (e) {
                    return true;
                }
            };
        }, {} ],
        45: [ function(_dereq_, module, exports) {
            'use strict';
            var hide = _dereq_('./$.hide'), redefine = _dereq_('./$.redefine'), fails = _dereq_('./$.fails'), defined = _dereq_('./$.defined'), wks = _dereq_('./$.wks');
            module.exports = function(KEY, length, exec) {
                var SYMBOL = wks(KEY), original = ''[KEY];
                if (fails(function() {
                    var O = {};
                    O[SYMBOL] = function() {
                        return 7;
                    };
                    return ''[KEY](O) != 7;
                })) {
                    redefine(String.prototype, KEY, exec(defined, SYMBOL, original));
                    hide(RegExp.prototype, SYMBOL, length == 2 ? function(string, arg) {
                        return original.call(string, this, arg);
                    } : function(string) {
                        return original.call(string, this);
                    });
                }
            };
        }, {
            './$.defined': 38,
            './$.fails': 44,
            './$.hide': 51,
            './$.redefine': 81,
            './$.wks': 103
        } ],
        46: [ function(_dereq_, module, exports) {
            'use strict';
            var anObject = _dereq_('./$.an-object');
            module.exports = function() {
                var that = anObject(this), result = '';
                if (that.global) {
                    result += 'g';
                }
                if (that.ignoreCase) {
                    result += 'i';
                }
                if (that.multiline) {
                    result += 'm';
                }
                if (that.unicode) {
                    result += 'u';
                }
                if (that.sticky) {
                    result += 'y';
                }
                return result;
            };
        }, {
            './$.an-object': 24
        } ],
        47: [ function(_dereq_, module, exports) {
            var ctx = _dereq_('./$.ctx'), call = _dereq_('./$.iter-call'), isArrayIter = _dereq_('./$.is-array-iter'), anObject = _dereq_('./$.an-object'), toLength = _dereq_('./$.to-length'), getIterFn = _dereq_('./core.get-iterator-method');
            module.exports = function(iterable, entries, fn, that) {
                var iterFn = getIterFn(iterable), f = ctx(fn, that, entries ? 2 : 1), index = 0, length, step, iterator;
                if (typeof iterFn != 'function') {
                    throw TypeError(iterable + ' is not iterable!');
                }
                if (isArrayIter(iterFn)) {
                    for (length = toLength(iterable.length); length > index; index++) {
                        entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
                    }
                } else {
                    for (iterator = iterFn.call(iterable); !(step = iterator.next()).done; ) {
                        call(iterator, f, step.value, entries);
                    }
                }
            };
        }, {
            './$.an-object': 24,
            './$.ctx': 37,
            './$.is-array-iter': 55,
            './$.iter-call': 60,
            './$.to-length': 99,
            './core.get-iterator-method': 104
        } ],
        48: [ function(_dereq_, module, exports) {
            var toIObject = _dereq_('./$.to-iobject'), getNames = _dereq_('./$').getNames, toString = {}.toString;
            var windowNames = typeof window == 'object' && Object.getOwnPropertyNames ? Object.getOwnPropertyNames(window) : [];
            var getWindowNames = function(it) {
                try {
                    return getNames(it);
                } catch (e) {
                    return windowNames.slice();
                }
            };
            module.exports.get = function getOwnPropertyNames(it) {
                if (windowNames && toString.call(it) == '[object Window]') {
                    return getWindowNames(it);
                }
                return getNames(toIObject(it));
            };
        }, {
            './$': 66,
            './$.to-iobject': 98
        } ],
        49: [ function(_dereq_, module, exports) {
            var global = module.exports = typeof window != 'undefined' && window.Math == Math ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
            if (typeof __g == 'number') {
                __g = global;
            }
        }, {} ],
        50: [ function(_dereq_, module, exports) {
            var hasOwnProperty = {}.hasOwnProperty;
            module.exports = function(it, key) {
                return hasOwnProperty.call(it, key);
            };
        }, {} ],
        51: [ function(_dereq_, module, exports) {
            var $ = _dereq_('./$'), createDesc = _dereq_('./$.property-desc');
            module.exports = _dereq_('./$.descriptors') ? function(object, key, value) {
                return $.setDesc(object, key, createDesc(1, value));
            } : function(object, key, value) {
                object[key] = value;
                return object;
            };
        }, {
            './$': 66,
            './$.descriptors': 39,
            './$.property-desc': 79
        } ],
        52: [ function(_dereq_, module, exports) {
            module.exports = _dereq_('./$.global').document && document.documentElement;
        }, {
            './$.global': 49
        } ],
        53: [ function(_dereq_, module, exports) {
            module.exports = function(fn, args, that) {
                var un = that === undefined;
                switch (args.length) {
                  case 0:
                    return un ? fn() : fn.call(that);

                  case 1:
                    return un ? fn(args[0]) : fn.call(that, args[0]);

                  case 2:
                    return un ? fn(args[0], args[1]) : fn.call(that, args[0], args[1]);

                  case 3:
                    return un ? fn(args[0], args[1], args[2]) : fn.call(that, args[0], args[1], args[2]);

                  case 4:
                    return un ? fn(args[0], args[1], args[2], args[3]) : fn.call(that, args[0], args[1], args[2], args[3]);
                }
                return fn.apply(that, args);
            };
        }, {} ],
        54: [ function(_dereq_, module, exports) {
            var cof = _dereq_('./$.cof');
            module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it) {
                return cof(it) == 'String' ? it.split('') : Object(it);
            };
        }, {
            './$.cof': 31
        } ],
        55: [ function(_dereq_, module, exports) {
            var Iterators = _dereq_('./$.iterators'), ITERATOR = _dereq_('./$.wks')('iterator'), ArrayProto = Array.prototype;
            module.exports = function(it) {
                return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
            };
        }, {
            './$.iterators': 65,
            './$.wks': 103
        } ],
        56: [ function(_dereq_, module, exports) {
            var cof = _dereq_('./$.cof');
            module.exports = Array.isArray || function(arg) {
                return cof(arg) == 'Array';
            };
        }, {
            './$.cof': 31
        } ],
        57: [ function(_dereq_, module, exports) {
            var isObject = _dereq_('./$.is-object'), floor = Math.floor;
            module.exports = function isInteger(it) {
                return !isObject(it) && isFinite(it) && floor(it) === it;
            };
        }, {
            './$.is-object': 58
        } ],
        58: [ function(_dereq_, module, exports) {
            module.exports = function(it) {
                return typeof it === 'object' ? it !== null : typeof it === 'function';
            };
        }, {} ],
        59: [ function(_dereq_, module, exports) {
            var isObject = _dereq_('./$.is-object'), cof = _dereq_('./$.cof'), MATCH = _dereq_('./$.wks')('match');
            module.exports = function(it) {
                var isRegExp;
                return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : cof(it) == 'RegExp');
            };
        }, {
            './$.cof': 31,
            './$.is-object': 58,
            './$.wks': 103
        } ],
        60: [ function(_dereq_, module, exports) {
            var anObject = _dereq_('./$.an-object');
            module.exports = function(iterator, fn, value, entries) {
                try {
                    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
                } catch (e) {
                    var ret = iterator['return'];
                    if (ret !== undefined) {
                        anObject(ret.call(iterator));
                    }
                    throw e;
                }
            };
        }, {
            './$.an-object': 24
        } ],
        61: [ function(_dereq_, module, exports) {
            'use strict';
            var $ = _dereq_('./$'), descriptor = _dereq_('./$.property-desc'), setToStringTag = _dereq_('./$.set-to-string-tag'), IteratorPrototype = {};
            _dereq_('./$.hide')(IteratorPrototype, _dereq_('./$.wks')('iterator'), function() {
                return this;
            });
            module.exports = function(Constructor, NAME, next) {
                Constructor.prototype = $.create(IteratorPrototype, {
                    next: descriptor(1, next)
                });
                setToStringTag(Constructor, NAME + ' Iterator');
            };
        }, {
            './$': 66,
            './$.hide': 51,
            './$.property-desc': 79,
            './$.set-to-string-tag': 86,
            './$.wks': 103
        } ],
        62: [ function(_dereq_, module, exports) {
            'use strict';
            var LIBRARY = _dereq_('./$.library'), $export = _dereq_('./$.export'), redefine = _dereq_('./$.redefine'), hide = _dereq_('./$.hide'), has = _dereq_('./$.has'), Iterators = _dereq_('./$.iterators'), $iterCreate = _dereq_('./$.iter-create'), setToStringTag = _dereq_('./$.set-to-string-tag'), getProto = _dereq_('./$').getProto, ITERATOR = _dereq_('./$.wks')('iterator'), BUGGY = !([].keys && 'next' in [].keys()), FF_ITERATOR = '@@iterator', KEYS = 'keys', VALUES = 'values';
            var returnThis = function() {
                return this;
            };
            module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
                $iterCreate(Constructor, NAME, next);
                var getMethod = function(kind) {
                    if (!BUGGY && kind in proto) {
                        return proto[kind];
                    }
                    switch (kind) {
                      case KEYS:
                        return function keys() {
                            return new Constructor(this, kind);
                        };

                      case VALUES:
                        return function values() {
                            return new Constructor(this, kind);
                        };
                    }
                    return function entries() {
                        return new Constructor(this, kind);
                    };
                };
                var TAG = NAME + ' Iterator', DEF_VALUES = DEFAULT == VALUES, VALUES_BUG = false, proto = Base.prototype, $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT], $default = $native || getMethod(DEFAULT), methods, key;
                if ($native) {
                    var IteratorPrototype = getProto($default.call(new Base()));
                    setToStringTag(IteratorPrototype, TAG, true);
                    if (!LIBRARY && has(proto, FF_ITERATOR)) {
                        hide(IteratorPrototype, ITERATOR, returnThis);
                    }
                    if (DEF_VALUES && $native.name !== VALUES) {
                        VALUES_BUG = true;
                        $default = function values() {
                            return $native.call(this);
                        };
                    }
                }
                if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
                    hide(proto, ITERATOR, $default);
                }
                Iterators[NAME] = $default;
                Iterators[TAG] = returnThis;
                if (DEFAULT) {
                    methods = {
                        values: DEF_VALUES ? $default : getMethod(VALUES),
                        keys: IS_SET ? $default : getMethod(KEYS),
                        entries: !DEF_VALUES ? $default : getMethod('entries')
                    };
                    if (FORCED) {
                        for (key in methods) {
                            if (!(key in proto)) {
                                redefine(proto, key, methods[key]);
                            }
                        }
                    } else {
                        $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
                    }
                }
                return methods;
            };
        }, {
            './$': 66,
            './$.export': 42,
            './$.has': 50,
            './$.hide': 51,
            './$.iter-create': 61,
            './$.iterators': 65,
            './$.library': 68,
            './$.redefine': 81,
            './$.set-to-string-tag': 86,
            './$.wks': 103
        } ],
        63: [ function(_dereq_, module, exports) {
            var ITERATOR = _dereq_('./$.wks')('iterator'), SAFE_CLOSING = false;
            try {
                var riter = [ 7 ][ITERATOR]();
                riter['return'] = function() {
                    SAFE_CLOSING = true;
                };
                Array.from(riter, function() {
                    throw 2;
                });
            } catch (e) {}
            module.exports = function(exec, skipClosing) {
                if (!skipClosing && !SAFE_CLOSING) {
                    return false;
                }
                var safe = false;
                try {
                    var arr = [ 7 ], iter = arr[ITERATOR]();
                    iter.next = function() {
                        safe = true;
                    };
                    arr[ITERATOR] = function() {
                        return iter;
                    };
                    exec(arr);
                } catch (e) {}
                return safe;
            };
        }, {
            './$.wks': 103
        } ],
        64: [ function(_dereq_, module, exports) {
            module.exports = function(done, value) {
                return {
                    value: value,
                    done: !!done
                };
            };
        }, {} ],
        65: [ function(_dereq_, module, exports) {
            module.exports = {};
        }, {} ],
        66: [ function(_dereq_, module, exports) {
            var $Object = Object;
            module.exports = {
                create: $Object.create,
                getProto: $Object.getPrototypeOf,
                isEnum: {}.propertyIsEnumerable,
                getDesc: $Object.getOwnPropertyDescriptor,
                setDesc: $Object.defineProperty,
                setDescs: $Object.defineProperties,
                getKeys: $Object.keys,
                getNames: $Object.getOwnPropertyNames,
                getSymbols: $Object.getOwnPropertySymbols,
                each: [].forEach
            };
        }, {} ],
        67: [ function(_dereq_, module, exports) {
            var $ = _dereq_('./$'), toIObject = _dereq_('./$.to-iobject');
            module.exports = function(object, el) {
                var O = toIObject(object), keys = $.getKeys(O), length = keys.length, index = 0, key;
                while (length > index) {
                    if (O[key = keys[index++]] === el) {
                        return key;
                    }
                }
            };
        }, {
            './$': 66,
            './$.to-iobject': 98
        } ],
        68: [ function(_dereq_, module, exports) {
            module.exports = false;
        }, {} ],
        69: [ function(_dereq_, module, exports) {
            module.exports = Math.expm1 || function expm1(x) {
                return (x = +x) == 0 ? x : x > -1e-6 && x < 1e-6 ? x + x * x / 2 : Math.exp(x) - 1;
            };
        }, {} ],
        70: [ function(_dereq_, module, exports) {
            module.exports = Math.log1p || function log1p(x) {
                return (x = +x) > -1e-8 && x < 1e-8 ? x - x * x / 2 : Math.log(1 + x);
            };
        }, {} ],
        71: [ function(_dereq_, module, exports) {
            module.exports = Math.sign || function sign(x) {
                return (x = +x) == 0 || x != x ? x : x < 0 ? -1 : 1;
            };
        }, {} ],
        72: [ function(_dereq_, module, exports) {
            var global = _dereq_('./$.global'), macrotask = _dereq_('./$.task').set, Observer = global.MutationObserver || global.WebKitMutationObserver, process = global.process, Promise = global.Promise, isNode = _dereq_('./$.cof')(process) == 'process', head, last, notify;
            var flush = function() {
                var parent, domain, fn;
                if (isNode && (parent = process.domain)) {
                    process.domain = null;
                    parent.exit();
                }
                while (head) {
                    domain = head.domain;
                    fn = head.fn;
                    if (domain) {
                        domain.enter();
                    }
                    fn();
                    if (domain) {
                        domain.exit();
                    }
                    head = head.next;
                }
                last = undefined;
                if (parent) {
                    parent.enter();
                }
            };
            if (isNode) {
                notify = function() {
                    process.nextTick(flush);
                };
            } else {
                if (Observer) {
                    var toggle = 1, node = document.createTextNode('');
                    new Observer(flush).observe(node, {
                        characterData: true
                    });
                    notify = function() {
                        node.data = toggle = -toggle;
                    };
                } else {
                    if (Promise && Promise.resolve) {
                        notify = function() {
                            Promise.resolve().then(flush);
                        };
                    } else {
                        notify = function() {
                            macrotask.call(global, flush);
                        };
                    }
                }
            }
            module.exports = function asap(fn) {
                var task = {
                    fn: fn,
                    next: undefined,
                    domain: isNode && process.domain
                };
                if (last) {
                    last.next = task;
                }
                if (!head) {
                    head = task;
                    notify();
                }
                last = task;
            };
        }, {
            './$.cof': 31,
            './$.global': 49,
            './$.task': 95
        } ],
        73: [ function(_dereq_, module, exports) {
            var $ = _dereq_('./$'), toObject = _dereq_('./$.to-object'), IObject = _dereq_('./$.iobject');
            module.exports = _dereq_('./$.fails')(function() {
                var a = Object.assign, A = {}, B = {}, S = Symbol(), K = 'abcdefghijklmnopqrst';
                A[S] = 7;
                K.split('').forEach(function(k) {
                    B[k] = k;
                });
                return a({}, A)[S] != 7 || Object.keys(a({}, B)).join('') != K;
            }) ? function assign(target, source) {
                var T = toObject(target), $$ = arguments, $$len = $$.length, index = 1, getKeys = $.getKeys, getSymbols = $.getSymbols, isEnum = $.isEnum;
                while ($$len > index) {
                    var S = IObject($$[index++]), keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S), length = keys.length, j = 0, key;
                    while (length > j) {
                        if (isEnum.call(S, key = keys[j++])) {
                            T[key] = S[key];
                        }
                    }
                }
                return T;
            } : Object.assign;
        }, {
            './$': 66,
            './$.fails': 44,
            './$.iobject': 54,
            './$.to-object': 100
        } ],
        74: [ function(_dereq_, module, exports) {
            var $export = _dereq_('./$.export'), core = _dereq_('./$.core'), fails = _dereq_('./$.fails');
            module.exports = function(KEY, exec) {
                var fn = (core.Object || {})[KEY] || Object[KEY], exp = {};
                exp[KEY] = exec(fn);
                $export($export.S + $export.F * fails(function() {
                    fn(1);
                }), 'Object', exp);
            };
        }, {
            './$.core': 36,
            './$.export': 42,
            './$.fails': 44
        } ],
        75: [ function(_dereq_, module, exports) {
            var $ = _dereq_('./$'), toIObject = _dereq_('./$.to-iobject'), isEnum = $.isEnum;
            module.exports = function(isEntries) {
                return function(it) {
                    var O = toIObject(it), keys = $.getKeys(O), length = keys.length, i = 0, result = [], key;
                    while (length > i) {
                        if (isEnum.call(O, key = keys[i++])) {
                            result.push(isEntries ? [ key, O[key] ] : O[key]);
                        }
                    }
                    return result;
                };
            };
        }, {
            './$': 66,
            './$.to-iobject': 98
        } ],
        76: [ function(_dereq_, module, exports) {
            var $ = _dereq_('./$'), anObject = _dereq_('./$.an-object'), Reflect = _dereq_('./$.global').Reflect;
            module.exports = Reflect && Reflect.ownKeys || function ownKeys(it) {
                var keys = $.getNames(anObject(it)), getSymbols = $.getSymbols;
                return getSymbols ? keys.concat(getSymbols(it)) : keys;
            };
        }, {
            './$': 66,
            './$.an-object': 24,
            './$.global': 49
        } ],
        77: [ function(_dereq_, module, exports) {
            'use strict';
            var path = _dereq_('./$.path'), invoke = _dereq_('./$.invoke'), aFunction = _dereq_('./$.a-function');
            module.exports = function() {
                var fn = aFunction(this), length = arguments.length, pargs = Array(length), i = 0, _ = path._, holder = false;
                while (length > i) {
                    if ((pargs[i] = arguments[i++]) === _) {
                        holder = true;
                    }
                }
                return function() {
                    var that = this, $$ = arguments, $$len = $$.length, j = 0, k = 0, args;
                    if (!holder && !$$len) {
                        return invoke(fn, pargs, that);
                    }
                    args = pargs.slice();
                    if (holder) {
                        for (;length > j; j++) {
                            if (args[j] === _) {
                                args[j] = $$[k++];
                            }
                        }
                    }
                    while ($$len > k) {
                        args.push($$[k++]);
                    }
                    return invoke(fn, args, that);
                };
            };
        }, {
            './$.a-function': 22,
            './$.invoke': 53,
            './$.path': 78
        } ],
        78: [ function(_dereq_, module, exports) {
            module.exports = _dereq_('./$.global');
        }, {
            './$.global': 49
        } ],
        79: [ function(_dereq_, module, exports) {
            module.exports = function(bitmap, value) {
                return {
                    enumerable: !(bitmap & 1),
                    configurable: !(bitmap & 2),
                    writable: !(bitmap & 4),
                    value: value
                };
            };
        }, {} ],
        80: [ function(_dereq_, module, exports) {
            var redefine = _dereq_('./$.redefine');
            module.exports = function(target, src) {
                for (var key in src) {
                    redefine(target, key, src[key]);
                }
                return target;
            };
        }, {
            './$.redefine': 81
        } ],
        81: [ function(_dereq_, module, exports) {
            var global = _dereq_('./$.global'), hide = _dereq_('./$.hide'), SRC = _dereq_('./$.uid')('src'), TO_STRING = 'toString', $toString = Function[TO_STRING], TPL = ('' + $toString).split(TO_STRING);
            _dereq_('./$.core').inspectSource = function(it) {
                return $toString.call(it);
            };
            (module.exports = function(O, key, val, safe) {
                if (typeof val == 'function') {
                    val.hasOwnProperty(SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
                    val.hasOwnProperty('name') || hide(val, 'name', key);
                }
                if (O === global) {
                    O[key] = val;
                } else {
                    if (!safe) {
                        delete O[key];
                    }
                    hide(O, key, val);
                }
            })(Function.prototype, TO_STRING, function toString() {
                return typeof this == 'function' && this[SRC] || $toString.call(this);
            });
        }, {
            './$.core': 36,
            './$.global': 49,
            './$.hide': 51,
            './$.uid': 102
        } ],
        82: [ function(_dereq_, module, exports) {
            module.exports = function(regExp, replace) {
                var replacer = replace === Object(replace) ? function(part) {
                    return replace[part];
                } : replace;
                return function(it) {
                    return String(it).replace(regExp, replacer);
                };
            };
        }, {} ],
        83: [ function(_dereq_, module, exports) {
            module.exports = Object.is || function is(x, y) {
                return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
            };
        }, {} ],
        84: [ function(_dereq_, module, exports) {
            var getDesc = _dereq_('./$').getDesc, isObject = _dereq_('./$.is-object'), anObject = _dereq_('./$.an-object');
            var check = function(O, proto) {
                anObject(O);
                if (!isObject(proto) && proto !== null) {
                    throw TypeError(proto + ': can\'t set as prototype!');
                }
            };
            module.exports = {
                set: Object.setPrototypeOf || ('__proto__' in {} ? function(test, buggy, set) {
                    try {
                        set = _dereq_('./$.ctx')(Function.call, getDesc(Object.prototype, '__proto__').set, 2);
                        set(test, []);
                        buggy = !(test instanceof Array);
                    } catch (e) {
                        buggy = true;
                    }
                    return function setPrototypeOf(O, proto) {
                        check(O, proto);
                        if (buggy) {
                            O.__proto__ = proto;
                        } else {
                            set(O, proto);
                        }
                        return O;
                    };
                }({}, false) : undefined),
                check: check
            };
        }, {
            './$': 66,
            './$.an-object': 24,
            './$.ctx': 37,
            './$.is-object': 58
        } ],
        85: [ function(_dereq_, module, exports) {
            'use strict';
            var global = _dereq_('./$.global'), $ = _dereq_('./$'), DESCRIPTORS = _dereq_('./$.descriptors'), SPECIES = _dereq_('./$.wks')('species');
            module.exports = function(KEY) {
                var C = global[KEY];
                if (DESCRIPTORS && C && !C[SPECIES]) {
                    $.setDesc(C, SPECIES, {
                        configurable: true,
                        get: function() {
                            return this;
                        }
                    });
                }
            };
        }, {
            './$': 66,
            './$.descriptors': 39,
            './$.global': 49,
            './$.wks': 103
        } ],
        86: [ function(_dereq_, module, exports) {
            var def = _dereq_('./$').setDesc, has = _dereq_('./$.has'), TAG = _dereq_('./$.wks')('toStringTag');
            module.exports = function(it, tag, stat) {
                if (it && !has(it = stat ? it : it.prototype, TAG)) {
                    def(it, TAG, {
                        configurable: true,
                        value: tag
                    });
                }
            };
        }, {
            './$': 66,
            './$.has': 50,
            './$.wks': 103
        } ],
        87: [ function(_dereq_, module, exports) {
            var global = _dereq_('./$.global'), SHARED = '__core-js_shared__', store = global[SHARED] || (global[SHARED] = {});
            module.exports = function(key) {
                return store[key] || (store[key] = {});
            };
        }, {
            './$.global': 49
        } ],
        88: [ function(_dereq_, module, exports) {
            var anObject = _dereq_('./$.an-object'), aFunction = _dereq_('./$.a-function'), SPECIES = _dereq_('./$.wks')('species');
            module.exports = function(O, D) {
                var C = anObject(O).constructor, S;
                return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
            };
        }, {
            './$.a-function': 22,
            './$.an-object': 24,
            './$.wks': 103
        } ],
        89: [ function(_dereq_, module, exports) {
            module.exports = function(it, Constructor, name) {
                if (!(it instanceof Constructor)) {
                    throw TypeError(name + ': use the \'new\' operator!');
                }
                return it;
            };
        }, {} ],
        90: [ function(_dereq_, module, exports) {
            var toInteger = _dereq_('./$.to-integer'), defined = _dereq_('./$.defined');
            module.exports = function(TO_STRING) {
                return function(that, pos) {
                    var s = String(defined(that)), i = toInteger(pos), l = s.length, a, b;
                    if (i < 0 || i >= l) {
                        return TO_STRING ? '' : undefined;
                    }
                    a = s.charCodeAt(i);
                    return a < 55296 || a > 56319 || i + 1 === l || (b = s.charCodeAt(i + 1)) < 56320 || b > 57343 ? TO_STRING ? s.charAt(i) : a : TO_STRING ? s.slice(i, i + 2) : (a - 55296 << 10) + (b - 56320) + 65536;
                };
            };
        }, {
            './$.defined': 38,
            './$.to-integer': 97
        } ],
        91: [ function(_dereq_, module, exports) {
            var isRegExp = _dereq_('./$.is-regexp'), defined = _dereq_('./$.defined');
            module.exports = function(that, searchString, NAME) {
                if (isRegExp(searchString)) {
                    throw TypeError('String#' + NAME + ' doesn\'t accept regex!');
                }
                return String(defined(that));
            };
        }, {
            './$.defined': 38,
            './$.is-regexp': 59
        } ],
        92: [ function(_dereq_, module, exports) {
            var toLength = _dereq_('./$.to-length'), repeat = _dereq_('./$.string-repeat'), defined = _dereq_('./$.defined');
            module.exports = function(that, maxLength, fillString, left) {
                var S = String(defined(that)), stringLength = S.length, fillStr = fillString === undefined ? ' ' : String(fillString), intMaxLength = toLength(maxLength);
                if (intMaxLength <= stringLength) {
                    return S;
                }
                if (fillStr == '') {
                    fillStr = ' ';
                }
                var fillLen = intMaxLength - stringLength, stringFiller = repeat.call(fillStr, Math.ceil(fillLen / fillStr.length));
                if (stringFiller.length > fillLen) {
                    stringFiller = stringFiller.slice(0, fillLen);
                }
                return left ? stringFiller + S : S + stringFiller;
            };
        }, {
            './$.defined': 38,
            './$.string-repeat': 93,
            './$.to-length': 99
        } ],
        93: [ function(_dereq_, module, exports) {
            'use strict';
            var toInteger = _dereq_('./$.to-integer'), defined = _dereq_('./$.defined');
            module.exports = function repeat(count) {
                var str = String(defined(this)), res = '', n = toInteger(count);
                if (n < 0 || n == Infinity) {
                    throw RangeError('Count can\'t be negative');
                }
                for (;n > 0; (n >>>= 1) && (str += str)) {
                    if (n & 1) {
                        res += str;
                    }
                }
                return res;
            };
        }, {
            './$.defined': 38,
            './$.to-integer': 97
        } ],
        94: [ function(_dereq_, module, exports) {
            var $export = _dereq_('./$.export'), defined = _dereq_('./$.defined'), fails = _dereq_('./$.fails'), spaces = '	\n\x0B\f\r   ᠎    ' + '         　\u2028\u2029\ufeff', space = '[' + spaces + ']', non = '​', ltrim = RegExp('^' + space + space + '*'), rtrim = RegExp(space + space + '*$');
            var exporter = function(KEY, exec) {
                var exp = {};
                exp[KEY] = exec(trim);
                $export($export.P + $export.F * fails(function() {
                    return !!spaces[KEY]() || non[KEY]() != non;
                }), 'String', exp);
            };
            var trim = exporter.trim = function(string, TYPE) {
                string = String(defined(string));
                if (TYPE & 1) {
                    string = string.replace(ltrim, '');
                }
                if (TYPE & 2) {
                    string = string.replace(rtrim, '');
                }
                return string;
            };
            module.exports = exporter;
        }, {
            './$.defined': 38,
            './$.export': 42,
            './$.fails': 44
        } ],
        95: [ function(_dereq_, module, exports) {
            var ctx = _dereq_('./$.ctx'), invoke = _dereq_('./$.invoke'), html = _dereq_('./$.html'), cel = _dereq_('./$.dom-create'), global = _dereq_('./$.global'), process = global.process, setTask = global.setImmediate, clearTask = global.clearImmediate, MessageChannel = global.MessageChannel, counter = 0, queue = {}, ONREADYSTATECHANGE = 'onreadystatechange', defer, channel, port;
            var run = function() {
                var id = +this;
                if (queue.hasOwnProperty(id)) {
                    var fn = queue[id];
                    delete queue[id];
                    fn();
                }
            };
            var listner = function(event) {
                run.call(event.data);
            };
            if (!setTask || !clearTask) {
                setTask = function setImmediate(fn) {
                    var args = [], i = 1;
                    while (arguments.length > i) {
                        args.push(arguments[i++]);
                    }
                    queue[++counter] = function() {
                        invoke(typeof fn == 'function' ? fn : Function(fn), args);
                    };
                    defer(counter);
                    return counter;
                };
                clearTask = function clearImmediate(id) {
                    delete queue[id];
                };
                if (_dereq_('./$.cof')(process) == 'process') {
                    defer = function(id) {
                        process.nextTick(ctx(run, id, 1));
                    };
                } else {
                    if (MessageChannel) {
                        channel = new MessageChannel();
                        port = channel.port2;
                        channel.port1.onmessage = listner;
                        defer = ctx(port.postMessage, port, 1);
                    } else {
                        if (global.addEventListener && typeof postMessage == 'function' && !global.importScripts) {
                            defer = function(id) {
                                global.postMessage(id + '', '*');
                            };
                            global.addEventListener('message', listner, false);
                        } else {
                            if (ONREADYSTATECHANGE in cel('script')) {
                                defer = function(id) {
                                    html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function() {
                                        html.removeChild(this);
                                        run.call(id);
                                    };
                                };
                            } else {
                                defer = function(id) {
                                    setTimeout(ctx(run, id, 1), 0);
                                };
                            }
                        }
                    }
                }
            }
            module.exports = {
                set: setTask,
                clear: clearTask
            };
        }, {
            './$.cof': 31,
            './$.ctx': 37,
            './$.dom-create': 40,
            './$.global': 49,
            './$.html': 52,
            './$.invoke': 53
        } ],
        96: [ function(_dereq_, module, exports) {
            var toInteger = _dereq_('./$.to-integer'), max = Math.max, min = Math.min;
            module.exports = function(index, length) {
                index = toInteger(index);
                return index < 0 ? max(index + length, 0) : min(index, length);
            };
        }, {
            './$.to-integer': 97
        } ],
        97: [ function(_dereq_, module, exports) {
            var ceil = Math.ceil, floor = Math.floor;
            module.exports = function(it) {
                return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
            };
        }, {} ],
        98: [ function(_dereq_, module, exports) {
            var IObject = _dereq_('./$.iobject'), defined = _dereq_('./$.defined');
            module.exports = function(it) {
                return IObject(defined(it));
            };
        }, {
            './$.defined': 38,
            './$.iobject': 54
        } ],
        99: [ function(_dereq_, module, exports) {
            var toInteger = _dereq_('./$.to-integer'), min = Math.min;
            module.exports = function(it) {
                return it > 0 ? min(toInteger(it), 9007199254740991) : 0;
            };
        }, {
            './$.to-integer': 97
        } ],
        100: [ function(_dereq_, module, exports) {
            var defined = _dereq_('./$.defined');
            module.exports = function(it) {
                return Object(defined(it));
            };
        }, {
            './$.defined': 38
        } ],
        101: [ function(_dereq_, module, exports) {
            var isObject = _dereq_('./$.is-object');
            module.exports = function(it, S) {
                if (!isObject(it)) {
                    return it;
                }
                var fn, val;
                if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) {
                    return val;
                }
                if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) {
                    return val;
                }
                if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) {
                    return val;
                }
                throw TypeError('Can\'t convert object to primitive value');
            };
        }, {
            './$.is-object': 58
        } ],
        102: [ function(_dereq_, module, exports) {
            var id = 0, px = Math.random();
            module.exports = function(key) {
                return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
            };
        }, {} ],
        103: [ function(_dereq_, module, exports) {
            var store = _dereq_('./$.shared')('wks'), uid = _dereq_('./$.uid'), Symbol = _dereq_('./$.global').Symbol;
            module.exports = function(name) {
                return store[name] || (store[name] = Symbol && Symbol[name] || (Symbol || uid)('Symbol.' + name));
            };
        }, {
            './$.global': 49,
            './$.shared': 87,
            './$.uid': 102
        } ],
        104: [ function(_dereq_, module, exports) {
            var classof = _dereq_('./$.classof'), ITERATOR = _dereq_('./$.wks')('iterator'), Iterators = _dereq_('./$.iterators');
            module.exports = _dereq_('./$.core').getIteratorMethod = function(it) {
                if (it != undefined) {
                    return it[ITERATOR] || it['@@iterator'] || Iterators[classof(it)];
                }
            };
        }, {
            './$.classof': 30,
            './$.core': 36,
            './$.iterators': 65,
            './$.wks': 103
        } ],
        105: [ function(_dereq_, module, exports) {
            'use strict';
            var $ = _dereq_('./$'), $export = _dereq_('./$.export'), DESCRIPTORS = _dereq_('./$.descriptors'), createDesc = _dereq_('./$.property-desc'), html = _dereq_('./$.html'), cel = _dereq_('./$.dom-create'), has = _dereq_('./$.has'), cof = _dereq_('./$.cof'), invoke = _dereq_('./$.invoke'), fails = _dereq_('./$.fails'), anObject = _dereq_('./$.an-object'), aFunction = _dereq_('./$.a-function'), isObject = _dereq_('./$.is-object'), toObject = _dereq_('./$.to-object'), toIObject = _dereq_('./$.to-iobject'), toInteger = _dereq_('./$.to-integer'), toIndex = _dereq_('./$.to-index'), toLength = _dereq_('./$.to-length'), IObject = _dereq_('./$.iobject'), IE_PROTO = _dereq_('./$.uid')('__proto__'), createArrayMethod = _dereq_('./$.array-methods'), arrayIndexOf = _dereq_('./$.array-includes')(false), ObjectProto = Object.prototype, ArrayProto = Array.prototype, arraySlice = ArrayProto.slice, arrayJoin = ArrayProto.join, defineProperty = $.setDesc, getOwnDescriptor = $.getDesc, defineProperties = $.setDescs, factories = {}, IE8_DOM_DEFINE;
            if (!DESCRIPTORS) {
                IE8_DOM_DEFINE = !fails(function() {
                    return defineProperty(cel('div'), 'a', {
                        get: function() {
                            return 7;
                        }
                    }).a != 7;
                });
                $.setDesc = function(O, P, Attributes) {
                    if (IE8_DOM_DEFINE) {
                        try {
                            return defineProperty(O, P, Attributes);
                        } catch (e) {}
                    }
                    if ('get' in Attributes || 'set' in Attributes) {
                        throw TypeError('Accessors not supported!');
                    }
                    if ('value' in Attributes) {
                        anObject(O)[P] = Attributes.value;
                    }
                    return O;
                };
                $.getDesc = function(O, P) {
                    if (IE8_DOM_DEFINE) {
                        try {
                            return getOwnDescriptor(O, P);
                        } catch (e) {}
                    }
                    if (has(O, P)) {
                        return createDesc(!ObjectProto.propertyIsEnumerable.call(O, P), O[P]);
                    }
                };
                $.setDescs = defineProperties = function(O, Properties) {
                    anObject(O);
                    var keys = $.getKeys(Properties), length = keys.length, i = 0, P;
                    while (length > i) {
                        $.setDesc(O, P = keys[i++], Properties[P]);
                    }
                    return O;
                };
            }
            $export($export.S + $export.F * !DESCRIPTORS, 'Object', {
                getOwnPropertyDescriptor: $.getDesc,
                defineProperty: $.setDesc,
                defineProperties: defineProperties
            });
            var keys1 = ('constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,' + 'toLocaleString,toString,valueOf').split(','), keys2 = keys1.concat('length', 'prototype'), keysLen1 = keys1.length;
            var createDict = function() {
                var iframe = cel('iframe'), i = keysLen1, gt = '>', iframeDocument;
                iframe.style.display = 'none';
                html.appendChild(iframe);
                iframe.src = 'javascript:';
                iframeDocument = iframe.contentWindow.document;
                iframeDocument.open();
                iframeDocument.write('<script>document.F=Object</script' + gt);
                iframeDocument.close();
                createDict = iframeDocument.F;
                while (i--) {
                    delete createDict.prototype[keys1[i]];
                }
                return createDict();
            };
            var createGetKeys = function(names, length) {
                return function(object) {
                    var O = toIObject(object), i = 0, result = [], key;
                    for (key in O) {
                        if (key != IE_PROTO) {
                            has(O, key) && result.push(key);
                        }
                    }
                    while (length > i) {
                        if (has(O, key = names[i++])) {
                            ~arrayIndexOf(result, key) || result.push(key);
                        }
                    }
                    return result;
                };
            };
            var Empty = function() {};
            $export($export.S, 'Object', {
                getPrototypeOf: $.getProto = $.getProto || function(O) {
                    O = toObject(O);
                    if (has(O, IE_PROTO)) {
                        return O[IE_PROTO];
                    }
                    if (typeof O.constructor == 'function' && O instanceof O.constructor) {
                        return O.constructor.prototype;
                    }
                    return O instanceof Object ? ObjectProto : null;
                },
                getOwnPropertyNames: $.getNames = $.getNames || createGetKeys(keys2, keys2.length, true),
                create: $.create = $.create || function(O, Properties) {
                    var result;
                    if (O !== null) {
                        Empty.prototype = anObject(O);
                        result = new Empty();
                        Empty.prototype = null;
                        result[IE_PROTO] = O;
                    } else {
                        result = createDict();
                    }
                    return Properties === undefined ? result : defineProperties(result, Properties);
                },
                keys: $.getKeys = $.getKeys || createGetKeys(keys1, keysLen1, false)
            });
            var construct = function(F, len, args) {
                if (!(len in factories)) {
                    for (var n = [], i = 0; i < len; i++) {
                        n[i] = 'a[' + i + ']';
                    }
                    factories[len] = Function('F,a', 'return new F(' + n.join(',') + ')');
                }
                return factories[len](F, args);
            };
            $export($export.P, 'Function', {
                bind: function bind(that) {
                    var fn = aFunction(this), partArgs = arraySlice.call(arguments, 1);
                    var bound = function() {
                        var args = partArgs.concat(arraySlice.call(arguments));
                        return this instanceof bound ? construct(fn, args.length, args) : invoke(fn, args, that);
                    };
                    if (isObject(fn.prototype)) {
                        bound.prototype = fn.prototype;
                    }
                    return bound;
                }
            });
            $export($export.P + $export.F * fails(function() {
                if (html) {
                    arraySlice.call(html);
                }
            }), 'Array', {
                slice: function(begin, end) {
                    var len = toLength(this.length), klass = cof(this);
                    end = end === undefined ? len : end;
                    if (klass == 'Array') {
                        return arraySlice.call(this, begin, end);
                    }
                    var start = toIndex(begin, len), upTo = toIndex(end, len), size = toLength(upTo - start), cloned = Array(size), i = 0;
                    for (;i < size; i++) {
                        cloned[i] = klass == 'String' ? this.charAt(start + i) : this[start + i];
                    }
                    return cloned;
                }
            });
            $export($export.P + $export.F * (IObject != Object), 'Array', {
                join: function join(separator) {
                    return arrayJoin.call(IObject(this), separator === undefined ? ',' : separator);
                }
            });
            $export($export.S, 'Array', {
                isArray: _dereq_('./$.is-array')
            });
            var createArrayReduce = function(isRight) {
                return function(callbackfn, memo) {
                    aFunction(callbackfn);
                    var O = IObject(this), length = toLength(O.length), index = isRight ? length - 1 : 0, i = isRight ? -1 : 1;
                    if (arguments.length < 2) {
                        for (;;) {
                            if (index in O) {
                                memo = O[index];
                                index += i;
                                break;
                            }
                            index += i;
                            if (isRight ? index < 0 : length <= index) {
                                throw TypeError('Reduce of empty array with no initial value');
                            }
                        }
                    }
                    for (;isRight ? index >= 0 : length > index; index += i) {
                        if (index in O) {
                            memo = callbackfn(memo, O[index], index, this);
                        }
                    }
                    return memo;
                };
            };
            var methodize = function($fn) {
                return function(arg1) {
                    return $fn(this, arg1, arguments[1]);
                };
            };
            $export($export.P, 'Array', {
                forEach: $.each = $.each || methodize(createArrayMethod(0)),
                map: methodize(createArrayMethod(1)),
                filter: methodize(createArrayMethod(2)),
                some: methodize(createArrayMethod(3)),
                every: methodize(createArrayMethod(4)),
                reduce: createArrayReduce(false),
                reduceRight: createArrayReduce(true),
                indexOf: methodize(arrayIndexOf),
                lastIndexOf: function(el, fromIndex) {
                    var O = toIObject(this), length = toLength(O.length), index = length - 1;
                    if (arguments.length > 1) {
                        index = Math.min(index, toInteger(fromIndex));
                    }
                    if (index < 0) {
                        index = toLength(length + index);
                    }
                    for (;index >= 0; index--) {
                        if (index in O) {
                            if (O[index] === el) {
                                return index;
                            }
                        }
                    }
                    return -1;
                }
            });
            $export($export.S, 'Date', {
                now: function() {
                    return +new Date();
                }
            });
            var lz = function(num) {
                return num > 9 ? num : '0' + num;
            };
            $export($export.P + $export.F * (fails(function() {
                return new Date(-5e13 - 1).toISOString() != '0385-07-25T07:06:39.999Z';
            }) || !fails(function() {
                new Date(NaN).toISOString();
            })), 'Date', {
                toISOString: function toISOString() {
                    if (!isFinite(this)) {
                        throw RangeError('Invalid time value');
                    }
                    var d = this, y = d.getUTCFullYear(), m = d.getUTCMilliseconds(), s = y < 0 ? '-' : y > 9999 ? '+' : '';
                    return s + ('00000' + Math.abs(y)).slice(s ? -6 : -4) + '-' + lz(d.getUTCMonth() + 1) + '-' + lz(d.getUTCDate()) + 'T' + lz(d.getUTCHours()) + ':' + lz(d.getUTCMinutes()) + ':' + lz(d.getUTCSeconds()) + '.' + (m > 99 ? m : '0' + lz(m)) + 'Z';
                }
            });
        }, {
            './$': 66,
            './$.a-function': 22,
            './$.an-object': 24,
            './$.array-includes': 27,
            './$.array-methods': 28,
            './$.cof': 31,
            './$.descriptors': 39,
            './$.dom-create': 40,
            './$.export': 42,
            './$.fails': 44,
            './$.has': 50,
            './$.html': 52,
            './$.invoke': 53,
            './$.iobject': 54,
            './$.is-array': 56,
            './$.is-object': 58,
            './$.property-desc': 79,
            './$.to-index': 96,
            './$.to-integer': 97,
            './$.to-iobject': 98,
            './$.to-length': 99,
            './$.to-object': 100,
            './$.uid': 102
        } ],
        106: [ function(_dereq_, module, exports) {
            var $export = _dereq_('./$.export');
            $export($export.P, 'Array', {
                copyWithin: _dereq_('./$.array-copy-within')
            });
            _dereq_('./$.add-to-unscopables')('copyWithin');
        }, {
            './$.add-to-unscopables': 23,
            './$.array-copy-within': 25,
            './$.export': 42
        } ],
        107: [ function(_dereq_, module, exports) {
            var $export = _dereq_('./$.export');
            $export($export.P, 'Array', {
                fill: _dereq_('./$.array-fill')
            });
            _dereq_('./$.add-to-unscopables')('fill');
        }, {
            './$.add-to-unscopables': 23,
            './$.array-fill': 26,
            './$.export': 42
        } ],
        108: [ function(_dereq_, module, exports) {
            'use strict';
            var $export = _dereq_('./$.export'), $find = _dereq_('./$.array-methods')(6), KEY = 'findIndex', forced = true;
            if (KEY in []) {
                Array(1)[KEY](function() {
                    forced = false;
                });
            }
            $export($export.P + $export.F * forced, 'Array', {
                findIndex: function findIndex(callbackfn) {
                    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
                }
            });
            _dereq_('./$.add-to-unscopables')(KEY);
        }, {
            './$.add-to-unscopables': 23,
            './$.array-methods': 28,
            './$.export': 42
        } ],
        109: [ function(_dereq_, module, exports) {
            'use strict';
            var $export = _dereq_('./$.export'), $find = _dereq_('./$.array-methods')(5), KEY = 'find', forced = true;
            if (KEY in []) {
                Array(1)[KEY](function() {
                    forced = false;
                });
            }
            $export($export.P + $export.F * forced, 'Array', {
                find: function find(callbackfn) {
                    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
                }
            });
            _dereq_('./$.add-to-unscopables')(KEY);
        }, {
            './$.add-to-unscopables': 23,
            './$.array-methods': 28,
            './$.export': 42
        } ],
        110: [ function(_dereq_, module, exports) {
            'use strict';
            var ctx = _dereq_('./$.ctx'), $export = _dereq_('./$.export'), toObject = _dereq_('./$.to-object'), call = _dereq_('./$.iter-call'), isArrayIter = _dereq_('./$.is-array-iter'), toLength = _dereq_('./$.to-length'), getIterFn = _dereq_('./core.get-iterator-method');
            $export($export.S + $export.F * !_dereq_('./$.iter-detect')(function(iter) {
                Array.from(iter);
            }), 'Array', {
                from: function from(arrayLike) {
                    var O = toObject(arrayLike), C = typeof this == 'function' ? this : Array, $$ = arguments, $$len = $$.length, mapfn = $$len > 1 ? $$[1] : undefined, mapping = mapfn !== undefined, index = 0, iterFn = getIterFn(O), length, result, step, iterator;
                    if (mapping) {
                        mapfn = ctx(mapfn, $$len > 2 ? $$[2] : undefined, 2);
                    }
                    if (iterFn != undefined && !(C == Array && isArrayIter(iterFn))) {
                        for (iterator = iterFn.call(O), result = new C(); !(step = iterator.next()).done; index++) {
                            result[index] = mapping ? call(iterator, mapfn, [ step.value, index ], true) : step.value;
                        }
                    } else {
                        length = toLength(O.length);
                        for (result = new C(length); length > index; index++) {
                            result[index] = mapping ? mapfn(O[index], index) : O[index];
                        }
                    }
                    result.length = index;
                    return result;
                }
            });
        }, {
            './$.ctx': 37,
            './$.export': 42,
            './$.is-array-iter': 55,
            './$.iter-call': 60,
            './$.iter-detect': 63,
            './$.to-length': 99,
            './$.to-object': 100,
            './core.get-iterator-method': 104
        } ],
        111: [ function(_dereq_, module, exports) {
            'use strict';
            var addToUnscopables = _dereq_('./$.add-to-unscopables'), step = _dereq_('./$.iter-step'), Iterators = _dereq_('./$.iterators'), toIObject = _dereq_('./$.to-iobject');
            module.exports = _dereq_('./$.iter-define')(Array, 'Array', function(iterated, kind) {
                this._t = toIObject(iterated);
                this._i = 0;
                this._k = kind;
            }, function() {
                var O = this._t, kind = this._k, index = this._i++;
                if (!O || index >= O.length) {
                    this._t = undefined;
                    return step(1);
                }
                if (kind == 'keys') {
                    return step(0, index);
                }
                if (kind == 'values') {
                    return step(0, O[index]);
                }
                return step(0, [ index, O[index] ]);
            }, 'values');
            Iterators.Arguments = Iterators.Array;
            addToUnscopables('keys');
            addToUnscopables('values');
            addToUnscopables('entries');
        }, {
            './$.add-to-unscopables': 23,
            './$.iter-define': 62,
            './$.iter-step': 64,
            './$.iterators': 65,
            './$.to-iobject': 98
        } ],
        112: [ function(_dereq_, module, exports) {
            'use strict';
            var $export = _dereq_('./$.export');
            $export($export.S + $export.F * _dereq_('./$.fails')(function() {
                function F() {}
                return !(Array.of.call(F) instanceof F);
            }), 'Array', {
                of: function of() {
                    var index = 0, $$ = arguments, $$len = $$.length, result = new (typeof this == 'function' ? this : Array)($$len);
                    while ($$len > index) {
                        result[index] = $$[index++];
                    }
                    result.length = $$len;
                    return result;
                }
            });
        }, {
            './$.export': 42,
            './$.fails': 44
        } ],
        113: [ function(_dereq_, module, exports) {
            _dereq_('./$.set-species')('Array');
        }, {
            './$.set-species': 85
        } ],
        114: [ function(_dereq_, module, exports) {
            'use strict';
            var $ = _dereq_('./$'), isObject = _dereq_('./$.is-object'), HAS_INSTANCE = _dereq_('./$.wks')('hasInstance'), FunctionProto = Function.prototype;
            if (!(HAS_INSTANCE in FunctionProto)) {
                $.setDesc(FunctionProto, HAS_INSTANCE, {
                    value: function(O) {
                        if (typeof this != 'function' || !isObject(O)) {
                            return false;
                        }
                        if (!isObject(this.prototype)) {
                            return O instanceof this;
                        }
                        while (O = $.getProto(O)) {
                            if (this.prototype === O) {
                                return true;
                            }
                        }
                        return false;
                    }
                });
            }
        }, {
            './$': 66,
            './$.is-object': 58,
            './$.wks': 103
        } ],
        115: [ function(_dereq_, module, exports) {
            var setDesc = _dereq_('./$').setDesc, createDesc = _dereq_('./$.property-desc'), has = _dereq_('./$.has'), FProto = Function.prototype, nameRE = /^\s*function ([^ (]*)/, NAME = 'name';
            NAME in FProto || _dereq_('./$.descriptors') && setDesc(FProto, NAME, {
                configurable: true,
                get: function() {
                    var match = ('' + this).match(nameRE), name = match ? match[1] : '';
                    has(this, NAME) || setDesc(this, NAME, createDesc(5, name));
                    return name;
                }
            });
        }, {
            './$': 66,
            './$.descriptors': 39,
            './$.has': 50,
            './$.property-desc': 79
        } ],
        116: [ function(_dereq_, module, exports) {
            'use strict';
            var strong = _dereq_('./$.collection-strong');
            _dereq_('./$.collection')('Map', function(get) {
                return function Map() {
                    return get(this, arguments.length > 0 ? arguments[0] : undefined);
                };
            }, {
                get: function get(key) {
                    var entry = strong.getEntry(this, key);
                    return entry && entry.v;
                },
                set: function set(key, value) {
                    return strong.def(this, key === 0 ? 0 : key, value);
                }
            }, strong, true);
        }, {
            './$.collection': 35,
            './$.collection-strong': 32
        } ],
        117: [ function(_dereq_, module, exports) {
            var $export = _dereq_('./$.export'), log1p = _dereq_('./$.math-log1p'), sqrt = Math.sqrt, $acosh = Math.acosh;
            $export($export.S + $export.F * !($acosh && Math.floor($acosh(Number.MAX_VALUE)) == 710), 'Math', {
                acosh: function acosh(x) {
                    return (x = +x) < 1 ? NaN : x > 94906265.62425156 ? Math.log(x) + Math.LN2 : log1p(x - 1 + sqrt(x - 1) * sqrt(x + 1));
                }
            });
        }, {
            './$.export': 42,
            './$.math-log1p': 70
        } ],
        118: [ function(_dereq_, module, exports) {
            var $export = _dereq_('./$.export');
            function asinh(x) {
                return !isFinite(x = +x) || x == 0 ? x : x < 0 ? -asinh(-x) : Math.log(x + Math.sqrt(x * x + 1));
            }
            $export($export.S, 'Math', {
                asinh: asinh
            });
        }, {
            './$.export': 42
        } ],
        119: [ function(_dereq_, module, exports) {
            var $export = _dereq_('./$.export');
            $export($export.S, 'Math', {
                atanh: function atanh(x) {
                    return (x = +x) == 0 ? x : Math.log((1 + x) / (1 - x)) / 2;
                }
            });
        }, {
            './$.export': 42
        } ],
        120: [ function(_dereq_, module, exports) {
            var $export = _dereq_('./$.export'), sign = _dereq_('./$.math-sign');
            $export($export.S, 'Math', {
                cbrt: function cbrt(x) {
                    return sign(x = +x) * Math.pow(Math.abs(x), 1 / 3);
                }
            });
        }, {
            './$.export': 42,
            './$.math-sign': 71
        } ],
        121: [ function(_dereq_, module, exports) {
            var $export = _dereq_('./$.export');
            $export($export.S, 'Math', {
                clz32: function clz32(x) {
                    return (x >>>= 0) ? 31 - Math.floor(Math.log(x + .5) * Math.LOG2E) : 32;
                }
            });
        }, {
            './$.export': 42
        } ],
        122: [ function(_dereq_, module, exports) {
            var $export = _dereq_('./$.export'), exp = Math.exp;
            $export($export.S, 'Math', {
                cosh: function cosh(x) {
                    return (exp(x = +x) + exp(-x)) / 2;
                }
            });
        }, {
            './$.export': 42
        } ],
        123: [ function(_dereq_, module, exports) {
            var $export = _dereq_('./$.export');
            $export($export.S, 'Math', {
                expm1: _dereq_('./$.math-expm1')
            });
        }, {
            './$.export': 42,
            './$.math-expm1': 69
        } ],
        124: [ function(_dereq_, module, exports) {
            var $export = _dereq_('./$.export'), sign = _dereq_('./$.math-sign'), pow = Math.pow, EPSILON = pow(2, -52), EPSILON32 = pow(2, -23), MAX32 = pow(2, 127) * (2 - EPSILON32), MIN32 = pow(2, -126);
            var roundTiesToEven = function(n) {
                return n + 1 / EPSILON - 1 / EPSILON;
            };
            $export($export.S, 'Math', {
                fround: function fround(x) {
                    var $abs = Math.abs(x), $sign = sign(x), a, result;
                    if ($abs < MIN32) {
                        return $sign * roundTiesToEven($abs / MIN32 / EPSILON32) * MIN32 * EPSILON32;
                    }
                    a = (1 + EPSILON32 / EPSILON) * $abs;
                    result = a - (a - $abs);
                    if (result > MAX32 || result != result) {
                        return $sign * Infinity;
                    }
                    return $sign * result;
                }
            });
        }, {
            './$.export': 42,
            './$.math-sign': 71
        } ],
        125: [ function(_dereq_, module, exports) {
            var $export = _dereq_('./$.export'), abs = Math.abs;
            $export($export.S, 'Math', {
                hypot: function hypot(value1, value2) {
                    var sum = 0, i = 0, $$ = arguments, $$len = $$.length, larg = 0, arg, div;
                    while (i < $$len) {
                        arg = abs($$[i++]);
                        if (larg < arg) {
                            div = larg / arg;
                            sum = sum * div * div + 1;
                            larg = arg;
                        } else {
                            if (arg > 0) {
                                div = arg / larg;
                                sum += div * div;
                            } else {
                                sum += arg;
                            }
                        }
                    }
                    return larg === Infinity ? Infinity : larg * Math.sqrt(sum);
                }
            });
        }, {
            './$.export': 42
        } ],
        126: [ function(_dereq_, module, exports) {
            var $export = _dereq_('./$.export'), $imul = Math.imul;
            $export($export.S + $export.F * _dereq_('./$.fails')(function() {
                return $imul(4294967295, 5) != -5 || $imul.length != 2;
            }), 'Math', {
                imul: function imul(x, y) {
                    var UINT16 = 65535, xn = +x, yn = +y, xl = UINT16 & xn, yl = UINT16 & yn;
                    return 0 | xl * yl + ((UINT16 & xn >>> 16) * yl + xl * (UINT16 & yn >>> 16) << 16 >>> 0);
                }
            });
        }, {
            './$.export': 42,
            './$.fails': 44
        } ],
        127: [ function(_dereq_, module, exports) {
            var $export = _dereq_('./$.export');
            $export($export.S, 'Math', {
                log10: function log10(x) {
                    return Math.log(x) / Math.LN10;
                }
            });
        }, {
            './$.export': 42
        } ],
        128: [ function(_dereq_, module, exports) {
            var $export = _dereq_('./$.export');
            $export($export.S, 'Math', {
                log1p: _dereq_('./$.math-log1p')
            });
        }, {
            './$.export': 42,
            './$.math-log1p': 70
        } ],
        129: [ function(_dereq_, module, exports) {
            var $export = _dereq_('./$.export');
            $export($export.S, 'Math', {
                log2: function log2(x) {
                    return Math.log(x) / Math.LN2;
                }
            });
        }, {
            './$.export': 42
        } ],
        130: [ function(_dereq_, module, exports) {
            var $export = _dereq_('./$.export');
            $export($export.S, 'Math', {
                sign: _dereq_('./$.math-sign')
            });
        }, {
            './$.export': 42,
            './$.math-sign': 71
        } ],
        131: [ function(_dereq_, module, exports) {
            var $export = _dereq_('./$.export'), expm1 = _dereq_('./$.math-expm1'), exp = Math.exp;
            $export($export.S + $export.F * _dereq_('./$.fails')(function() {
                return !Math.sinh(-2e-17) != -2e-17;
            }), 'Math', {
                sinh: function sinh(x) {
                    return Math.abs(x = +x) < 1 ? (expm1(x) - expm1(-x)) / 2 : (exp(x - 1) - exp(-x - 1)) * (Math.E / 2);
                }
            });
        }, {
            './$.export': 42,
            './$.fails': 44,
            './$.math-expm1': 69
        } ],
        132: [ function(_dereq_, module, exports) {
            var $export = _dereq_('./$.export'), expm1 = _dereq_('./$.math-expm1'), exp = Math.exp;
            $export($export.S, 'Math', {
                tanh: function tanh(x) {
                    var a = expm1(x = +x), b = expm1(-x);
                    return a == Infinity ? 1 : b == Infinity ? -1 : (a - b) / (exp(x) + exp(-x));
                }
            });
        }, {
            './$.export': 42,
            './$.math-expm1': 69
        } ],
        133: [ function(_dereq_, module, exports) {
            var $export = _dereq_('./$.export');
            $export($export.S, 'Math', {
                trunc: function trunc(it) {
                    return (it > 0 ? Math.floor : Math.ceil)(it);
                }
            });
        }, {
            './$.export': 42
        } ],
        134: [ function(_dereq_, module, exports) {
            'use strict';
            var $ = _dereq_('./$'), global = _dereq_('./$.global'), has = _dereq_('./$.has'), cof = _dereq_('./$.cof'), toPrimitive = _dereq_('./$.to-primitive'), fails = _dereq_('./$.fails'), $trim = _dereq_('./$.string-trim').trim, NUMBER = 'Number', $Number = global[NUMBER], Base = $Number, proto = $Number.prototype, BROKEN_COF = cof($.create(proto)) == NUMBER, TRIM = 'trim' in String.prototype;
            var toNumber = function(argument) {
                var it = toPrimitive(argument, false);
                if (typeof it == 'string' && it.length > 2) {
                    it = TRIM ? it.trim() : $trim(it, 3);
                    var first = it.charCodeAt(0), third, radix, maxCode;
                    if (first === 43 || first === 45) {
                        third = it.charCodeAt(2);
                        if (third === 88 || third === 120) {
                            return NaN;
                        }
                    } else {
                        if (first === 48) {
                            switch (it.charCodeAt(1)) {
                              case 66:
                              case 98:
                                radix = 2;
                                maxCode = 49;
                                break;

                              case 79:
                              case 111:
                                radix = 8;
                                maxCode = 55;
                                break;

                              default:
                                return +it;
                            }
                            for (var digits = it.slice(2), i = 0, l = digits.length, code; i < l; i++) {
                                code = digits.charCodeAt(i);
                                if (code < 48 || code > maxCode) {
                                    return NaN;
                                }
                            }
                            return parseInt(digits, radix);
                        }
                    }
                }
                return +it;
            };
            if (!$Number(' 0o1') || !$Number('0b1') || $Number('+0x1')) {
                $Number = function Number(value) {
                    var it = arguments.length < 1 ? 0 : value, that = this;
                    return that instanceof $Number && (BROKEN_COF ? fails(function() {
                        proto.valueOf.call(that);
                    }) : cof(that) != NUMBER) ? new Base(toNumber(it)) : toNumber(it);
                };
                $.each.call(_dereq_('./$.descriptors') ? $.getNames(Base) : ('MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' + 'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' + 'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger').split(','), function(key) {
                    if (has(Base, key) && !has($Number, key)) {
                        $.setDesc($Number, key, $.getDesc(Base, key));
                    }
                });
                $Number.prototype = proto;
                proto.constructor = $Number;
                _dereq_('./$.redefine')(global, NUMBER, $Number);
            }
        }, {
            './$': 66,
            './$.cof': 31,
            './$.descriptors': 39,
            './$.fails': 44,
            './$.global': 49,
            './$.has': 50,
            './$.redefine': 81,
            './$.string-trim': 94,
            './$.to-primitive': 101
        } ],
        135: [ function(_dereq_, module, exports) {
            var $export = _dereq_('./$.export');
            $export($export.S, 'Number', {
                EPSILON: Math.pow(2, -52)
            });
        }, {
            './$.export': 42
        } ],
        136: [ function(_dereq_, module, exports) {
            var $export = _dereq_('./$.export'), _isFinite = _dereq_('./$.global').isFinite;
            $export($export.S, 'Number', {
                isFinite: function isFinite(it) {
                    return typeof it == 'number' && _isFinite(it);
                }
            });
        }, {
            './$.export': 42,
            './$.global': 49
        } ],
        137: [ function(_dereq_, module, exports) {
            var $export = _dereq_('./$.export');
            $export($export.S, 'Number', {
                isInteger: _dereq_('./$.is-integer')
            });
        }, {
            './$.export': 42,
            './$.is-integer': 57
        } ],
        138: [ function(_dereq_, module, exports) {
            var $export = _dereq_('./$.export');
            $export($export.S, 'Number', {
                isNaN: function isNaN(number) {
                    return number != number;
                }
            });
        }, {
            './$.export': 42
        } ],
        139: [ function(_dereq_, module, exports) {
            var $export = _dereq_('./$.export'), isInteger = _dereq_('./$.is-integer'), abs = Math.abs;
            $export($export.S, 'Number', {
                isSafeInteger: function isSafeInteger(number) {
                    return isInteger(number) && abs(number) <= 9007199254740991;
                }
            });
        }, {
            './$.export': 42,
            './$.is-integer': 57
        } ],
        140: [ function(_dereq_, module, exports) {
            var $export = _dereq_('./$.export');
            $export($export.S, 'Number', {
                MAX_SAFE_INTEGER: 9007199254740991
            });
        }, {
            './$.export': 42
        } ],
        141: [ function(_dereq_, module, exports) {
            var $export = _dereq_('./$.export');
            $export($export.S, 'Number', {
                MIN_SAFE_INTEGER: -9007199254740991
            });
        }, {
            './$.export': 42
        } ],
        142: [ function(_dereq_, module, exports) {
            var $export = _dereq_('./$.export');
            $export($export.S, 'Number', {
                parseFloat: parseFloat
            });
        }, {
            './$.export': 42
        } ],
        143: [ function(_dereq_, module, exports) {
            var $export = _dereq_('./$.export');
            $export($export.S, 'Number', {
                parseInt: parseInt
            });
        }, {
            './$.export': 42
        } ],
        144: [ function(_dereq_, module, exports) {
            var $export = _dereq_('./$.export');
            $export($export.S + $export.F, 'Object', {
                assign: _dereq_('./$.object-assign')
            });
        }, {
            './$.export': 42,
            './$.object-assign': 73
        } ],
        145: [ function(_dereq_, module, exports) {
            var isObject = _dereq_('./$.is-object');
            _dereq_('./$.object-sap')('freeze', function($freeze) {
                return function freeze(it) {
                    return $freeze && isObject(it) ? $freeze(it) : it;
                };
            });
        }, {
            './$.is-object': 58,
            './$.object-sap': 74
        } ],
        146: [ function(_dereq_, module, exports) {
            var toIObject = _dereq_('./$.to-iobject');
            _dereq_('./$.object-sap')('getOwnPropertyDescriptor', function($getOwnPropertyDescriptor) {
                return function getOwnPropertyDescriptor(it, key) {
                    return $getOwnPropertyDescriptor(toIObject(it), key);
                };
            });
        }, {
            './$.object-sap': 74,
            './$.to-iobject': 98
        } ],
        147: [ function(_dereq_, module, exports) {
            _dereq_('./$.object-sap')('getOwnPropertyNames', function() {
                return _dereq_('./$.get-names').get;
            });
        }, {
            './$.get-names': 48,
            './$.object-sap': 74
        } ],
        148: [ function(_dereq_, module, exports) {
            var toObject = _dereq_('./$.to-object');
            _dereq_('./$.object-sap')('getPrototypeOf', function($getPrototypeOf) {
                return function getPrototypeOf(it) {
                    return $getPrototypeOf(toObject(it));
                };
            });
        }, {
            './$.object-sap': 74,
            './$.to-object': 100
        } ],
        149: [ function(_dereq_, module, exports) {
            var isObject = _dereq_('./$.is-object');
            _dereq_('./$.object-sap')('isExtensible', function($isExtensible) {
                return function isExtensible(it) {
                    return isObject(it) ? $isExtensible ? $isExtensible(it) : true : false;
                };
            });
        }, {
            './$.is-object': 58,
            './$.object-sap': 74
        } ],
        150: [ function(_dereq_, module, exports) {
            var isObject = _dereq_('./$.is-object');
            _dereq_('./$.object-sap')('isFrozen', function($isFrozen) {
                return function isFrozen(it) {
                    return isObject(it) ? $isFrozen ? $isFrozen(it) : false : true;
                };
            });
        }, {
            './$.is-object': 58,
            './$.object-sap': 74
        } ],
        151: [ function(_dereq_, module, exports) {
            var isObject = _dereq_('./$.is-object');
            _dereq_('./$.object-sap')('isSealed', function($isSealed) {
                return function isSealed(it) {
                    return isObject(it) ? $isSealed ? $isSealed(it) : false : true;
                };
            });
        }, {
            './$.is-object': 58,
            './$.object-sap': 74
        } ],
        152: [ function(_dereq_, module, exports) {
            var $export = _dereq_('./$.export');
            $export($export.S, 'Object', {
                is: _dereq_('./$.same-value')
            });
        }, {
            './$.export': 42,
            './$.same-value': 83
        } ],
        153: [ function(_dereq_, module, exports) {
            var toObject = _dereq_('./$.to-object');
            _dereq_('./$.object-sap')('keys', function($keys) {
                return function keys(it) {
                    return $keys(toObject(it));
                };
            });
        }, {
            './$.object-sap': 74,
            './$.to-object': 100
        } ],
        154: [ function(_dereq_, module, exports) {
            var isObject = _dereq_('./$.is-object');
            _dereq_('./$.object-sap')('preventExtensions', function($preventExtensions) {
                return function preventExtensions(it) {
                    return $preventExtensions && isObject(it) ? $preventExtensions(it) : it;
                };
            });
        }, {
            './$.is-object': 58,
            './$.object-sap': 74
        } ],
        155: [ function(_dereq_, module, exports) {
            var isObject = _dereq_('./$.is-object');
            _dereq_('./$.object-sap')('seal', function($seal) {
                return function seal(it) {
                    return $seal && isObject(it) ? $seal(it) : it;
                };
            });
        }, {
            './$.is-object': 58,
            './$.object-sap': 74
        } ],
        156: [ function(_dereq_, module, exports) {
            var $export = _dereq_('./$.export');
            $export($export.S, 'Object', {
                setPrototypeOf: _dereq_('./$.set-proto').set
            });
        }, {
            './$.export': 42,
            './$.set-proto': 84
        } ],
        157: [ function(_dereq_, module, exports) {
            'use strict';
            var classof = _dereq_('./$.classof'), test = {};
            test[_dereq_('./$.wks')('toStringTag')] = 'z';
            if (test + '' != '[object z]') {
                _dereq_('./$.redefine')(Object.prototype, 'toString', function toString() {
                    return '[object ' + classof(this) + ']';
                }, true);
            }
        }, {
            './$.classof': 30,
            './$.redefine': 81,
            './$.wks': 103
        } ],
        158: [ function(_dereq_, module, exports) {
            'use strict';
            var $ = _dereq_('./$'), LIBRARY = _dereq_('./$.library'), global = _dereq_('./$.global'), ctx = _dereq_('./$.ctx'), classof = _dereq_('./$.classof'), $export = _dereq_('./$.export'), isObject = _dereq_('./$.is-object'), anObject = _dereq_('./$.an-object'), aFunction = _dereq_('./$.a-function'), strictNew = _dereq_('./$.strict-new'), forOf = _dereq_('./$.for-of'), setProto = _dereq_('./$.set-proto').set, same = _dereq_('./$.same-value'), SPECIES = _dereq_('./$.wks')('species'), speciesConstructor = _dereq_('./$.species-constructor'), asap = _dereq_('./$.microtask'), PROMISE = 'Promise', process = global.process, isNode = classof(process) == 'process', P = global[PROMISE], Wrapper;
            var testResolve = function(sub) {
                var test = new P(function() {});
                if (sub) {
                    test.constructor = Object;
                }
                return P.resolve(test) === test;
            };
            var USE_NATIVE = function() {
                var works = false;
                function P2(x) {
                    var self = new P(x);
                    setProto(self, P2.prototype);
                    return self;
                }
                try {
                    works = P && P.resolve && testResolve();
                    setProto(P2, P);
                    P2.prototype = $.create(P.prototype, {
                        constructor: {
                            value: P2
                        }
                    });
                    if (!(P2.resolve(5).then(function() {}) instanceof P2)) {
                        works = false;
                    }
                    if (works && _dereq_('./$.descriptors')) {
                        var thenableThenGotten = false;
                        P.resolve($.setDesc({}, 'then', {
                            get: function() {
                                thenableThenGotten = true;
                            }
                        }));
                        works = thenableThenGotten;
                    }
                } catch (e) {
                    works = false;
                }
                return works;
            }();
            var sameConstructor = function(a, b) {
                if (LIBRARY && a === P && b === Wrapper) {
                    return true;
                }
                return same(a, b);
            };
            var getConstructor = function(C) {
                var S = anObject(C)[SPECIES];
                return S != undefined ? S : C;
            };
            var isThenable = function(it) {
                var then;
                return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
            };
            var PromiseCapability = function(C) {
                var resolve, reject;
                this.promise = new C(function($$resolve, $$reject) {
                    if (resolve !== undefined || reject !== undefined) {
                        throw TypeError('Bad Promise constructor');
                    }
                    resolve = $$resolve;
                    reject = $$reject;
                });
                this.resolve = aFunction(resolve), this.reject = aFunction(reject);
            };
            var perform = function(exec) {
                try {
                    exec();
                } catch (e) {
                    return {
                        error: e
                    };
                }
            };
            var notify = function(record, isReject) {
                if (record.n) {
                    return;
                }
                record.n = true;
                var chain = record.c;
                asap(function() {
                    var value = record.v, ok = record.s == 1, i = 0;
                    var run = function(reaction) {
                        var handler = ok ? reaction.ok : reaction.fail, resolve = reaction.resolve, reject = reaction.reject, result, then;
                        try {
                            if (handler) {
                                if (!ok) {
                                    record.h = true;
                                }
                                result = handler === true ? value : handler(value);
                                if (result === reaction.promise) {
                                    reject(TypeError('Promise-chain cycle'));
                                } else {
                                    if (then = isThenable(result)) {
                                        then.call(result, resolve, reject);
                                    } else {
                                        resolve(result);
                                    }
                                }
                            } else {
                                reject(value);
                            }
                        } catch (e) {
                            reject(e);
                        }
                    };
                    while (chain.length > i) {
                        run(chain[i++]);
                    }
                    chain.length = 0;
                    record.n = false;
                    if (isReject) {
                        setTimeout(function() {
                            var promise = record.p, handler, console;
                            if (isUnhandled(promise)) {
                                if (isNode) {
                                    process.emit('unhandledRejection', value, promise);
                                } else {
                                    if (handler = global.onunhandledrejection) {
                                        handler({
                                            promise: promise,
                                            reason: value
                                        });
                                    } else {
                                        if ((console = global.console) && console.error) {
                                            console.error('Unhandled promise rejection', value);
                                        }
                                    }
                                }
                            }
                            record.a = undefined;
                        }, 1);
                    }
                });
            };
            var isUnhandled = function(promise) {
                var record = promise._d, chain = record.a || record.c, i = 0, reaction;
                if (record.h) {
                    return false;
                }
                while (chain.length > i) {
                    reaction = chain[i++];
                    if (reaction.fail || !isUnhandled(reaction.promise)) {
                        return false;
                    }
                }
                return true;
            };
            var $reject = function(value) {
                var record = this;
                if (record.d) {
                    return;
                }
                record.d = true;
                record = record.r || record;
                record.v = value;
                record.s = 2;
                record.a = record.c.slice();
                notify(record, true);
            };
            var $resolve = function(value) {
                var record = this, then;
                if (record.d) {
                    return;
                }
                record.d = true;
                record = record.r || record;
                try {
                    if (record.p === value) {
                        throw TypeError('Promise can\'t be resolved itself');
                    }
                    if (then = isThenable(value)) {
                        asap(function() {
                            var wrapper = {
                                r: record,
                                d: false
                            };
                            try {
                                then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
                            } catch (e) {
                                $reject.call(wrapper, e);
                            }
                        });
                    } else {
                        record.v = value;
                        record.s = 1;
                        notify(record, false);
                    }
                } catch (e) {
                    $reject.call({
                        r: record,
                        d: false
                    }, e);
                }
            };
            if (!USE_NATIVE) {
                P = function Promise(executor) {
                    aFunction(executor);
                    var record = this._d = {
                        p: strictNew(this, P, PROMISE),
                        c: [],
                        a: undefined,
                        s: 0,
                        d: false,
                        v: undefined,
                        h: false,
                        n: false
                    };
                    try {
                        executor(ctx($resolve, record, 1), ctx($reject, record, 1));
                    } catch (err) {
                        $reject.call(record, err);
                    }
                };
                _dereq_('./$.redefine-all')(P.prototype, {
                    then: function then(onFulfilled, onRejected) {
                        var reaction = new PromiseCapability(speciesConstructor(this, P)), promise = reaction.promise, record = this._d;
                        reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
                        reaction.fail = typeof onRejected == 'function' && onRejected;
                        record.c.push(reaction);
                        if (record.a) {
                            record.a.push(reaction);
                        }
                        if (record.s) {
                            notify(record, false);
                        }
                        return promise;
                    },
                    'catch': function(onRejected) {
                        return this.then(undefined, onRejected);
                    }
                });
            }
            $export($export.G + $export.W + $export.F * !USE_NATIVE, {
                Promise: P
            });
            _dereq_('./$.set-to-string-tag')(P, PROMISE);
            _dereq_('./$.set-species')(PROMISE);
            Wrapper = _dereq_('./$.core')[PROMISE];
            $export($export.S + $export.F * !USE_NATIVE, PROMISE, {
                reject: function reject(r) {
                    var capability = new PromiseCapability(this), $$reject = capability.reject;
                    $$reject(r);
                    return capability.promise;
                }
            });
            $export($export.S + $export.F * (!USE_NATIVE || testResolve(true)), PROMISE, {
                resolve: function resolve(x) {
                    if (x instanceof P && sameConstructor(x.constructor, this)) {
                        return x;
                    }
                    var capability = new PromiseCapability(this), $$resolve = capability.resolve;
                    $$resolve(x);
                    return capability.promise;
                }
            });
            $export($export.S + $export.F * !(USE_NATIVE && _dereq_('./$.iter-detect')(function(iter) {
                P.all(iter)['catch'](function() {});
            })), PROMISE, {
                all: function all(iterable) {
                    var C = getConstructor(this), capability = new PromiseCapability(C), resolve = capability.resolve, reject = capability.reject, values = [];
                    var abrupt = perform(function() {
                        forOf(iterable, false, values.push, values);
                        var remaining = values.length, results = Array(remaining);
                        if (remaining) {
                            $.each.call(values, function(promise, index) {
                                var alreadyCalled = false;
                                C.resolve(promise).then(function(value) {
                                    if (alreadyCalled) {
                                        return;
                                    }
                                    alreadyCalled = true;
                                    results[index] = value;
                                    --remaining || resolve(results);
                                }, reject);
                            });
                        } else {
                            resolve(results);
                        }
                    });
                    if (abrupt) {
                        reject(abrupt.error);
                    }
                    return capability.promise;
                },
                race: function race(iterable) {
                    var C = getConstructor(this), capability = new PromiseCapability(C), reject = capability.reject;
                    var abrupt = perform(function() {
                        forOf(iterable, false, function(promise) {
                            C.resolve(promise).then(capability.resolve, reject);
                        });
                    });
                    if (abrupt) {
                        reject(abrupt.error);
                    }
                    return capability.promise;
                }
            });
        }, {
            './$': 66,
            './$.a-function': 22,
            './$.an-object': 24,
            './$.classof': 30,
            './$.core': 36,
            './$.ctx': 37,
            './$.descriptors': 39,
            './$.export': 42,
            './$.for-of': 47,
            './$.global': 49,
            './$.is-object': 58,
            './$.iter-detect': 63,
            './$.library': 68,
            './$.microtask': 72,
            './$.redefine-all': 80,
            './$.same-value': 83,
            './$.set-proto': 84,
            './$.set-species': 85,
            './$.set-to-string-tag': 86,
            './$.species-constructor': 88,
            './$.strict-new': 89,
            './$.wks': 103
        } ],
        159: [ function(_dereq_, module, exports) {
            var $export = _dereq_('./$.export'), _apply = Function.apply;
            $export($export.S, 'Reflect', {
                apply: function apply(target, thisArgument, argumentsList) {
                    return _apply.call(target, thisArgument, argumentsList);
                }
            });
        }, {
            './$.export': 42
        } ],
        160: [ function(_dereq_, module, exports) {
            var $ = _dereq_('./$'), $export = _dereq_('./$.export'), aFunction = _dereq_('./$.a-function'), anObject = _dereq_('./$.an-object'), isObject = _dereq_('./$.is-object'), bind = Function.bind || _dereq_('./$.core').Function.prototype.bind;
            $export($export.S + $export.F * _dereq_('./$.fails')(function() {
                function F() {}
                return !(Reflect.construct(function() {}, [], F) instanceof F);
            }), 'Reflect', {
                construct: function construct(Target, args) {
                    aFunction(Target);
                    var newTarget = arguments.length < 3 ? Target : aFunction(arguments[2]);
                    if (Target == newTarget) {
                        if (args != undefined) {
                            switch (anObject(args).length) {
                              case 0:
                                return new Target();

                              case 1:
                                return new Target(args[0]);

                              case 2:
                                return new Target(args[0], args[1]);

                              case 3:
                                return new Target(args[0], args[1], args[2]);

                              case 4:
                                return new Target(args[0], args[1], args[2], args[3]);
                            }
                        }
                        var $args = [ null ];
                        $args.push.apply($args, args);
                        return new (bind.apply(Target, $args))();
                    }
                    var proto = newTarget.prototype, instance = $.create(isObject(proto) ? proto : Object.prototype), result = Function.apply.call(Target, instance, args);
                    return isObject(result) ? result : instance;
                }
            });
        }, {
            './$': 66,
            './$.a-function': 22,
            './$.an-object': 24,
            './$.core': 36,
            './$.export': 42,
            './$.fails': 44,
            './$.is-object': 58
        } ],
        161: [ function(_dereq_, module, exports) {
            var $ = _dereq_('./$'), $export = _dereq_('./$.export'), anObject = _dereq_('./$.an-object');
            $export($export.S + $export.F * _dereq_('./$.fails')(function() {
                Reflect.defineProperty($.setDesc({}, 1, {
                    value: 1
                }), 1, {
                    value: 2
                });
            }), 'Reflect', {
                defineProperty: function defineProperty(target, propertyKey, attributes) {
                    anObject(target);
                    try {
                        $.setDesc(target, propertyKey, attributes);
                        return true;
                    } catch (e) {
                        return false;
                    }
                }
            });
        }, {
            './$': 66,
            './$.an-object': 24,
            './$.export': 42,
            './$.fails': 44
        } ],
        162: [ function(_dereq_, module, exports) {
            var $export = _dereq_('./$.export'), getDesc = _dereq_('./$').getDesc, anObject = _dereq_('./$.an-object');
            $export($export.S, 'Reflect', {
                deleteProperty: function deleteProperty(target, propertyKey) {
                    var desc = getDesc(anObject(target), propertyKey);
                    return desc && !desc.configurable ? false : delete target[propertyKey];
                }
            });
        }, {
            './$': 66,
            './$.an-object': 24,
            './$.export': 42
        } ],
        163: [ function(_dereq_, module, exports) {
            'use strict';
            var $export = _dereq_('./$.export'), anObject = _dereq_('./$.an-object');
            var Enumerate = function(iterated) {
                this._t = anObject(iterated);
                this._i = 0;
                var keys = this._k = [], key;
                for (key in iterated) {
                    keys.push(key);
                }
            };
            _dereq_('./$.iter-create')(Enumerate, 'Object', function() {
                var that = this, keys = that._k, key;
                do {
                    if (that._i >= keys.length) {
                        return {
                            value: undefined,
                            done: true
                        };
                    }
                } while (!((key = keys[that._i++]) in that._t));
                return {
                    value: key,
                    done: false
                };
            });
            $export($export.S, 'Reflect', {
                enumerate: function enumerate(target) {
                    return new Enumerate(target);
                }
            });
        }, {
            './$.an-object': 24,
            './$.export': 42,
            './$.iter-create': 61
        } ],
        164: [ function(_dereq_, module, exports) {
            var $ = _dereq_('./$'), $export = _dereq_('./$.export'), anObject = _dereq_('./$.an-object');
            $export($export.S, 'Reflect', {
                getOwnPropertyDescriptor: function getOwnPropertyDescriptor(target, propertyKey) {
                    return $.getDesc(anObject(target), propertyKey);
                }
            });
        }, {
            './$': 66,
            './$.an-object': 24,
            './$.export': 42
        } ],
        165: [ function(_dereq_, module, exports) {
            var $export = _dereq_('./$.export'), getProto = _dereq_('./$').getProto, anObject = _dereq_('./$.an-object');
            $export($export.S, 'Reflect', {
                getPrototypeOf: function getPrototypeOf(target) {
                    return getProto(anObject(target));
                }
            });
        }, {
            './$': 66,
            './$.an-object': 24,
            './$.export': 42
        } ],
        166: [ function(_dereq_, module, exports) {
            var $ = _dereq_('./$'), has = _dereq_('./$.has'), $export = _dereq_('./$.export'), isObject = _dereq_('./$.is-object'), anObject = _dereq_('./$.an-object');
            function get(target, propertyKey) {
                var receiver = arguments.length < 3 ? target : arguments[2], desc, proto;
                if (anObject(target) === receiver) {
                    return target[propertyKey];
                }
                if (desc = $.getDesc(target, propertyKey)) {
                    return has(desc, 'value') ? desc.value : desc.get !== undefined ? desc.get.call(receiver) : undefined;
                }
                if (isObject(proto = $.getProto(target))) {
                    return get(proto, propertyKey, receiver);
                }
            }
            $export($export.S, 'Reflect', {
                get: get
            });
        }, {
            './$': 66,
            './$.an-object': 24,
            './$.export': 42,
            './$.has': 50,
            './$.is-object': 58
        } ],
        167: [ function(_dereq_, module, exports) {
            var $export = _dereq_('./$.export');
            $export($export.S, 'Reflect', {
                has: function has(target, propertyKey) {
                    return propertyKey in target;
                }
            });
        }, {
            './$.export': 42
        } ],
        168: [ function(_dereq_, module, exports) {
            var $export = _dereq_('./$.export'), anObject = _dereq_('./$.an-object'), $isExtensible = Object.isExtensible;
            $export($export.S, 'Reflect', {
                isExtensible: function isExtensible(target) {
                    anObject(target);
                    return $isExtensible ? $isExtensible(target) : true;
                }
            });
        }, {
            './$.an-object': 24,
            './$.export': 42
        } ],
        169: [ function(_dereq_, module, exports) {
            var $export = _dereq_('./$.export');
            $export($export.S, 'Reflect', {
                ownKeys: _dereq_('./$.own-keys')
            });
        }, {
            './$.export': 42,
            './$.own-keys': 76
        } ],
        170: [ function(_dereq_, module, exports) {
            var $export = _dereq_('./$.export'), anObject = _dereq_('./$.an-object'), $preventExtensions = Object.preventExtensions;
            $export($export.S, 'Reflect', {
                preventExtensions: function preventExtensions(target) {
                    anObject(target);
                    try {
                        if ($preventExtensions) {
                            $preventExtensions(target);
                        }
                        return true;
                    } catch (e) {
                        return false;
                    }
                }
            });
        }, {
            './$.an-object': 24,
            './$.export': 42
        } ],
        171: [ function(_dereq_, module, exports) {
            var $export = _dereq_('./$.export'), setProto = _dereq_('./$.set-proto');
            if (setProto) {
                $export($export.S, 'Reflect', {
                    setPrototypeOf: function setPrototypeOf(target, proto) {
                        setProto.check(target, proto);
                        try {
                            setProto.set(target, proto);
                            return true;
                        } catch (e) {
                            return false;
                        }
                    }
                });
            }
        }, {
            './$.export': 42,
            './$.set-proto': 84
        } ],
        172: [ function(_dereq_, module, exports) {
            var $ = _dereq_('./$'), has = _dereq_('./$.has'), $export = _dereq_('./$.export'), createDesc = _dereq_('./$.property-desc'), anObject = _dereq_('./$.an-object'), isObject = _dereq_('./$.is-object');
            function set(target, propertyKey, V) {
                var receiver = arguments.length < 4 ? target : arguments[3], ownDesc = $.getDesc(anObject(target), propertyKey), existingDescriptor, proto;
                if (!ownDesc) {
                    if (isObject(proto = $.getProto(target))) {
                        return set(proto, propertyKey, V, receiver);
                    }
                    ownDesc = createDesc(0);
                }
                if (has(ownDesc, 'value')) {
                    if (ownDesc.writable === false || !isObject(receiver)) {
                        return false;
                    }
                    existingDescriptor = $.getDesc(receiver, propertyKey) || createDesc(0);
                    existingDescriptor.value = V;
                    $.setDesc(receiver, propertyKey, existingDescriptor);
                    return true;
                }
                return ownDesc.set === undefined ? false : (ownDesc.set.call(receiver, V), true);
            }
            $export($export.S, 'Reflect', {
                set: set
            });
        }, {
            './$': 66,
            './$.an-object': 24,
            './$.export': 42,
            './$.has': 50,
            './$.is-object': 58,
            './$.property-desc': 79
        } ],
        173: [ function(_dereq_, module, exports) {
            var $ = _dereq_('./$'), global = _dereq_('./$.global'), isRegExp = _dereq_('./$.is-regexp'), $flags = _dereq_('./$.flags'), $RegExp = global.RegExp, Base = $RegExp, proto = $RegExp.prototype, re1 = /a/g, re2 = /a/g, CORRECT_NEW = new $RegExp(re1) !== re1;
            if (_dereq_('./$.descriptors') && (!CORRECT_NEW || _dereq_('./$.fails')(function() {
                re2[_dereq_('./$.wks')('match')] = false;
                return $RegExp(re1) != re1 || $RegExp(re2) == re2 || $RegExp(re1, 'i') != '/a/i';
            }))) {
                $RegExp = function RegExp(p, f) {
                    var piRE = isRegExp(p), fiU = f === undefined;
                    return !(this instanceof $RegExp) && piRE && p.constructor === $RegExp && fiU ? p : CORRECT_NEW ? new Base(piRE && !fiU ? p.source : p, f) : Base((piRE = p instanceof $RegExp) ? p.source : p, piRE && fiU ? $flags.call(p) : f);
                };
                $.each.call($.getNames(Base), function(key) {
                    key in $RegExp || $.setDesc($RegExp, key, {
                        configurable: true,
                        get: function() {
                            return Base[key];
                        },
                        set: function(it) {
                            Base[key] = it;
                        }
                    });
                });
                proto.constructor = $RegExp;
                $RegExp.prototype = proto;
                _dereq_('./$.redefine')(global, 'RegExp', $RegExp);
            }
            _dereq_('./$.set-species')('RegExp');
        }, {
            './$': 66,
            './$.descriptors': 39,
            './$.fails': 44,
            './$.flags': 46,
            './$.global': 49,
            './$.is-regexp': 59,
            './$.redefine': 81,
            './$.set-species': 85,
            './$.wks': 103
        } ],
        174: [ function(_dereq_, module, exports) {
            var $ = _dereq_('./$');
            if (_dereq_('./$.descriptors') && /./g.flags != 'g') {
                $.setDesc(RegExp.prototype, 'flags', {
                    configurable: true,
                    get: _dereq_('./$.flags')
                });
            }
        }, {
            './$': 66,
            './$.descriptors': 39,
            './$.flags': 46
        } ],
        175: [ function(_dereq_, module, exports) {
            _dereq_('./$.fix-re-wks')('match', 1, function(defined, MATCH) {
                return function match(regexp) {
                    'use strict';
                    var O = defined(this), fn = regexp == undefined ? undefined : regexp[MATCH];
                    return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));
                };
            });
        }, {
            './$.fix-re-wks': 45
        } ],
        176: [ function(_dereq_, module, exports) {
            _dereq_('./$.fix-re-wks')('replace', 2, function(defined, REPLACE, $replace) {
                return function replace(searchValue, replaceValue) {
                    'use strict';
                    var O = defined(this), fn = searchValue == undefined ? undefined : searchValue[REPLACE];
                    return fn !== undefined ? fn.call(searchValue, O, replaceValue) : $replace.call(String(O), searchValue, replaceValue);
                };
            });
        }, {
            './$.fix-re-wks': 45
        } ],
        177: [ function(_dereq_, module, exports) {
            _dereq_('./$.fix-re-wks')('search', 1, function(defined, SEARCH) {
                return function search(regexp) {
                    'use strict';
                    var O = defined(this), fn = regexp == undefined ? undefined : regexp[SEARCH];
                    return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[SEARCH](String(O));
                };
            });
        }, {
            './$.fix-re-wks': 45
        } ],
        178: [ function(_dereq_, module, exports) {
            _dereq_('./$.fix-re-wks')('split', 2, function(defined, SPLIT, $split) {
                return function split(separator, limit) {
                    'use strict';
                    var O = defined(this), fn = separator == undefined ? undefined : separator[SPLIT];
                    return fn !== undefined ? fn.call(separator, O, limit) : $split.call(String(O), separator, limit);
                };
            });
        }, {
            './$.fix-re-wks': 45
        } ],
        179: [ function(_dereq_, module, exports) {
            'use strict';
            var strong = _dereq_('./$.collection-strong');
            _dereq_('./$.collection')('Set', function(get) {
                return function Set() {
                    return get(this, arguments.length > 0 ? arguments[0] : undefined);
                };
            }, {
                add: function add(value) {
                    return strong.def(this, value = value === 0 ? 0 : value, value);
                }
            }, strong);
        }, {
            './$.collection': 35,
            './$.collection-strong': 32
        } ],
        180: [ function(_dereq_, module, exports) {
            'use strict';
            var $export = _dereq_('./$.export'), $at = _dereq_('./$.string-at')(false);
            $export($export.P, 'String', {
                codePointAt: function codePointAt(pos) {
                    return $at(this, pos);
                }
            });
        }, {
            './$.export': 42,
            './$.string-at': 90
        } ],
        181: [ function(_dereq_, module, exports) {
            'use strict';
            var $export = _dereq_('./$.export'), toLength = _dereq_('./$.to-length'), context = _dereq_('./$.string-context'), ENDS_WITH = 'endsWith', $endsWith = ''[ENDS_WITH];
            $export($export.P + $export.F * _dereq_('./$.fails-is-regexp')(ENDS_WITH), 'String', {
                endsWith: function endsWith(searchString) {
                    var that = context(this, searchString, ENDS_WITH), $$ = arguments, endPosition = $$.length > 1 ? $$[1] : undefined, len = toLength(that.length), end = endPosition === undefined ? len : Math.min(toLength(endPosition), len), search = String(searchString);
                    return $endsWith ? $endsWith.call(that, search, end) : that.slice(end - search.length, end) === search;
                }
            });
        }, {
            './$.export': 42,
            './$.fails-is-regexp': 43,
            './$.string-context': 91,
            './$.to-length': 99
        } ],
        182: [ function(_dereq_, module, exports) {
            var $export = _dereq_('./$.export'), toIndex = _dereq_('./$.to-index'), fromCharCode = String.fromCharCode, $fromCodePoint = String.fromCodePoint;
            $export($export.S + $export.F * (!!$fromCodePoint && $fromCodePoint.length != 1), 'String', {
                fromCodePoint: function fromCodePoint(x) {
                    var res = [], $$ = arguments, $$len = $$.length, i = 0, code;
                    while ($$len > i) {
                        code = +$$[i++];
                        if (toIndex(code, 1114111) !== code) {
                            throw RangeError(code + ' is not a valid code point');
                        }
                        res.push(code < 65536 ? fromCharCode(code) : fromCharCode(((code -= 65536) >> 10) + 55296, code % 1024 + 56320));
                    }
                    return res.join('');
                }
            });
        }, {
            './$.export': 42,
            './$.to-index': 96
        } ],
        183: [ function(_dereq_, module, exports) {
            'use strict';
            var $export = _dereq_('./$.export'), context = _dereq_('./$.string-context'), INCLUDES = 'includes';
            $export($export.P + $export.F * _dereq_('./$.fails-is-regexp')(INCLUDES), 'String', {
                includes: function includes(searchString) {
                    return !!~context(this, searchString, INCLUDES).indexOf(searchString, arguments.length > 1 ? arguments[1] : undefined);
                }
            });
        }, {
            './$.export': 42,
            './$.fails-is-regexp': 43,
            './$.string-context': 91
        } ],
        184: [ function(_dereq_, module, exports) {
            'use strict';
            var $at = _dereq_('./$.string-at')(true);
            _dereq_('./$.iter-define')(String, 'String', function(iterated) {
                this._t = String(iterated);
                this._i = 0;
            }, function() {
                var O = this._t, index = this._i, point;
                if (index >= O.length) {
                    return {
                        value: undefined,
                        done: true
                    };
                }
                point = $at(O, index);
                this._i += point.length;
                return {
                    value: point,
                    done: false
                };
            });
        }, {
            './$.iter-define': 62,
            './$.string-at': 90
        } ],
        185: [ function(_dereq_, module, exports) {
            var $export = _dereq_('./$.export'), toIObject = _dereq_('./$.to-iobject'), toLength = _dereq_('./$.to-length');
            $export($export.S, 'String', {
                raw: function raw(callSite) {
                    var tpl = toIObject(callSite.raw), len = toLength(tpl.length), $$ = arguments, $$len = $$.length, res = [], i = 0;
                    while (len > i) {
                        res.push(String(tpl[i++]));
                        if (i < $$len) {
                            res.push(String($$[i]));
                        }
                    }
                    return res.join('');
                }
            });
        }, {
            './$.export': 42,
            './$.to-iobject': 98,
            './$.to-length': 99
        } ],
        186: [ function(_dereq_, module, exports) {
            var $export = _dereq_('./$.export');
            $export($export.P, 'String', {
                repeat: _dereq_('./$.string-repeat')
            });
        }, {
            './$.export': 42,
            './$.string-repeat': 93
        } ],
        187: [ function(_dereq_, module, exports) {
            'use strict';
            var $export = _dereq_('./$.export'), toLength = _dereq_('./$.to-length'), context = _dereq_('./$.string-context'), STARTS_WITH = 'startsWith', $startsWith = ''[STARTS_WITH];
            $export($export.P + $export.F * _dereq_('./$.fails-is-regexp')(STARTS_WITH), 'String', {
                startsWith: function startsWith(searchString) {
                    var that = context(this, searchString, STARTS_WITH), $$ = arguments, index = toLength(Math.min($$.length > 1 ? $$[1] : undefined, that.length)), search = String(searchString);
                    return $startsWith ? $startsWith.call(that, search, index) : that.slice(index, index + search.length) === search;
                }
            });
        }, {
            './$.export': 42,
            './$.fails-is-regexp': 43,
            './$.string-context': 91,
            './$.to-length': 99
        } ],
        188: [ function(_dereq_, module, exports) {
            'use strict';
            _dereq_('./$.string-trim')('trim', function($trim) {
                return function trim() {
                    return $trim(this, 3);
                };
            });
        }, {
            './$.string-trim': 94
        } ],
        189: [ function(_dereq_, module, exports) {
            'use strict';
            var $ = _dereq_('./$'), global = _dereq_('./$.global'), has = _dereq_('./$.has'), DESCRIPTORS = _dereq_('./$.descriptors'), $export = _dereq_('./$.export'), redefine = _dereq_('./$.redefine'), $fails = _dereq_('./$.fails'), shared = _dereq_('./$.shared'), setToStringTag = _dereq_('./$.set-to-string-tag'), uid = _dereq_('./$.uid'), wks = _dereq_('./$.wks'), keyOf = _dereq_('./$.keyof'), $names = _dereq_('./$.get-names'), enumKeys = _dereq_('./$.enum-keys'), isArray = _dereq_('./$.is-array'), anObject = _dereq_('./$.an-object'), toIObject = _dereq_('./$.to-iobject'), createDesc = _dereq_('./$.property-desc'), getDesc = $.getDesc, setDesc = $.setDesc, _create = $.create, getNames = $names.get, $Symbol = global.Symbol, $JSON = global.JSON, _stringify = $JSON && $JSON.stringify, setter = false, HIDDEN = wks('_hidden'), isEnum = $.isEnum, SymbolRegistry = shared('symbol-registry'), AllSymbols = shared('symbols'), useNative = typeof $Symbol == 'function', ObjectProto = Object.prototype;
            var setSymbolDesc = DESCRIPTORS && $fails(function() {
                return _create(setDesc({}, 'a', {
                    get: function() {
                        return setDesc(this, 'a', {
                            value: 7
                        }).a;
                    }
                })).a != 7;
            }) ? function(it, key, D) {
                var protoDesc = getDesc(ObjectProto, key);
                if (protoDesc) {
                    delete ObjectProto[key];
                }
                setDesc(it, key, D);
                if (protoDesc && it !== ObjectProto) {
                    setDesc(ObjectProto, key, protoDesc);
                }
            } : setDesc;
            var wrap = function(tag) {
                var sym = AllSymbols[tag] = _create($Symbol.prototype);
                sym._k = tag;
                DESCRIPTORS && setter && setSymbolDesc(ObjectProto, tag, {
                    configurable: true,
                    set: function(value) {
                        if (has(this, HIDDEN) && has(this[HIDDEN], tag)) {
                            this[HIDDEN][tag] = false;
                        }
                        setSymbolDesc(this, tag, createDesc(1, value));
                    }
                });
                return sym;
            };
            var isSymbol = function(it) {
                return typeof it == 'symbol';
            };
            var $defineProperty = function defineProperty(it, key, D) {
                if (D && has(AllSymbols, key)) {
                    if (!D.enumerable) {
                        if (!has(it, HIDDEN)) {
                            setDesc(it, HIDDEN, createDesc(1, {}));
                        }
                        it[HIDDEN][key] = true;
                    } else {
                        if (has(it, HIDDEN) && it[HIDDEN][key]) {
                            it[HIDDEN][key] = false;
                        }
                        D = _create(D, {
                            enumerable: createDesc(0, false)
                        });
                    }
                    return setSymbolDesc(it, key, D);
                }
                return setDesc(it, key, D);
            };
            var $defineProperties = function defineProperties(it, P) {
                anObject(it);
                var keys = enumKeys(P = toIObject(P)), i = 0, l = keys.length, key;
                while (l > i) {
                    $defineProperty(it, key = keys[i++], P[key]);
                }
                return it;
            };
            var $create = function create(it, P) {
                return P === undefined ? _create(it) : $defineProperties(_create(it), P);
            };
            var $propertyIsEnumerable = function propertyIsEnumerable(key) {
                var E = isEnum.call(this, key);
                return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
            };
            var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
                var D = getDesc(it = toIObject(it), key);
                if (D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) {
                    D.enumerable = true;
                }
                return D;
            };
            var $getOwnPropertyNames = function getOwnPropertyNames(it) {
                var names = getNames(toIObject(it)), result = [], i = 0, key;
                while (names.length > i) {
                    if (!has(AllSymbols, key = names[i++]) && key != HIDDEN) {
                        result.push(key);
                    }
                }
                return result;
            };
            var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
                var names = getNames(toIObject(it)), result = [], i = 0, key;
                while (names.length > i) {
                    if (has(AllSymbols, key = names[i++])) {
                        result.push(AllSymbols[key]);
                    }
                }
                return result;
            };
            var $stringify = function stringify(it) {
                if (it === undefined || isSymbol(it)) {
                    return;
                }
                var args = [ it ], i = 1, $$ = arguments, replacer, $replacer;
                while ($$.length > i) {
                    args.push($$[i++]);
                }
                replacer = args[1];
                if (typeof replacer == 'function') {
                    $replacer = replacer;
                }
                if ($replacer || !isArray(replacer)) {
                    replacer = function(key, value) {
                        if ($replacer) {
                            value = $replacer.call(this, key, value);
                        }
                        if (!isSymbol(value)) {
                            return value;
                        }
                    };
                }
                args[1] = replacer;
                return _stringify.apply($JSON, args);
            };
            var buggyJSON = $fails(function() {
                var S = $Symbol();
                return _stringify([ S ]) != '[null]' || _stringify({
                    a: S
                }) != '{}' || _stringify(Object(S)) != '{}';
            });
            if (!useNative) {
                $Symbol = function Symbol() {
                    if (isSymbol(this)) {
                        throw TypeError('Symbol is not a constructor');
                    }
                    return wrap(uid(arguments.length > 0 ? arguments[0] : undefined));
                };
                redefine($Symbol.prototype, 'toString', function toString() {
                    return this._k;
                });
                isSymbol = function(it) {
                    return it instanceof $Symbol;
                };
                $.create = $create;
                $.isEnum = $propertyIsEnumerable;
                $.getDesc = $getOwnPropertyDescriptor;
                $.setDesc = $defineProperty;
                $.setDescs = $defineProperties;
                $.getNames = $names.get = $getOwnPropertyNames;
                $.getSymbols = $getOwnPropertySymbols;
                if (DESCRIPTORS && !_dereq_('./$.library')) {
                    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
                }
            }
            var symbolStatics = {
                'for': function(key) {
                    return has(SymbolRegistry, key += '') ? SymbolRegistry[key] : SymbolRegistry[key] = $Symbol(key);
                },
                keyFor: function keyFor(key) {
                    return keyOf(SymbolRegistry, key);
                },
                useSetter: function() {
                    setter = true;
                },
                useSimple: function() {
                    setter = false;
                }
            };
            $.each.call(('hasInstance,isConcatSpreadable,iterator,match,replace,search,' + 'species,split,toPrimitive,toStringTag,unscopables').split(','), function(it) {
                var sym = wks(it);
                symbolStatics[it] = useNative ? sym : wrap(sym);
            });
            setter = true;
            $export($export.G + $export.W, {
                Symbol: $Symbol
            });
            $export($export.S, 'Symbol', symbolStatics);
            $export($export.S + $export.F * !useNative, 'Object', {
                create: $create,
                defineProperty: $defineProperty,
                defineProperties: $defineProperties,
                getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
                getOwnPropertyNames: $getOwnPropertyNames,
                getOwnPropertySymbols: $getOwnPropertySymbols
            });
            $JSON && $export($export.S + $export.F * (!useNative || buggyJSON), 'JSON', {
                stringify: $stringify
            });
            setToStringTag($Symbol, 'Symbol');
            setToStringTag(Math, 'Math', true);
            setToStringTag(global.JSON, 'JSON', true);
        }, {
            './$': 66,
            './$.an-object': 24,
            './$.descriptors': 39,
            './$.enum-keys': 41,
            './$.export': 42,
            './$.fails': 44,
            './$.get-names': 48,
            './$.global': 49,
            './$.has': 50,
            './$.is-array': 56,
            './$.keyof': 67,
            './$.library': 68,
            './$.property-desc': 79,
            './$.redefine': 81,
            './$.set-to-string-tag': 86,
            './$.shared': 87,
            './$.to-iobject': 98,
            './$.uid': 102,
            './$.wks': 103
        } ],
        190: [ function(_dereq_, module, exports) {
            'use strict';
            var $ = _dereq_('./$'), redefine = _dereq_('./$.redefine'), weak = _dereq_('./$.collection-weak'), isObject = _dereq_('./$.is-object'), has = _dereq_('./$.has'), frozenStore = weak.frozenStore, WEAK = weak.WEAK, isExtensible = Object.isExtensible || isObject, tmp = {};
            var $WeakMap = _dereq_('./$.collection')('WeakMap', function(get) {
                return function WeakMap() {
                    return get(this, arguments.length > 0 ? arguments[0] : undefined);
                };
            }, {
                get: function get(key) {
                    if (isObject(key)) {
                        if (!isExtensible(key)) {
                            return frozenStore(this).get(key);
                        }
                        if (has(key, WEAK)) {
                            return key[WEAK][this._i];
                        }
                    }
                },
                set: function set(key, value) {
                    return weak.def(this, key, value);
                }
            }, weak, true, true);
            if (new $WeakMap().set((Object.freeze || Object)(tmp), 7).get(tmp) != 7) {
                $.each.call([ 'delete', 'has', 'get', 'set' ], function(key) {
                    var proto = $WeakMap.prototype, method = proto[key];
                    redefine(proto, key, function(a, b) {
                        if (isObject(a) && !isExtensible(a)) {
                            var result = frozenStore(this)[key](a, b);
                            return key == 'set' ? this : result;
                        }
                        return method.call(this, a, b);
                    });
                });
            }
        }, {
            './$': 66,
            './$.collection': 35,
            './$.collection-weak': 34,
            './$.has': 50,
            './$.is-object': 58,
            './$.redefine': 81
        } ],
        191: [ function(_dereq_, module, exports) {
            'use strict';
            var weak = _dereq_('./$.collection-weak');
            _dereq_('./$.collection')('WeakSet', function(get) {
                return function WeakSet() {
                    return get(this, arguments.length > 0 ? arguments[0] : undefined);
                };
            }, {
                add: function add(value) {
                    return weak.def(this, value, true);
                }
            }, weak, false, true);
        }, {
            './$.collection': 35,
            './$.collection-weak': 34
        } ],
        192: [ function(_dereq_, module, exports) {
            'use strict';
            var $export = _dereq_('./$.export'), $includes = _dereq_('./$.array-includes')(true);
            $export($export.P, 'Array', {
                includes: function includes(el) {
                    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
                }
            });
            _dereq_('./$.add-to-unscopables')('includes');
        }, {
            './$.add-to-unscopables': 23,
            './$.array-includes': 27,
            './$.export': 42
        } ],
        193: [ function(_dereq_, module, exports) {
            var $export = _dereq_('./$.export');
            $export($export.P, 'Map', {
                toJSON: _dereq_('./$.collection-to-json')('Map')
            });
        }, {
            './$.collection-to-json': 33,
            './$.export': 42
        } ],
        194: [ function(_dereq_, module, exports) {
            var $export = _dereq_('./$.export'), $entries = _dereq_('./$.object-to-array')(true);
            $export($export.S, 'Object', {
                entries: function entries(it) {
                    return $entries(it);
                }
            });
        }, {
            './$.export': 42,
            './$.object-to-array': 75
        } ],
        195: [ function(_dereq_, module, exports) {
            var $ = _dereq_('./$'), $export = _dereq_('./$.export'), ownKeys = _dereq_('./$.own-keys'), toIObject = _dereq_('./$.to-iobject'), createDesc = _dereq_('./$.property-desc');
            $export($export.S, 'Object', {
                getOwnPropertyDescriptors: function getOwnPropertyDescriptors(object) {
                    var O = toIObject(object), setDesc = $.setDesc, getDesc = $.getDesc, keys = ownKeys(O), result = {}, i = 0, key, D;
                    while (keys.length > i) {
                        D = getDesc(O, key = keys[i++]);
                        if (key in result) {
                            setDesc(result, key, createDesc(0, D));
                        } else {
                            result[key] = D;
                        }
                    }
                    return result;
                }
            });
        }, {
            './$': 66,
            './$.export': 42,
            './$.own-keys': 76,
            './$.property-desc': 79,
            './$.to-iobject': 98
        } ],
        196: [ function(_dereq_, module, exports) {
            var $export = _dereq_('./$.export'), $values = _dereq_('./$.object-to-array')(false);
            $export($export.S, 'Object', {
                values: function values(it) {
                    return $values(it);
                }
            });
        }, {
            './$.export': 42,
            './$.object-to-array': 75
        } ],
        197: [ function(_dereq_, module, exports) {
            var $export = _dereq_('./$.export'), $re = _dereq_('./$.replacer')(/[\\^$*+?.()|[\]{}]/g, '\\$&');
            $export($export.S, 'RegExp', {
                escape: function escape(it) {
                    return $re(it);
                }
            });
        }, {
            './$.export': 42,
            './$.replacer': 82
        } ],
        198: [ function(_dereq_, module, exports) {
            var $export = _dereq_('./$.export');
            $export($export.P, 'Set', {
                toJSON: _dereq_('./$.collection-to-json')('Set')
            });
        }, {
            './$.collection-to-json': 33,
            './$.export': 42
        } ],
        199: [ function(_dereq_, module, exports) {
            'use strict';
            var $export = _dereq_('./$.export'), $at = _dereq_('./$.string-at')(true);
            $export($export.P, 'String', {
                at: function at(pos) {
                    return $at(this, pos);
                }
            });
        }, {
            './$.export': 42,
            './$.string-at': 90
        } ],
        200: [ function(_dereq_, module, exports) {
            'use strict';
            var $export = _dereq_('./$.export'), $pad = _dereq_('./$.string-pad');
            $export($export.P, 'String', {
                padLeft: function padLeft(maxLength) {
                    return $pad(this, maxLength, arguments.length > 1 ? arguments[1] : undefined, true);
                }
            });
        }, {
            './$.export': 42,
            './$.string-pad': 92
        } ],
        201: [ function(_dereq_, module, exports) {
            'use strict';
            var $export = _dereq_('./$.export'), $pad = _dereq_('./$.string-pad');
            $export($export.P, 'String', {
                padRight: function padRight(maxLength) {
                    return $pad(this, maxLength, arguments.length > 1 ? arguments[1] : undefined, false);
                }
            });
        }, {
            './$.export': 42,
            './$.string-pad': 92
        } ],
        202: [ function(_dereq_, module, exports) {
            'use strict';
            _dereq_('./$.string-trim')('trimLeft', function($trim) {
                return function trimLeft() {
                    return $trim(this, 1);
                };
            });
        }, {
            './$.string-trim': 94
        } ],
        203: [ function(_dereq_, module, exports) {
            'use strict';
            _dereq_('./$.string-trim')('trimRight', function($trim) {
                return function trimRight() {
                    return $trim(this, 2);
                };
            });
        }, {
            './$.string-trim': 94
        } ],
        204: [ function(_dereq_, module, exports) {
            var $ = _dereq_('./$'), $export = _dereq_('./$.export'), $ctx = _dereq_('./$.ctx'), $Array = _dereq_('./$.core').Array || Array, statics = {};
            var setStatics = function(keys, length) {
                $.each.call(keys.split(','), function(key) {
                    if (length == undefined && key in $Array) {
                        statics[key] = $Array[key];
                    } else {
                        if (key in []) {
                            statics[key] = $ctx(Function.call, [][key], length);
                        }
                    }
                });
            };
            setStatics('pop,reverse,shift,keys,values,entries', 1);
            setStatics('indexOf,every,some,forEach,map,filter,find,findIndex,includes', 3);
            setStatics('join,slice,concat,push,splice,unshift,sort,lastIndexOf,' + 'reduce,reduceRight,copyWithin,fill');
            $export($export.S, 'Array', statics);
        }, {
            './$': 66,
            './$.core': 36,
            './$.ctx': 37,
            './$.export': 42
        } ],
        205: [ function(_dereq_, module, exports) {
            _dereq_('./es6.array.iterator');
            var global = _dereq_('./$.global'), hide = _dereq_('./$.hide'), Iterators = _dereq_('./$.iterators'), ITERATOR = _dereq_('./$.wks')('iterator'), NL = global.NodeList, HTC = global.HTMLCollection, NLProto = NL && NL.prototype, HTCProto = HTC && HTC.prototype, ArrayValues = Iterators.NodeList = Iterators.HTMLCollection = Iterators.Array;
            if (NLProto && !NLProto[ITERATOR]) {
                hide(NLProto, ITERATOR, ArrayValues);
            }
            if (HTCProto && !HTCProto[ITERATOR]) {
                hide(HTCProto, ITERATOR, ArrayValues);
            }
        }, {
            './$.global': 49,
            './$.hide': 51,
            './$.iterators': 65,
            './$.wks': 103,
            './es6.array.iterator': 111
        } ],
        206: [ function(_dereq_, module, exports) {
            var $export = _dereq_('./$.export'), $task = _dereq_('./$.task');
            $export($export.G + $export.B, {
                setImmediate: $task.set,
                clearImmediate: $task.clear
            });
        }, {
            './$.export': 42,
            './$.task': 95
        } ],
        207: [ function(_dereq_, module, exports) {
            var global = _dereq_('./$.global'), $export = _dereq_('./$.export'), invoke = _dereq_('./$.invoke'), partial = _dereq_('./$.partial'), navigator = global.navigator, MSIE = !!navigator && /MSIE .\./.test(navigator.userAgent);
            var wrap = function(set) {
                return MSIE ? function(fn, time) {
                    return set(invoke(partial, [].slice.call(arguments, 2), typeof fn == 'function' ? fn : Function(fn)), time);
                } : set;
            };
            $export($export.G + $export.B + $export.F * MSIE, {
                setTimeout: wrap(global.setTimeout),
                setInterval: wrap(global.setInterval)
            });
        }, {
            './$.export': 42,
            './$.global': 49,
            './$.invoke': 53,
            './$.partial': 77
        } ],
        208: [ function(_dereq_, module, exports) {
            _dereq_('./modules/es5');
            _dereq_('./modules/es6.symbol');
            _dereq_('./modules/es6.object.assign');
            _dereq_('./modules/es6.object.is');
            _dereq_('./modules/es6.object.set-prototype-of');
            _dereq_('./modules/es6.object.to-string');
            _dereq_('./modules/es6.object.freeze');
            _dereq_('./modules/es6.object.seal');
            _dereq_('./modules/es6.object.prevent-extensions');
            _dereq_('./modules/es6.object.is-frozen');
            _dereq_('./modules/es6.object.is-sealed');
            _dereq_('./modules/es6.object.is-extensible');
            _dereq_('./modules/es6.object.get-own-property-descriptor');
            _dereq_('./modules/es6.object.get-prototype-of');
            _dereq_('./modules/es6.object.keys');
            _dereq_('./modules/es6.object.get-own-property-names');
            _dereq_('./modules/es6.function.name');
            _dereq_('./modules/es6.function.has-instance');
            _dereq_('./modules/es6.number.constructor');
            _dereq_('./modules/es6.number.epsilon');
            _dereq_('./modules/es6.number.is-finite');
            _dereq_('./modules/es6.number.is-integer');
            _dereq_('./modules/es6.number.is-nan');
            _dereq_('./modules/es6.number.is-safe-integer');
            _dereq_('./modules/es6.number.max-safe-integer');
            _dereq_('./modules/es6.number.min-safe-integer');
            _dereq_('./modules/es6.number.parse-float');
            _dereq_('./modules/es6.number.parse-int');
            _dereq_('./modules/es6.math.acosh');
            _dereq_('./modules/es6.math.asinh');
            _dereq_('./modules/es6.math.atanh');
            _dereq_('./modules/es6.math.cbrt');
            _dereq_('./modules/es6.math.clz32');
            _dereq_('./modules/es6.math.cosh');
            _dereq_('./modules/es6.math.expm1');
            _dereq_('./modules/es6.math.fround');
            _dereq_('./modules/es6.math.hypot');
            _dereq_('./modules/es6.math.imul');
            _dereq_('./modules/es6.math.log10');
            _dereq_('./modules/es6.math.log1p');
            _dereq_('./modules/es6.math.log2');
            _dereq_('./modules/es6.math.sign');
            _dereq_('./modules/es6.math.sinh');
            _dereq_('./modules/es6.math.tanh');
            _dereq_('./modules/es6.math.trunc');
            _dereq_('./modules/es6.string.from-code-point');
            _dereq_('./modules/es6.string.raw');
            _dereq_('./modules/es6.string.trim');
            _dereq_('./modules/es6.string.iterator');
            _dereq_('./modules/es6.string.code-point-at');
            _dereq_('./modules/es6.string.ends-with');
            _dereq_('./modules/es6.string.includes');
            _dereq_('./modules/es6.string.repeat');
            _dereq_('./modules/es6.string.starts-with');
            _dereq_('./modules/es6.array.from');
            _dereq_('./modules/es6.array.of');
            _dereq_('./modules/es6.array.iterator');
            _dereq_('./modules/es6.array.species');
            _dereq_('./modules/es6.array.copy-within');
            _dereq_('./modules/es6.array.fill');
            _dereq_('./modules/es6.array.find');
            _dereq_('./modules/es6.array.find-index');
            _dereq_('./modules/es6.regexp.constructor');
            _dereq_('./modules/es6.regexp.flags');
            _dereq_('./modules/es6.regexp.match');
            _dereq_('./modules/es6.regexp.replace');
            _dereq_('./modules/es6.regexp.search');
            _dereq_('./modules/es6.regexp.split');
            _dereq_('./modules/es6.promise');
            _dereq_('./modules/es6.map');
            _dereq_('./modules/es6.set');
            _dereq_('./modules/es6.weak-map');
            _dereq_('./modules/es6.weak-set');
            _dereq_('./modules/es6.reflect.apply');
            _dereq_('./modules/es6.reflect.construct');
            _dereq_('./modules/es6.reflect.define-property');
            _dereq_('./modules/es6.reflect.delete-property');
            _dereq_('./modules/es6.reflect.enumerate');
            _dereq_('./modules/es6.reflect.get');
            _dereq_('./modules/es6.reflect.get-own-property-descriptor');
            _dereq_('./modules/es6.reflect.get-prototype-of');
            _dereq_('./modules/es6.reflect.has');
            _dereq_('./modules/es6.reflect.is-extensible');
            _dereq_('./modules/es6.reflect.own-keys');
            _dereq_('./modules/es6.reflect.prevent-extensions');
            _dereq_('./modules/es6.reflect.set');
            _dereq_('./modules/es6.reflect.set-prototype-of');
            _dereq_('./modules/es7.array.includes');
            _dereq_('./modules/es7.string.at');
            _dereq_('./modules/es7.string.pad-left');
            _dereq_('./modules/es7.string.pad-right');
            _dereq_('./modules/es7.string.trim-left');
            _dereq_('./modules/es7.string.trim-right');
            _dereq_('./modules/es7.regexp.escape');
            _dereq_('./modules/es7.object.get-own-property-descriptors');
            _dereq_('./modules/es7.object.values');
            _dereq_('./modules/es7.object.entries');
            _dereq_('./modules/es7.map.to-json');
            _dereq_('./modules/es7.set.to-json');
            _dereq_('./modules/js.array.statics');
            _dereq_('./modules/web.timers');
            _dereq_('./modules/web.immediate');
            _dereq_('./modules/web.dom.iterable');
            module.exports = _dereq_('./modules/$.core');
        }, {
            './modules/$.core': 36,
            './modules/es5': 105,
            './modules/es6.array.copy-within': 106,
            './modules/es6.array.fill': 107,
            './modules/es6.array.find': 109,
            './modules/es6.array.find-index': 108,
            './modules/es6.array.from': 110,
            './modules/es6.array.iterator': 111,
            './modules/es6.array.of': 112,
            './modules/es6.array.species': 113,
            './modules/es6.function.has-instance': 114,
            './modules/es6.function.name': 115,
            './modules/es6.map': 116,
            './modules/es6.math.acosh': 117,
            './modules/es6.math.asinh': 118,
            './modules/es6.math.atanh': 119,
            './modules/es6.math.cbrt': 120,
            './modules/es6.math.clz32': 121,
            './modules/es6.math.cosh': 122,
            './modules/es6.math.expm1': 123,
            './modules/es6.math.fround': 124,
            './modules/es6.math.hypot': 125,
            './modules/es6.math.imul': 126,
            './modules/es6.math.log10': 127,
            './modules/es6.math.log1p': 128,
            './modules/es6.math.log2': 129,
            './modules/es6.math.sign': 130,
            './modules/es6.math.sinh': 131,
            './modules/es6.math.tanh': 132,
            './modules/es6.math.trunc': 133,
            './modules/es6.number.constructor': 134,
            './modules/es6.number.epsilon': 135,
            './modules/es6.number.is-finite': 136,
            './modules/es6.number.is-integer': 137,
            './modules/es6.number.is-nan': 138,
            './modules/es6.number.is-safe-integer': 139,
            './modules/es6.number.max-safe-integer': 140,
            './modules/es6.number.min-safe-integer': 141,
            './modules/es6.number.parse-float': 142,
            './modules/es6.number.parse-int': 143,
            './modules/es6.object.assign': 144,
            './modules/es6.object.freeze': 145,
            './modules/es6.object.get-own-property-descriptor': 146,
            './modules/es6.object.get-own-property-names': 147,
            './modules/es6.object.get-prototype-of': 148,
            './modules/es6.object.is': 152,
            './modules/es6.object.is-extensible': 149,
            './modules/es6.object.is-frozen': 150,
            './modules/es6.object.is-sealed': 151,
            './modules/es6.object.keys': 153,
            './modules/es6.object.prevent-extensions': 154,
            './modules/es6.object.seal': 155,
            './modules/es6.object.set-prototype-of': 156,
            './modules/es6.object.to-string': 157,
            './modules/es6.promise': 158,
            './modules/es6.reflect.apply': 159,
            './modules/es6.reflect.construct': 160,
            './modules/es6.reflect.define-property': 161,
            './modules/es6.reflect.delete-property': 162,
            './modules/es6.reflect.enumerate': 163,
            './modules/es6.reflect.get': 166,
            './modules/es6.reflect.get-own-property-descriptor': 164,
            './modules/es6.reflect.get-prototype-of': 165,
            './modules/es6.reflect.has': 167,
            './modules/es6.reflect.is-extensible': 168,
            './modules/es6.reflect.own-keys': 169,
            './modules/es6.reflect.prevent-extensions': 170,
            './modules/es6.reflect.set': 172,
            './modules/es6.reflect.set-prototype-of': 171,
            './modules/es6.regexp.constructor': 173,
            './modules/es6.regexp.flags': 174,
            './modules/es6.regexp.match': 175,
            './modules/es6.regexp.replace': 176,
            './modules/es6.regexp.search': 177,
            './modules/es6.regexp.split': 178,
            './modules/es6.set': 179,
            './modules/es6.string.code-point-at': 180,
            './modules/es6.string.ends-with': 181,
            './modules/es6.string.from-code-point': 182,
            './modules/es6.string.includes': 183,
            './modules/es6.string.iterator': 184,
            './modules/es6.string.raw': 185,
            './modules/es6.string.repeat': 186,
            './modules/es6.string.starts-with': 187,
            './modules/es6.string.trim': 188,
            './modules/es6.symbol': 189,
            './modules/es6.weak-map': 190,
            './modules/es6.weak-set': 191,
            './modules/es7.array.includes': 192,
            './modules/es7.map.to-json': 193,
            './modules/es7.object.entries': 194,
            './modules/es7.object.get-own-property-descriptors': 195,
            './modules/es7.object.values': 196,
            './modules/es7.regexp.escape': 197,
            './modules/es7.set.to-json': 198,
            './modules/es7.string.at': 199,
            './modules/es7.string.pad-left': 200,
            './modules/es7.string.pad-right': 201,
            './modules/es7.string.trim-left': 202,
            './modules/es7.string.trim-right': 203,
            './modules/js.array.statics': 204,
            './modules/web.dom.iterable': 205,
            './modules/web.immediate': 206,
            './modules/web.timers': 207
        } ],
        209: [ function(_dereq_, module, exports) {
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
        210: [ function(_dereq_, module, exports) {
            var process = module.exports = {};
            var queue = [];
            var draining = false;
            var currentQueue;
            var queueIndex = -1;
            function cleanUpNextTick() {
                draining = false;
                if (currentQueue.length) {
                    queue = currentQueue.concat(queue);
                } else {
                    queueIndex = -1;
                }
                if (queue.length) {
                    drainQueue();
                }
            }
            function drainQueue() {
                if (draining) {
                    return;
                }
                var timeout = setTimeout(cleanUpNextTick);
                draining = true;
                var len = queue.length;
                while (len) {
                    currentQueue = queue;
                    queue = [];
                    while (++queueIndex < len) {
                        if (currentQueue) {
                            currentQueue[queueIndex].run();
                        }
                    }
                    queueIndex = -1;
                    len = queue.length;
                }
                currentQueue = null;
                draining = false;
                clearTimeout(timeout);
            }
            process.nextTick = function(fun) {
                var args = new Array(arguments.length - 1);
                if (arguments.length > 1) {
                    for (var i = 1; i < arguments.length; i++) {
                        args[i - 1] = arguments[i];
                    }
                }
                queue.push(new Item(fun, args));
                if (queue.length === 1 && !draining) {
                    setTimeout(drainQueue, 0);
                }
            };
            function Item(fun, array) {
                this.fun = fun;
                this.array = array;
            }
            Item.prototype.run = function() {
                this.fun.apply(null, this.array);
            };
            process.title = 'browser';
            process.browser = true;
            process.env = {};
            process.argv = [];
            process.version = '';
            process.versions = {};
            function noop() {}
            process.on = noop;
            process.addListener = noop;
            process.once = noop;
            process.off = noop;
            process.removeListener = noop;
            process.removeAllListeners = noop;
            process.emit = noop;
            process.binding = function(name) {
                throw new Error('process.binding is not supported');
            };
            process.cwd = function() {
                return '/';
            };
            process.chdir = function(dir) {
                throw new Error('process.chdir is not supported');
            };
            process.umask = function() {
                return 0;
            };
        }, {} ],
        211: [ function(_dereq_, module, exports) {
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
        }, {} ],
        212: [ function(_dereq_, module, exports) {
            var bundleFn = arguments[3];
            var sources = arguments[4];
            var cache = arguments[5];
            var stringify = JSON.stringify;
            module.exports = function(fn) {
                var keys = [];
                var wkey;
                var cacheKeys = Object.keys(cache);
                for (var i = 0, l = cacheKeys.length; i < l; i++) {
                    var key = cacheKeys[i];
                    var exp = cache[key].exports;
                    if (exp === fn || exp.default === fn) {
                        wkey = key;
                        break;
                    }
                }
                if (!wkey) {
                    wkey = Math.floor(Math.pow(16, 8) * Math.random()).toString(16);
                    var wcache = {};
                    for (var i = 0, l = cacheKeys.length; i < l; i++) {
                        var key = cacheKeys[i];
                        wcache[key] = key;
                    }
                    sources[wkey] = [ Function([ 'require', 'module', 'exports' ], '(' + fn + ')(self)'), wcache ];
                }
                var skey = Math.floor(Math.pow(16, 8) * Math.random()).toString(16);
                var scache = {};
                scache[wkey] = wkey;
                sources[skey] = [ Function([ 'require' ], 'var f = require(' + stringify(wkey) + ');' + '(f.default ? f.default : f)(self);'), scache ];
                var src = '(' + bundleFn + ')({' + Object.keys(sources).map(function(key) {
                    return stringify(key) + ':[' + sources[key][0] + ',' + stringify(sources[key][1]) + ']';
                }).join(',') + '},{},[' + stringify(skey) + '])';
                var URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
                return new Worker(URL.createObjectURL(new Blob([ src ], {
                    type: 'text/javascript'
                })));
            };
        }, {} ]
    }, {}, [ 1 ])(1);
});
