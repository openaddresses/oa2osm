#!/bin/sh

# immediately exit script when it encounters an error
set -e

# tests with stdin/stdout
./oa2osm.js < test/input.csv | diff - test/output.osm
./oa2osm.js --title-case 'CITY' < test/input.csv | diff - test/output-title-case.osm
./oa2osm.js --map-city='addr:suburb' < test/input.csv | diff - test/output-map.osm

# test input and output arguments
./oa2osm.js test/input.csv | diff - test/output.osm

./oa2osm.js test/input.csv test/output-result.osm && diff test/output-result.osm test/output.osm
rm -f test/output-result.osm
