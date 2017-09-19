const fs = require('fs');

fs.readFile('maguindanao-complete.json', 'utf8', (err,data) => {
	if (err) throw err;
	data = JSON.parse(data);

	let coords = data.geometries[0].coordinates.map(coordinates => {
		return coordinates[0].map(point => {
			let obj = {};
			obj['lng'] = point[0];
			obj['lat'] = point[1];
			return obj;
		});
	});
	coords = JSON.stringify(coords);
	let body = `
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
                  zoom: 9,
                  center: {lat: 7.1477907, lng: 124.2943109},
                  mapTypeId: 'terrain'
                });

               var shapeCoords = ${coords};
				var shape = new google.maps.Polygon({
				    paths: shapeCoords,
				    strokeColor: '#FF0000',
				    strokeOpacity: 0.8,
				    strokeWeight: 2,
				    fillColor: '#FF0000',
				    fillOpacity: 0.5
			    });
			    shape.setMap(map);
              }
            </script>
            <script async defer
            src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDl32dSXGt7MYeJnkofk4mARVT4VUF5Poo&callback=initMap">
            </script>
          </body>
        </html>
	`;

	fs.writeFile('maguindanao.html', body, err => {
		if (err) return err;
		console.log('Successfully created HTML file.');
	});
})