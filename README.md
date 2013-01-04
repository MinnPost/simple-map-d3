# Simple Map (D3)

A very simple "choropleth" style map with tooltips with D3 (R2D3).  All you need is a GeoJSON of polygons.

## Data

Any latitude and longitude based GeoJSON file will work.

## Usage

Include JS

Create container

    <div id="simple-map-d3-example"></div>
    
Create the map

    var map = simpleMapD3({
      data: 'path/to/file.geojson'
    });