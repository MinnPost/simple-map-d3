/**
 * Main JS for Simple Map (D3).
 *
 * Colors from http://colorbrewer2.org/
 */
function SimpleMapD3(o) {
  var smd = {};
  
  var defaults = {
    colorOn: false,
    colorSet: 'YlOrBr',
    colorScale: 'quantile',
    colorReverse: false,
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
    legendFormatter: d3.format(','),
    legendOn: true,
    legendTitle: 'Legend',
    styles: {},
    stylesHover: {},
    stylesBackground: {},
    stylesLegendContainer: {},
    stylesLegendTitleText: {},
    stylesLegendText: {},
    stylesLegendSwatch: {},
    stylesGraticule: {},
    stylesGlobe: {},
    dragOn: false,
    graticuleOn: false
  };
  
  // Colorbrewer colors borrowed from Chroma.js
  // https://github.com/gka/chroma.js/blob/master/src/colors/colorbrewer.coffee
  // Copyright (c) 2002 Cynthia Brewer, Mark Harrower, and The 
  // Pennsylvania State University.
  // Licensed under the Apache License, Version 2.0
  smd.brewer = {
    OrRd: ['#fff7ec', '#fee8c8', '#fdd49e', '#fdbb84', '#fc8d59', '#ef6548', '#d7301f', '#b30000', '#7f0000'],
    PuBu: ['#fff7fb', '#ece7f2', '#d0d1e6', '#a6bddb', '#74a9cf', '#3690c0', '#0570b0', '#045a8d', '#023858'],
    BuPu: ['#f7fcfd', '#e0ecf4', '#bfd3e6', '#9ebcda', '#8c96c6', '#8c6bb1', '#88419d', '#810f7c', '#4d004b'],
    Oranges: ['#fff5eb', '#fee6ce', '#fdd0a2', '#fdae6b', '#fd8d3c', '#f16913', '#d94801', '#a63603', '#7f2704'],
    BuGn: ['#f7fcfd', '#e5f5f9', '#ccece6', '#99d8c9', '#66c2a4', '#41ae76', '#238b45', '#006d2c', '#00441b'],
    YlOrBr: ['#ffffe5', '#fff7bc', '#fee391', '#fec44f', '#fe9929', '#ec7014', '#cc4c02', '#993404', '#662506'],
    YlGn: ['#ffffe5', '#f7fcb9', '#d9f0a3', '#addd8e', '#78c679', '#41ab5d', '#238443', '#006837', '#004529'],
    Reds: ['#fff5f0', '#fee0d2', '#fcbba1', '#fc9272', '#fb6a4a', '#ef3b2c', '#cb181d', '#a50f15', '#67000d'],
    RdPu: ['#fff7f3', '#fde0dd', '#fcc5c0', '#fa9fb5', '#f768a1', '#dd3497', '#ae017e', '#7a0177', '#49006a'],
    Greens: ['#f7fcf5', '#e5f5e0', '#c7e9c0', '#a1d99b', '#74c476', '#41ab5d', '#238b45', '#006d2c', '#00441b'],
    YlGnBu: ['#ffffd9', '#edf8b1', '#c7e9b4', '#7fcdbb', '#41b6c4', '#1d91c0', '#225ea8', '#253494', '#081d58'],
    Purples: ['#fcfbfd', '#efedf5', '#dadaeb', '#bcbddc', '#9e9ac8', '#807dba', '#6a51a3', '#54278f', '#3f007d'],
    GnBu: ['#f7fcf0', '#e0f3db', '#ccebc5', '#a8ddb5', '#7bccc4', '#4eb3d3', '#2b8cbe', '#0868ac', '#084081'],
    Greys: ['#ffffff', '#f0f0f0', '#d9d9d9', '#bdbdbd', '#969696', '#737373', '#525252', '#252525', '#000000'],
    YlOrRd: ['#ffffcc', '#ffeda0', '#fed976', '#feb24c', '#fd8d3c', '#fc4e2a', '#e31a1c', '#bd0026', '#800026'],
    PuRd: ['#f7f4f9', '#e7e1ef', '#d4b9da', '#c994c7', '#df65b0', '#e7298a', '#ce1256', '#980043', '#67001f'],
    Blues: ['#f7fbff', '#deebf7', '#c6dbef', '#9ecae1', '#6baed6', '#4292c6', '#2171b5', '#08519c', '#08306b'],
    PuBuGn: ['#fff7fb', '#ece2f0', '#d0d1e6', '#a6bddb', '#67a9cf', '#3690c0', '#02818a', '#016c59', '#014636'],
    // diverging
    Spectral: ['#9e0142', '#d53e4f', '#f46d43', '#fdae61', '#fee08b', '#ffffbf', '#e6f598', '#abdda4', '#66c2a5', '#3288bd', '#5e4fa2'],
    RdYlGn: ['#a50026', '#d73027', '#f46d43', '#fdae61', '#fee08b', '#ffffbf', '#d9ef8b', '#a6d96a', '#66bd63', '#1a9850', '#006837'],
    RdBu: ['#67001f', '#b2182b', '#d6604d', '#f4a582', '#fddbc7', '#f7f7f7', '#d1e5f0', '#92c5de', '#4393c3', '#2166ac', '#053061'],
    PiYG: ['#8e0152', '#c51b7d', '#de77ae', '#f1b6da', '#fde0ef', '#f7f7f7', '#e6f5d0', '#b8e186', '#7fbc41', '#4d9221', '#276419'],
    PRGn: ['#40004b', '#762a83', '#9970ab', '#c2a5cf', '#e7d4e8', '#f7f7f7', '#d9f0d3', '#a6dba0', '#5aae61', '#1b7837', '#00441b'],
    RdYlBu: ['#a50026', '#d73027', '#f46d43', '#fdae61', '#fee090', '#ffffbf', '#e0f3f8', '#abd9e9', '#74add1', '#4575b4', '#313695'],
    BrBG: ['#543005', '#8c510a', '#bf812d', '#dfc27d', '#f6e8c3', '#f5f5f5', '#c7eae5', '#80cdc1', '#35978f', '#01665e', '#003c30'],
    RdGy: ['#67001f', '#b2182b', '#d6604d', '#f4a582', '#fddbc7', '#ffffff', '#e0e0e0', '#bababa', '#878787', '#4d4d4d', '#1a1a1a'],
    PuOr: ['#7f3b08', '#b35806', '#e08214', '#fdb863', '#fee0b6', '#f7f7f7', '#d8daeb', '#b2abd2', '#8073ac', '#542788', '#2d004b'],
    // qualitative
    Set2: ['#66c2a5', '#fc8d62', '#8da0cb', '#e78ac3', '#a6d854', '#ffd92f', '#e5c494', '#b3b3b3'],
    Accent: ['#7fc97f', '#beaed4', '#fdc086', '#ffff99', '#386cb0', '#f0027f', '#bf5b17', '#666666'],
    Set1: ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf', '#999999'],
    Set3: ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#b3de69', '#fccde5', '#d9d9d9', '#bc80bd', '#ccebc5', '#ffed6f'],
    Dark2: ['#1b9e77', '#d95f02', '#7570b3', '#e7298a', '#66a61e', '#e6ab02', '#a6761d', '#666666'],
    Paired: ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99', '#e31a1c', '#fdbf6f', '#ff7f00', '#cab2d6', '#6a3d9a', '#ffff99', '#b15928'],
    Pastel2: ['#b3e2cd', '#fdcdac', '#cbd5e8', '#f4cae4', '#e6f5c9', '#fff2ae', '#f1e2cc', '#cccccc'],
    Pastel1: ['#fbb4ae', '#b3cde3', '#ccebc5', '#decbe4', '#fed9a6', '#ffffcc', '#e5d8bd', '#fddaec', '#f2f2f2']
  };
  
  // Constructor
  smd.constructor = function(options) {
    // Make sure we have the right libraries
    if (typeof d3 === 'undefined') {
      throw new Error('Simple Map requires D3.');
    }
    
    // Extend defaults
    var extended = defaults;
    for (var prop in options) {
      if (options.hasOwnProperty(prop)) {
        extended[prop] = options[prop];
      }
    }
    smd.options = extended;
    
    // Make colorset
    if (typeof smd.options.colorSet == 'string' && 
      toString.call(smd.brewer[smd.options.colorSet]) == '[object Array]') {
      smd.options.colorSet = smd.brewer[smd.options.colorSet];
    }
    else if (toString.call(smd.options.colorSet) != '[object Array]') {
      throw new Error('Simple Map requires a valid colorSet option.');
    }
    if (smd.options.colorReverse === true) {
      smd.options.colorSet = smd.options.colorSet.reverse();
    }
    
    // Create event dispatcher using D3
    smd.events = d3.dispatch('dataLoaded', 'rendered');

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
    
    smd.topo();
    
    // Call data loaded event
    smd.events.dataLoaded(smd);
    
    // Render everything
    smd
      .drawCanvas()
      .projection()
      .makeColorRange()
      .drawGlobe()
      .drawGraticule()
      .drawMap()
      .fit()
      .drawLegend()
      .drag();
    
    // Call rendered event
    smd.events.rendered(smd);
    
    return smd;
  };
  
  // Handle topojson
  smd.topo = function() {
    var o = smd.options.topojsonObject;
    var obj;
    
    if (smd.data.type.toLowerCase() === 'topology' && 
      typeof topojson != 'undefined') {
      // Use first object found if object not defined
      if (typeof o == 'undefined') {
        for (o in smd.data.objects) {
          if (smd.data.objects.hasOwnProperty(o)) {
            obj = smd.data.objects[o];
            break;
          }
        }
      }
      smd.data = topojson.feature(smd.data, smd.data.objects[o]);
    }
    
    return smd;
  };
  
  // Load up canvas, set size to container
  smd.drawCanvas = function() {
    smd.container = d3.select(smd.options.container);
    smd.width = parseFloat(smd.container.style('width'));
    smd.height = parseFloat(smd.container.style('height'));
    smd.canvas = smd.container.append('svg')
      .attr('width', smd.width)
      .attr('height', smd.height)
      .attr('class', 'smd-canvas')
      .classed('smd-draggable', smd.options.dragOn)
      .classed('smd-tooltipped', smd.options.tooltipOn)
      .data([{ x: 0, y: 0 }]);
      
    smd.background = smd.canvas.append('rect')
      .attr('width', smd.width)
      .attr('height', smd.height)
      .classed('smd-background', true)
      .style(smd.options.stylesBackground);
      
    smd.draggableGroup = smd.canvas.append('g')
      .attr('class', 'smd-draggable-group');
    smd.featureGroup = smd.draggableGroup.append('g').attr('class', 'smd-feature-group');
      
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

    smd.featureGroup.attr('transform',
      'translate(' + smd.projection.translate() + ') ' + 
      'scale(' + 0.95 / Math.max((b[1][0] - b[0][0]) / smd.width, (b[1][1] - b[0][1]) / smd.height) + ') ' +
      'translate(' + -(b[1][0] + b[0][0]) / 2 + ',' + -(b[1][1] + b[0][1]) / 2 + ')');
      
    return smd;
  };
  
  // Make color range
  smd.makeColorRange = function() {
    var scaleFunc = smd.options.colorScale;
    var d, domain;
    smd.valuesSet = [];
    
    // Make color range
    if (smd.options.colorOn !== true) {
      return smd;
    }
    
    // Get values for range
    for (d = 0; d < smd.data.features.length; d++) {
      smd.valuesSet.push(parseFloat(smd.data.features[d].properties[smd.options.colorProperty]));
    }
    smd.valuesSet.sort(function(a, b) { return a - b; });
  
    // Determine range function to use
    if (typeof scaleFunc != 'function') {
      scaleFunc = d3.scale[scaleFunc];
    } 
    // Make range with appropriate values
    smd.colorRange = scaleFunc()
      .domain(smd.valuesSet)
      .range(smd.options.colorSet);
    
    // Clamp if can
    if (typeof smd.colorRange.clamp == 'function') {
      smd.colorRange.clamp(true);
    }
    return smd;
  };
  
  // Dragging functinoality
  smd.dragging = false;
  smd.drag = function() {
    smd.dragIt = d3.behavior.drag()
      .on('drag', function(d) {
        if (smd.options.dragOn !== true) {
          return true;
        }
        smd.dragging = true;
        smd.canvas.classed('dragging', true);
        d3.event.sourceEvent.stopPropagation();
        d.x += d3.event.dx;
        d.y += d3.event.dy;
        
        smd.draggableGroup.attr('transform', 'translate(' + [d.x, d.y] + ')');
      })
      .on('dragend', function() {
        smd.canvas.classed('dragging', false);
        smd.dragging = false;
      });

    smd.canvas.call(smd.dragIt);
    return smd;
  };
  
  // Render graticule
  smd.drawGraticule = function() {
    if (smd.options.graticuleOn !== true) {
      return smd;
    }
    
    smd.graticule = d3.geo.graticule();
    smd.featureGroup.append('path')
      .datum(smd.graticule)
      .attr('d', smd.projPath)
      .attr('class', 'smd-graticule')
      .style(smd.options.stylesGraticule);
    
    return smd;
  };
  
  // Render globe
  smd.drawGlobe = function() {
    if (smd.options.globeOn !== true) {
      return smd;
    }
    
    smd.globe = smd.featureGroup.append('path')
      .datum({ type: 'Sphere' })
      .attr('class', 'smd-globe')
      .attr('d', smd.projPath)
      .style(smd.options.stylesGlobe);
    
    return smd;
  };
  
  // Make legend
  smd.drawLegend = function() {
    var qs;
    var formatter = smd.options.legendFormatter || d3.format(',');
    var unit = 10;
    var width = smd.options.legendWidth || (smd.width / 5);
    var scale = smd.options.legendScale || 1;
    var min = d3.min(smd.valuesSet);
    var max = d3.max(smd.valuesSet);
    var legendSwatches = [];
    var c;
    
    // Make sure legend is on
    if (smd.options.legendOn !== true || typeof smd.colorRange == 'undefined') {
      return smd;
    }
    
    // Specific to scale type, unfortunately
    if (smd.options.colorScale === 'quantile') {
      legendSwatches = smd.colorRange.quantiles();
      legendSwatches[0] = min;
    }
    
    // Quantize
    if (smd.options.colorScale === 'quantize') {
      for (c = 0; c < smd.options.colorSet.length; c++) {
        legendSwatches.push(smd.colorRange.invertExtent(smd.options.colorSet[c])[0]);
      }
    }
    
    // Ensure we have something to make a legend with
    if (legendSwatches.length === 0) {
      return smd;
    }
    
    // Specific to scale type, unfortunately
    if (legendSwatches && legendSwatches.length > 0) {
      // Make group for legend objects
      smd.legendGroup = smd.canvas.append('g');
      
      // Make container and label for legend
      smd.legendGroup.append('rect')
        .attr('class', 'smd-legend-container')
        .attr('width', width)
        .attr('height', legendSwatches.length * (unit * 2) + (unit * 3))
        .attr('x', unit)
        .attr('y', unit)
        .style(smd.options.stylesLegendContainer);
      smd.legendGroup.append('text')
        .attr('class', 'smd-legend-label')
        .attr('font-size', unit)
        .attr('x', (unit * 2))
        .attr('y', (unit * 3))
        .text(smd.options.legendTitle)
        .style(smd.options.stylesLegendTitleText);
      
      // Add colors swatches
      smd.legendGroup
        .selectAll('rect.smd-legend-swatch')
          .data(legendSwatches)
        .enter().append('rect')
          .attr('class', 'smd-legend-swatch')
          .attr('width', unit)
          .attr('height', unit)
          .attr('x', (unit * 2))
          .attr('y', function(d, i) { return (i * unit * 2) + (unit * 4); })
          .style(smd.options.stylesLegendSwatch)
          .style('fill', function(d, i) { return smd.colorRange(d); });
          
      // Add text label
      smd.legendGroup
        .selectAll('text.smd-legend-amount')
          .data(legendSwatches)
        .enter().append('text')
          .attr('class', 'smd-legend-amount')
          .attr('font-size', unit)
          .attr('x', (unit * 4))
          .attr('y', function(d, i) { return (i * unit * 2) + (unit * 5 - 1); })
          .text(function(d, i) { return '>= ' + formatter(d); })
          .style(smd.options.stylesLegendText);
      
      // Scale
      smd.legendGroup.attr('transform', 'scale(' + scale + ')');
    }
  
    return smd;
  };
  
  // Render
  smd.drawMap = function() {
    // Render paths
    smd.featureGroup
      .selectAll('path')
        .data(smd.data.features)
      .enter().append('path')
        .attr('d', smd.projPath)
        .attr('class', 'smd-path')
        .style(smd.options.styles)
        .attr('fill', function(d) {
          if (smd.options.colorOn === false) {
            return smd.options.styles.fill;
          }
          else {
            return smd.colorRange(d.properties[smd.options.colorProperty]);
          }
        })
        .on('mouseover', function(d) {
          // Tooltip
          if (smd.options.tooltipOn === true) {
            smd.container.select('.simple-map-d3-tooltip')
              .style('display', 'block')
              .html(smd.options.tooltipContent(d));
          }
          
          // Styles
          d3.select(this).style(smd.options.stylesHover);
        })
        .on('mouseout', function(d) {
          // Tooltip
          if (smd.options.tooltipOn === true) {
            smd.container.select('.simple-map-d3-tooltip')
              .style('display', 'none');
          }
          
          // Styles
          d3.select(this).style(smd.options.styles);
        });
        
    return smd;
  };
  
  // Construct and return our map object.
  smd.constructor(o);
  return smd;
}