/*! simple-map-d3 - v0.1.2 - 2013-08-09
 * http://code.minnpost.com/simple-map-d3/
 * Copyright (c) 2013 Alan Palazzolo; Licensed MIT
 */

/**
 * Main JS for Simple Map (D3).
 *
 * Colors from http://colorbrewer2.org/
 */
function SimpleMapD3(o) {
  var smd = {};
  
  var defaults = {
    'stroke-width': 1,
    stroke: '#898989',
    fill: '#BDBDBD',
    colorOn: false,
    colorSet: ['#F7FCF5', '#E5F5E0', '#C7E9C0', '#A1D99B', 
      '#74C476', '#41AB5D', '#238B45', '#005A32'],
    tooltipOn: true,
    tooltipContent: function(d) {
      var output = '';
      for (var p in d.properties) {
        if (d.properties.hasOwnProperty(p)) {
          output += p + ': ' + d.properties[p] + '<br />';
        }
      }
      return output;
    },
    projection: 'albersUsa',
    styles: {}
  };
  
  // Constructor
  smd.constructor = function(options) {
    // Extend defaults
    var extended = defaults;
    for (var prop in options) {
      if (options.hasOwnProperty(prop)) {
        extended[prop] = options[prop];
      }
    }
    smd.options = extended;

    // Check if data was given, or if data source was given
    if (smd.options.data === Object(smd.options.data)) {
      smd.data = smd.options.data;
      smd.loadData(smd.data);
    }
    else if (toString.call(smd.options.datasource) == '[object String]') {
      smd.getData();
    }
    
    return smd;
  };
  
  // Get data
  smd.getData = function() {
    d3.json(smd.options.datasource, function(data) {
      smd.data = data;
      smd.loadData();
    });
    
    return smd;
  };
  
  // Handle data once loaded
  smd.loadData = function(data) {
    if (smd.data === void 0) {
      smd.data = data;
    }
    smd.topo().canvas().projection().render().fit();
    
    return smd;
  };
  
  // Handle topojson
  smd.topo = function() {
    var o, obj;
    
    if (smd.data.type.toLowerCase() === 'topology' && 
      typeof topojson != 'undefined') {
      // Use first object found (this should become configurable
      for (o in smd.data.objects) {
        if (smd.data.objects.hasOwnProperty(o)) {
          obj = smd.data.objects[o];
          break;
        }
      }
      smd.data = topojson.feature(smd.data, smd.data.objects[o]);
    }
    
    return smd;
  };
  
  // Load up canvas, set size to container
  smd.canvas = function() {
    smd.container = d3.select(smd.options.container);
    smd.width = parseFloat(smd.container.style('width'));
    smd.height = parseFloat(smd.container.style('height'));
    smd.canvas = smd.container.append('svg')
      .attr('width', smd.width)
      .attr('height', smd.height);
    smd.group = smd.canvas.append('g');
      
    // Add tooltip
    if (smd.options.tooltipOn === true) {
      smd.container.classed('simple-map-d3-tooltip-container', true);
      smd.container.append('div').classed('simple-map-d3-tooltip', true);
    }
    
    return smd;
  };
  
  // Create projection
  smd.projection = function() {
    var projFunc = smd.options.projection;
  
    if (typeof projFunc == 'undefined' ||
      typeof d3.geo[projFunc] != 'function') {
      projFunc = 'albersUsa';
    }
    
    smd.centroid = d3.geo.centroid(smd.data);
    smd.projection = d3.geo[projFunc]()
      .scale(1000)
      .translate([smd.width / 2, smd.height / 2]);
    
    // Center if available
    if (typeof smd.projection.center === 'function') {
      smd.projection.center(smd.centroid);
    }
    
    // Rotate if needed
    if (typeof smd.options.rotation != 'undefined' &&
      smd.options.rotation.length > 0 &&
      typeof smd.projection.rotate === 'function') {
      smd.projection.rotate(smd.options.rotation);
    }
  
    smd.projPath = d3.geo.path()
      .projection(smd.projection);
      
    return smd;
  };
  
  // Fit view
  smd.fit = function() {
    var b = smd.bounds = smd.projPath.bounds(smd.data);

    smd.group.attr('transform',
      'translate(' + smd.projection.translate() + ')' + 
      'scale(' + 0.95 / Math.max((b[1][0] - b[0][0]) / smd.width, (b[1][1] - b[0][1]) / smd.height) + ')' +
      'translate(' + -(b[1][0] + b[0][0]) / 2 + ',' + -(b[1][1] + b[0][1]) / 2 + ')');
      
    return smd;
  };
  
  // Make color range
  smd.makeColorRange = function() {
    var min = d3.min(smd.data.features, function(d) { return d.properties[smd.options.colorProperty]; });
    var max = d3.max(smd.data.features, function(d) { return d.properties[smd.options.colorProperty]; });
    // Use a sort of sensible, proportional color step
    smd.options.colorStep = smd.options.colorStep || ((max - min) / smd.options.colorSet.length / 2);

    smd.colorRange = d3.scale.linear()
      .domain(d3.range(min, max, smd.options.colorStep))
      .range(smd.options.colorSet)
      .clamp(true);
    
    return smd;
  };
  
  // Callback for attribute: Fill
  smd.attributeFill = function(d) {
    if (smd.options.colorOn === false) {
      return smd.options.fill;
    }
    else {
      if (!smd.ColorRange) {
        smd.makeColorRange();
      }
      return smd.colorRange(d.properties[smd.options.colorProperty]);
    }
  };
  
  // Render
  smd.render = function() {
    smd.group
      .selectAll('path')
        .data(smd.data.features)
      .enter().append('path')
        .attr('d', smd.projPath)
        .attr('class', 'smd-path')
        .style(smd.options.styles)
        .attr('fill', function(d) { return smd.attributeFill(d); })
        .on('mouseover', function(d) {
          // Tooltip
          if (smd.options.tooltipOn === true) {
            smd.container.select('.simple-map-d3-tooltip')
              .style('display', 'block')
              .html(smd.options.tooltipContent(d));
          }
        })
        .on('mouseout', function(d) {
          // Tooltip
          if (smd.options.tooltipOn === true) {
            smd.container.select('.simple-map-d3-tooltip')
              .style('display', 'none');
          }
        });
        
    return smd;
  };
  
  // Construct and return our map object.
  smd.constructor(o);
  return smd;
}