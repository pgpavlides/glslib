uniform float uTime;
uniform vec2 uResolution;

varying vec2 vUv;

void main() {
  vec2 st = vUv;
  
  // Create a gradient based on uv coordinates
  vec3 colorA = vec3(0.149, 0.141, 0.912);
  vec3 colorB = vec3(1.000, 0.833, 0.224);
  
  // Use the sin of time to create movement
  float pct = sin(uTime) * 0.5 + 0.5;
  
  // Mix between two colors
  vec3 color = mix(colorA, colorB, sin(st.x * 3.14159 + uTime) * 0.5 + 0.5);
  
  gl_FragColor = vec4(color, 1.0);
}
