(function(xs) {

  var _c = document.createElement('canvas'),
      _ctx = _c.getContext('2d'),
      _imageData = {};

  xs.start = function(Game) {
    xs.Probe.init();
    xs.scale = 1;
    xs.system = new xs.System();
    xs.input = new xs.Input();
    xs.view = new xs.View();
    xs.system.addEventListener('tick', xs.view.tick.bind(xs.view));
    xs.setGame(Game);
  };
  
  xs.setGame = function(Game) {
    xs.game = new Game();
    xs.system.addEventListener('tick', xs.game.tick.bind(xs.game));
    xs.system.addEventListener('resize', xs.game.resize.bind(xs.game));
  };
  
  xs.merge = function(o1, o2) {
    var key;
    for (key in o2) {
      o1[key] = xs.clone(o2[key]);
    }
    return o1;
  };

  xs.clamp = function(min, max, value) {
    return Math.max(min, Math.min(max, value));
  };
  
  xs.clone = function(o) {
    if (o && o.toJSON) {
      return JSON.parse(JSON.stringify(o));
    } else if (o && o.clone) {
      return o.clone(true); // true for easel deep copy
    } else if (o instanceof Array) {
      return cloneArray(o);
    } else if (o instanceof Object) {
      return cloneObject(o);
    } else {
      return o;
    }
  };
    
  function cloneObject(o) {
    var p, prop;
    p = {};
    for (prop in o) {
      p[prop] = xs.clone(o[prop]);
    }
    return p;
  }
  
  function cloneArray(a) {
    return a.map(function(x) { return xs.clone(x); });
  }
  
  xs.getImage = function(id) {
    return xs._images[id];
  };
  
  xs.createScaledImage = function(imageData, newWidth, newHeight, canvas) {
    var c, ctx, scaledImageData, scaleX, scaleY,
        x, y, px, py, i, j, k;

    c = canvas || document.createElement('canvas');
    c.width = newWidth;
    c.height = newHeight;
    ctx = c.getContext('2d');
    scaledImageData = ctx.createImageData(newWidth, newHeight);
    
    scaleX = newWidth / imageData.width;
    scaleY = newHeight / imageData.height;
          
    for (y = 0; y < scaledImageData.height; ++y) {
      py = Math.floor(y / scaleY);
      for (x = 0; x < scaledImageData.width; ++x) {
        px = Math.floor(x / scaleX);
        i = (y * scaledImageData.width + x) * 4;
        j = (py * imageData.width + px) * 4;
        for (k = 0; k < 4; ++k) {
          scaledImageData.data[i + k] = imageData.data[j + k];
        }
      }
    }
    
    ctx.putImageData(scaledImageData, 0, 0);
    return c;
  };
  
  xs.getImageData = function(image) {
    var getData;
    _c.width = image.width;
    _c.height = image.height;
    _ctx.drawImage(image, 0, 0);
    getData = _ctx.webkitGetImageDataHD ?
              'webkitGetImageDataHD' :
              'getImageData';
    return _ctx[getData](0, 0, image.width, image.height);
  };
  
  xs.prepContext = function(ctx) {
    if (xs.scale <= 1) {
      ctx.imageSmoothingEnabled = true;
      ctx.mozImageSmoothingEnabled = true;
      ctx.oImageSmoothingEnabled = true;
      ctx.webkitImageSmoothingEnabled = true;
      ctx.canvas.style.imageRendering = 'auto';
      return;
    }
    switch (xs.scaling) {
      case xs.SCALING.CANVAS:
        ctx.imageSmoothingEnabled = false;
        ctx.mozImageSmoothingEnabled = false;
        ctx.oImageSmoothingEnabled = false;
        ctx.webkitImageSmoothingEnabled = false;
        break;
      case xs.SCALING.CSS:
        ctx.canvas.style.imageRendering = 'crisp-edges';
        ctx.canvas.style.imageRendering = '-o-crisp-edges';
        ctx.canvas.style.imageRendering = '-moz-crisp-edges';
        ctx.canvas.style.imageRendering = '-webkit-optimize-contrast';
        break;
      case xs.SCALING.MANUAL:
        break;
    }
  };
  
  xs.getScaledPosition = function(p) {
    //if (xs.scaling == xs.SCALING.MANUAL && xs.scale * xs.pixelRatio > 1) {
    //  return Math.round(p * xs.scale);
    //}
    return Math.round(p);
  };
  
  xs._images = {};
  
  xs.SCALING = {
    CANVAS: 0,
    CSS: 1,
    MANUAL: 2
  };
  
  xs.RENDER = {
    CRISP: 0,
    SMOOTH: 1
  };
  
  xs.render = xs.RENDER.CRISP;
  xs.scaling = xs.SCALING.CANVAS;

}(MODULES.axis));