(function(xs) {

  var BitmapTile = xs.Tile.extend({
      
    init: function(settings) {
      this._super(settings);
      this.view = new createjs.Bitmap();
      this.view.image = MODIT.getImage(this.imageName);
      
    },
    
    updateView: function() {
      var w, h,
          image = this.view.image;
      if (!image) return;
      if (xs.scaling == xs.SCALING.CANVAS) {
        this.view.scaleX = this.size.x / image.width;
        this.view.scaleY = this.size.y / image.height;
      } else if (xs.scaling == xs.SCALING.MANUAL) {
        w = Math.round(this.size.x * xs.scale) || 1;
        h = Math.round(this.size.y * xs.scale) || 1;
        if (!(image.width == w && image.height == h)) {
          //TODO
        }
      }
      this.flips.x && (this.view.scaleX = Math.abs(this.view.scaleX) * -1);
      
      this._super();
      this.view.regX = image.width / 2;
      this.view.regY = image.height / 2;
      this.view.x = this.index.x * this.size.x + this.size.x / 2;
      this.view.y = this.index.y * this.size.y + this.size.y / 2;
    }
    
  });

  xs.BitmapTile = BitmapTile;
}(MODULES.axis));