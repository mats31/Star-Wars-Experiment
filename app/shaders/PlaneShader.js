import THREE from 'three';

export default class PlaneShader {

	constructor() {

    this.uniforms = THREE.UniformsUtils.merge([
      THREE.UniformsLib.common,
      THREE.UniformsLib.aomap,
      THREE.UniformsLib.lightmap,
      THREE.UniformsLib.emissivemap,
      THREE.UniformsLib.bumpmap,
      THREE.UniformsLib.normalmap,
      THREE.UniformsLib.displacementmap,
      THREE.UniformsLib.fog,
      THREE.UniformsLib.lights,
      THREE.UniformsLib.shadowmap,
      {
    		'ambient': {
          type: 'c',
          value: new THREE.Color(0xffffff),
        },
        'emissive': {
          type: 'c',
          value: new THREE.Color(0x000000),
        },
        'specular': {
          type: 'c',
          value: new THREE.Color(0x111111),
        },
        'shininess': {
          type: 'f',
          value: 30,
        },
        'map': {
          type: 't',
          value: null,
        },
        'noise': {
          type: 't',
          value: null,
        },
    	},
		]);

    this.vertexShader = [
      '#define PHONG',
      '#define USE_MAP',

      'varying vec3 vViewPosition;',

      '#ifndef FLAT_SHADED',

      ' varying vec3 vNormal;',

      '#endif',

      // CUSTOM SHADER //
      ' uniform sampler2D noise;',

      THREE.ShaderChunk.common,
      THREE.ShaderChunk.uv_pars_vertex,
      THREE.ShaderChunk.uv2_pars_vertex,
      THREE.ShaderChunk.displacementmap_pars_vertex,
      THREE.ShaderChunk.envmap_pars_vertex,
      THREE.ShaderChunk.lights_phong_pars_vertex,
      THREE.ShaderChunk.color_pars_vertex,
      THREE.ShaderChunk.morphtarget_pars_vertex,
      THREE.ShaderChunk.skinning_pars_vertex,
      THREE.ShaderChunk.shadowmap_pars_vertex,
      THREE.ShaderChunk.logdepthbuf_pars_vertex,

      'void main() {',

      THREE.ShaderChunk.uv_vertex,
      THREE.ShaderChunk.uv2_vertex,
      THREE.ShaderChunk.color_vertex,
      THREE.ShaderChunk.beginnormal_vertex,
      THREE.ShaderChunk.morphnormal_vertex,
      THREE.ShaderChunk.skinbase_vertex,
      THREE.ShaderChunk.skinnormal_vertex,
      THREE.ShaderChunk.defaultnormal_vertex,

      '#ifndef FLAT_SHADED', // Normal computed with derivatives when FLAT_SHADED

      ' vNormal = normalize( transformedNormal );',

      '#endif',

      THREE.ShaderChunk.begin_vertex,
      THREE.ShaderChunk.displacementmap_vertex,
      THREE.ShaderChunk.morphtarget_vertex,
      THREE.ShaderChunk.skinning_vertex,
      THREE.ShaderChunk.project_vertex,
      THREE.ShaderChunk.logdepthbuf_vertex,
      /* ----- Custom Shader --- */
      ' vUv = uv;',

      ' mvPosition = modelViewMatrix * vec4( position.x, position.y * (texture2D( noise, uv ).x), position.z, 1.0 );',

      ' gl_Position = projectionMatrix * mvPosition;',
      /* -------- */

      ' vViewPosition = - mvPosition.xyz;',

      THREE.ShaderChunk.worldpos_vertex,
      THREE.ShaderChunk.envmap_vertex,
      THREE.ShaderChunk.lights_phong_vertex,
      THREE.ShaderChunk.shadowmap_vertex,

      '}',

    ].join( '\n' );

    this.fragmentShader = [

      '#define PHONG',
      '#define USE_MAP',

      'uniform vec3 diffuse;',
      'uniform vec3 emissive;',
      'uniform vec3 specular;',
      'uniform float shininess;',
      'uniform float opacity;',

      // // ** CUSTOM SHADER ** //
      // 'uniform sampler2D map;',
      // 'varying vec2 vUv;',

      THREE.ShaderChunk.common,
      THREE.ShaderChunk.color_pars_fragment,
      THREE.ShaderChunk.uv_pars_fragment,
      THREE.ShaderChunk.uv2_pars_fragment,
      THREE.ShaderChunk.map_pars_fragment,
      THREE.ShaderChunk.alphamap_pars_fragment,
      THREE.ShaderChunk.aomap_pars_fragment,
      THREE.ShaderChunk.lightmap_pars_fragment,
      THREE.ShaderChunk.emissivemap_pars_fragment,
      THREE.ShaderChunk.envmap_pars_fragment,
      THREE.ShaderChunk.fog_pars_fragment,
      THREE.ShaderChunk.lights_phong_pars_fragment,
      THREE.ShaderChunk.shadowmap_pars_fragment,
      THREE.ShaderChunk.bumpmap_pars_fragment,
      THREE.ShaderChunk.normalmap_pars_fragment,
      THREE.ShaderChunk.specularmap_pars_fragment,
      THREE.ShaderChunk.logdepthbuf_pars_fragment,

      'void main() {',

      ' vec3 outgoingLight = vec3( 0.0 );',
      ' vec4 diffuseColor = vec4( diffuse, opacity );',
      ' vec3 totalAmbientLight = ambientLightColor;',
      ' vec3 totalEmissiveLight = emissive;',
      ' vec3 shadowMask = vec3( 1.0 );',

      // ** CUSTOM SHADER ** //

      THREE.ShaderChunk.logdepthbuf_fragment,
      THREE.ShaderChunk.map_fragment,
      THREE.ShaderChunk.color_fragment,
      THREE.ShaderChunk.alphamap_fragment,
      THREE.ShaderChunk.alphatest_fragment,
      THREE.ShaderChunk.specularmap_fragment,
      THREE.ShaderChunk.normal_phong_fragment,
      THREE.ShaderChunk.lightmap_fragment,
      THREE.ShaderChunk.hemilight_fragment,
      THREE.ShaderChunk.aomap_fragment,
      THREE.ShaderChunk.emissivemap_fragment,
      THREE.ShaderChunk.lights_phong_fragment,
      THREE.ShaderChunk.shadowmap_fragment,

      'totalDiffuseLight *= shadowMask;',
      'totalSpecularLight *= shadowMask;',

      '#ifdef METAL',

      ' outgoingLight += diffuseColor.rgb * ( totalDiffuseLight + totalAmbientLight ) * specular + totalSpecularLight + totalEmissiveLight;',

      '#else',

      ' outgoingLight += diffuseColor.rgb * ( totalDiffuseLight + totalAmbientLight ) + totalSpecularLight + totalEmissiveLight;',

      '#endif',

      THREE.ShaderChunk.envmap_fragment,
      THREE.ShaderChunk.linear_to_gamma_fragment,
      THREE.ShaderChunk.fog_fragment,

      ' gl_FragColor = vec4( outgoingLight, diffuseColor.a );',

      '}',

    ].join( '\n' );
  }
}
