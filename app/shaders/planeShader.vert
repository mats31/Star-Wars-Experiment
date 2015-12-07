uniform sampler2D noise;
varying vec2 vUv;

void main() {
  vUv = uv;

  vec4 mvPosition = modelViewMatrix * vec4( position.x, position.y * (texture2D( noise, uv ).x), position.z, 1.0 );

  gl_Position = projectionMatrix * mvPosition;

}
