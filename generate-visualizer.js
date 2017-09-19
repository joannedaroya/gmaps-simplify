'use strict';

const fs = require('fs'),
	readMultipleFiles = require('read-multiple-files'),
	config = require('./config'),
	dirPath = './provinces/',
	threshold = 'threshold_80',
    dirPathMin = `./minified_provinces/${threshold}/`,
    apiKey = config.MY_KEY;

let setMapFn = input => {
	let i = 0;
	let content = input.map(coords => {
		let colorGen = Math.floor(0x1000000 * Math.random()).toString(16);
		let color = '#' + ('000000' + colorGen).slice(-6);
		i += 1;
		return `
			var shape${i}Coords = ${coords};
			var shape${i} = new google.maps.Polygon({
			    paths: shape${i}Coords,
			    strokeColor: '${color}',
			    strokeOpacity: 0.8,
			    strokeWeight: 2,
			    fillColor: '${color}',
			    fillOpacity: 0.5
		    });
		    shape${i}.setMap(map);
		`;
	});
	return content.reduce((aggregate, coordinate) => aggregate + coordinate);
}

let genHtml = setMap => {
	return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="initial-scale=1.0, user-scalable=no">
        <meta charset="utf-8">
        <title>Simple Polygon</title>
        <style>
          #map {
            height: 100%;
          }
          html, body {
            height: 100%;
            margin: 0;
            padding: 0;
          }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          function initMap() {
            var map = new google.maps.Map(document.getElementById('map'), {
              zoom: 6,
              center: {lat: 13.1024, lng: 120.7651}, // MINDORO
              mapTypeId: 'terrain'
            });

           ${setMap}
          }
        </script>
        <script type="text/javascript" src="config.js"></script>
        <script async defer
        src="https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap">
        </script>
      </body>
    </html>
	`;
}

fs.readdir(dirPath, (err,filesPath) => {
	if (err) throw err;
	filesPath = filesPath.map(filePath => dirPath + filePath);
	readMultipleFiles(filesPath, 'utf8', (err,data) => {
		if (err) throw err;

		let generateCode = setMapFn(data);

		if(typeof apiKey === 'undefined') {
			console.log('No API Key provided.');
		} else {
			fs.writeFile('index.html', genHtml(generateCode), err => {
		    	if (err) return err;
			});
		}
	})
});

fs.readdir(dirPathMin, (err,filesPath) => {
	if (err) throw err;
	filesPath = filesPath.map(filePath => dirPathMin + filePath);
	readMultipleFiles(filesPath, 'utf8', (err,data) => {
		if (err) throw err;
		
		let generateMin = setMapFn(data);
        let fileName = `minified_provinces/${threshold}.html`;

		if(typeof apiKey === 'undefined') {
			console.log('No API Key provided.');
		} else {
			fs.writeFile(fileName, genHtml(generateMin), err => {
			    if (err) return err;
			});
		}
	})
});