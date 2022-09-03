
uniform float time;
// uniform samplerCube cubeTexture;
uniform sampler2D uTexture;
uniform float uScale;
// uniform vec3 cameraPosition;

varying vec3 vNormal;
varying vec2 vUv;
varying vec3 vPosition;

const vec3 dLight = normalize(vec3(0.5, 0.2, 1.0));

void main() {
  vec2 _uv = vUv * 2. - 1.;

  // _uv -= 0.5;
  // _uv *= (1. - min(length(vec2(0.5)) * 5., 1.)) * 5.;
  // _uv *= distance;
  // _uv = _uv * uScale;
  // _uv /= 4.2;
  vec2 center = _uv; // vec2(0., 0.);
  vec2 point = gl_FragCoord.xy;
  // _uv += 0.5;
  // float distance = length(vec2(center));

  // vec4 _test = texture2D(uTexture, _uv);
  // _test.r *= distance;

  float t = ceil(0.5 - length(_uv));
  vec4 color = vec4(vec3(0.0, 0.0, t), t);

  gl_FragColor = color;
}
