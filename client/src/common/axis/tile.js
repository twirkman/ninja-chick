(function(xs) {
  
  var Tile = xs.Class.extend({
    
    DEFAULTS: {
      axes: ['x', 'y'],
      index: {x: 0, y: 0},
      size: {x: 32, y: 32},
      flips: {x: false, y: false},
      rotation: 0,
      view: {},
    },
    
    layer: null,
    
    init: function(settings) {
      xs.merge(this, settings);
    },
      
    setSize: function() {
      var i, axis;
      for (i = 0; i < this.axes.length; i++) {
        axis = this.axes[i];
        this.size[axis] = arguments[i];
      }
    },
      
    setIndex: function() {
      var i, axis;
      for (i = 0; i < this.axes.length; i++) {
        axis = this.axes[i];
        this.index[axis] = arguments[i];
      }
    },
    
    updateView: function() {
      var i, axis, p;
      for (i = 0; i < this.axes.length; i++) {
        axis = this.axes[i];
        p = this.size[axis];
        this.view[axis] = this.index[axis] * xs.getScaledPosition(p);
      }
      this.view.rotation = this.rotation;
    }
  });

  xs.Tile = Tile;
}(MODULES.axis));