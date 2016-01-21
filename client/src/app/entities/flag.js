(function(xs) {

  var Flag = xs.Entity.extend({
    
    DEFAULTS: {
      size: {x: 64, y: 64},
      gravityFactor: 0,
      hits: xs.Entity.HITS.FIXED,
      imageName: 'flag'
    },
    
    init: function(settings) {
      var image;
      this._super(settings);
      image = MODIT.getImage(this.imageName);
      this.view = new createjs.Bitmap(image);
      this.view.scaleX = this.size.x / image.width;
      this.view.scaleY = this.size.y / image.height;
    },
    
    preSolve: function(e, target) {
      e.enabled = false;
      if (target === xs.game.getEntity('player')) {
        xs.system.dispatchEvent('leveldone');
      }
    }
    
  });

  xs.Flag = Flag;
}(MODULES.axis));