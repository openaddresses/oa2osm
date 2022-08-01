# oa2osm
Converts [OpenAddresses result GeoJSON](https://batch.openaddresses.io/data) to [OpenStreetMap XML](https://wiki.openstreetmap.org/wiki/OSM_XML).

# How to use
Download a result GeoJSON file from https://batch.openaddresses.io/data

## Locally
    git clone https://github.com/openaddresses/oa2osm.git
    cd oa2osm
    npm install
    ./oa2osm.js input.geojson output.osm

## Globally
    npm install --global oa2osm
    oa2osm input.geojson output.osm

# Usage
```
Usage: oa2osm [options] [input.geojson] [output.osm]

Options:
    --title-case                    Comma separated list of source
                                    fields to convert to title case.
    --map-source_field=target_tag   Define a source field to target tag.

Example:
    oa2osm --title-case 'STREET,CITY' --map-city='addr:suburb'
```
