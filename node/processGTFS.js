var request = require('request'),
    fs = require('fs'),
    process = require('child_process'),
    csv = require('csv'),
    _ = require('underscore'),
    assert = require('assert');

var createCSVObject = function(filePath) {
    //
};

var createCustomData = function() {
    // var csv = createCSVObject();
    var stationAsKey = {};
    var stopIdIndex;
    var arrivalTimeIndex;
    var departureTimeIndex;
    var tripIdIndex;
    csv().fromPath(__dirname + "/gtfs/stop_times.txt").
        on("data", function(data, index) {
            if ( index === 0 ) {
                /* hoisted variable :) */
                stopIdIndex = data.indexOf("stop_id");
                arrivalTimeIndex = data.indexOf("arrival_time");
                departureTimeIndex = data.indexOf("departure_time");
                tripIdIndex = 0; //wtf don't know why this won't work: data.indexOf("trip_id"); //train number is part of this
            } else {
                console.log("data: " + arrivalTimeIndex);
                var customDataObject = {
                    arrivalTime : data[arrivalTimeIndex],
                    departureTime : data[departureTimeIndex],
                    tripId : data[tripIdIndex]
                };
                
                var stationName = data[stopIdIndex];
                // console.log("obj: " + stationName + ".." + JSON.stringify(customDataObject));
                var existingStationObjects = stationAsKey[stationName];
                // console.log("exi:" + existingStationObjects);

                if ( existingStationObjects ){
                    existingStationObjects.push(customDataObject);
                } else {
                    existingStationObjects = [customDataObject];
                }
                stationAsKey[stationName] = existingStationObjects;
            }
        }).
        on("end", function() {
            fs.writeFile("../data/stationKey.json", JSON.stringify(stationAsKey));
        });
};

var unzipFile = function() {
    process.exec("unzip " + __dirname + "/google_transit.zip -d gtfs", function(err) {
        if (err) {
            throw err;
        } else {
            console.log("File unzipped");
            createCustomData();
        }
    });
};

var main = function(err) {
    if (err) {
        throw err;
    }
    var fileStream = fs.createWriteStream('google_transit.zip').
                        on('close', unzipFile);
    request('http://www.caltrain.com/Assets/GTFS/caltrain/google_transit.zip').
        pipe(fileStream);
    
};

// process.exec("rm -rf google_transit.zip gtfs", main);
createCustomData();