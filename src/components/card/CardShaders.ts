export const vertCard = /* glsl */ `
  varying vec2 vUv;
  varying vec3 camPos;
  varying vec3 eyeVector;
  varying vec3 vNormal;

  void main() {
    vUv = uv;
    camPos = cameraPosition;
    vNormal = normalMatrix * normal;
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    eyeVector = normalize(worldPosition.xyz - cameraPosition);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const fragCardFront = /* glsl */ `
  varying vec2 vUv;
  uniform sampler2D skullrender;
  uniform sampler2D cardtemplate;
  uniform sampler2D backtexture;
  uniform sampler2D noiseTex;
  uniform sampler2D color;
  uniform sampler2D noise;
  uniform float time;
  varying vec3 camPos;
  varying vec3 eyeVector;
  varying vec3 vNormal;

  float Fresnel(vec3 eyeVector, vec3 worldNormal) {
    return pow(clamp(1.0 + dot(eyeVector, worldNormal), 0.0, 1.0), 1.80);
  }

  void main() {
    vec4 temptex = texture2D(cardtemplate, vUv);
    
    // Mapeamento normalizado da janela interna da carta
    vec2 windowUv = (vUv - vec2(0.12, 0.35)) / vec2(0.76, 0.48);
    vec4 skulltex = texture2D(skullrender, clamp(windowUv, 0.0, 1.0));

    float f = Fresnel(eyeVector, normalize(vNormal));
    vec4 noisetex = texture2D(noise, mod(vUv * 2.0, 1.0));

    // Janela interna (verde croma no template original)
    if (temptex.g >= 0.45 && temptex.r < 0.65) {
      gl_FragColor = f * 0.7 + skulltex;
      gl_FragColor += noisetex / 6.0;
    } else {
      // Borda holográfica iridescente
      vec4 bactex = texture2D(backtexture, vUv);
      float tone = pow(clamp(dot(normalize(camPos), normalize(bactex.rgb)), 0.0, 1.0), 1.0);
      vec4 colortex = texture2D(color, vec2(tone, 0.0));

      // Brilho holográfico cintilante
      vec2 uvSparkle = vUv;
      float iTime = time * 0.4;
      uvSparkle.y += iTime * 0.05;
      uvSparkle.x -= sin(iTime * 0.1) * 0.05;

      float sparkle = texture2D(noiseTex, mod(vUv * 4.0, 1.0) * 0.6 + vec2(iTime * -0.02)).r;
      sparkle *= texture2D(noiseTex, mod(uvSparkle * 4.0, 1.0) * 0.9 + vec2(iTime * 0.015)).b;
      sparkle = pow(sparkle, 8.0);

      gl_FragColor = temptex * colortex;
      gl_FragColor += vec4(sin((tone + vUv.x + vUv.y * 0.1) * 10.0)) * 0.12;
      gl_FragColor += vec4(sparkle * 1.5);
    }

    gl_FragColor.a = temptex.a;
  }
