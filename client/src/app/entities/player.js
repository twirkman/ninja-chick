(function(my, xs) {

  var Player = xs.Actor.extend({
    
    DEFAULTS: {
      hits: xs.Entity.HITS.ACTIVE,
      size: {x: 32, y: 32},
      offsets: {x: -16, y: -16},
      decel: {x: 600, y: 0},
      maxVel: {x: 600, y: 1200},
      runAccel: 2200,
      jumpAccel: 36000,
      runDecel: Infinity,//4200,
      jumpDecel: Infinity,
      turnFactor: 1.2,
      clingForgiveness: 7
    },
    
    _jumpPeaked: true,
    _wallNormal: null,
    _ticksSinceCling: Infinity,
    _poof: null,
    
    init: function(settings) {
      var spriteSheet = new createjs.SpriteSheet({
        images: [
          MODIT.getImage("idle"),
          MODIT.getImage("running"),
          MODIT.getImage("jumping"),
          MODIT.getImage("wall-cling"),
        ],
        frames: {width: 32, height: 32, regX: 16, regY: 16},
        animations: {
          idle: 0,
          run: [1, 4, "run", 4],
          jump: 5,
          cling: 6
        }
      });
      createjs.SpriteSheetUtils.addFlippedFrames(
          spriteSheet, true, true, true);
      
      this._poof = new xs.Emitter({
        emissionsPerSecond: 10000,
        active: false,
        particleType: 'Feather'
      });
      
      this._super(spriteSheet, settings);
    },
    
    updateModel: function() {
      if (this.touching.x) {
        this._ticksSinceCling = 0;
        this._wallNormal = this.touching.x < 0 ? 1 : -1;
      } else {
        this._ticksSinceCling++;
      }
      this.handleInput();
      this._super();
    },
    
    handleInput: function() {
      var jump, startJump, stopJump,
          left, right, up, down, run, climb,
          tx, ty;
           
      startJump = xs.input.pressed('jump');
      stopJump = xs.input.released('jump');
      right = xs.input.state('right');
      left = xs.input.state('left');
      up = xs.input.state('up');
      down = xs.input.state('down');
      run = (left || right) && !(left && right) ? left ? -1 : 1 : 0;
      climb = (up || down) && !(up && down) ? up ? -1 : 1 : 0;
      jump = startJump && (this.isGrounded() || this.isClinging());
      
      this.accel.y = 0;
      this.accel.x = this.runAccel * run;
      this.flips.x = run ? left : this.flips.x;
      this.decel.y = this.DEFAULTS.decel.y;
      this.maxVel.y = this.DEFAULTS.maxVel.y;
      this.gravityFactor = this.DEFAULTS.gravityFactor;
      
      if ((this.vel.x > 0 && run == -1) || (this.vel.x < 0 && run == 1)) {
        this.accel.x *= this.turnFactor;
      }
      this.decel.x = this.isGrounded() ? this.runDecel : this.DEFAULTS.decel.x;
      
      if (this.touching.x) {
        this.gravityFactor = 0;
        this.maxVel.y = this.DEFAULTS.maxVel.x;
        this.decel.y = this.runDecel;
        this.vel.x = this.touching.x > 0 ? 1 : -1;
        this.decel.x = 0;
        if (climb) {
          this.accel.x = 0;
          this.accel.y = this.runAccel * climb;
          this.flips.x = this.touching.x < 0;
        }
      }
      
      if (this.touching.y) {
        this.gravityFactor = 0;
        this.vel.y = this.touching.y > 0 ? 1 : -1;
        this.decel.y = 0;
      }
      
      if (jump) {
        if (this.isGrounded()) {
          this.vel.y = 0;
          this.accel.y = this.jumpAccel * (this.flips.y ? 0.5 : -1);
        } else {
          this.vel.y = 0;
          this.accel.y = -this.jumpAccel;
          this.vel.x = 0;
          this.accel.x = this.jumpAccel * this._wallNormal;
          this.flips.x = this._wallNormal == -1;
        }
        this._jumpPeaked = false;
      } else {
        
        tx = Math.abs(this.touching.x);
        ty = Math.abs(this.touching.y);
          
        if (this.touching.x && this.touching.y) {
          if (tx > ty) {
            this.vel.y = tx * (this.touching.y < 0 ? 1 : -1);
          } else {
            this.vel.x = ty * (this.touching.x < 0 ? 1 : -1);
            this.flips.x = run ? left : this.touching.x > 0;
          }
        } else {
          this._checkTurn(run, climb);
        }
        
        if (this.vel.y >= 0 || this.touching.y < 0) {
          this._jumpPeaked = true;
        } else if (stopJump && !this._jumpPeaked) {
          this.decel.y = this.jumpDecel;
        }
      }
    },
    
    _checkTurn: function(run, climb) {
      var xOffset, yOffset, dir,
          grid = xs.game.grid,
          ix = grid.getIndex('x', this.pos.x),
          iy = grid.getIndex('y', this.pos.y),
          cx = grid.getCoord('x', ix),
          cy = grid.getCoord('y', iy);
          
      if ((this.touching.x < 0 && run < 0) ||
          (this.touching.x > 0 && run > 0)) {
        if (grid.getCellAt(ix + run, iy) == 0) {
          xOffset = this.touching.x < 0 ? 0 : 1;
          yOffset = this.pos.y - this.size.y < cy ? 0 : 1;
          dir = yOffset ? 1 : -1;
          if (climb !== dir) {
            this.pos.x = grid.getCoord('x', ix + xOffset) +
                run * (this.offsets.x + 0.001);
            this.pos.y = grid.getCoord('y', iy + yOffset) +
                dir * (this.offsets.y - 0.001);
            this._turnX(run, dir);
          }
        }
      } else if ((this.touching.y < 0 && climb < 0) ||
                 (this.touching.y > 0 && climb > 0)) {
        if (grid.getCellAt(ix, iy + climb) == 0) {
          yOffset = this.touching.y < 0 ? 0 : 1;
          xOffset = this.pos.x - this.size.x < cx ? 0 : 1;
          dir = xOffset ? 1 : -1;
          if (run !== dir) {
            this.pos.y = grid.getCoord('y', iy + yOffset) +
                climb * (this.offsets.y + 0.001);
            this.pos.x = grid.getCoord('x', ix + xOffset) +
                dir * (this.offsets.x - 0.001);
            this._turnY(dir, climb);
          }
        }
      }
    },
    
    _turnX: function(xDir, yDir) {
      this.vel.x = Math.abs(this.vel.y) * xDir;
      this.vel.y = yDir;
      this.accel.y = 0;
      this.decel.y = 0;
    },
    
    _turnY: function(xDir, yDir) {
      this.vel.y = Math.abs(this.vel.x) * yDir;
      this.vel.x = xDir;
      this.accel.x = 0;
      this.decel.x = 0;
    },
    
    handleMovement: function(movement) {
      if (movement.hits.x.indexOf(3) != -1 ||
          movement.hits.y.indexOf(3) != -1) {
        this.handleDeath();
        return;
      }
      if (movement.hits.x.indexOf(10) != -1) {
        this.handleDeath();
        return;
      }
      this._super(movement);
      this.handleOB(movement);
      this.flips.y = this.touching.y < 0;
      if (this.touching.x && this.touching.y) {
        var tx = Math.abs(this.touching.x);
        var ty = Math.abs(this.touching.y);
        if (tx <= ty) {
          this.flips.x = this.touching.x > 0;
        }
      }
    },
    
    handleDeath: function() {
      this._poof.active = true;
      this._poof.pos.x = this.pos.x;
      this._poof.pos.y = this.pos.y;
      xs.game.removeEntity(this);
      xs.system.dispatchEvent('poof');
    },
    
    handleOB: function(m) {
      var box = this.getBounds(),
          bounds = xs.game.getLayer('collision').getBounds();
          
      if (!bounds.containsBox(box)) {
        if (box.x.max > bounds.x.max) {
          this.pos.x -= box.x.max - bounds.x.max;
          this.vel.x = 0;
        } else if (box.x.min < bounds.x.min) {
          this.pos.x += bounds.x.min - box.x.min;
          this.vel.x = 0;
        }
        
        if (box.y.min > bounds.y.max) {
          this.handleDeath();
        }
      }
    },
    
    getAnimState: function() {
      if (this.isIdle()) return "idle";
      if (this.isGrounded()) return "run";
      if (this.touching.x) return "cling";
      return "jump";
    },
    
    isIdle: function() {
      return this.isGrounded() && this.accel.x == 0 && this.accel.y == 0;
    },
    
    isGrounded: function() {
      return this.touching.y != 0;
    },
    
    isClinging: function() {
      return !this.touching.y && this._ticksSinceCling < this.clingForgiveness;
    }
  });

  xs.Player = Player;
}(MODULES.my, MODULES.axis));