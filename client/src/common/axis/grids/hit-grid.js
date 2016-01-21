(function(xs) {

  var HitGrid = xs.Grid.extend({
    
    _hits: null,
    _hitIndices: null,
    _hitRanges: null,
    _hitRegions: null,
    _cellIndex: null,
    
    init: function(settings) {
      var i, axis;
      this._super(settings);
      this._hits = {};
      this._hitIndices = {};
      this._hitRanges = [];
      this._hitRegions = [];
      this._cellIndex = [];
      for (i = 0; i < this.axes.length; i++) {
        axis = this.axes[i];
        this._hits[axis] = [];
        this._hitIndices[axis] = [];
        this._hitRanges.push([]);
        if (i < this.axes.length - 1) {
          this._hitRegions.push([]);
        }
      }
    },
    
    getHitRanges: function(bounds) {
      var i;
      for (i = 0; i < this.axes.length; i++) {
        this._setHitRange(i, bounds);
      }
      return this._hitRanges;
    },
    
    getHitRegion: function(ranges) {
      var i, j, k, region, range;
      for (i = 0; i < this.axes.length - 1; i++) {
        this._hitRegions[i].length = 0;
        region = (i == 0) ? ranges[i] : this._hitRegions[i - 1];
        range = ranges[i + 1];
        for (j = 0; j < region.length; j++) {
          for (k = 0; k < range.length; k++) {
            this._hitRegions[i].push(region[j]);
            this._hitRegions[i].push(range[k]);
          }
        }
      }
      return this._hitRegions[i - 1];
    },
    
    getHits: function(region, axis) {
      var i, j, numAxes, numCells, cell;
      
      axis = axis || this.axes[0];
      this._hits[axis].length = 0;
      this._hitIndices[axis].length = 0;
      
      numAxes = this.axes.length;
      numCells = region.length / numAxes;
      
      for (i = 0; i < numCells; i++) {
        this._cellIndex.length = 0;
        for (j = 0; j < numAxes; j++) {
          this._cellIndex.push(region[i * numAxes + j]);
        }

        cell = this.getCellAt(this._cellIndex);
        if (cell) {
          this._hits[axis].push(cell);
          for (j = 0; j < numAxes; j++) {
            this._hitIndices[axis].push(region[i * numAxes + j]);
          }
        }
      }
      return this._hits[axis];
    },
        
    _setHitRange: function(index, bounds) {
      var i, axis, min, max;
      axis = this.axes[index];
      min = this.getIndex(axis, bounds[axis].min);
      max = this.getIndex(axis, bounds[axis].max) + 1;
      this._hitRanges[index].length = 0;
      for (i = min; i < max; i++) {
        this._hitRanges[index].push(i);
      }
    }

  });
  
  xs.HitGrid = HitGrid;
}(MODULES.axis));