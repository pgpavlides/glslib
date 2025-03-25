uniform float uTime;
uniform vec2 uResolution;

varying vec2 vUv;

// Custom infinity shader based on original
precision highp float;
float gTime = 0.;
const float REPEAT = 5.0;

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
    
    // Blend between different shapes based on time
    float sphere = sdSphere(pos, 0.3);
    float torus = sdTorus(pos, vec2(0.3, 0.1));
    float octahedron = sdOctahedron(pos, 0.4);
    
    // Smooth blend between shapes
    float shape = mix(
        mix(sphere, torus, smoothstep(0.0, 1.0, sin(morphFactor) * 0.5 + 0.5)),
        octahedron,
        smoothstep(0.0, 1.0, cos(morphFactor) * 0.5 + 0.5)
    );
    
    return shape;
}

// Create a set of shapes in a specific arrangement
float shape_set(vec3 pos, float time) {
    vec3 pos_origin = pos;
    float morphFactor = gTime * 0.3;
    
    // Create 6 instances of the shape in different positions
    
    // Top shape
    pos = pos_origin;
    pos.y += sin(gTime * 0.4) * 2.0;
    pos.xz *= rot(gTime * 0.2);
    float shape1 = customShape(pos, 1.8 - abs(sin(gTime * 0.4)), morphFactor);
    
    // Bottom shape
    pos = pos_origin;
    pos.y -= sin(gTime * 0.4) * 2.0;
    pos.xz *= rot(gTime * 0.3);
    float shape2 = customShape(pos, 1.8 - abs(sin(gTime * 0.4)), morphFactor + 1.0);
    
    // Left shape
    pos = pos_origin;
    pos.x += sin(gTime * 0.4) * 2.0;
    pos.yz *= rot(gTime * 0.4);
    float shape3 = customShape(pos, 1.8 - abs(sin(gTime * 0.4)), morphFactor + 2.0);    
    
    // Right shape
    pos = pos_origin;
    pos.x -= sin(gTime * 0.4) * 2.0;
    pos.yz *= rot(gTime * 0.5);
    float shape4 = customShape(pos, 1.8 - abs(sin(gTime * 0.4)), morphFactor + 3.0);    
    
    // Forward shape
    pos = pos_origin;
    pos.z += sin(gTime * 0.4) * 2.0;
    pos.xy *= rot(gTime * 0.6);
    float shape5 = customShape(pos, 1.5, morphFactor + 4.0);    
    
    // Central shape
    pos = pos_origin;
    pos.xy *= rot(gTime * 0.7);
    pos.yz *= rot(gTime * 0.5);
    float shape6 = customShape(pos, 0.8, morphFactor + 5.0);    
    
    // Combine all shapes with smooth union
    float k = 0.2; // Blend factor
    float result = shape1;
    result = min(result, shape2);
    result = min(result, shape3);
    result = min(result, shape4);
    result = min(result, shape5);
    result = min(result, shape6);
    
    return result;
}

float map(vec3 pos, float time) {
    return shape_set(pos, time);
}

void main() {
    // Convert from UV to screen coordinates
    vec2 fragCoord = vUv * uResolution;
    vec2 p = (fragCoord.xy * 2.0 - uResolution.xy) / min(uResolution.x, uResolution.y);
    
    // Setup camera
    vec3 ro = vec3(0., 0.0, uTime * 3.0);
    vec3 ray = normalize(vec3(p, 1.8));
    ray.xy = ray.xy * rot(sin(uTime * 0.05) * 3.0);
    ray.yz = ray.yz * rot(sin(uTime * 0.03) * 0.3);
    
    float t = 0.1;
    vec3 col = vec3(0.);
    float ac = 0.0;
    
    // Raymarch
    for (int i = 0; i < 90; i++) {
        vec3 pos = ro + ray * t;
        // Create infinite repeating space
        pos = mod(pos-2., 4.) - 2.;
        gTime = uTime - float(i) * 0.008;
        
        float d = map(pos, uTime);
        d = max(abs(d), 0.01);
        ac += exp(-d*25.); // Glow factor
        t += d * 0.6;
    }
    
    // Set colors based on accumulated values
    col = vec3(0.2, 0.5, 0.8) * ac * 0.02; // Blue base color
    
    // Add color variation
    col.r += 0.3 * sin(uTime * 0.7); // Red variation
    col.g += 0.2 * cos(uTime * 0.5); // Green variation
    col.b += 0.4 + 0.2 * sin(uTime * 0.3); // Blue variation
    
    gl_FragColor = vec4(col, 1.0 - t * (0.02 + 0.02 * sin(uTime)));
}