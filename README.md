# oa2osm
Converts [OpenAddresses result CSVs](https://openaddresses.io/) to [OpenStreetMap XML](https://wiki.openstreetmap.org/wiki/OSM_XML).

# How to use
Download a result CSV from http://results.openaddresses.io/

    npm install
    ./oa2osm.js input.csv output.osm

# Usage
```
Usage: ./oa2osm.js [options] [input.csv] [output.osm]

Options:
    --title-case                    Comma separated list of source
                                    fields to convert to title case.
    --map-source_field=target_tag   Define a source field to target tag.

Example:
    oa2osm --title-case 'STREET,CITY' --map-city='addr:suburb'
```
