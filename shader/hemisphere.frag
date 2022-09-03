
uniform float time;
uniform samplerCube cubeTexture;
// uniform sampler2D uTexture;
// uniform vec3 cameraPosition;

varying vec3 vNormal;
varying vec2 vUv;
varying vec3 vPosition;

const vec3 dLight = normalize(vec3(0.5, 0.2, 1.0));

void main() {
  // float d = dot(vNormal, dLight);

  vec3 eyeDirection = normalize(vPosition - cameraPosition);
  vec3 normal = normalize(vNormal);
  // float eta = 1.0 / 1.00001;
  vec3 refractVec = reflect(eyeDirection, normal);

  vec4 envColor = textureCube(cubeTexture, refractVec);
  envColor.a = 0.05;
  // vec4 _color = vec4(vec3(envColor.a), 1.);
  // vec4 _test = texture2D(uTexture, vUv);
  gl_FragColor = envColor;
  // gl_FragColor = _test;
  // gl_FragColor = _color;
  // gl_FragColor = vec4(refractVec, 1.0);
  // gl_FragColor = vec4(vec3(vUv, 0.), 0.5 );
}
