(function(xs) {

  var TileLayer = xs.TileLayer.extend({
      
    init: function(settings) {
      this.view = new createjs.Container();
      this._super(settings);
    }
  });

  xs.TileLayer = TileLayer;
}(MODULES.axis));