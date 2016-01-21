(function(xs) {
  
  var Emitter = xs.Class.extend({
       
    DEFAULTS: {
      particleType: 'Entity',
      particleSettings: null,
      active: true,
      lifeTime: Infinity,
      emissionsPerSecond: 4,
      maxParticles: 50,
      pos: {x: 0, y: 0}
    },
    
    _age: 0,
    _activeParticles: 0,
    _secondsToNextEmission: 0,
    _pool: null,
    
    init: function(settings) {
      xs.merge(this, settings);
      xs.system.addEventListener('tick', this.tick.bind(this));
      this.reset();
    },
    
    reset: function() {
      var i, particle;
      this._pool = [];
      this._activeParticles = 0;
      for (i = 0; i < this.maxParticles; i++) {
        particle = new xs[this.particleType](this.particleSettings);
        this._pool.push(particle);
      }
    },
      
    tick: function(e) {
      if (e.paused) return;
      if (!this.active) return;
      this.update(e);
      this._age += e.delta;
      this.active = this._age < this.lifeTime;
    },
    
    update: function(e) {
      var secondsPerEmission;
      if (this.emissionsPerSecond) {
        secondsPerEmission = 1 / this.emissionsPerSecond;
        this._secondsToNextEmission -= e.delta;
        while (this._secondsToNextEmission < 0) {
          this.emitParticle();
          this._secondsToNextEmission += secondsPerEmission;
        }
      }
    },
    
    emitParticle: function() {
      var particle;
      if (this._activeParticles < this.maxParticles) {
        particle = this._pool[this._activeParticles];
        particle.id = this._activeParticles;
        particle.pos.x = this.pos.x;
        particle.pos.y = this.pos.y;
        xs.game.addEntity(particle);
        this._activeParticles++;
      }
    }
  });

  xs.Emitter = Emitter;
}(MODULES.axis));