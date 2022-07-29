#!/bin/sh

# immediately exit script when it encounters an error
set -e

# tests with stdin/stdout
echo "Test 1"
./oa2osm.js < test/input.geojson | diff - test/output.osm

echo "Test 2"
./oa2osm.js --title-case 'CITY' < test/input.geojson | diff - test/output-title-case.osm

echo "Test 3"
./oa2osm.js --map-city='addr:suburb' < test/input.geojson | diff - test/output-map.osm

# test input and output arguments
echo "Test 4"
./oa2osm.js test/input.geojson | diff - test/output.osm

echo "Test 5"
./oa2osm.js test/input.geojson test/output-result.osm && diff test/output-result.osm test/output.osm
rm -f test/output-result.osm
