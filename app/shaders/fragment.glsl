varying vec2 vUv;
varying float noise;
uniform sampler2D tSnow;

float random( vec3 scale, float seed ){
  return fract( sin( dot( gl_FragCoord.xyz + seed, scale ) ) * 43758.5453 + seed ) ;
}

void main() {
  float r = .005 * random( vec3( 1.0, 1.2, 1.5 ), 0.0 );
  vec2 tPos = vec2( 1.2, 1.0 - 1.3 * noise + r );
  //vec2 tPos = vec2( 1.2, 0.8 - 1.3 * noise + r );
  vec4 color = texture2D( tSnow, tPos );
  gl_FragColor = vec4( color.rgb, 1.0 );
}
