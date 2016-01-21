(function(xs) {
  
  var Game = xs.Class.extend({
    
    DEFAULTS: {
      step: 1 / 60,
      gravity: {x: 0, y: 0},
      cellsize: {x: 64, y: 64},
    },
        
    time: 0,
    layers: null,
    camera: null,
    grid: null,
    entityGrid: null,
    _bounds: null,
    _hitEvent: null,
    _pausePending: false,
    
    init: function() {
      xs.game = this;
      this.layers = {};
      this.camera = new xs.Camera();
      this.entityGrid = new xs.DynamicGrid({cellsize: this.cellsize});
      this._bounds = new xs.Box();
      this._hitEvent = {},
      this.reset();
    },
    
    tick: function(e) {
      if (!e.paused) {
        while (this.time < e.runTime) {
          this.time += this.step;
          this.update(e);
        }
        this.draw(e);
        xs.input.clear();
      }
      if (this._pausePending) {
        this._pausePending = false;
        xs.system.setPaused(true);
      }
    },
    
    update: function(e) {
      for (var x in this.layers) { this.layers[x].updateModel(e); }
      this.entityGrid.checkHits();
    },
    
    draw: function(e) {
      this.camera.update(e);
      for (var x in this.layers) { this.layers[x].updateView(e); }
      xs.prepContext(xs.view.canvas.getContext('2d'));
    },
    
    resize: function() {
      for (var x in this.layers) { this.layers[x].resize(); }
    },

    reset: function() {
      var data = MODIT.getJson('level-data');
      this.startLevel = data.start;
      this.endLevel = data.end;
      this.loadLevel(this.startLevel);
      this.resume();
    },
    
    pause: function() {
      this._pausePending = true;
    },
    
    resume: function() {
      this._pausePending = false;
      xs.system.setPaused(false);
    },
    
    createEntity: function(type, settings, layer) {
      layer = layer || 'entity';
      return this.layers[layer].createEntity(type, settings);
    },
    
    addEntity: function(entity, layer) {
      layer = layer || 'entity';
      this.layers[layer].addEntity(entity);
    },
    
    removeEntity: function(entity, layer) {
      layer = layer || 'entity';
      this.layers[layer].removeEntity(entity);
    },
    
    getEntity: function(name, layer) {
      layer = layer || 'entity';
      return this.layers[layer].getEntity(name);
    },
    
    createLayer: function(type, settings) {
      var layer = new xs[type](settings);
      this.addLayer(layer);
      return layer;
    },
    
    addLayer: function(layer) {
      this.layers[layer.name] = layer;
      this.grid = layer.name === 'collision' ? layer.grid : this.grid;
    },
    
    getLayer: function(name) {
      return this.layers[name];
    },
    
    getBounds: function() {
      var x, bounds;
      this._bounds.setAsIso(0, 0);
      for (x in this.layers) {
        bounds = this.layers[x].getBounds();
        this._bounds.addBox(bounds);
      }
      return this._bounds;
    },
    
    loadLevel: function(number) {
      this.camera.reset();
      this.level = MODIT.getJson('level' + number);
      this.level.number = number;
      this._loadLayers(this.level);
      this.camera.bounds.setAsBox(this.getBounds());
      this.camera.bounds.deflate(this.camera.fov.x / 2, this.camera.fov.y / 2);
      this.resize();
    },
    
    _loadLayers: function(layers) {
      var i;
      this.grid = this.GRID;
      this.layers = {};
      for (i = 0; i < layers.length; i++) {
        this.createLayer(layers[i].type, layers[i]);
      }
    },

    GRID: {
      sweep: function(start, move, bounds) {
        var axis, pos = {}, hits = {};
        for (axis in start) {
          hits[axis] = [];
          pos[axis] = start[axis] + move[axis];
        }
        return {pos: pos, hits: hits};
      }
    }
  });
  
  xs.Game = Game;
}(MODULES.axis));