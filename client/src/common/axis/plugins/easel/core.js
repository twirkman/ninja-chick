(function(xs) {

  var _images = [],
      _data = {images: [], frames: [], animations: null};

  xs.createScaledSpriteSheet = function(spriteSheet, scaleX, scaleY) {
    var scaleX, scaleY, numFrames, frame, imageData, scaledImage, anims, a,
        i, j, x, y, w, h, index, regX, regY;
    
    _data.images.length = 0;
    _data.frames.length = 0;
    _data.animations = {};
    
    numFrames = spriteSheet.getNumFrames();
    for (i = 0; i < numFrames; ++i) {
      frame = spriteSheet.getFrame(i);
      x = Math.round(frame.rect.x * scaleX);
      y = Math.round(frame.rect.y * scaleY);
      w = Math.round(frame.rect.width * scaleX);
      h = Math.round(frame.rect.height * scaleY);
      regX = Math.round(frame.regX * scaleX);
      regY = Math.round(frame.regY * scaleY);
      
      for (index = -1, j = 0; j < _data.images.length; ++j) {
        if (frame.image === _data.images[j]) {
          index = j;
          break;
        }
      }
      if (index == -1) {
        index = j;
        _data.images.push(frame.image);
      }
      
      _data.frames.push([x, y, w, h, index, regX, regY]);
    }
    
    for (i = 0; i < _data.images.length; ++i) {
      imageData = xs.getImageData(_data.images[i]);
      scaledImage = xs.createScaledImage(imageData, imageData.width * scaleX,
          imageData.height * scaleY);
      _data.images[i] = scaledImage;
    }
    
    anims = spriteSheet.getAnimations();
    for (i = 0; i < anims.length; ++i) {
      a = spriteSheet.getAnimation(anims[i]);
      if (a.next == null) a.next = false;
      _data.animations[a.name] = a;
    }
    
    return new createjs.SpriteSheet(_data);
  };

}(MODULES.axis));