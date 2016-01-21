(function(xs) {
  
  var Input = xs.Class.extend({
    
    kibo: null,
    
    _state: null,
    _pressed: null,
    _released: null,
    
    init: function() {
      this.kibo = new Kibo();
      
      this._state = {};
      this._pressed = {};
      this._released = {};
    },
    
    clear: function() {
      this._pressed = {};
      this._released = {};
    },
    
    bind: function(keys, action) {
      this.kibo.down(keys, this._setter(action, true));
      this.kibo.up(keys, this._setter(action, false));
    },
    
    unbind: function(keys) {
      this.kibo.down(keys);
      this.kibo.up(keys);
    },
    
    state: function(action) {
      return this._state[action];
    },
    
    pressed: function(action) {
      return this._pressed[action];
    },
    
    released: function(action) {
      return this._released[action];
    },
    
    _setter: function(action, down) {
      var self = this;
      return function() {
        self._state[action] || (down && (self._pressed[action] = true));
        self._state[action] && (down || (self._released[action] = true));
        self._state[action] = down;
      }
    }
    
  });

  xs.Input = Input;
}(MODULES.axis));