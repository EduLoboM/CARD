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

// Shader para a FRENTE da carta (Animação anime + Formato Hearthstone / Full Art)
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
  uniform int displayMode; // 0 = Full Art, 1 = Moldura Hearthstone

  float Fresnel(vec3 eyeVec, vec3 worldNorm) {
    return pow(clamp(1.0 + dot(eyeVec, worldNorm), 0.0, 1.0), 1.80);
  }

  vec3 rainbow(float t) {
    return 0.5 + 0.5 * cos(6.28318 * (t + vec3(0.0, 0.33, 0.67)));
  }

  void main() {
    float f = Fresnel(eyeVector, normalize(vWorldNormal));

    // Ajuste de proporção para centralizar a cena 16:9 no formato de carta 2:3
    vec2 animUv = vUv;
    animUv.x = (vUv.x - 0.5) * 0.72 + 0.5;
    vec4 animColor = texture2D(videoTexture, clamp(animUv, 0.0, 1.0));

    // Efeito Foil iridescente sutil
    float angleFactor = dot(vViewDirection, vWorldNormal) + (vUv.x + vUv.y * 0.5);
    vec3 holoFoil = rainbow(angleFactor * 1.5 + time * 0.15) * pow(f, 1.4);

    vec2 sparkleUv = vUv * 6.0 + vec2(sin(time * 0.3) * 0.05, cos(time * 0.3) * 0.05);
    float sparkle = texture2D(noiseTex, sparkleUv).r;
    sparkle = pow(sparkle, 9.0) * 2.5 * f;

    if (displayMode == 0) {
      // 0 = Full Art: vídeo cobrindo toda a face com brilho foil
      vec3 finalRgb = animColor.rgb + (holoFoil * 0.35 + sparkle) * holoIntensity;
      gl_FragColor = vec4(finalRgb, 1.0);
    } else {
      // 1 = Moldura Hearthstone com Retrato Oval Arqueado do Lacaio
      vec2 center = vec2(0.5, 0.56);
      vec2 diff = (vUv - center) / vec2(0.42, 0.35);
      float dist = dot(diff, diff);

      if (dist <= 1.0) {
        // Dentro do retrato oval: a animação brilha viva
        float edgeSmooth = smoothstep(1.0, 0.90, dist);
        vec3 finalPortrait = animColor.rgb + (holoFoil * 0.25) * holoIntensity;
        // Borda dourada interna do retrato
        if (dist >= 0.92) {
          finalPortrait = mix(vec3(0.9, 0.75, 0.3), finalPortrait, edgeSmooth);
        }
        gl_FragColor = vec4(finalPortrait, 1.0);
      } else {
        // Fora do retrato: acabamento de pedra nobre / metal clássico de Hearthstone
        float stoneNoise = texture2D(noise, vUv * 3.0).r;
        vec3 stoneColor = vec3(0.12, 0.12, 0.16) + stoneNoise * 0.05;

        // Borda decorativa dourada externa
        if (vUv.x < 0.04 || vUv.x > 0.96 || vUv.y < 0.03 || vUv.y > 0.97) {
          stoneColor = vec3(0.85, 0.65, 0.25) + holoFoil * 0.3 * holoIntensity;
        }

        gl_FragColor = vec4(stoneColor, 1.0);
      }
    }
  }
`;

// Shader para o VERSO da carta (Bart Simpson preenchendo o fundo TODO que GIRA JUNTO DA CARTA dentro da Borda Holográfica 3D)
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
  uniform float time;
  uniform float holoIntensity;
  uniform vec3 color0;
  uniform vec3 color1;

  float Fresnel(vec3 eyeVec, vec3 worldNorm) {
    return pow(clamp(1.0 + dot(eyeVec, worldNorm), 0.0, 1.0), 1.80);
  }

  void main() {
    // 1. O Bart Simpson preenche 100% da carta de ponta a ponta
    vec4 bart = texture2D(bartTexture, vUv);

    vec4 temptex = texture2D(cardtemplate, vUv);
    float f = Fresnel(eyeVector, normalize(vWorldNormal));

    // Borda holográfica ornamental com reflexo metálico e sparkles
    vec4 bactex = texture2D(backtexture, vUv);
    float tone = pow(clamp(dot(normalize(camPos), normalize(bactex.rgb)), 0.0, 1.0), 1.0);
    vec4 colortex = texture2D(color, vec2(tone, 0.0));

    // Sparkles dinâmicos
    vec2 uvSparkle = vUv;
    float iTime = time * 0.4;
    uvSparkle.y += iTime * 0.05;
    uvSparkle.x -= sin(iTime * 0.1) * 0.05;

    float sparkle = texture2D(noiseTex, mod(vUv * 4.0, 1.0) * 0.6 + vec2(iTime * -0.02)).r;
    sparkle *= texture2D(noiseTex, mod(uvSparkle * 4.0, 1.0) * 0.9 + vec2(iTime * 0.015)).b;
    sparkle = pow(sparkle, 8.0);

    vec4 borderEffect = temptex * colortex;
    borderEffect += vec4(sin((tone + vUv.x + vUv.y * 0.1) * 10.0)) * 0.12;
    borderEffect += vec4(sparkle * 1.5) * holoIntensity;

    // Se estiver na janela interna (onde o template original é verde croma):
    // Exibe o Bart preenchendo o fundo com um brilho holográfico elegante
    if (temptex.g >= 0.45 && temptex.r < 0.65) {
      vec3 holoSheen = f * color0 * 0.25 * holoIntensity;
      gl_FragColor = vec4(bart.rgb + holoSheen, 1.0);
    } else {
      // Onde tem a moldura ornamental da carta:
      // A moldura holográfica sobrepõe suavemente o fundo do Bart
      vec3 finalBorder = mix(bart.rgb, borderEffect.rgb, temptex.a);
      gl_FragColor = vec4(finalBorder, 1.0);
    }
  }
`;
