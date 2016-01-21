(function(xs) {
  
  var Game = xs.Game.extend({
        
    init: function() {
      this.stage = new createjs.Stage(xs.view.canvas);
      this._super();
    },
    
    draw: function(e) {
      this._super(e);
      this.stage.update(e);
    },
    
    loadLevel: function(number) {
      this.stage.removeAllChildren();
      this._super(number);
    },
    
    addLayer: function(layer, index) {
      this._super(layer);
      if (!index) { this.stage.addChild(layer.view); }
      else if (typeof index === 'number') {
        this.stage.addChildAt(layer.view, index);
      } else {
        if (typeof index === 'string') { index = this.getLayer(index); }
        index = this.stage.getChildIndex(index.view);
        this.stage.addChildAt(layer.view, index);
      }
    }
  });
  
  xs.Game = Game;
}(MODULES.axis));