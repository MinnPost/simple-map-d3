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
    }
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
      smd.dataLoaded(smd.data);
    }
    else if (toString.call(smd.options.datasource) == '[object String]') {
      smd.getData();
    }
  };
  
  // Get data
  smd.getData = function() {
    d3.json(smd.options.datasource, function(data) {
      smd.data = data;
      smd.loadData();
    });
  };
  
  // Handle data once loaded
  smd.loadData = function(data) {
    if (smd.data === void 0) {
      smd.data = data;
    }
    smd.topo();
    smd.canvas();
    smd.project();
    smd.render();
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
  };
  
  // Load up canvas, set size to container
  smd.canvas = function() {
    smd.container = d3.select(smd.options.container);
    smd.width = parseFloat(smd.container.style('width'));
    smd.height = parseFloat(smd.container.style('height'));
    smd.canvas = smd.container.append('svg')
      .attr('width', smd.width)
      .attr('height', smd.height);
      
    // Add tooltip
    if (smd.options.tooltipOn === true) {
      smd.container.classed('simple-map-d3-tooltip-container', true);
      smd.container.append('div').classed('simple-map-d3-tooltip', true);
    }
  };
  
  // Project data into the canvas
  smd.project = function() {
    smd.proj = d3.geo.mercator().scale(1).translate([0,0]);
    smd.projOptions = smd.projOptions || {};
    
    // Variables
    var margin = smd.width * 0.02;
    var bounds0 = d3.geo.bounds(smd.data);
    var bounds = bounds0.map(smd.proj);
    var xscale = (smd.width - 2 * margin) / Math.abs(bounds[1][0] - bounds[0][0]);
    var yscale = (smd.height - 2 * margin) / Math.abs(bounds[1][1] - bounds[0][1]);
    var pscale = Math.min(xscale, yscale);
    var wscale = pscale;
    var d, widthd, heightd;
    
    // Handle projection
    smd.proj.scale(pscale);
    smd.proj.translate(smd.proj([-bounds0[0][0], -bounds0[1][1]]));
    smd.projOptions.path = d3.geo.path().projection(smd.proj);
    
    // Handle svg canvas, dpeneding on orientation
    if (xscale > yscale) {
      d = xscale * Math.abs(bounds[1][0] - bounds[0][0]) - yscale * Math.abs(bounds[1][0] - bounds[0][0]);
      smd.canvas.attr('transform', 'translate(' + d / 2 + ', 0)');
    }
    else {
      d = yscale * Math.abs(bounds[1][1] - bounds[0][1]) - xscale * Math.abs(bounds[1][1] - bounds[0][1]);
      smd.canvas.attr('transform', 'translate(0, ' + d / 5 + ')');
    }
    
    // Handle offset, depending on orientation
    widthd = smd.proj(bounds0[0])[1];
    heightd = smd.proj(bounds0[1])[0];
    if (xscale > yscale) {
      smd.projOptions.offsetxd = (smd.width / 2 - widthd / 2);
      smd.projOptions.offsetyd = margin;
    }
    else {
      smd.projOptions.offsetxd = margin;
      smd.projOptions.offsetyd = (smd.height / 2 - heightd / 2);
    }
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
    smd.canvas
      .selectAll('path')
        .data(smd.data.features)
      .enter().append('path')
        .attr('d', smd.projOptions.path)
        .attr('stroke', smd.options.stroke)
        .attr('stroke-width', smd.options['stroke-width'])
        .attr('fill', function(d) { return smd.attributeFill(d); })
        .attr('transform', 'translate(' + smd.projOptions.offsetxd + ', ' + smd.projOptions.offsetyd + ')')
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
  };
  
  // Construct and return our map object.
  smd.constructor(o);
  return smd;
}