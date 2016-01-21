(function(xs) {

  var Probe = xs.Class.extend({
    
    init: function() {
      throw 'Probe is a static class and should not be instantiated';
    }
  });
  
  Probe.init = function() {
    this.setPixelRatio();
    //this.setScaling();
    //xs._scaling = xs.scaling;
   // console.log('pixelRatio: ' + xs.pixelRatio);
   // console.log('scaling: ' + xs.scaling);
  };
  
  Probe.setPixelRatio = function() {
    var devicePixelRatio, backingStorePixelRatio;
    devicePixelRatio = window.devicePixelRatio || 1;
    backingStorePixelRatio =
        this._ctx.webkitBackingStorePixelRatio ||
        this._ctx.mozBackingStorePixelRatio ||
        this._ctx.msBackingStorePixelRatio ||
        this._ctx.oBackingStorePixelRatio ||
        this._ctx.backingStorePixelRatio || 1;
    xs.pixelRatio = devicePixelRatio / backingStorePixelRatio;
  };
  
  Probe.setScaling = function() {
    var getData, imageData, image, ratio, canvas, ctx, imageSmoothing,
        w, h, x, y, px, py, i, j, k, rms, count,
        scale = 4;
        
    ratio = xs.pixelRatio;
    image = this._pixelImage;
    ctx = this._ctx;
    canvas = ctx.canvas;
    getData = ctx.webkitGetImageDataHD ? 'webkitGetImageDataHD' : 'getImageData';
    imageSmoothing =
        ctx.webkitImageSmoothingEnabled ||
        ctx.mozImageSmoothingEnabled ||
        ctx.oImageSmoothingEnabled ||
        ctx.imageSmoothingEnabled;
        
    xs.scaling = xs.SCALING.CANVAS;
    if (imageSmoothing) {
      w = image.naturalWidth;
      h = image.naturalHeight;
      canvas.width = w * scale * ratio;
      canvas.height = h * scale * ratio;
      xs.scale = scale;
      xs.prepContext(this._ctx);
      this._ctx.scale(scale * ratio, scale * ratio);
      this._ctx.drawImage(image, 0, 0);
      
      imageData = this._ctx[getData](0, 0, canvas.width, canvas.height);
      scale = imageData.width / w;
      
      for (count = 0, rms = 0, y = 0; y < imageData.height; ++y) {
        py = Math.floor(y / scale);
        for (x = 0; x < imageData.width; ++x) {
          px = Math.floor(x / scale);
          i = (y * imageData.width + x) * 4;
          j = (py * w + px) * 4;
          for (k = 0; k < 4; ++k) {
            count++;
            rms += Math.pow(imageData.data[i + k] - this._pixelData[j + k], 2);
          }
        }
      }
      
      rms = Math.sqrt(rms / count);
      if (rms < this.maxBlur) return;
    }
    
    xs.scaling = xs.SCALING.CSS;
    for (i = 0; i < this.renderStyles.length; ++i) {
      canvas.style.imageRendering = this.renderStyles[i];
      if (canvas.style.imageRendering == this.renderStyles[i]) return;
    }
    
    xs.scaling = xs.SCALING.MANUAL;
  };
  
  Probe.maxBlur = 5;
  Probe.renderStyles = [
    'crisp-edges', '-moz-crisp-edges', '-webkit-optimize-contrast'
  ];
  
  Probe._ctx = document.createElement('canvas').getContext('2d');
  
  Probe._pixelImage = new Image();
  Probe._pixelImage.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAIAAABLbSncAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAsElEQVQIHWO0a2MOq7RiYGDYPf/S759/vDIMN/Sf/vXjD8vPFYqv/H6KabMD5b68/8HAwBhQaMbA8J+x7rLZErdncXulRTTZgHJAANHKxM/BLCrKcSH6yx37D59v/YHIAbUyBhhqK/AyPfj8DygEZABJIBvIYPJRYoUIPf/7E8jQEWWGiDAqScpwcnAAhb7/+AFkAEkgGwhYgBYAKUsBTgYGzuMfvvPwcnz5zOAqywkANZdBAfQK15QAAAAASUVORK5CYII=";
  
  Probe._pixelData = [62, 134, 3, 255, 148, 255, 61, 255, 148, 255, 61, 255, 79, 158, 15, 255, 74, 151, 11, 255, 148, 255, 60, 255, 68, 142, 7, 255, 62, 134, 3, 255, 55, 46, 36, 255, 126, 212, 54, 255, 148, 255, 61, 255, 79, 158, 15, 255, 62, 134, 3, 255, 148, 255, 61, 255, 148, 255, 61, 255, 148, 255, 60, 255, 126, 211, 54, 255, 34, 25, 28, 255, 128, 214, 55, 255, 148, 255, 61, 255, 148, 255, 61, 255, 148, 255, 61, 255, 79, 158, 15, 255, 74, 151, 11, 255, 141, 219, 57, 255, 55, 46, 36, 255, 80, 49, 43, 255, 112, 62, 45, 255, 135, 217, 57, 255, 148, 255, 61, 255, 79, 158, 15, 255, 62, 134, 3, 255, 80, 49, 43, 255, 112, 62, 45, 255, 80, 49, 43, 255, 80, 49, 43, 255, 112, 62, 45, 255, 112, 62, 45, 255, 80, 49, 43, 255, 112, 62, 45, 255, 156, 83, 48, 255, 112, 62, 45, 255, 112, 62, 45, 255, 55, 46, 36, 255, 112, 62, 45, 255, 156, 83, 48, 255, 156, 83, 48, 255, 112, 62, 45, 255, 34, 25, 28, 255, 43, 33, 36, 255, 43, 33, 36, 255, 34, 25, 28, 255, 43, 33, 36, 255, 34, 25, 28, 255, 34, 25, 28, 255, 34, 25, 28, 255, 55, 46, 36, 255, 55, 46, 36, 255, 112, 62, 45, 255, 112, 62, 45, 255, 55, 46, 36, 255, 55, 46, 36, 255, 43, 33, 36, 255, 112, 62, 45, 255];

  xs.Probe = Probe;
}(MODULES.axis));