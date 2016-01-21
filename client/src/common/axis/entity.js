(function(xs) {

  var Entity = xs.Class.extend({
    
    DEFAULTS: {
      axes: ['x', 'y'],
      pos: {x: 0, y: 0},
      size: {x: 32, y: 32},
      offsets: {x: 0, y: 0},
      vel: {x: 0, y: 0},
      maxVel: {x: 1000, y: 1000},
      minBounceVel: {x: 50, y: 50},
      accel: {x: 0, y: 0},
      decel: {x: 0, y: 0},
      touching: {x: 0, y: 0},
      hits: 0,
      bounceFactor: 0,
      gravityFactor: 1,
      view: {}
    },
    
    lastPos: null,
    _step: null,
    _bounds: null,
    
    init: function(settings) {
      xs.merge(this, settings);
      this.lastPos = {};
      this._step = {};
      this._bounds = new xs.Box();
    },
    
    resize: function(e) {},
    
    updateModel: function(e) {
      var i, axis, m, g;
      for (i = 0; i < this.axes.length; i++){
        axis = this.axes[i];
        this.lastPos[axis] = this.pos[axis];
      }
      this.applyForces(xs.game.step);
      
      g = xs.game.grid;
      m = g.sweep(this.pos, this.getStep(xs.game.step), this.getBounds());
      this.handleMovement(m);
    },
    
    updateView: function(e) {
      var i, axis, t, p;
      t = (xs.game.time - e.runTime) / xs.game.step;
      for (i = 0; i < this.axes.length; i++){
        axis = this.axes[i];
        p = t * this.lastPos[axis] + (1 - t) * this.pos[axis];
        this.view[axis] = xs.getScaledPosition(p);
      }
    },
    
    applyForces: function(dt) {
      var i, axis;
      for (i = 0; i < this.axes.length; i++) {
        axis = this.axes[i];
        this.vel[axis] += xs.game.gravity[axis] * this.gravityFactor * dt;
        if (this.accel[axis]) {
          this.vel[axis] += this.accel[axis] * dt;
        } else if (this.decel[axis]) {
          if (this.vel[axis] > 0) {
            this.vel[axis] =
                Math.max(0, this.vel[axis] - this.decel[axis] * dt);
          } else {
            this.vel[axis] =
                Math.min(0, this.vel[axis] + this.decel[axis] * dt);
          }
        }
        this.vel[axis] =
            xs.clamp(-this.maxVel[axis], this.maxVel[axis], this.vel[axis]);
      }
    },
      
    handleMovement: function(movement) {
      var i, axis;
      for (i = 0; i < this.axes.length; i++) {
        axis = this.axes[i];
        this.touching[axis] = 0;
        if (movement.hits[axis].length) {
          if (this.bounceFactor &&
              Math.abs(this.vel[axis]) > this.minBounceVel[axis]) {
            this.vel[axis] *= -this.bounceFactor;
          } else {
            this.touching[axis] = this.vel[axis];
            this.vel[axis] = 0;
          }
        }
        this.pos[axis] = movement.pos[axis];
      }
    },
    
    preSolve: function(e, target) {},
    
    postSolve: function(e, target) {
      
    },
    
    getBounds: function() {
      this._bounds.set(this.pos, this.size, this.offsets);
      return this._bounds;
    },
    
    getStep: function(dt) {
      var i, axis;
      for (i = 0; i < this.axes.length; i++) {
        axis = this.axes[i];
        this._step[axis] = this.vel[axis] * dt;
      }
      return this._step;
    }
  });
  
  Entity.HITS = {
    NONE: 0,
    REACTIVE: 1,
    PASSIVE: 2,
    ACTIVE: 4,
    FIXED: 5,
  };
    
  Entity.checkHit = function(A, B) {
    if (A.hits + B.hits < this.HITS.ACTIVE) return;
    if (A.hits == this.HITS.FIXED && B.hits == this.HITS.FIXED) return;
    this._hitEvent.boundsA = A.getBounds();
    this._hitEvent.boundsB = B.getBounds();
    if (!this._hitEvent.boundsA.overlaps(this._hitEvent.boundsB)) return;
    this._hitEvent.enabled = true;
    this._hitEvent.strong = null;
    this._hitEvent.weak = null;
    if (A.hits < B.hits) {
      if (!(A.hits == this.HITS.PASSIVE && B.hits == this.HITS.ACTIVE)) {
        this._hitEvent.strong = B;
        this._hitEvent.weak = A;
      }
    } else if (B.hits < A.hits) {
      if (!(B.hits == this.HITS.PASSIVE && A.hits == this.HITS.ACTIVE)) {
        this._hitEvent.strong = A;
        this._hitEvent.weak = B;
      }
    }
    this._hitEvent.A = A;
    this._hitEvent.B = B;
    A.preSolve(this._hitEvent, B);
    B.preSolve(this._hitEvent, A);
    if (this._hitEvent.enabled) {
      xs.game.entityGrid.resolveHit(this._hitEvent);
      A.postSolve(this._hitEvent, B);
      B.postSolve(this._hitEvent, A);
    }
  };
  
  Entity._hitEvent = {};

  xs.Entity = Entity;
}(MODULES.axis));