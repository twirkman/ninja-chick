(function(my, xs) {

  var Feather = xs.Entity.extend({

    DEFAULTS: {
      size: {x: 16, y: 16},
      offsets: {x: -8, y: -8},
      decel: {x: 3000, y: 3000},
      gravityFactor: 0,
      hits: 0,
      imageName: 'feather'
    },

    init: function(settings) {
      var image, angle, speed, rotation;
      this._super(settings);
      image = MODIT.getImage(this.imageName);
      this.view = new createjs.Bitmap(image);
      this.view.scaleX = this.size.x / image.width;
      this.view.scaleY = this.size.y / image.height;
      this.view.regX = 8;
      this.view.regY = 8;
      rotation = Math.random() * 360;
      this.view.rotation = rotation;
      angle = Math.random() * 2 * Math.PI;
      speed = (Math.random() + 1) * 600;
      this.vel.x = speed * Math.cos(angle);
      this.vel.y = speed * Math.sin(angle);
      this.windX = Math.random() / 2 + 0.3;
      this.windY = Math.random() / 2 + 0.3;
    },

    updateModel: function(e) {
      var i, axis, m, g;
      for (i = 0; i < this.axes.length; i++){
        axis = this.axes[i];
        this.lastPos[axis] = this.pos[axis];
      }
      this.applyForces(xs.game.step);
      for (i = 0; i < this.axes.length; i++){
        axis = this.axes[i];
        this.pos[axis] += this.vel[axis] * xs.game.step;
      }
      this.pos.x += this.windX;//Math.random();
      this.pos.y += this.windY;//Math.random();
      this.view.rotation += 0.4;//Math.random();
    },

  });

  xs.Feather = Feather;
}(MODULES.my, MODULES.axis));
