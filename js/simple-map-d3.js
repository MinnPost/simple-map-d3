/**
 * Main JS for Simple Map (D3).
 */
var SimpleMapD3 = (function() {
  // Private variables and functions
  var foo = 'bar';
  
  // Constructor
  var SimpleMapD3 = function(options) {
    this.options = options;
    
    // Check if data was given, or if data source was given
    if (this.options.data === Object(obj)) {
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
    d3.json(this.options.datasource, this.dataLoaded);
  };
  
  // Handle data once loaded
  SimpleMapD3.prototype.dataLoaded = function(data) {
    if (this.data === void 0) {
      this.data = data;
    }
  };
  
  // return module
  return SimpleMapD3;
})();