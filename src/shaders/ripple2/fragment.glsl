uniform float uTime;
uniform vec2 uResolution;

varying vec2 vUv;

void main() {
  vec2 st = vUv;
  vec2 center = vec2(0.5);
  float dist = distance(st, center);
  
  float wave = sin(dist * 50.0 - uTime * 9.0) * 0.5 + 0.5;
  
  vec3 color = mix(
    vec3(0.3608, 0.4824, 0.6),
    vec3(0.4824, 0.4824, 0.5686),
    wave
  );
  
  gl_FragColor = vec4(color, 1.0);
}
