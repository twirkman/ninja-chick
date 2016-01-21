// TODO - decide on a module pattern
window.MODIT = window.MODIT || {};
var MODULES = {
  ui: MODIT.ui,
  axis: {},
  my: {},
};

(function(my, xs, ui) {

  this.main = function() {
    xs.start(my.Game);
  };

  var images = [
    { id: "bamboo-edge", src: "bamboo-edge.png", type: createjs.LoadQueue.TEXT },
    { id: "bamboo", src: "bamboo.png", type: createjs.LoadQueue.TEXT },
    { id: "brick", src: "brick.png", type: createjs.LoadQueue.TEXT },
    { id: "door-b", src: "door-b.png", type: createjs.LoadQueue.TEXT },
    { id: "door-t", src: "door-t.png", type: createjs.LoadQueue.TEXT },
    { id: "feather", src: "feather.png", type: createjs.LoadQueue.TEXT },
    { id: "flag", src: "flag.png", type: createjs.LoadQueue.TEXT },
    { id: "fuji", src: "fuji.jpg", type: createjs.LoadQueue.TEXT },
    { id: "grass-brick", src: "grass-brick.png", type: createjs.LoadQueue.TEXT },
    { id: "hills", src: "hills.png", type: createjs.LoadQueue.TEXT },
    { id: "houses", src: "houses.png", type: createjs.LoadQueue.TEXT },
    { id: "idle", src: "idle.png", type: createjs.LoadQueue.TEXT },
    { id: "jumping", src: "jumping.png", type: createjs.LoadQueue.TEXT },
    { id: "panel-b", src: "panel-b.png", type: createjs.LoadQueue.TEXT },
    { id: "panel-t", src: "panel-t.png", type: createjs.LoadQueue.TEXT },
    { id: "roof-b", src: "roof-b.png", type: createjs.LoadQueue.TEXT },
    { id: "roof-edge-br", src: "roof-edge-br.png", type: createjs.LoadQueue.TEXT },
    { id: "roof-edge-t", src: "roof-edge-t.png", type: createjs.LoadQueue.TEXT },
    { id: "roof-edge-tr", src: "roof-edge-tr.png", type: createjs.LoadQueue.TEXT },
    { id: "roof-end-r", src: "roof-end-r.png", type: createjs.LoadQueue.TEXT },
    { id: "roof-t", src: "roof-t.png", type: createjs.LoadQueue.TEXT },
    { id: "running", src: "running.png", type: createjs.LoadQueue.TEXT },
    { id: "sky", src: "sky.png", type: createjs.LoadQueue.TEXT },
    { id: "stone-edge-b", src: "stone-edge-b.png", type: createjs.LoadQueue.TEXT },
    { id: "stone-edge-lr", src: "stone-edge-lr.png", type: createjs.LoadQueue.TEXT },
    { id: "stone-edge-t", src: "stone-edge-t.png", type: createjs.LoadQueue.TEXT },
    { id: "stone-grass-edge-lr", src: "stone-grass-edge-lr.png", type: createjs.LoadQueue.TEXT },
    { id: "stone-grass-trans-x", src: "stone-grass-trans-x.png", type: createjs.LoadQueue.TEXT },
    { id: "stone-grass-trans", src: "stone-grass-trans.png", type: createjs.LoadQueue.TEXT },
    { id: "wall-edge-br", src: "wall-edge-br.png", type: createjs.LoadQueue.TEXT },
    { id: "wall-cling", src: "wall-cling.png", type: createjs.LoadQueue.TEXT },
    { id: "window-b", src: "window-b.png", type: createjs.LoadQueue.TEXT },
    { id: "window-t", src: "window-t.png", type: createjs.LoadQueue.TEXT }
  ];
  
  var assets = [
    { id: "level-data", src: "level-data.json", type: createjs.LoadQueue.JSON },
    { id: "level1", src: "level1.json", type: createjs.LoadQueue.JSON },
  ];
  
  // TODO - replace this MODIT image loading crap

  var queue = new createjs.LoadQueue();
  queue.on("complete", createImages);
  queue.setMaxConnections(20);
  queue.loadManifest(images, true, 'static/assets/');
  queue.loadManifest(assets, true, 'static/assets/');
  
  function createImages() {
    var i, image;
    MODIT.images = {};
    MODIT.imagesRdy = 0;
    for (i = 0; i < images.length; i++) {
      image = images[i];
      MODIT.images[image.id] = ui.createImage(queue.getResult(image.id), {}, checkDone);
    }
  }
  
  function checkDone() {
    MODIT.imagesRdy++;
    if (MODIT.imagesRdy == images.length) { main(); }
  }
  
  MODIT.getImage = function(id) {
    return MODIT.images[id];
  }
  
  MODIT.getJson = function(id) {
    return queue.getResult(id);
  }

}(MODULES.my, MODULES.axis, MODULES.ui));