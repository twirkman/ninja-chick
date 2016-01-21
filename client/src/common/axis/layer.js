(function(xs) {

  var Layer = xs.Class.extend({
    
    DEFAULTS: {
      depth: 1,
      scroll: {x: true, y: true},
      offset: {x: 0, y: 0},
      view: {}
    },
    
    _viewport: null,
    _bounds: null,
    
    init: function(settings) {
      xs.merge(this, settings);
      this._viewport = new xs.Box();
      this._bounds = new xs.Box();
    },
    
    getBounds: function() {
      return this._bounds.setAsIso(0, 0);
    },

    updateModel: function() {},
    
    updateView: function() {
      var vp = this._viewport,
          cam = xs.game.camera,
          distance = this.depth - cam.pos.z;
          
      vp.x.min = this.scroll.x ? cam.pos.x / distance - cam.fov.x / 2 : 0;
      vp.x.max = vp.x.min + cam.fov.x - 1;
      vp.y.min = this.scroll.y ? cam.pos.y / distance - cam.fov.y / 2 : 0;
      vp.y.max = vp.y.min + cam.fov.y - 1;
      
      this.view.x = Math.floor((this.offset.x - vp.x.min) * xs.scale);
      this.view.y = Math.floor((this.offset.y - vp.y.min) * xs.scale);
      this.view.visible = distance > 0;
    },
    
    resize: function() {
      if (xs.scaling == xs.SCALING.CANVAS || xs.scale * xs.pixelRatio <= 1) {
        this.view.scaleX = this.view.scaleY = xs.scale;
      }
    }
  });

  xs.Layer = Layer;
}(MODULES.axis));