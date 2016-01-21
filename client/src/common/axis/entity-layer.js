(function(xs) {

  var EntityLayer = xs.Layer.extend({
    
    entities: null,
    
    init: function(settings) {
      this.entities = [];
      this._super(settings);
      this._loadEntities();
    },
    
    _loadEntities: function() {
      var i, entityDef, entity;
      for (i = 0; i < this.ents.length; i++) {
        entityDef = this.ents[i];
        this.createEntity(entityDef.type, entityDef);
      }
    },
    
    createEntity: function(type, settings) {
      var entity = new xs[type](settings);
      this.addEntity(entity);
      return entity;
    },
    
    addEntity: function(entity) {
      this.entities.push(entity);
    },
    
    addEntityAt: function(entity, index) {
      this.entities.splice(index, 0, entity);
    },
    
    removeEntity: function(entity) {
      var index = this.entities.indexOf(entity);
      this.entities.splice(index, 1);
    },
    
    getEntity: function(name) {
      var i, entity;
      for (i = 0; i < this.entities.length; i++) {
        entity = this.entities[i];
        if (name == entity.name) { return entity; }
      }
      return null;
    },
    
    resize: function(e) {
      var i;
      this._super(e);
      for (i = 0; i < this.entities.length; i++) {
        this.entities[i].resize(e);
      }
    },
    
    updateModel: function(e) {
      var i;
      this._super(e);
      for (i = 0; i < this.entities.length; i++) {
        this.entities[i].updateModel(e);
      }
    },
    
    updateView: function(e) {
      var i;
      this._super(e);
      for (i = 0; i < this.entities.length; i++) {
        this.entities[i].updateView(e);
      }
    }
  });

  xs.EntityLayer = EntityLayer;
}(MODULES.axis));