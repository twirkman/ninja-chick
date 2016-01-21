(function(xs) {

  var Actor = xs.Entity.extend({
    
    DEFAULTS: {
      view: new createjs.BitmapAnimation(),
      flips: {x: false, y: false}
    },

    _spriteSheet: null,
    _lastAnim: null,
    
    init: function(spriteSheet, settings) {
      this._spriteSheet = spriteSheet;
      this.view.spriteSheet = spriteSheet;
      this._super(settings);
    },
    
    resize: function(e) {
      if (xs.scaling == xs.SCALING.MANUAL) {
        this.view.spriteSheet =
            xs.createScaledSpriteSheet(this._spriteSheet, xs.scale, xs.scale);
      }
    },
    
    getFlipState: function() {
      if (this.flips.x && this.flips.y) return '_hv';
      else if (this.flips.x) return '_h';
      else if (this.flips.y) return '_v';
      else return '';
    },
    
    getAnimState: function() {
      return '';
    },
    
    updateView: function(e) {
      this._super(e);
      this._updateAnimation(this.view);
    },
    
    _updateAnimation: function(anim) {
      var frame, newAnim;
      
      frame = anim.currentAnimationFrame || 0;
      newAnim = this.getAnimState();
      anim.gotoAndPlay(newAnim + this.getFlipState());
      if (newAnim == this._lastAnim) {
        while (frame > 0) {
          anim.advance();
          frame--;
        }
      } else {
        anim._advanceCount = 0;
      }
      this._lastAnim = newAnim;
    },
    
  });

  xs.Actor = Actor;
}(MODULES.axis));