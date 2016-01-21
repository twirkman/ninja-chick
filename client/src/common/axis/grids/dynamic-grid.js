(function(xs) {

  var DynamicGrid = xs.HitGrid.extend({

    OFFSET: 0.001,
    _cells: null,
    _overlap: null,
    _checked: null,
    
    init: function(settings) {
      this._super(settings);
      this._overlap = {};
      this._cells = [];
      this._checked = [];
    },
    
    clear: function() {
      var i;
      for (i = 0; i < this._cells.length; i++) {
        this._cells[i].length = 0;
      }
    },
    
    setRegion: function(region, value) {
      var i, j, numAxes, numCells, cell;
      numAxes = this.axes.length;
      numCells = region.length / numAxes;
      for (i = 0; i < numCells; i++) {
        this._cellIndex.length = 0;
        for (j = 0; j < numAxes; j++) {
          this._cellIndex.push(region[i * numAxes + j]);
        }
        cell = this.getCellAt(this._cellIndex) || this._createCell();;
        cell.push(value);
        this.setCellAt(this._cellIndex, cell);
      }
    },
    
    checkHits: function() {
      var x, i, j, k, A, B, bounds, ranges, region, hits, entities;
      this.clear();
      for (x in xs.game.layers) {
        entities = xs.game.layers[x].entities;
        if (!entities) continue;
        for (i = 0; i < entities.length; i++) {
          A = entities[i];
          if (A.hits == xs.Entity.HITS.NONE) continue;
          this._checked.length = 0;
          bounds = A.getBounds();
          ranges = this.getHitRanges(bounds);
          region = this.getHitRegion(ranges);
          hits = this.getHits(region);
          for (j = 0; j < hits.length; j++) {
            if (hits[j] instanceof Array) {
              for (k = 0; k < hits[j].length; k++) {
                hits.push(hits[j][k]);
              }
            } else {
              B = hits[j];
              if (B.hits == xs.Entity.HITS.NONE) continue;
              if (this._checked.indexOf(B) == -1) {
                xs.Entity.checkHit(A, B);
                this._checked.push(B);
              }
            }
          }
          this.setRegion(region, A);
        }
      }
    },
    
    resolveHit: function(e) {
      var i, axis, stepA, stepB, step, time, offset, hitTime = 1;
      e.axis = null;
      for (i = 0; i < this.axes.length; i++) {
        axis = this.axes[i];
        offset = this.OFFSET;
        stepA = e.A.pos[axis] - e.A.lastPos[axis];
        stepB = e.B.pos[axis] - e.B.lastPos[axis];
        step = stepA - stepB;
        if (step > 0) {
          this._overlap[axis] = e.boundsA[axis].max - e.boundsB[axis].min;
        } else {
          this._overlap[axis] = e.boundsA[axis].min - e.boundsB[axis].max;
          offset *= -1;
        }
        time = Math.abs(this._overlap[axis] / step);
        this._overlap[axis] += offset;
        if (time < hitTime) {
          hitTime = time;
          e.axis = axis;
          e.hitVelA = stepA / xs.game.step;
          e.hitVelB = stepB / xs.game.step;
        }
      }
      
      if (!e.axis) return;
      for (i = 0; i < this.axes.length; i++) {
        axis = this.axes[i];
        if (axis != e.axis) {
          this._overlap[axis] = 0;
        }
      }
            
      if (!e.strong) {
        this._overlap[e.axis] *= 0.5;
      }
      if (e.strong !== e.B) {
        this._separate(e, e.axis, e.B, e.boundsB);
      }
      if (e.strong !== e.A) {
        this._overlap[e.axis] *= -1;
        this._separate(e, e.axis, e.A, e.boundsA);
      }
    },
    
    //TODO - move to postSolve, calculate data here and attach to hitEvent
    _separate: function(e, axis, entity, bounds) {
      var g, m, baseVel, hitVel, myVel, otherVel;
      g = xs.game.grid;
      m = g.sweep(entity.pos, this._overlap, bounds);
      myVel = entity === e.A ? e.hitVelA : e.hitVelB;
      otherVel = entity === e.B ? e.hitVelA : e.hitVelB;
      if (!e.strong) {
        if (entity.bounceFactor &&
            Math.abs(myVel) > entity.minBounceVel[axis]) {
          entity.vel[axis] = myVel + (otherVel - myVel) / 2 -
              myVel * entity.bounceFactor;
        } else {
          entity.vel[axis] = myVel + (otherVel - myVel) / 2;
        }
      } else {
        if (entity.bounceFactor &&
            Math.abs(myVel) > entity.minBounceVel[axis]) {
          entity.vel[axis] = otherVel - myVel * entity.bounceFactor;
        } else {
          entity.touching[axis] = otherVel;
          entity.vel[axis] = otherVel;
        }
      }
      entity.pos[axis] = m.pos[axis];
    },
    
    _createCell: function() {
      var cell = [];
      this._cells.push(cell);
      return cell;
    }
  });
  
  xs.DynamicGrid = DynamicGrid;
}(MODULES.axis));