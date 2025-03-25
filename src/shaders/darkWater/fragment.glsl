uniform float uTime;
uniform vec2 uResolution;

varying vec2 vUv;

// Simple water effect shader
void main() {
  // Basic parameters
  float time = uTime * 0.4;
  vec2 uv = vUv;
  
  // Create a centered coordinate system
  vec2 p = uv * 2.0 - 1.0;

  // Calculate distance from center
  float dist = length(p);
  
  // Create ripple effect
  float ripple1 = sin(dist * 10.0 - time * 2.0) * 0.5 + 0.5;
  float ripple2 = sin(dist * 15.0 - time * 1.5) * 0.5 + 0.5;
  float ripple3 = sin(dist * 5.0 - time * 1.0) * 0.5 + 0.5;
  
  // Mix ripples
  float ripples = mix(ripple1, ripple2, 0.5);
  ripples = mix(ripples, ripple3, 0.3);
  
  // Color palette - dark blue tones
  vec3 baseColor = vec3(0.05, 0.1, 0.2);         // Deep dark blue
  vec3 midColor = vec3(0.1, 0.2, 0.3);           // Mid blue
  vec3 highlightColor = vec3(0.2, 0.4, 0.6);     // Highlight blue
  
  // Create color gradient based on ripples
  vec3 color = mix(baseColor, midColor, ripples);
  color = mix(color, highlightColor, ripples * ripples * 0.3);
  
  // Add vignette effect
  float vignette = 1.0 - smoothstep(0.5, 1.5, dist);
  color = mix(vec3(0.02, 0.05, 0.1), color, vignette);
  
  gl_FragColor = vec4(color, 1.0);
}
