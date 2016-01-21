(function(xs, ui) {
  
  var View = xs.Class.extend({
  
    DEFAULTS: {
      width: 1136,
      height: 640
    },
    
    bodyStyle: {
      margin: '0px',
      padding: '0px',
      border: 'none',
    },
    
    centerStyle: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      backgroundColor: '#fff'
    },
    
    style: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      backgroundColor: '#000',
      overflow: 'hidden',
    },
    
    canvasStyle: {
      width: '100%',
      height: '100%'
    },
        
    _resizePending: false,

    init: function(settings) {
      xs.merge(this, settings);
      ui.addEventListener('resize', this.resize, this);
      ui.addEventListener('orientationchange', this.resize, this);
      ui.setStyle(document.body, this.bodyStyle);
      this.parent = this.parent ||
                    ui.addElement(document.body, 'div', this.style);
      this.div = ui.addElement(this.parent, 'div', this.centerStyle);
      this.canvas = ui.addElement(this.div, 'canvas', this.canvasStyle);
      this._handleResize();
    },
    
    tick: function(e) {
      if (this._resizePending) {
        this._resizePending = false;
        this._handleResize();
      }
    },

    resize: function() {
      this._resizePending = true;
    },
    
    _handleResize: function() {
      var scale,
          rect = this.parent.getBoundingClientRect(),
          w = rect.width,
          h = rect.height;
          
      this.aspectRatio = this.width / this.height;
      if (this.aspectRatio < w / h) { w = h * this.aspectRatio; }
      
      scale = w / this.width;
      this._resizeCanvas(scale);
    },

    _resizeCanvas: function(scale) {
      var w, h, power = 15;

      switch (xs.render) {
        case xs.RENDER.CRISP:
          if (scale >= 1) {
            scale = Math.floor(scale);
            break;
          }
          while (scale < power / 16) { power--; }
          scale = power / 16;
          break;
        case xs.RENDER.SMOOTH:
          break;
      }
      
      w = Math.round(this.width * scale);
      h = Math.round(this.height * scale);
      
      //if (scale * xs.pixelRatio >= 1 && xs.scaling == xs.SCALING.CSS) {
      //  this.canvas.width = this.width
      //  this.canvas.height = this.height;
      //} else {
        this.canvas.width = w * xs.pixelRatio;
        this.canvas.height = h * xs.pixelRatio;
      //}
      
      xs.scale = this.canvas.width / this.width;
      
      ui.setStyle(this.div, {
        width: w + 'px',
        height: h + 'px',
        marginTop: -h / 2 + 'px',
        marginLeft: -w / 2 + 'px',
        fontSize: xs.scale + 'em'
      });
      
      xs.system.dispatchEvent({type: 'resize'});
    }
  });
  
  xs.View = View;
}(MODULES.axis, MODULES.ui));