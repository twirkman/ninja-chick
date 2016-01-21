window.MODIT = window.MODIT || {};
(function(window) {

  var WIUI = WIUI || {};

  // list of css properties that are supposed to be numerical values
  // anything not in this list will have px added to it by setStyle
  // if its value is an integer
  var integerAttributes = ['zIndex', 'fontWeight', 'opacity'];

  WIUI.setStyle = function(el, styleObj) {
    if(styleObj instanceof Array) {
      for(var i = 0; i < styleObj.length; i++) {
        WIUI.setStyle(el, styleObj[i]);
      }
    } else {
      for(var x in styleObj) {
        if(parseFloat(styleObj[x]) == styleObj[x] &&
           integerAttributes.indexOf(x) == -1) {
          styleObj[x] = styleObj[x] + 'px';
        }
        el.style[x] = styleObj[x];
      }
    }
  };

  /**
   * Removes all the given style properties from the object
   * @param el {HTMLElement} the element to clear style on
   * @param styleObj {Obj} an object with attributes for each style to clear
   */
  WIUI.clearStyle = function(el, styleObj) {
     if(styleObj instanceof Array) {
      for(var i = 0; i < styleObj.length; i++) {
        WIUI.clearStyle(el, styleObj[i]);
      }
    } else {
      for(var x in styleObj) {
        el.style[x] = null;
      }
    }
  };

  WIUI.createElement = function(type, styleObj) {
    var el = document.createElement(type);
    if(styleObj) {
      WIUI.setStyle(el, styleObj);
    }
    return el;
  };

  WIUI.addElement = function(div, type, styleObj) {
    var el = WIUI.createElement(type, styleObj);
    div.appendChild(el);
    return el;
  };


  /**
   * Returns an img tag with the given src, style and onload function
   * @param src {String} the src for the image
   * @param style {Obj} style object to apply to the image
   * @param onload {function} function to call onload
   * @return {img} the created img tag
   */
  WIUI.createImage = function(src, style, onload) {
    var image = WIUI.createElement('img', style);
    image.onload = onload;
    image.src = src;
    return image;
  };



  WIUI.addEventListener = function(name, onevent, context, win) {
    var wind = win;
    if(!wind) {
      wind = window;
    }
    wind.addEventListener(name, function() {
      onevent.apply(context);
    });
  };



  MODIT.ui = WIUI;
}(window));