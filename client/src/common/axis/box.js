(function(xs) {
  
  var Box = xs.Class.extend({
    
    DEFAULTS: {
      axes: ['x', 'y']
    },
   
    _center: null,
      
    init: function(settings) {
      var i, axis;
      xs.merge(this, settings);
      for (i = 0; i < this.axes.length; i++) {
        axis = this.axes[i];
        this[axis] = {};
      }
      this._center = {};
    },
    
    set: function(pos, size, offsets) {
      var i, axis;
      for (i = 0; i < this.axes.length; i++) {
        axis = this.axes[i];
        this[axis].min = (pos ? pos[axis] : 0) + (offsets ? offsets[axis] : 0);
        this[axis].max = this[axis].min + size[axis];
      }
      return this;
    },
    
    setAsIso: function(min, max) {
      var i, axis;
      for (i = 0; i < this.axes.length; i++) {
        axis = this.axes[i];
        this[axis].min = min;
        this[axis].max = max;
      }
      return this;
    },
    
    setAsBox: function(box) {
      var i, axis;
      for (i = 0; i < this.axes.length; i++) {
        axis = this.axes[i];
        this[axis].min = box[axis].min;
        this[axis].max = box[axis].max;
      }
      return this;
    },
    
    shift: function() {
      var i, axis;
      for (i = 0; i < this.axes.length; i++) {
        axis = this.axes[i];
        this[axis].min += arguments[i];
        this[axis].max += arguments[i];
      }
      return this;
    },
    
    scale: function() {
      var i, axis;
      for (i = 0; i < this.axes.length; i++) {
        axis = this.axes[i];
        this[axis].min *= arguments[i];
        this[axis].max *= arguments[i];
      }
      return this;
    },
    
    deflate: function() {
      var i, axis;
      for (i = 0; i < this.axes.length; i++) {
        axis = this.axes[i];
        this[axis].min += arguments[i];
        this[axis].max -= arguments[i];
      }
      return this;
    },
    
    inflate: function() {
      var i, axis;
      for (i = 0; i < this.axes.length; i++) {
        axis = this.axes[i];
        this[axis].min -= arguments[i];
        this[axis].max += arguments[i];
      }
      return this;
    },
    
    addBox: function(box) {
      var i, axis;
      for (i = 0; i < this.axes.length; i++) {
        axis = this.axes[i];
        this[axis].min = Math.min(this[axis].min, box[axis].min);
        this[axis].max = Math.max(this[axis].max, box[axis].max);
      }
      return this;
    },
    
    subBox: function(box) {
      var i, axis;
      for (i = 0; i < this.axes.length; i++) {
        axis = this.axes[i];
        this[axis].min = Math.max(this[axis].min, box[axis].min);
        this[axis].max = Math.min(this[axis].max, box[axis].max);
      }
      return this;
    },
    
    equals: function(box) {
      var i, axis;
      for (i = 0; i < this.axes.length; i++) {
        axis = this.axes[i];
        if (this[axis].min !== box[axis].min) return false;
        if (this[axis].max !== box[axis].max) return false;
      }
      return true;
    },
    
    overlaps: function(box) {
      var i, axis;
      for (i = 0; i < this.axes.length; i++) {
        axis = this.axes[i];
        if (this[axis].min > box[axis].max) return false;
        if (box[axis].min > this[axis].max) return false;
      }
      return true;
    },
    
    containsBox: function(box) {
      var i, axis;
      for (i = 0; i < this.axes.length; i++) {
        axis = this.axes[i];
        if (this[axis].min > box[axis].min) return false;
        if (this[axis].max < box[axis].max) return false;
      }
      return true;
    },
    
    containsPoint: function(point) {
      var i, axis;
      for (i = 0; i < this.axes.length; i++) {
        axis = this.axes[i];
        if (this[axis].min > point[axis]) return false;
        if (this[axis].max < point[axis]) return false;
      }
      return true;
    },
    
    getCenter: function() {
      var i, axis;
      for (i = 0; i < this.axes.length; i++) {
        axis = this.axes[i];
        this._center[axis] = this[axis].max - this[axis].min;
      }
      return this._center;
    }
  });
  
  xs.Box = Box;
}(MODULES.axis));