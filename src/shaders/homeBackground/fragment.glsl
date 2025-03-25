uniform float uTime;
uniform vec2 uResolution;

varying vec2 vUv;

// Custom infinity shader based on original
precision highp float;
float gTime = 0.;
const float REPEAT = 5.0;

// Smoother sin function to prevent sudden movements
float smoothSin(float x) {
    return 0.5 * sin(x) * (1.0 + cos(x * 0.5));
}

// Smooth cubic transition function
float cubicEase(float t) {
    return t * t * (3.0 - 2.0 * t);
}

// Smoother quintic ease function
float quinticEase(float t) {
    return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

// Rotation matrix
mat2 rot(float a) {
    float c = cos(a), s = sin(a);
    return mat2(c,s,-s,c);
}

// Signed distance function for a sphere
float sdSphere(vec3 p, float r) {
    return length(p) - r;
}

// Signed distance function for a torus
float sdTorus(vec3 p, vec2 t) {
    vec2 q = vec2(length(p.xz) - t.x, p.y);
    return length(q) - t.y;
}

// Signed distance function for an octahedron
float sdOctahedron(vec3 p, float s) {
    p = abs(p);
    return (p.x + p.y + p.z - s) * 0.57735027;
}

// Custom shape function
float customShape(vec3 pos, float scale, float morphFactor) {
    pos *= scale;
    
    // Blend between different shapes based on time, using smoother transitions
    float sphere = sdSphere(pos, 0.3);
    float torus = sdTorus(pos, vec2(0.3, 0.1));
    float octahedron = sdOctahedron(pos, 0.4);
    
    // Smoother shape blending using quintic ease
    float blend1 = quinticEase(sin(morphFactor * 0.2) * 0.5 + 0.5);
    float blend2 = quinticEase(cos(morphFactor * 0.15) * 0.5 + 0.5);
    
    // Smooth blend between shapes
    float shape = mix(
        mix(sphere, torus, blend1),
        octahedron,
        blend2
    );
    
    return shape;
}

// Smooth blend function for shapes
float smin(float a, float b, float k) {
    float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
    return mix(b, a, h) - k * h * (1.0 - h);
}

// Create a set of shapes in a specific arrangement
float shape_set(vec3 pos, float time) {
    vec3 pos_origin = pos;
    float morphFactor = gTime * 0.15; // Reduced from 0.3 for smoother morphing
    
    // Use smoother sin functions and slower frequencies
    
    // Top shape
    pos = pos_origin;
    pos.y += smoothSin(gTime * 0.2) * 1.6; // Reduced amplitude and frequency
    pos.xz *= rot(gTime * 0.12); // Slower rotation
    float shape1 = customShape(pos, 1.8 - 0.3 * cubicEase(abs(sin(gTime * 0.15))), morphFactor);
    
    // Bottom shape
    pos = pos_origin;
    pos.y -= smoothSin(gTime * 0.18) * 1.6; // Slightly different frequency
    pos.xz *= rot(gTime * 0.14);
    float shape2 = customShape(pos, 1.8 - 0.3 * cubicEase(abs(sin(gTime * 0.17))), morphFactor + 1.0);
    
    // Left shape
    pos = pos_origin;
    pos.x += smoothSin(gTime * 0.17) * 1.7;
    pos.yz *= rot(gTime * 0.13);
    float shape3 = customShape(pos, 1.8 - 0.3 * cubicEase(abs(sin(gTime * 0.16))), morphFactor + 2.0);    
    
    // Right shape
    pos = pos_origin;
    pos.x -= smoothSin(gTime * 0.19) * 1.7;
    pos.yz *= rot(gTime * 0.15);
    float shape4 = customShape(pos, 1.8 - 0.3 * cubicEase(abs(sin(gTime * 0.18))), morphFactor + 3.0);    
    
    // Forward shape
    pos = pos_origin;
    pos.z += smoothSin(gTime * 0.16) * 1.8;
    pos.xy *= rot(gTime * 0.11);
    float shape5 = customShape(pos, 1.5, morphFactor + 4.0);    
    
    // Central shape
    pos = pos_origin;
    pos.xy *= rot(gTime * 0.09); // Slower rotation
    pos.yz *= rot(gTime * 0.07);
    float shape6 = customShape(pos, 0.8, morphFactor + 5.0);    
    
    // Combine all shapes with smooth union
    float k = 0.35; // Increased blend factor for smoother merging (was 0.2)
    float result = shape1;
    result = smin(result, shape2, k);
    result = smin(result, shape3, k);
    result = smin(result, shape4, k);
    result = smin(result, shape5, k);
    result = smin(result, shape6, k);
    
    return result;
}

float map(vec3 pos, float time) {
    return shape_set(pos, time);
}

void main() {
    // Convert from UV to screen coordinates
    vec2 fragCoord = vUv * uResolution;
    vec2 p = (fragCoord.xy * 2.0 - uResolution.xy) / min(uResolution.x, uResolution.y);
    
    // Setup camera with smoother movements
    vec3 ro = vec3(0., 0.0, uTime * 1.8); // Slowed down camera movement
    vec3 ray = normalize(vec3(p, 1.8));
    
    // Smoother camera rotations
    float camRotX = smoothSin(uTime * 0.03) * 1.5; // Reduced amplitude, slower frequency
    float camRotY = smoothSin(uTime * 0.02) * 0.2; // Very gentle y-rotation
    
    ray.xy = ray.xy * rot(camRotX);
    ray.yz = ray.yz * rot(camRotY);
    
    float t = 0.1;
    vec3 col = vec3(0.);
    float ac = 0.0;
    
    // Raymarch
    for (int i = 0; i < 90; i++) {
        vec3 pos = ro + ray * t;
        // Create infinite repeating space
        pos = mod(pos-2., 4.) - 2.;
        gTime = uTime - float(i) * 0.005; // Reduced time delta per step for smoother motion
        
        float d = map(pos, uTime);
        d = max(abs(d), 0.01);
        ac += exp(-d*20.); // Reduced glow factor for smoother appearance
        t += d * 0.6;
    }
    
    // Set colors based on accumulated values with smoother transitions
    col = vec3(0.2, 0.5, 0.8) * ac * 0.02; // Blue base color
    
    // Smoother color variations
    col.r += 0.2 * smoothSin(uTime * 0.25); // Slower, gentler red variation
    col.g += 0.15 * smoothSin(uTime * 0.2); // Using smoothSin instead of cos
    col.b += 0.4 + 0.15 * smoothSin(uTime * 0.15); // Slower blue variation
    
    // Smoother transparency pulsing
    float alpha = 1.0 - t * (0.02 + 0.01 * smoothSin(uTime * 0.15));
    
    gl_FragColor = vec4(col, alpha);
}