uniform float uTime;
uniform vec2 uResolution;

varying vec2 vUv;

// 2D Random
float random (in vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

// 2D Noise based on Morgan McGuire
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // Smooth Interpolation
    vec2 u = smoothstep(0.0, 1.0, f);

    // Mix 4 corners percentages
    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

void main() {
    vec2 st = vUv;
    
    // Scale the coordinate system to see some noise
    vec2 pos = vec2(st * 5.0);
    pos.x += uTime * 0.5;
    
    // Use the noise function
    float n = noise(pos);
    
    // Colorize
    vec3 color = mix(
      vec3(0.2, 0.5, 0.7),
      vec3(0.9, 0.4, 0.1),
      n
    );
    
    gl_FragColor = vec4(color, 1.0);
}
