'use strict';

const jsonfile = require('jsonfile'),
    simplify= require('line-simplify-rdp'),
    srcJsonFile = 'Provinces-new.json';

const multiplier = 1000000,
    tolerance = 80,
    threshold = tolerance * 100000;
let setLatLng = input => {
    let obj = {};
    obj['lng'] = input[0];
    obj['lat'] = input[1];
    return obj;
}
let setPoints = input => {
    let obj = {};
    obj['x'] = input[1];
    obj['y'] = input[0];
    return obj;
}
let convertData = (input,multiplier) => {
    return input.map(element => {
        let obj = {};
        obj.x = element.x * multiplier;
        obj.y = element.y * multiplier;
        return obj;
    });
}
let returnData = (input,multiplier) => {
    return input.map(element => {
        let obj = {};
        obj.x = element.x / multiplier;
        obj.y = element.y / multiplier;
        return obj;
    });
}
let convertKeys = input => {
    return input.map(element => {
        let obj = {};
        obj['lng'] = element.y;
        obj['lat'] = element.x;
        return obj;
    });
}

jsonfile.readFile(srcJsonFile, (err,data) => {
    if (err) throw err;
    data.features.map(content => {
        const getProvName = content.properties.PROVINCE;
        let fileName = getProvName.split(" ").join("_").toLowerCase();
        fileName = fileName.split("-").join("_").toLowerCase();
        let coords, points, originalData, simplifiedData, result;
        const filePath = `./provinces/${fileName}.json`,
            minifiedPath = `./minified_provinces/threshold_${tolerance}/${fileName}.json`;

        if(content.geometry.type === 'Polygon') {
            coords = content.geometry.coordinates[0].map(point => setLatLng(point));
            jsonfile.writeFile(filePath, coords, err => { if (err) return err });

            points = content.geometry.coordinates[0].map(point => setPoints(point));
            originalData = convertData(points,multiplier);
            simplifiedData = simplify(originalData, threshold);
            result = convertKeys(returnData(simplifiedData,multiplier));
            
            jsonfile.writeFile(minifiedPath, result, err => { if (err) throw err });
        } else if(content.geometry.type === 'MultiPolygon') {
            coords = content.geometry.coordinates.map(coordinates => {
                return coordinates[0].map(point => setLatLng(point));
            });
            jsonfile.writeFile(filePath, coords, err => { if (err) return err });

            points = content.geometry.coordinates.map(coordinates => {
                return coordinates[0].map(point => setPoints(point));
            });
            originalData = points.map(element => convertData(element,multiplier));
            simplifiedData = originalData.map(element => simplify(element, threshold));
            result = simplifiedData.map(element => convertKeys(returnData(element,multiplier)));

            jsonfile.writeFile(minifiedPath, result, err => { if (err) throw err });
        }
    })
});