/**
 * Main JS for Simple Map (D3).
 */
var SimpleMapD3 = (function() {
  // Private variables and functions
  var defaults = {
    stroke: '#898989',
    fill: '#FFFFFF',
    colorOn: false
  };
  
  // Constructor
  var SimpleMapD3 = function(options) {
    // Extend defaults
    var extended = defaults;
    for (var prop in options) {
      extended[prop] = options[prop];
    }
    this.options = extended;
    
    // Check if data was given, or if data source was given
    if (this.options.data === Object(this.options.data)) {
      this.data = this.options.data;
      this.dataLoaded(this.data);
    }
    else if (toString.call(this.options.datasource) == '[object String]') {
      this.getData();
    }
  };
  
  // Prototype "public" methods
  SimpleMapD3.prototype.constructor = SimpleMapD3,
  
  // Get data
  SimpleMapD3.prototype.getData = function() {
    var thisMap = this;
    
    d3.json(this.options.datasource, function(data) {
      thisMap.data = data;
      thisMap.loadData();
    });
  };
  
  // Handle data once loaded
  SimpleMapD3.prototype.loadData = function(data) {
    if (this.data === void 0) {
      this.data = data;
    }
    this.createCanvas();
    this.project();
    this.render();
  };
  
  // Load up canvas, set size to container
  SimpleMapD3.prototype.createCanvas = function() {
    this.container = d3.select(this.options.container);
    this.width = parseFloat(this.container.style('width'));
    this.height = parseFloat(this.container.style('height'));
    this.canvas = this.container.append('svg')
      .attr('width', this.width)
      .attr('height', this.height);
  };
  
  // Project data into the canvas
  SimpleMapD3.prototype.project = function() {
    this.proj = d3.geo.mercator().scale(1).translate([0,0]);
    this.projOptions = this.projOptions || {};
    
    // Variables
    var margin = this.width * 0.02;
    var bounds0 = d3.geo.bounds(this.data);
    var bounds = bounds0.map(this.proj);
    var xscale = (this.width - 2 * margin) / Math.abs(bounds[1][0] - bounds[0][0]);
    var yscale = (this.height - 2 * margin) / Math.abs(bounds[1][1] - bounds[0][1]);
    var pscale = Math.min(xscale, yscale);
    var wscale = pscale;
    var d, widthd, heightd;
    
    // Handle projection
    this.proj.scale(pscale);
    this.proj.translate(this.proj([-bounds0[0][0], -bounds0[1][1]]));
    this.projOptions.path = d3.geo.path().projection(this.proj);
    
    // Handle svg canvas, dpeneding on orientation
    if (xscale > yscale) {
      d = xscale * Math.abs(bounds[1][0] - bounds[0][0]) - yscale * Math.abs(bounds[1][0] - bounds[0][0]);
      this.canvas.attr('transform', 'translate(' + d / 2 + ', 0)');
    }
    else {
      d = yscale * Math.abs(bounds[1][1] - bounds[0][1]) - xscale * Math.abs(bounds[1][1] - bounds[0][1]);
      this.canvas.attr('transform', 'translate(0, ' + d / 5 + ')');
    }
    
    // Handle offset, depending on orientation
    widthd = this.proj(bounds0[0])[1];
    heightd = this.proj(bounds0[1])[0];
    if (xscale > yscale) {
      this.projOptions.offsetxd = (this.width / 2 - widthd / 2);
      this.projOptions.offsetyd = margin;
    }
    else {
      this.projOptions.offsetxd = margin;
      this.projOptions.offsetyd = (this.height / 2 - heightd / 2);
    }
  };
  
  // Make color range
  SimpleMapD3.prototype.makeColorRange = function() {
    var thisMap = this;
    
    var min = d3.min(this.data.features, function(d) { return d.properties[thisMap.options.colorProperty]; });
    var max = d3.max(this.data.features, function(d) { return d.properties[thisMap.options.colorProperty]; });
    // Use a sort of sensible, proportional color step
    this.options.colorStep = this.options.colorStep || ((max - min) / this.options.colorSet.length * 0.1);

    this.colorRange = d3.scale.linear()
      .domain(d3.range(min, max, this.options.colorStep))
      .range(this.options.colorSet)
      .clamp(true);
  };
  
  // Callback for attribute: Fill
  SimpleMapD3.prototype.attributeFill = function(d) {
    if (this.options.colorOn === false) {
      return this.options.fill;
    }
    else {
      if (!this.ColorRange) {
        this.makeColorRange();
      }
      return this.colorRange(d.properties[this.options.colorProperty]);
    }
  };
  
  // Render
  SimpleMapD3.prototype.render = function() {
    var thisMap = this;
  
    this.canvas
      .selectAll('path')
        .data(this.data.features)
      .enter().append('path')
        .attr('d', this.projOptions.path)
        .attr('stroke', this.options.stroke)
        .attr('fill', function(d) { return thisMap.attributeFill(d); })
        .attr('transform', 'translate(' + this.projOptions.offsetxd + ', ' + this.projOptions.offsetyd + ')');
  };
  
  // return module
  return SimpleMapD3;
})();