(function(xs) {

  var Camera = xs.Class.extend({
    
    DEFAULTS: {
      pos: {x: 0, y: 0, z: 0},
      fov: {x: 0, y: 0},
          
      target: null,
      trackFactor: 0.2,
      minMove: 0.01,
    },
    
    bounds: null,
    
    _dirty: false,
    
    init: function(settings) {
      xs.merge(this, settings);
      
      this.bounds = new xs.Box();
    },
    
    update: function() {
      var axis, toMove, dirty;
      for (axis in this.target) {
        toMove = (this.target[axis] - this.pos[axis]) * this.trackFactor;
        if (Math.abs(toMove) > this.minMove) {
          this._setProp('pos', axis, this.pos[axis] + toMove);
        }
      }
      dirty = this._dirty;
      this._dirty = false;
      return dirty;
    },
    
    reset: function() {
      this.setPos(xs.view.width / 2, xs.view.height / 2, 0);
      this.setFov(xs.view.width, xs.view.height);
    },
    
    setPos: function(x, y, z) {
      this._setProp('pos', 'x', x);
      this._setProp('pos', 'y', y);
      this._setProp('pos', 'z', z);
    },
            
    setFov: function(x, y) {
      this._setProp('fov', 'x', x);
      this._setProp('fov', 'y', y);
    },
    
    clean: function() {
      this._dirty = false;
    },
    
    dirty: function() {
      this._dirty = true;
    },
    
    isDirty: function() {
      return this._dirty;
    },
    
    _setProp: function(context, prop, value) {
      if (value !== undefined && value !== null) {
        if (context == 'pos') value = this._boundProp(prop, value);
        if (value !== this[context][prop]) {
          this[context][prop] = value;
          this._dirty = true;
        }
      }
    },
    
    _boundProp: function(prop, value) {
      if (this.bounds[prop] && this.bounds[prop].min) {
        return xs.clamp(this.bounds[prop].min, this.bounds[prop].max, value);
      }
      return value;
    }
    
  });

  xs.Camera = Camera;
}(MODULES.axis));