export const vertCard = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vWorldNormal;
  varying vec3 vViewDirection;
  varying vec3 vLocalPosition;

  void main() {
    vUv = uv;
    vLocalPosition = position;
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    vViewDirection = normalize(cameraPosition - worldPos.xyz);
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

// Shader para a FRENTE da carta (exibe o vídeo/animação do CARD_FRONT.gif)
export const fragCardFront = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vWorldNormal;
  varying vec3 vViewDirection;
  varying vec3 vLocalPosition;

  uniform sampler2D videoTexture;
  uniform sampler2D noiseTex;
  uniform sampler2D sparkleTex;
  uniform float time;
  uniform float holoIntensity;
  uniform int displayMode; // 0 = Full Art, 1 = TCG Frame

  // Arco-íris iridescente baseado no ângulo de visão (Fresnel + Normal)
  vec3 rainbow(float t) {
    return 0.5 + 0.5 * cos(6.28318 * (t + vec3(0.0, 0.33, 0.67)));
  }

  void main() {
    vec2 uv = vUv;

    // Ajuste de proporção para o vídeo 16:9 em cartão 2:3
    if (displayMode == 0) {
      // Full Art: corte central proporcional
      uv.x = (uv.x - 0.5) * 0.75 + 0.5;
    } else {
      // Moldura TCG com borda estilizada
      // Janela de ilustração entre Y: 0.32 e 0.90
      if (vUv.y >= 0.30 && vUv.y <= 0.92 && vUv.x >= 0.06 && vUv.x <= 0.94) {
        uv.x = (vUv.x - 0.06) / 0.88;
        uv.y = (vUv.y - 0.30) / 0.62;
      }
    }

    vec4 baseColor = texture2D(videoTexture, uv);

    // Se estiver em modo moldura e fora da janela de arte, cria acabamento metálico
    if (displayMode == 1 && !(vUv.y >= 0.30 && vUv.y <= 0.92 && vUv.x >= 0.06 && vUv.x <= 0.94)) {
      baseColor = vec4(0.12, 0.12, 0.18, 1.0);
      // Borda decorativa dourada
      if (vUv.x < 0.04 || vUv.x > 0.96 || vUv.y < 0.03 || vUv.y > 0.97) {
        baseColor = vec4(0.85, 0.70, 0.30, 1.0);
      }
    }

    // Efeito Holográfico Foil
    float fresnel = clamp(1.0 - dot(vViewDirection, vWorldNormal), 0.0, 1.0);
    float angleFactor = dot(vViewDirection, vWorldNormal) + (vUv.x + vUv.y * 0.5);
    vec3 holoFoil = rainbow(angleFactor * 1.5 + time * 0.15) * pow(fresnel, 1.4);

    // Ruído de glitter / glitter sparkle
    vec2 sparkleUv = vUv * 6.0 + vec2(sin(time * 0.3) * 0.05, cos(time * 0.3) * 0.05);
    float sparkle = texture2D(noiseTex, sparkleUv).r;
    sparkle = pow(sparkle, 9.0) * 2.5 * fresnel;

    // Combina textura de vídeo com acabamento holográfico
    vec3 finalRgb = baseColor.rgb + (holoFoil * 0.45 + sparkle) * holoIntensity;

    gl_FragColor = vec4(finalRgb, 1.0);
  }
`;

// Shader para o VERSO da carta (exibe o Bart Simpson - CARD_BACK.png)
export const fragCardBack = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vWorldNormal;
  varying vec3 vViewDirection;
  varying vec3 vLocalPosition;

  uniform sampler2D backImage;
  uniform sampler2D noiseTex;
  uniform float time;
  uniform float holoIntensity;

  vec3 rainbow(float t) {
    return 0.5 + 0.5 * cos(6.28318 * (t + vec3(0.0, 0.33, 0.67)));
  }

  void main() {
    vec4 baseColor = texture2D(backImage, vUv);

    // Efeito holográfico suave no verso da carta
    float fresnel = clamp(1.0 - dot(vViewDirection, vWorldNormal), 0.0, 1.0);
    float angleFactor = dot(vViewDirection, vWorldNormal) + (vUv.x * 1.2 - vUv.y * 0.8);
    vec3 holoFoil = rainbow(angleFactor * 2.0 + time * 0.1) * pow(fresnel, 1.8);

    // Sparkles sutis no fundo
    float sparkle = texture2D(noiseTex, vUv * 5.0 + vec2(time * 0.02)).r;
    sparkle = pow(sparkle, 10.0) * 1.8 * fresnel;

    // Se o pixel for claro (fundo do Bart), o reflexo brilha mais
    float lightness = dot(baseColor.rgb, vec3(0.299, 0.587, 0.114));
    vec3 finalRgb = baseColor.rgb + (holoFoil * 0.35 + sparkle) * holoIntensity * (lightness > 0.5 ? 1.0 : 0.6);

    gl_FragColor = vec4(finalRgb, 1.0);
  }
`;
