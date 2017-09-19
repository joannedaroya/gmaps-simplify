Philippines geojson visualizer - Node.js
================

Extract coordinates, convert to Google Maps format, simplify points using [line-simplify-rdp](https://github.com/scottglz/line-simplify-rdp), and generate html files to visualize at different threshold values. GeoJSON Source File, [Provinces.json](https://github.com/macoymejia/geojsonph/blob/master/Province/Provinces.json), was edited to fit 81 provinces. Used [Map Shaper](http://mapshaper.org/) to merge 2 provinces.

How?
----

### extractProvinces.js
`tolerance`: defines how big the `threshold` will be when simplifying the points. Read [line-simplify-rdp documentation](https://www.npmjs.com/package/line-simplify-rdp) for further explanation on how to simplify points. You can adjust how much `tolerance` and `threshold` will be used.
Sample:
```js
const tolerance = 1,
	threshold = tolerance * 100000;
```

### generate-visualizer.js
`apiKey` must be declared to successfully generate an HTML file. Sample:
```js
const apiKey = 'your API key';
```

### run program using Node.js
Once you have set a `tolerance` and/or `threshold`, run the program to extract the coordinates.