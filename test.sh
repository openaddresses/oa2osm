#!/bin/sh

./oa2osm.js < test/input.csv | diff - test/output.osm
./oa2osm.js --title-case 'CITY' < test/input.csv | diff - test/output-title-case.osm
./oa2osm.js --map-city='addr:suburb' < test/input.csv | diff - test/output-map.osm
