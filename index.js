import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import Overlay from 'ol/Overlay.js';
import TileLayer from 'ol/layer/Tile';
import XYZSource from 'ol/source/XYZ';
import OSM from 'ol/source/OSM';
import {toStringHDMS} from 'ol/coordinate.js';
import {fromLonLat} from 'ol/proj';
import {toLonLat} from 'ol/proj.js';
import DragAndDrop from 'ol/interaction/DragAndDrop';

var defaultCoord = [0, 0];

/**
 * Elements that make up the popup.
 */
var container = document.getElementById('popup');
var content = document.getElementById('popup-content');
var closer = document.getElementById('popup-closer');


/**
 * Create an overlay to anchor the popup to the map.
 */
var overlay = new Overlay({
  element: container,
  autoPan: true,
  autoPanAnimation: {
    duration: 250
  }
});

const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM()
    })
    // new TileLayer({
    //   source: new XYZSource({
    //     url: 'http://tile.stamen.com/terrain/{z}/{x}/{y}.jpg'
    //   })
    // })
  ],
  overlays: [overlay],
  view: new View({
    center: defaultCoord,
    zoom: 2
  })
});

function onClick(id, callback) {
  document.getElementById(id).addEventListener('click', callback);
}

onClick('yourLocation', function() {
  navigator.geolocation.getCurrentPosition(function(pos) {
    console.log(pos);
    const coords = fromLonLat([pos.coords.longitude, pos.coords.latitude]);
    map.getView().animate({center: coords, zoom: 12, duration: 1000});
  });
});
onClick('defaultLocation', function() {
  map.getView().animate({center: defaultCoord, zoom: 2, duration: 1000});
});


 

/**
 * Add a click handler to the map to render the popup.
 */
map.on('singleclick', function(evt) {
  var coordinate = evt.coordinate;
  var hdms = toStringHDMS(toLonLat(coordinate));

  content.innerHTML = '<p>You clicked here:</p><code>' + hdms +
      '</code>';
  overlay.setPosition(coordinate);
});

 /**
 * Add a click handler to hide the popup.
 * @return {boolean} Don't follow the href.
 */
closer.onclick = function() {
  overlay.setPosition(undefined);
  closer.blur();
  return false;
};