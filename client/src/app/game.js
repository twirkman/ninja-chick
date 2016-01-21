(function(my, xs, ui) {
    
  var Game = xs.Game.extend({
  
    DEFAULTS: {
      gravity: {x: 0, y: 900},
      timeTillRespawn: 1.8
    },
    
    _respawnPending: false,
    
    init: function() {
      this._super();
      
      xs.input.bind(['space'], 'jump');
      xs.input.bind(['a', 'left'], 'left');
      xs.input.bind(['d', 'right'], 'right');
      xs.input.bind(['w', 'up'], 'up');
      xs.input.bind(['s', 'down'], 'down');
      
      xs.system.addEventListener('poof', this.onPoof.bind(this));
      xs.system.addEventListener('leveldone', this.onLevelDone.bind(this));
      
      ui.setStyle(xs.view.div, {
        backgroundImage: 'url(' + MODIT.getImage('sky').src + ')',
        backgroundRepeat: 'repeat',
        backgroundSize: 'contain'
      });
    },
    
    update: function(e) {
      if (this._respawnPending) {
        this.timeTillRespawn -= this.step;
        this.timeTillRespawn < 0 && this.onLose();
      }
      this._super(e);
    },
    
    loadLevel: function(number) {
      var edges, pos;
      this._super(number);
      edges = new xs.EdgesLayer();
      this.addLayer(edges, 'entity');
      edges.postProcess();
      edges.resize();
      pos = this.getEntity('player').pos;
      this.camera.target = pos;
      this.camera.setPos(pos.x, pos.y);
    },
    
    onPoof: function(e) {
      this._respawnPending = true;
      this.timeTillRespawn = this.DEFAULTS.timeTillRespawn;
    },
    
    onLevelDone: function() {
      if (this.level.number == this.endLevel) {
        this.onWin();
      } else {
        this.loadLevel(this.level.number + 1);
      }
    },
    
    onWin: function() {
      this.reset();
    },
    
    onLose: function() {
      this._respawnPending = false;
      this.loadLevel(this.level.number);
    },
  });
  
  my.Game = Game;
}(MODULES.my, MODULES.axis, MODULES.ui));