`;

export const fragCardBack = /* glsl */ `
  varying vec2 vUv;
  uniform sampler2D cardtemplate;
  uniform sampler2D backtexture;
  uniform sampler2D noiseTex;
  uniform sampler2D color;
  uniform sampler2D noise;
  uniform sampler2D flower;
  uniform float time;
  varying vec3 camPos;
  varying vec3 eyeVector;
  varying vec3 vNormal;

  float Fresnel(vec3 eyeVector, vec3 worldNormal) {
    return pow(clamp(1.0 + dot(eyeVector, worldNormal), 0.0, 1.0), 1.80);
  }

  void main() {
    vec4 temptex = texture2D(cardtemplate, vUv);
    vec4 flowerTex = texture2D(flower, vUv);
    float f = Fresnel(eyeVector, normalize(vNormal));
    vec4 noisetex = texture2D(noise, mod(vUv * 2.0, 1.0));

    vec4 bactex = texture2D(backtexture, vUv);
    float tone = pow(clamp(dot(normalize(camPos), normalize(bactex.rgb)), 0.0, 1.0), 1.0);
    vec4 colortex = texture2D(color, vec2(tone, 0.0));

    // Janela interna no verso
    if (temptex.g >= 0.45 && temptex.r < 0.65) {
      if (flowerTex.a > 0.2) {
        gl_FragColor = flowerTex * colortex;
      } else {
        gl_FragColor = vec4(0.05, 0.05, 0.1, 1.0) + f * 0.5;
        gl_FragColor += noisetex / 6.0;
      }
    } else {
      // Efeito arco-íris holográfico
      gl_FragColor = temptex * colortex;
      gl_FragColor += vec4(sin((tone + vUv.x + vUv.y * 0.1) * 10.0)) * 0.12;

      float sparkle = texture2D(noiseTex, mod(vUv * 3.5, 1.0) + vec2(time * 0.01)).r;
      gl_FragColor += vec4(pow(sparkle, 6.0) * 0.8);
    }

    gl_FragColor.a = temptex.a;
  }
`;

export const vertSkull = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 camPos;
  varying vec3 vPosition;
  varying vec2 vUv;
  varying vec3 eyeVector;

  void main() {
    vNormal = normalMatrix * normal;
    vUv = uv;
    camPos = cameraPosition;
    vPosition = position;
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    eyeVector = normalize(worldPosition.xyz - cameraPosition);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const fragSkull = /* glsl */ `
  #define NUM_OCTAVES 5
  uniform float time;
  uniform vec3 color0;
  uniform vec3 color1;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 camPos;
  varying vec2 vUv;
  varying vec3 eyeVector;

  float rand(vec2 n) {
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
  }

  float noise(vec2 p){
    vec2 ip = floor(p);
    vec2 u = fract(p);
    u = u * u * (3.0 - 2.0 * u);

    float res = mix(
      mix(rand(ip), rand(ip + vec2(1.0, 0.0)), u.x),
      mix(rand(ip + vec2(0.0, 1.0)), rand(ip + vec2(1.0, 1.0)), u.x),
      u.y
    );
    return res * res;
  }

  float fbm(vec2 x) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
    for (int i = 0; i < NUM_OCTAVES; ++i) {
      v += a * noise(x);
      x = rot * x * 2.0 + shift;
      a *= 0.5;
    }
    return v;
  }

  float setOpacity(float r, float g, float b) {
    float tone = (r + g + b) / 3.0;
    return tone < 0.65 ? 0.0 : 1.0;
  }

  float Fresnel(vec3 eyeVector, vec3 worldNormal) {
    return pow(clamp(1.0 + dot(eyeVector, worldNormal), 0.0, 1.0), 3.0);
  }

  void main() {
    float f = Fresnel(eyeVector, normalize(vNormal));
    vec2 p = vUv * 6.0 + vec2(0.0, -time * 0.8);
    float n = fbm(p);

    vec3 viewDirectionW = normalize(camPos - vPosition);
    float fresnelTerm = clamp(1.0 - dot(viewDirectionW, normalize(vNormal)), 0.0, 1.0);

    vec3 color = vec3(n) + fresnelTerm * 0.5;
    vec3 color2 = color - 0.2;

    float noisetone = setOpacity(color.r, color.g, color.b);
    float noisetone2 = setOpacity(color2.r, color2.g, color2.b);

    vec4 backColor = vec4(color0 * noisetone, 1.0);
    vec4 frontColor = vec4(color1 * noisetone, 1.0);

    if (noisetone2 > 0.0) {
      gl_FragColor = frontColor + f * vec4(color1, 1.0) * 0.8;
    } else {
      gl_FragColor = backColor + f * vec4(color0, 1.0) * 0.4;
    }

    // Alpha fade
    gl_FragColor.a = clamp(noisetone + f, 0.0, 1.0);
  }
`;
