uniform float uTime;
uniform vec2 uResolution;

varying vec2 vUv;

void main() {
  vec2 st = vUv;
  vec2 center = vec2(0.5);
  float dist = distance(st, center);
  
  float wave = sin(dist * 50.0 - uTime * 3.0) * 0.5 + 0.5;
  
  vec3 color = mix(
    vec3(0.0, 0.5, 1.0),
    vec3(0.0, 0.0, 0.5),
    wave
  );
  
  gl_FragColor = vec4(color, 1.0);
}
