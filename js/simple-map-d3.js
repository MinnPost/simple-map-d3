/**
 * Main JS for Simple Map (D3).
 */
var SimpleMapD3 = (function() {
  // Private variables and functions
  var defaults = {
  
  };
  
  // Constructor
  var SimpleMapD3 = function(options) {
    this.options = options;
    
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
    
    console.log(this);
  };
  
  // return module
  return SimpleMapD3;
})();