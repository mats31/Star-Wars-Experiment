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
gui.add(webgl.vignette.params, 'boost' ).min(0).max(10);
gui.add(webgl.vignette.params, 'reduction' ).min(0).max(10);
gui.add(webgl.bloomPass.params, 'blendMode' ).min(0).max(10);
gui.add(webgl.bloomPass.params, 'blurAmount' ).min(0).max(10);
gui.add(webgl.params, 'volume' ).min(0).max(1);

// gui.add(webgl.hemiLight, 'intensity' ).min(0).max(10);
// gui.add(webgl.hemiLight.position, 'x' ).min(0).max(1000);
// gui.add(webgl.hemiLight.position, 'y' ).min(0).max(1000);
// gui.add(webgl.hemiLight.position, 'z' ).min(0).max(1000);

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

function onDocumentClick(e) {
  webgl.attackSaber(e);
}

// handle resize
window.addEventListener('resize', resizeHandler);

// Mouse move
window.addEventListener('mousemove', onDocumentMouseMove);

// Mouse click
window.addEventListener('click', onDocumentClick);

// Tests tab active
window.onfocus = function onFocus() {
  webgl.tabIsActive = true;
};

window.onblur = function onBlur() {
  webgl.tabIsActive = false;
};

// let's play !
animate();
