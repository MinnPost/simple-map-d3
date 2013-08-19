/**
 * Core/basic tests for Simple Map
 */
var test = require('tape');
var d3 = require('d3');
var SimpleMapD3 = require('../lib/js/simple-map-d3.js');

test('map', function(t) {
  t.plan(1);
  
  var smd = SimpleMapD3({});
  t.equal(typeof smd, 'object');
});