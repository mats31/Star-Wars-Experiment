import Webgl from './Webgl';
import raf from 'raf';
import dat from 'dat-gui';
import 'gsap';

let webgl;
let gui;

// webgl settings
webgl = new Webgl(window.innerWidth, window.innerHeight);
document.body.appendChild(webgl.renderer.domElement);

// GUI settings
gui = new dat.GUI();
gui.add(webgl.params, 'usePostprocessing');

function animate() {
  raf(animate);

  webgl.render();
}

function resizeHandler() {
  webgl.resize(window.innerWidth, window.innerHeight);
}

function onDocumentMouseMove(e) {
  webgl.moveSaber(e);
}

// handle resize
window.addEventListener('resize', resizeHandler);

// Mouse down
window.addEventListener('mousemove', onDocumentMouseMove);

// let's play !
animate();
