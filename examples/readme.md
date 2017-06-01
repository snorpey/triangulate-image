example images
===

gradients
---
![example image 01](img/example-01.png)
```javascript
var params = {
	blur: 110,
	vertexCount: 700,
	accuracy: 0.2,
	fill: true,
	gradients: true,
	gradientStops: 2,
	stroke: true,
	strokeWidth: 10,
	lineJoin: 'round'
};
```

low poly
---
![example image 02](img/example-02.png)
```javascript
var params = {
	blur: 110,
	vertexCount: 50,
	accuracy: 0.9,
	fill: true,
	gradients: false,
	gradientStops: 2,
	stroke: false,
	strokeWidth: 10,
	lineJoin: 'round'
};
```

outlines
---
![example image 03](img/example-03.png)
```javascript
var params = {
	blur: 110,
	vertexCount: 1350,
	accuracy: 0.9,
	fill: false,
	gradients: false,
	gradientStops: 2,
	stroke: true,
	strokeWidth: 1,
	lineJoin: 'miter'
};
```

high poly
---
![example image 04](img/example-04.png)
```javascript
var params = {
	blur: 110,
	vertexCount: 4350,
	accuracy: 0.9,
	fill: true,
	gradients: false,
	gradientStops: 2,
	stroke: true,
	strokeWidth: 2,
	lineJoin: 'miter'
};
```

broken mirror
---
![example image 05](img/example-05.png)
```javascript
var params = {
	blur: 110,
	vertexCount: 650,
	accuracy: 0.5,
	fill: true,
	gradients: true,
	gradientStops: 20,
	stroke: true,
	strokeWidth: 15,
	lineJoin: 'miter'
};
```

lazy painter
---
![example image 06](img/example-06.png)
```javascript
var params = {
	blur: 110,
	vertexCount: 650,
	accuracy: 0.5,
	fill: true,
	gradients: false,
	gradientStops: 2,
	stroke: true,
	strokeWidth: 10,
	lineJoin: 'miter'
};
```