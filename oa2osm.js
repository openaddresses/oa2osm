#!/usr/bin/env node

const fs = require('fs');
const {split} = require('event-stream');
const transform = require('stream-transform');
const {pipeline} = require('stream');
const xml = require('xml');
const numeral = require('numeral');
const argv = require('minimist')(process.argv.slice(2), {
  boolean: ['help', 'h']
});

if (argv.h|| argv.help) {
  console.error();
  console.error("Usage: ./oa2osm.js [options] [input.geojson] [output.osm]");
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
  'unit': 'addr:unit',
  'number': 'addr:housenumber',
  'street': 'addr:street',
  'city': 'addr:city',
  'district': 'addr:district',
  'region': 'addr:state',
  'postcode': 'addr:postcode'
};

// tags to title case if option given
const titleCaseTags = (argv['title-case'] || '').split(',').map((attribute) => {
  return attribute.toLowerCase();
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

const transformer = transform((record, callback) => {
  const parsedRecord = JSON.parse(record);
  count++;
  if (count % 100 == 0) {
    process.stdout.write(" " + numeral(count).format('0a') + "   \r");
  }
  const e = [{
    _attr: {
      lat: parsedRecord.geometry.coordinates[1],
      lon: parsedRecord.geometry.coordinates[0],
      visible: "true",
      version: "1",
      id: -count
    }
  }];
  const props = parsedRecord.properties;
  Object.keys(map).map((oaKey) => {
    if (props[oaKey]) {
      e.push({
        tag: {
          _attr: {
            k: map[oaKey],
            v: (titleCaseTags.includes(oaKey)) ? toTitleCase(props[oaKey]) : props[oaKey]
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
output.write('<osm version="0.6" upload="false" generator="https://github.com/openaddresses/oa2osm">' + "\n");

pipeline(
  fs.createReadStream(argv._.length > 0 ? argv._[0] : '/dev/stdin'),
  split(),
  transformer,
  output,
  () => {
    if (argv._.length > 1) {
      fs.appendFileSync(argv._[1], '</osm>\n');
    } else {
      process.stdout.write('</osm>\n');
    }
  }
)

