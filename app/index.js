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

// Tests tab active
window.onfocus = function onFocus() {
  webgl.tabIsActive = true;
};

window.onblur = function onBlur() {
  webgl.tabIsActive = false;
};

document.getElementById('start').addEventListener('click', () => {
  document.querySelector('.light1').className = 'light light1';
  document.querySelector('.light2').className = 'light light2';
  document.querySelector('.light3').className = 'light light3';
  document.querySelector('.light4').className = 'light light4';
  document.querySelector('.title').className = 'title';
  document.querySelector('.description').className = 'description';
  document.querySelector('.presentation').className = 'presentation disable';
  setTimeout(() => {
    document.querySelector('.presentation').parentNode.removeChild(document.querySelector('.presentation'));
  }, 1600);
  webgl.startExperiment();
});

// let's play !
animate();
