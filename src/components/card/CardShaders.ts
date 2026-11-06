export const vertCard = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vWorldNormal;
  varying vec3 vViewDirection;
  varying vec3 vLocalPosition;
  varying vec3 camPos;
  varying vec3 eyeVector;

  void main() {
    vUv = uv;
    vLocalPosition = position;
    camPos = cameraPosition;
    
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    vViewDirection = normalize(cameraPosition - worldPos.xyz);
    eyeVector = normalize(worldPos.xyz - cameraPosition);

    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

// Shader para a FRENTE da carta (CARD_FRONT.gif / vídeo anime)
export const fragCardFront = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vWorldNormal;
  varying vec3 vViewDirection;
  varying vec3 vLocalPosition;
  varying vec3 camPos;
  varying vec3 eyeVector;

  uniform sampler2D videoTexture;
  uniform sampler2D cardtemplate;
  uniform sampler2D backtexture;
  uniform sampler2D noiseTex;
  uniform sampler2D color;
  uniform sampler2D noise;
  uniform float time;
  uniform float holoIntensity;
  uniform int displayMode; // 0 = Full Art, 1 = Borda Holográfica TCG

  float Fresnel(vec3 eyeVec, vec3 worldNorm) {
    return pow(clamp(1.0 + dot(eyeVec, worldNorm), 0.0, 1.0), 1.80);
  }

  vec3 rainbow(float t) {
    return 0.5 + 0.5 * cos(6.28318 * (t + vec3(0.0, 0.33, 0.67)));
  }

  void main() {
    float f = Fresnel(eyeVector, normalize(vWorldNormal));

    if (displayMode == 0) {
      // Full Art: animação cobrindo a carta inteira com efeito foil
      vec2 uv = vUv;
      uv.x = (uv.x - 0.5) * 0.75 + 0.5;
      vec4 baseColor = texture2D(videoTexture, clamp(uv, 0.0, 1.0));

      float angleFactor = dot(vViewDirection, vWorldNormal) + (vUv.x + vUv.y * 0.5);
      vec3 holoFoil = rainbow(angleFactor * 1.5 + time * 0.15) * pow(f, 1.4);

      vec2 sparkleUv = vUv * 6.0 + vec2(sin(time * 0.3) * 0.05, cos(time * 0.3) * 0.05);
      float sparkle = texture2D(noiseTex, sparkleUv).r;
      sparkle = pow(sparkle, 9.0) * 2.5 * f;

      vec3 finalRgb = baseColor.rgb + (holoFoil * 0.45 + sparkle) * holoIntensity;
      gl_FragColor = vec4(finalRgb, 1.0);
    } else {
      // Borda Holográfica Original com a animação na janela central
      vec4 temptex = texture2D(cardtemplate, vUv);
      vec4 noisetex = texture2D(noise, mod(vUv * 2.0, 1.0));

      if (temptex.g >= 0.45 && temptex.r < 0.65) {
        vec2 uv = (vUv - vec2(0.04, 0.03)) / vec2(0.92, 0.94);
        uv.x = (uv.x - 0.5) * 0.75 + 0.5;
        vec4 animColor = texture2D(videoTexture, clamp(uv, 0.0, 1.0));

        gl_FragColor = animColor + f * 0.3 * holoIntensity;
        gl_FragColor += (noisetex / 7.0) * holoIntensity;
      } else {
        vec4 bactex = texture2D(backtexture, vUv);
        float tone = pow(clamp(dot(normalize(camPos), normalize(bactex.rgb)), 0.0, 1.0), 1.0);
        vec4 colortex = texture2D(color, vec2(tone, 0.0));

        vec2 uvSparkle = vUv;
        float iTime = time * 0.4;
        uvSparkle.y += iTime * 0.05;
        uvSparkle.x -= sin(iTime * 0.1) * 0.05;

        float sparkle = texture2D(noiseTex, mod(vUv * 4.0, 1.0) * 0.6 + vec2(iTime * -0.02)).r;
        sparkle *= texture2D(noiseTex, mod(uvSparkle * 4.0, 1.0) * 0.9 + vec2(iTime * 0.015)).b;
        sparkle = pow(sparkle, 8.0);

        gl_FragColor = temptex * colortex;
        gl_FragColor += vec4(sin((tone + vUv.x + vUv.y * 0.1) * 10.0)) * 0.12;
        gl_FragColor += vec4(sparkle * 1.5) * holoIntensity;
      }

      gl_FragColor.a = temptex.a;
    }
  }
`;

// Shader para o VERSO da carta (Janela fixa para o Bart Simpson + Borda Holográfica)
export const fragCardBack = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vWorldNormal;
  varying vec3 vViewDirection;
  varying vec3 vLocalPosition;
  varying vec3 camPos;
  varying vec3 eyeVector;

  uniform sampler2D cardtemplate;
  uniform sampler2D backtexture;
  uniform sampler2D noiseTex;
  uniform sampler2D color;
  uniform sampler2D noise;
  uniform sampler2D bartTexture;
  uniform vec2 resolution;
  uniform float time;
  uniform float holoIntensity;
  uniform vec3 color0;
  uniform vec3 color1;

  float Fresnel(vec3 eyeVec, vec3 worldNorm) {
    return pow(clamp(1.0 + dot(eyeVec, worldNorm), 0.0, 1.0), 1.80);
  }

  void main() {
    vec4 temptex = texture2D(cardtemplate, vUv);
    float f = Fresnel(eyeVector, normalize(vWorldNormal));

    // Janela interna (verde croma original): A carta funciona como uma JANELA fixa para o Bart
    if (temptex.g >= 0.45 && temptex.r < 0.65) {
      // Projeção em coordenadas de tela: o Bart NÃO gira com a carta!
      // A carta se move como uma janela através da qual o Bart é visto estático no fundo
      float minDim = min(resolution.x, resolution.y);
      vec2 centerOffset = gl_FragCoord.xy - resolution * 0.5;
      
      // Enquadramento proporcional do Bart Simpson no centro da visualização
      vec2 bartUv = (centerOffset / (minDim * 0.55)) + vec2(0.5, 0.48);

      vec4 bart;
      if (bartUv.x >= 0.0 && bartUv.x <= 1.0 && bartUv.y >= 0.0 && bartUv.y <= 1.0) {
        bart = texture2D(bartTexture, bartUv);
      } else {
        // Cor do fundo natural da imagem do Bart (creme claro)
        bart = vec4(0.99, 0.98, 0.94, 1.0);
      }

      // Leve brilho de borda e fresnel na janela
      vec3 finalColor = bart.rgb + f * color0 * 0.3 * holoIntensity;

      gl_FragColor = vec4(finalColor, temptex.a);
    } else {
      // Borda holográfica original completa com reflexo e sparkles
      vec4 bactex = texture2D(backtexture, vUv);
      float tone = pow(clamp(dot(normalize(camPos), normalize(bactex.rgb)), 0.0, 1.0), 1.0);
      vec4 colortex = texture2D(color, vec2(tone, 0.0));

      // Sparkles
      vec2 uvSparkle = vUv;
      float iTime = time * 0.4;
      uvSparkle.y += iTime * 0.05;
      uvSparkle.x -= sin(iTime * 0.1) * 0.05;

      float sparkle = texture2D(noiseTex, mod(vUv * 4.0, 1.0) * 0.6 + vec2(iTime * -0.02)).r;
      sparkle *= texture2D(noiseTex, mod(uvSparkle * 4.0, 1.0) * 0.9 + vec2(iTime * 0.015)).b;
      sparkle = pow(sparkle, 8.0);

      gl_FragColor = temptex * colortex;
      gl_FragColor += vec4(sin((tone + vUv.x + vUv.y * 0.1) * 10.0)) * 0.12;
      gl_FragColor += vec4(sparkle * 1.5) * holoIntensity;
      gl_FragColor.a = temptex.a;
    }
  }
`;
