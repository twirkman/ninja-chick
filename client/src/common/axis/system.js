/* Adapted from...
* Ticker
* Visit http://createjs.com/ for documentation, updates and examples.
*
* Copyright (c) 2010 gskinner.com, inc.
*
* Permission is hereby granted, free of charge, to any person
* obtaining a copy of this software and associated documentation
* files (the "Software"), to deal in the Software without
* restriction, including without limitation the rights to use,
* copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the
* Software is furnished to do so, subject to the following
* conditions:
*
* The above copyright notice and this permission notice shall be
* included in all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
* EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
* OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
* NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
* HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
* WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
* FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
* OTHER DEALINGS IN THE SOFTWARE.
*/

(function(xs) {

  var System = xs.Class.extend({
            
    _listeners: null,
    _started: false,
    _paused: false,
    _pausedTime: 0,
    _deadTime: 0,
    _lastTime: 0,
    _ticks: 0,
    _times: null,
  
    init: function() {
      this._times = [];
      this._listeners = {};
      this._boundTick = this._tick.bind(this);
    },
    
    startClock: function() {
      this._pausedTime = 0;
      this._deadTime = 0;
      this._ticks = 0;
      this._times.length = 0;
      this._started = true;
      requestAnimationFrame(this._boundTick);
    },
  
  	addEventListener: function(type, listener) {
      var listeners, arr;
      listeners = this._listeners;
      this.removeEventListener(type, listener);
      arr = listeners[type];
      if (!arr) { arr = listeners[type] = []; }
      arr.push(listener);
      if (!this._started) { this.startClock(); }
      return listener;
    },
  
    removeEventListener: function(type, listener) {
      var i, l, listeners, arr;
      listeners = this._listeners;
      arr = listeners[type];
      if (!arr) { return; }
      for (i = 0, l = arr.length; i < l; i++) {
        if (arr[i] == listener) {
          if (l == 1) { delete(listeners[type]); }
          else { arr.splice(i, 1); }
          break;
        }
      }
    },
  
    removeAllEventListeners: function(type) {
      if (!type) { this._listeners = {}; }
      else { delete(this._listeners[type]); }
    },
  
    dispatchEvent: function(eventObj, target) {
      var ret = false, listeners = this._listeners;
      if (eventObj && listeners) {
        if (typeof eventObj == "string") { eventObj = {type: eventObj}; }
        var arr = listeners[eventObj.type];
        if (!arr) { return ret; }
        eventObj.target = target||this;
        arr = arr.slice();
        for (var i = 0, l = arr.length; i < l; i++) {
          var o = arr[i];
          if (o.handleEvent) { ret = ret || o.handleEvent(eventObj); }
          else { ret = ret || o(eventObj); }
        }
      }
      return !!ret;
    },
  
    hasEventListener: function(type) {
      return !!(this._listeners[type]);
    },
  
    getFPS: function(ticks) {
      if (this._times.length < 2) { return -1; }
      if (!ticks) { ticks = this._times.length - 1; }
      else { ticks = Math.min(this._times.length - 1, ticks); }
      return (1 / ((this._times[0] - this._times[ticks]) / ticks));
    },
  
    setPaused: function(value) {
      this._paused = value;
    },
  
    getPaused: function() {
      return this._paused;
    },
  
    getTicks: function(runTicks) {
      return  this._ticks - (runTicks ? this._pausedTicks : 0);
    },
  
    _tick: function(time) {
      var seconds, elapsed;
      requestAnimationFrame(this._boundTick);
      
      seconds = time / 1000;
      elapsed = seconds - this._lastTime;
      
      this._ticks++;
      if (this._paused) {
        this._pausedTicks++;
        this._pausedTime += elapsed;
      }
      
      if (elapsed > System.maxStep) {
        this._deadTime += elapsed - System.maxStep;
        elapsed = System.maxStep;
      }
      
      this.dispatchEvent({
        type: "tick",
        paused: this._paused,
        delta: elapsed,
        time: seconds,
        runTime: seconds - this._pausedTime - this._deadTime
      });
      
      this._lastTime = seconds;
      this._times.unshift(seconds - this._deadTime);
      while (this._times.length > 100) { this._times.pop(); }
    }
  });
  
  System.maxStep = 0.05;

  xs.System = System;
}(MODULES.axis));