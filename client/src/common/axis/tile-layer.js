(function(xs) {

  var TileLayer = xs.Layer.extend({

    grid: null,
    tileset: null,
    tiles: null,
    _region: null,
    _lastRegion: null,
    
    init: function(settings) {
      this._super(settings);
      this.grid = this.name === 'collision' ?
          new xs.StaticGrid(settings) : new xs.Grid(settings);
      this._region = new xs.Box();
      this._lastRegion = new xs.Box().setAsIso(Infinity, -Infinity);
      this.resetTiles();
    },
    
    getBounds: function() {
      return this._bounds.setAsBox(this.grid.getBounds());
    },
    
    updateView: function() {
      this._super();
      if (!this.view.visible) return;
      this._region.x.min = this.grid.getIndex('x', this._viewport.x.min);
      this._region.x.max = this.grid.getIndex('x', this._viewport.x.max);
      this._region.y.min = this.grid.getIndex('y', this._viewport.y.min);
      this._region.y.max = this.grid.getIndex('y', this._viewport.y.max);
      if (this._region.equals(this._lastRegion)) return;
      this._setActiveTiles(this._lastRegion, this._region);
      this._lastRegion.setAsBox(this._region);
    },
    
    _setActiveTiles: function(lastRegion, region) {
      var i, j, xMin, xMax, yMin, yMax, index, tile;
      xMin = Math.max(lastRegion.x.min, region.x.min);
      xMax = Math.min(lastRegion.x.max, region.x.max);
      yMin = Math.max(lastRegion.y.min, region.y.min);
      yMax = Math.min(lastRegion.y.max, region.y.max);
         
      for (index = 0, i = lastRegion.x.min; i < lastRegion.x.max + 1; i++) {
        for (j = lastRegion.y.min; j < lastRegion.y.max + 1; j++) {
          tile = this.tiles[i] && this.tiles[i][j];
          if (i < xMin || i > xMax || j < yMin || j > yMax) {
            //this.deactivateTile(tile, index);
            //TODO - move to plugin
            tile && this.view.removeChildAt(index);
          } else { tile && index++; }
        }
      }
      
      for (index = 0, i = region.x.min; i < region.x.max + 1; i++) {
        for (j = region.y.min; j < region.y.max + 1; j++) {
          if (i < xMin || i > xMax || j < yMin || j > yMax) {
            tile = this.getTile(i, j);
            //this.activateTile(tile, index);
            //TODO - move to plugin
            tile && this.view.addChildAt(tile.view, index);
          } else { tile = this.tiles[i] && this.tiles[i][j]; }
          tile && index++;
        }
      }
    },
    
    resize: function(e) {
      var column, row, tile;
      for (column in this.tiles) {
        for (row in this.tiles[column]) {
          tile = this.tiles[column][row];
          tile && tile.updateView();
        }
      }
      this._super(e);
    },
    
    resetTiles: function() {
      var i, j;
      this.tiles = {};
      for (i = 0; i < this.grid.data.length; i++) {
        this.tiles[i] = {};
        for (j = 0; j < this.grid.data[i].length; j++) {
          this.createTile(i, j);
        }
      }
    },
    
    createTile: function(xIndex, yIndex, index) {
      var tileIndex, tileDef, tile;
      tileIndex = index || this.grid.getCellAt(xIndex, yIndex) - 1;
      tileDef = this.tileset[tileIndex];
      if (!tileDef) return null;
      tile = new xs[tileDef.type](tileDef);
      tile.layer = this;
      tile.setIndex(xIndex, yIndex);
      tile.setSize(this.grid.cellsize.x, this.grid.cellsize.y);
      tile.updateView();
      this.tiles[xIndex] = this.tiles[xIndex] || {};
      this.tiles[xIndex][yIndex] = tile;
      return tile;
    },
    
    removeTile: function(tile) {
      this.tiles[tile.index.x][tile.index.y] = null;
      this.grid.setCellAt(tile.index.x, tile.index.y, null);
      //TODO - move to plugin
      this.view.removeChild(tile.view);
    },
    
    getTile: function(xIndex, yIndex) {
      var tile = this.tiles[xIndex] && this.tiles[xIndex][yIndex];
      if (!tile) tile = this.createTile(xIndex, yIndex);
      return tile;
    }
  });

  xs.TileLayer = TileLayer;
}(MODULES.axis));