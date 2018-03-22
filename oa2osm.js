#!/usr/bin/env node

var fs = require('fs');
var parse = require('csv-parse');
var transform = require('stream-transform');
var xml = require('xml');
var numeral = require('numeral');

if (process.argv.length < 4) {
    console.error("Usage: ./oa2osm.js oa.csv oa.osm");
    process.exit();
}

var map = {
    'UNIT': 'addr:unit',
    'NUMBER': 'addr:housenumber',
    'STREET': 'addr:street',
    'CITY': 'addr:city',
    'DISTRICT': 'addr:district',
    'REGION': 'addr:state',
    'POSTCODE': 'addr:postcode'
};

var count = 0;

var parser = parse({ columns: true });
var transformer = transform(function(record, callback){
    count++;
    if (count % 100 == 0) {
        process.stdout.write(" " + numeral(count).format('0a') + "   \r");
    }
    var e = [{
        _attr: {
            lat: record.LAT,
            lon: record.LON,
            visible: "true",
            version: "1"
        }
    }];
    Object.keys(map).map((oaKey) => {
        if (record[oaKey]) {
            e.push({
                tag: {
                    _attr: {
                        k: map[oaKey],
                        v: record[oaKey]
                    }
                }
            });
        }
    });
    var node = xml([{ node: e }], true);
    callback(null, node + "\n");
}, {parallel: 10});

var output = fs.createWriteStream(process.argv[3]);
output.write('<?xml version="1.0" encoding="UTF-8"?>' + "\n");
output.write('<osm version="0.6" generator="oa2osm">' + "\n");
fs.createReadStream(process.argv[2])
    .pipe(parser)
    .pipe(transformer)
    .pipe(output, { end: false });

// fixme is there a race condition here? transformer finished but last note not yet written?
transformer.on('end', () => {
    output.write('</osm>' + "\n");
});
