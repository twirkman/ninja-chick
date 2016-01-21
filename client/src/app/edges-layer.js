(function(xs) {

  var EdgesLayer = xs.TileLayer.extend({

    DEFAULTS: {
      name: "edges",
      tileset: [
        {type: "BitmapTile", imageName: "stone-edge-b"},
        {type: "BitmapTile", imageName: "stone-edge-lr",
          flips: {x: true, y: false}},
        {type: "BitmapTile", imageName: "stone-edge-t"},
        {type: "BitmapTile", imageName: "stone-edge-lr"},
        {type: "BitmapTile", imageName: "stone-grass-edge-lr",
          flips: {x: true, y: false}},
        {type: "BitmapTile", imageName: "stone-grass-edge-t"},
        {type: "BitmapTile", imageName: "stone-grass-edge-lr"},
        {type: "BitmapTile", imageName: "stone-grass-trans-x"},
        {type: "BitmapTile", imageName: "stone-grass-trans"},
        {type: "BitmapTile", imageName: "bamboo-edge"},
        {type: "BitmapTile", imageName: "bamboo-edge", rotation: 90},
        {type: "BitmapTile", imageName: "bamboo-edge", rotation: 180},
        {type: "BitmapTile", imageName: "bamboo-edge", rotation: 270},
        {type: "BitmapTile", imageName: "wall-edge-br"},
        {type: "BitmapTile", imageName: "wall-edge-br",
          flips: {x: true, y: false}},
        {type: "BitmapTile", imageName: "roof-edge-br"},
        {type: "BitmapTile", imageName: "roof-edge-br",
          flips: {x: true, y: false}},
        {type: "BitmapTile", imageName: "roof-edge-tr"},
        {type: "BitmapTile", imageName: "roof-edge-tr",
          flips: {x: true, y: false}},
        {type: "BitmapTile", imageName: "roof-end-r"},
        {type: "BitmapTile", imageName: "roof-end-r",
          flips: {x: true, y: false}},
        {type: "BitmapTile", imageName: "roof-edge-t"}
      ]
    },
 
    STONE: 1,
    GRASS: 2,
    BAMBOO: 3,
    PANEL_B: 4,
    PANEL_T: 5,
    DOOR_B: 6,
    DOOR_T: 7,
    WINDOW_B: 8,
    WINDOW_T: 9,
    ROOF_B: 10,
    ROOF_T: 11,
    
    STONE_B: 0,
    STONE_L: 1,
    STONE_T: 2,
    STONE_R: 3,
    GRASS_L: 4,
    GRASS_T: 5,
    GRASS_R: 6,
    FADE_LR: 7,
    FADE_RL: 8,
    BAMBOO_T: 9,
    BAMBOO_R: 10,
    BAMBOO_B: 11,
    BAMBOO_L: 12,
    WALL_BR: 13,
    WALL_BL: 14,
    ROOF_BR: 15,
    ROOF_BL: 16,
    ROOF_TR: 17,
    ROOF_TL: 18,
    ROOF_ER: 19,
    ROOF_EL: 20,
    ROOF_TM: 21,
    
    init: function() {
      var layer = xs.game.getLayer('collision'),
          data = xs.clone(layer.grid.data);
      for (i = 0; i < data.length; i++) {
        for (j = 0; j < data[i].length; j++) {
          data[i][j] = 0;
        }
      }
      this._super({data: data, cellsize: layer.cellsize, offset: layer.offset});
      this.view = new createjs.Container();
    },
    
    postProcess: function() {
      var i, j, c, n, e, s, w, se, sw, tile, tiles,
          layer = xs.game.getLayer('collision'),
          grid = layer.grid,
          data = grid.data;
      for (i = 0; i < data.length; i++) {
        for (j = 0; j < data[i].length; j++) {
          c = grid.getCellAt(i, j);
          n = grid.getCellAt(i, j - 1) || 0;
          e = grid.getCellAt(i + 1, j) || 0;
          s = grid.getCellAt(i, j + 1) || 0;
          w = grid.getCellAt(i - 1, j) || 0;
          se = grid.getCellAt(i + 1, j + 1) || 0;
          sw = grid.getCellAt(i - 1, j + 1) || 0;
          tiles = this._processTiles(c, n, e, s, w, se, sw);
          if (!(tiles && tiles.length)) continue;
          tile = new xs.ContainerTile();
          tile.setIndex(i, j);
          tile.setSize(grid.cellsize.x, grid.cellsize.y);
          tile.setTiles(tiles);
          tile.updateView();
          this.tiles[i][j] = tile;
        }
      }
    },
    
    _processTiles: function(c, n, e, s, w, se, sw) {
      var tiles = [];
      this._processBamboo(tiles, c, n, e, s, w, se, sw);
      this._processHouse(tiles, c, n, e, s, w, se, sw);
      this._processStone(tiles, c, n, e, s, w, se, sw);
      return tiles;
    },
    
    _processStone: function(tiles, c, n, e, s, w, se, sw) {
      if (c == this.GRASS) return;
      if (c == this.STONE) {
        if (e == this.GRASS) {
          this._addTile(this.FADE_RL, tiles);
        }
        if (w == this.GRASS) {
          this._addTile(this.FADE_LR, tiles);
        }
      } else {
        if (n == this.STONE || n == this.GRASS) {
          this._addTile(this.STONE_B, tiles);
        }
        if (e == this.STONE || e == this.GRASS) {
          this._addTile(e == this.STONE ? this.STONE_L : this.GRASS_L, tiles);
        }
        if (w == this.STONE || w == this.GRASS) {
          this._addTile(w == this.STONE ? this.STONE_R : this.GRASS_R, tiles);
        }
        if (s == this.STONE || s == this.GRASS) {
          this._addTile(s == this.STONE ? this.STONE_T : this.GRASS_T, tiles);
        }
      }
    },
    
    _processBamboo: function(tiles, c, n, e, s, w, se, sw) {
      if (this._checkStone(c) || this._checkHouse(c)) return;
      if (c != this.BAMBOO && n == this.BAMBOO) {
        this._addTile(this.BAMBOO_B, tiles);
      }
      if (c != this.BAMBOO && e == this.BAMBOO) {
        this._addTile(this.BAMBOO_L, tiles);
      }
      if (c != this.BAMBOO && w == this.BAMBOO) {
        this._addTile(this.BAMBOO_R, tiles);
      }
      if (c != this.BAMBOO && s == this.BAMBOO) {
        this._addTile(this.BAMBOO_T, tiles);
      }
    },
    
    _processHouse: function(tiles, c, n, e, s, w, se, sw) {
      if (this._checkStone(c) || this._checkHouse(c)) return;
      if (this._checkRoof(s)) {
        this._addTile(this.ROOF_TM, tiles);
        if (!this._checkRoof(se) ) {
          this._addTile(this.ROOF_TR, tiles);
        }
        if (!this._checkRoof(sw)) {
          this._addTile(this.ROOF_TL, tiles);
        }
      } else {
        if (!this._checkHouse(e) && this._checkRoof(se)) {
          this._addTile(this.ROOF_EL, tiles);
        }
        if (!this._checkHouse(w) && this._checkRoof(sw)) {
          this._addTile(this.ROOF_ER, tiles);
        }
      }
      if (this._checkWallB(e)) {
        this._addTile(this.WALL_BL, tiles);
      } else if (e == this.ROOF_B) {
        this._addTile(this.ROOF_BL, tiles);
      }
      if (this._checkWallB(w)) {
        this._addTile(this.WALL_BR, tiles);
      } else if (w == this.ROOF_B) {
        this._addTile(this.ROOF_BR, tiles);
      }
    },
    
    _checkStone: function(t) {
      if (t == this.STONE || t == this.GRASS) { return true; }
      return false;
    },
    
    _checkHouse: function(t) {
      if (t == this.PANEL_B || t == this.PANEL_T ||
          t == this.DOOR_B || t == this.DOOR_T ||
          t == this.WINDOW_B || t == this.WINDOW_T ||
          t == this.ROOF_B || t == this.ROOF_T) { return true; }
      return false;
    },
    
    _checkWallB: function(t) {
      if (t == this.PANEL_B || t == this.DOOR_B || t == this.WINDOW_B) {
        return true;
      }
      return false;
    },
    
    _checkRoof: function(t) {
      if (t == this.ROOF_B || t == this.ROOF_T) { return true; }
      return false;
    },
    
    _addTile: function(index, tiles) {
      var tileDef = this.tileset[index],
          tile = new xs.BitmapTile(tileDef);
      tile.setSize(this.grid.cellsize.x, this.grid.cellsize.y);
      tile.updateView();
      tiles.push(tile);
    }
  });

  xs.EdgesLayer = EdgesLayer;
}(MODULES.axis));