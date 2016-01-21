(function(xs) {

  var StaticGrid = xs.HitGrid.extend({
    
    OFFSET: 0.001,
    
    _timeLeft: 0,
    _target: null,
    _offsets: null,
    _cell: null,
    _pos: null,
    _hitTime: null,
    _hitPos: null,
    _result: null,
    
    init: function(settings) {
      var i, axis;
      this._super(settings);
      this._target = {};
      this._offsets = {};
      this._cell = {};
      this._pos = {};
      this._hitTime = {};
      this._hitPos = {};
      this._result = {};
      this._result.target = this._target;
      this._result.pos = this._pos;
      this._result.hits = this._hits;
      this._result.hitIndices = this._hitIndices;
      this._result.hitTime = this._hitTime;
      this._result.hitPos = this._hitPos;
      for (i = 0; i < this.axes.length; i++) {
        axis = this.axes[i];
        this._offsets[axis] = {};
        this._hitPos[axis] = {};
      }
    },
    
    sweep: function(start, step, bounds) {
      var i, axis;
      
      this._timeLeft = 1;
      
      for (i = 0; i < this.axes.length; i++) {
        axis = this.axes[i];
        this._target[axis] = start[axis] + step[axis];
        if (step[axis] > 0) {
          this._offsets[axis].front = bounds[axis].max - start[axis];
          this._offsets[axis].edge = 1;
          this._offsets[axis].cell = 1;
        } else {
          this._offsets[axis].front = bounds[axis].min - start[axis];
          this._offsets[axis].edge = 0;
          this._offsets[axis].cell = -1;
        }
        this._cell[axis] =
            this.getIndex(axis, start[axis] + this._offsets[axis].front);
        this._pos[axis] = start[axis];
        this._hits[axis].length = 0;
      }
    
      while (this._timeLeft) this._sweepToNextEdge(bounds);
      return this._result;
    },
    
    _sweepToNextEdge: function(bounds) {
      var i, axis, front, edge, time, toTarget, shift,
          hitDist, hitAxis, hitIndex,
          hitTime = 1;
      
      for (i = 0; i < this.axes.length; i++) {
        axis = this.axes[i];
        if (this._hits[axis].length) continue;
        toTarget = this._target[axis] - this._pos[axis];
        if (!toTarget) continue;
        
        edge = this._cell[axis] + this._offsets[axis].edge;
        front = this._pos[axis] + this._offsets[axis].front;
        hitDist = this.getCoord(axis, edge) - front;
        
        time = hitDist / toTarget;
        if (time <= hitTime) {
          hitTime = time;
          hitAxis = axis;
          hitIndex = this._cell[axis] + this._offsets[axis].cell;
        }
      }
            
      for (i = 0; i < this.axes.length; i++) {
        axis = this.axes[i];
        if (this._hits[axis].length) continue;
        shift = hitTime * (this._target[axis] - this._pos[axis]);
        bounds[axis].min += shift;
        bounds[axis].max += shift;
        this._pos[axis] += shift;
      }
      
      if (hitAxis) {
        if (this._checkHitAxis(hitAxis, hitIndex, bounds)) {
          shift = this._offsets[hitAxis].cell * this.OFFSET;
          bounds[hitAxis].min -= shift;
          bounds[hitAxis].max -= shift;
          this._pos[hitAxis] -= shift;
        } else {
          this._cell[hitAxis] += this._offsets[hitAxis].cell;
        }
      }
      
      this._timeLeft -= hitTime * this._timeLeft;
    },
    
    _checkHitAxis: function(hitAxis, hitIndex, bounds) {
      var i, axis, region;
       
      for (i = 0; i < this.axes.length; i++) {
        axis = this.axes[i];
        if (axis == hitAxis) {
          this._hitRanges[i].length = 0;
          this._hitRanges[i].push(hitIndex);
        } else {
          this._setHitRange(i, bounds);
        }
      }
      
      region = this.getHitRegion(this._hitRanges);
      this.getHits(region, hitAxis);
      
      if (this._hits[hitAxis].length) {
        this._hitTime[hitAxis] = 1 - this._timeLeft;
        for (i = 0; i < this.axes.length; i++) {
          axis = this.axes[i];
          this._hitPos[hitAxis][axis] = this._pos[axis];
        }
        return true;
      }
      return false;
    }
  });
  
  xs.StaticGrid = StaticGrid;
}(MODULES.axis));