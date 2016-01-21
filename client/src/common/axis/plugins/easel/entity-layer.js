(function(xs) {

  var EntityLayer = xs.EntityLayer.extend({
      
    init: function(settings) {
      this.view = new createjs.Container();
      this._super(settings);
    },
    
    addEntity: function(entity) {
      entity.view instanceof createjs.DisplayObject &&
          this.view.addChild(entity.view);
      this._super(entity);
    },
    
    removeEntity: function(entity) {
      this.view.removeChild(entity.view);
      this._super(entity);
    },
    
    addEntityAt: function(entity, index) {
      entity.view instanceof createjs.DisplayObject &&
          this.view.addChildAt(entity.view, index);
      this._super(entity);
    },
  });

  xs.EntityLayer = EntityLayer;
}(MODULES.axis));