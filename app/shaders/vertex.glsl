#pragma glslify: pnoise = require(glsl-noise/periodic/3d)

varying vec2 vUv;
varying float noise;
uniform float time;
uniform float move;
uniform float ice;
uniform float space;

float turbulence( vec3 p ) {
    float w = 100.0;
    float t = -.5;
    for (float f = 1.0 ; f <= 10.0 ; f++ ){
        float power = pow( 2.0, f );
        t += abs( pnoise( vec3( power * p ), vec3( 10.0, 10.0, 10.0 ) ) / power );
    }
    return t;
}

void main() {
    vUv = uv;

    noise = (ice + 0.5) *  -.10 * turbulence( .5 * normal + time );
    float b = ( space + 0.4) * pnoise( 0.05 * position + vec3( 0.2 * time ), vec3( 0.1 ) );
    float displacement = (move + - .1) * noise + b;

    vec3 newPosition = position + normal * displacement;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, .1 );
}
