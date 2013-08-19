# Simple Map (D3)

A very simple "choropleth" style map with tooltips with D3.  All you need is a GeoJSON of polygons.

## Usage

See [code.minnpost.com/simple-map-d3](http://code.minnpost.com/simple-map-d3/) for instructions, configuration, and examples.

## Development

### Install

1. Install [NodeJS](http://nodejs.org/).
1. Install [Grunt](http://gruntjs.com/): `npm install -g grunt-cli`
1. Install [Bower](http://bower.io/): `npm install -g bower` 
1. Install packages: `npm install && bower install`

### Build

1. Run: `grunt`

## Example

The example page is built with some other libraries.

    bower install https://github.com/michaelparenteau/simple.git topojson#~1.2.3 jquery#~2.0.3

### Testing

There are some very basic tests in the `tests/` folder.  Run them like so: `node tests/core.js`

### Browser support

As this library depends heavily on D3 and SVG, Simple Map will only work in "modern" browsers.  The following is some basic tests run on Tesling.

[![browser support](https://ci.testling.com/minnpost/simple-map-d3.png)](https://ci.testling.com/minnpost/simple-map-d3)
