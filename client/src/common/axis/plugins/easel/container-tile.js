(function(xs) {

  var ContainerTile = xs.Tile.extend({
      
    init: function(settings) {
      this._super(settings);
      this.view = new createjs.Container();
    },
    
    setTiles: function(tiles) {
      var i;
      this.view.removeAllChildren();
      for (i = 0; i < tiles.length; i++) {
        this.view.addChild(tiles[i].view);
      }
      //IE 10 hates cache ??
      //this.view.cache(0, 0, this.size.x, this.size.y);
    },
    
    updateView: function() {
      this._super();
      this.view.regX = this.size.x / 2;
      this.view.regY = this.size.y / 2;
      this.view.x = this.index.x * this.size.x + this.size.x / 2;
      this.view.y = this.index.y * this.size.y + this.size.y / 2;
    }
    
  });

  xs.ContainerTile = ContainerTile;
}(MODULES.axis));