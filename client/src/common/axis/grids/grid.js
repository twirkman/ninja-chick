//TODO - move repeat back to TileLayer
(function(xs) {
  
  var Grid = xs.Class.extend({
    
    DEFAULTS: {
      axes: ['x', 'y'],
      cellsize: {x: 16, y: 16},
      offset: {x: 0, y: 0},
      repeat: {x: false, y: false},
      data: []
    },
    
    _bounds: null,
        
    init: function(settings) {
      xs.merge(this, settings);
      
      this._bounds = new xs.Box();
    },
    
    setCell: function() {
      var i, data, index, cell;
      cell = arguments[arguments.length - 1];
      if (arguments[0] instanceof Array) arguments = arguments[0];
      
      data = this.data;
      for (i = 0; i < this.axes.length - 1; i++) {
        index = this.getIndex(i, arguments[i]);
        if (!data[index]) data[index] = [];
        data = data[index];
      }
      index = this.getIndex(i, arguments[i]);
      data[index] = cell;
    },
    
    setCellAt: function() {
      var i, data, index, cell;
      cell = arguments[arguments.length - 1];
      if (arguments[0] instanceof Array) arguments = arguments[0];
      
      data = this.data;
      for (i = 0; i < this.axes.length - 1; i++) {
        index = arguments[i];
        if (!data[index]) data[index] = [];
        data = data[index];
      }
      index = arguments[i];
      data[index] = cell;
    },
    
    getCell: function() {
      var i, data, index;
      if (arguments[0] instanceof Array) arguments = arguments[0];
      
      data = this.data;
      for (i = 0; i < this.axes.length; i++) {
        index = this.getIndex(i, arguments[i], true);
        data && (data = data[index]);
      }
      return data ? data : data == 0 ? 0 : null;
    },
    
    getCellAt: function() {
      var i, data, index;
      if (arguments[0] instanceof Array) arguments = arguments[0];
      
      data = this.data;
      for (i = 0; i < this.axes.length; i++) {
        index = arguments[i];
        if (this.repeat[this.axes[i]]) index = this._wrapIndex(i, index);
        data && (data = data[index]);
      }
      return data ? data : data == 0 ? 0 : null;
    },
    
    getCoord: function(axis, index) {
      if (typeof axis == 'number') axis = this.axes[axis];
      return this.cellsize[axis] * index + this.offset[axis];
    },
    
    getIndex: function(axis, coord, wrap) {
      var index;
      if (typeof axis == 'number') axis = this.axes[axis];
      coord -= this.offset[axis];
      index = Math.floor(coord / this.cellsize[axis]);
      return (wrap && this.repeat[axis]) ? this._wrapIndex(axis, index) : index;
    },
    
    getUnits: function(axis) {
      var i, data;
      if (typeof axis == 'string') axis = this.axes.indexOf(axis);
      
      data = this.data;
      for (i = 0; i < axis; i++) {
        data = data[0];
      }
      return data.length;
    },
    
    getSize: function(axis) {
      return this.getUnits(axis) * this.cellsize[axis];
    },
    
    getBounds: function() {
      var i, axis;
      for (i = 0; i < this.axes.length; i++) {
        axis = this.axes[i];
        this._bounds[axis].min = 0;
        this._bounds[axis].max = this.getSize(axis);
      }
      return this._bounds;
    },
    
    _wrapIndex: function(axis, index) {
      var units = this.getUnits(axis);
      if (index < 0 || index > units - 1) {
        index = index % units;
        if (index < 0) index = units + index;
      }
      return index;
    },
    
    checkCellAt: function() {
      var i;
      for (i = 0; i < arguments.length; i++) {
        if (arguments[i] < 0 || arguments[i] > this.getUnits(i) - 1) {
          return false;
        }
      }
      return true;
    }
  });
      
  xs.Grid = Grid;
}(MODULES.axis));