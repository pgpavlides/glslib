uniform float uTime;
uniform vec2 uResolution;

varying vec2 vUv;

void main() {
  vec2 st = vUv;
  
  // Your shader code here
  vec3 color = vec3(st.x, st.y, abs(sin(uTime)));
  
  gl_FragColor = vec4(color, 1.0);
}
