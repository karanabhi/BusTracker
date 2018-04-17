// Brunch automatically concatenates all files in your
// watched paths. Those paths can be configured at
// config.paths.watched in "brunch-config.js".
//
// However, those files will only be executed if
// explicitly imported. The only exception are files
// in vendor, which are never wrapped in imports and
// therefore are always executed.

// Import dependencies
//
// If you no longer want to use a dependency, remember
// to also remove its path from "config.paths.watched".
import "phoenix_html"

// Import local files
//
// Local files can be imported directly using relative
// paths "./socket" or full ones "web/static/js/socket".

import socket from "./socket"
import api from './api';
import main_init from "./components/main";
import store from './store';


function init() {
  let root = document.getElementById('tracker');

  if(root){
  // Now that you are connected, you can join c;hannels with a topic:
    let channel = socket.channel("tracker:lobby", {});
    main_init(root,channel,store);
    // if(document.getElementById('map-canvas')){
    //   initMap();
    // }
  }
}

$(init);
