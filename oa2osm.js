#!/usr/bin/env node

const fs = require('fs');
const parse = require('csv-parse');
const transform = require('stream-transform');
const {pipeline} = require('stream');
const xml = require('xml');
const numeral = require('numeral');
const argv = require('minimist')(process.argv.slice(2), {
    boolean: ['help', 'h']
});

if (argv.h|| argv.help) {
    console.error();
    console.error("Usage: ./oa2osm.js [options] [input.csv] [output.osm]");
    console.error();
    console.error("Options:");
    console.error("    --title-case                    Comma separated list of source");
    console.error("                                    fields to convert to title case.");
    console.error("    --map-source_field=target_tag   Define a source field to target tag.");
    console.error();
    console.error("Example:");
    console.error("    oa2osm --title-case 'STREET,CITY' --map-city='addr:suburb'");

    process.exit();
}

const map = {
    'UNIT': 'addr:unit',
    'NUMBER': 'addr:housenumber',
    'STREET': 'addr:street',
    'CITY': 'addr:city',
    'DISTRICT': 'addr:district',
    'REGION': 'addr:state',
    'POSTCODE': 'addr:postcode'
};

// tags to title case if option given
const titleCaseTags = (argv['title-case'] || '').split(',').map((attribute) => {
    return attribute.toUpperCase();
});

// allow user to override tag mapping
Object.keys(map).forEach((key) => {
    if (argv['map-' + key.toLowerCase()]) {
        map[key] = argv['map-' + key.toLowerCase()];
    }
});

/* https://stackoverflow.com/a/196991/6702659 */
function toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        (txt) => {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}

let count = 0;

const parser = parse({ columns: true });
const transformer = transform((record, callback) => {
    count++;
    if (count % 100 == 0) {
        process.stdout.write(" " + numeral(count).format('0a') + "   \r");
    }
    const e = [{
        _attr: {
            lat: record.LAT,
            lon: record.LON,
            visible: "true",
            version: "1",
            id: -count
        }
    }];
    Object.keys(map).map((oaKey) => {
        if (record[oaKey]) {
            e.push({
                tag: {
                    _attr: {
                        k: map[oaKey],
                        v: (titleCaseTags.includes(oaKey)) ? toTitleCase(record[oaKey]) : record[oaKey]
                    }
                }
            });
        }
    });
    const node = xml([{ node: e }], true);
    callback(null, node + "\n");
}, {parallel: 10});

const output = fs.createWriteStream(argv._.length > 1 ? argv._[1] : '/dev/stdout');
output.write('<?xml version="1.0" encoding="UTF-8"?>' + "\n");
output.write('<osm version="0.6" generator="https://github.com/openaddresses/oa2osm">' + "\n");

pipeline(
    fs.createReadStream(argv._.length > 0 ? argv._[0] : '/dev/stdin'),
    parser,
    transformer,
    output,
    (err) => {
        output.write('</osm>\n');
    }
)

