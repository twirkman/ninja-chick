/* based on
 * Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */
(function(xs) {
  
  //TODO - add class props to subclass
  
  var Class,
      initializing = false,
      fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
 
  Class = function() {};
 
  Class.extend = function(prop) {
    var _super = this.prototype;
   
    initializing = true;
    var prototype = new this();
    initializing = false;
   
    for (var name in prop) {
      if (name == 'DEFAULTS') {
        var clone = prototype[name] ? xs.clone(prototype[name]) : {};
        prototype[name] = xs.merge(clone, prop[name]);
      } else {
        prototype[name] = typeof prop[name] == "function" &&
          typeof _super[name] == "function" && fnTest.test(prop[name]) ?
          (function(name, fn){
            return function() {
              var tmp = this._super;
             
              this._super = _super[name];
             
              var ret = fn.apply(this, arguments);
              this._super = tmp;
             
              return ret;
            };
          })(name, prop[name]) :
          prop[name];
      }
    }
   
    function Class() {
      if (!initializing && this.init) {
        this.DEFAULTS && xs.merge(this, this.DEFAULTS);
        this.init.apply(this, arguments);
      }
    }
    
    Class.prototype = prototype;
    Class.prototype.constructor = Class;
    Class.extend = arguments.callee;
    
    return Class;
  };
  
  xs.Class = Class;
})(MODULES.axis);