export const vertCard = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vWorldNormal;
  varying vec3 vViewDirection;
  varying vec3 vLocalPosition;
  varying vec3 camPos;
  varying vec3 eyeVector;
  varying vec3 vLocalViewDir;

  uniform vec3 localCamPos;

  void main() {
    vUv = uv;
    vLocalPosition = position;
    camPos = cameraPosition;
    
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    vViewDirection = normalize(cameraPosition - worldPos.xyz);
    eyeVector = normalize(worldPos.xyz - cameraPosition);

    // Vetor de visão no espaço local da carta para cálculo de paralaxe consistente
    vLocalViewDir = normalize(localCamPos - position);

    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

// Shader para a FRENTE da carta (Animação anime + Borda no Estilo Original com Emblemas e Paralaxe)
export const fragCardFront = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vWorldNormal;
  varying vec3 vViewDirection;
  varying vec3 vLocalPosition;
  varying vec3 camPos;
  varying vec3 eyeVector;
  varying vec3 vLocalViewDir;

  uniform sampler2D videoTexture;
  uniform sampler2D cardtemplate;
  uniform sampler2D backtexture;
  uniform sampler2D noiseTex;
  uniform sampler2D color;
  uniform sampler2D noise;
  uniform float time;
  uniform float holoIntensity;
  uniform float parallaxStrength;
  uniform vec2 pointerOffset;
  uniform int displayMode; // 0 = Full Art, 1 = Borda Original com Emblemas
  uniform vec3 color0;
  uniform vec3 color1;

  float Fresnel(vec3 eyeVec, vec3 worldNorm) {
    return pow(clamp(1.0 + dot(eyeVec, worldNorm), 0.0, 1.0), 1.80);
  }

  vec3 rainbow(float t) {
    return 0.5 + 0.5 * cos(6.28318 * (t + vec3(0.0, 0.33, 0.67)));
  }

  void main() {
    float f = Fresnel(eyeVector, normalize(vWorldNormal));

    // Vetor de paralaxe suave combinado (perspectiva 3D + ponteiro)
    vec2 parallax = (vLocalViewDir.xy * 0.045 + pointerOffset * 0.025) * parallaxStrength;

    if (displayMode == 0) {
      // 0 = Full Art: vídeo cobrindo toda a face com brilho foil e leve paralaxe
      vec2 fullUv = (vUv - 0.5) * 0.96 + 0.5 + parallax;
      fullUv.x = (fullUv.x - 0.5) * 0.72 + 0.5;
      vec4 animColor = texture2D(videoTexture, clamp(fullUv, 0.0, 1.0));

      float angleFactor = dot(vViewDirection, normalize(vWorldNormal)) + (vUv.x + vUv.y * 0.5);
      vec3 holoFoil = rainbow(angleFactor * 1.5 + time * 0.15) * pow(f, 1.4);

      vec2 sparkleUv = vUv * 6.0 + vec2(sin(time * 0.3) * 0.05, cos(time * 0.3) * 0.05);
      float sparkle = texture2D(noiseTex, sparkleUv).r;
      sparkle = pow(sparkle, 9.0) * 2.5 * f;

      vec3 finalRgb = animColor.rgb + (holoFoil * 0.35 + sparkle) * holoIntensity;
      gl_FragColor = vec4(finalRgb, 1.0);
    } else {
      // 1 = Borda Holográfica com Emblemas Descritivos no Estilo Original
      vec4 temptex = texture2D(cardtemplate, vUv);

      if (temptex.a < 0.05) {
        discard;
      }

      // Máscara subpixel contínua (elimina 100% dos jagged edges / serrilhado nas curvas):
      float isWindow = smoothstep(0.12, 0.45, temptex.g - max(temptex.r, temptex.b));

      // Janela interna e números recortados: Vídeo anime com leve paralaxe
      vec2 animUv = (vUv - 0.5) * 1.08 + 0.5 + parallax;
      animUv.x = (animUv.x - 0.5) * 0.72 + 0.5;
      vec4 animColor = texture2D(videoTexture, clamp(animUv, 0.0, 1.0));

      // Reflexo iridescente sutil sobre a arte
      float angleFactor = dot(vViewDirection, normalize(vWorldNormal)) + (vUv.x + vUv.y * 0.5);
      vec3 holoFoil = rainbow(angleFactor * 1.4 + time * 0.12) * pow(f, 1.5);
      vec2 sparkleUv = animUv * 5.0 + vec2(sin(time * 0.3) * 0.04, cos(time * 0.3) * 0.04);
      float sparkle = pow(texture2D(noiseTex, sparkleUv).r, 8.0) * 1.8 * f;

      vec3 finalArt = animColor.rgb + (holoFoil * 0.22 + sparkle * 0.6) * holoIntensity;

      // Efeito Foil na Borda (mesma fórmula mágica do verso)
      vec4 bactex = texture2D(backtexture, vUv);
      float tone = pow(clamp(dot(normalize(camPos), normalize(bactex.rgb)), 0.0, 1.0), 1.0);
      vec4 colortex = texture2D(color, vec2(tone, 0.0));

      // Sparkles dinâmicos
      vec2 uvSparkle = vUv;
      float iTime = time * 0.4;
      uvSparkle.y += iTime * 0.05;
      uvSparkle.x -= sin(iTime * 0.1) * 0.05;

      float borderSparkle = texture2D(noiseTex, mod(vUv * 4.0, 1.0) * 0.6 + vec2(iTime * -0.02)).r;
      borderSparkle *= texture2D(noiseTex, mod(uvSparkle * 4.0, 1.0) * 0.9 + vec2(iTime * 0.015)).b;
      borderSparkle = pow(borderSparkle, 8.0);

      vec3 borderFoil = colortex.rgb;
      borderFoil = mix(borderFoil, borderFoil * color0 * 1.8, 0.65);
      borderFoil += vec3(sin((tone + vUv.x + vUv.y * 0.1) * 10.0)) * 0.12;
      borderFoil += vec3(borderSparkle * 1.8) * holoIntensity;
      borderFoil += f * color0 * 0.35 * holoIntensity;

      // Mistura 100% antialiased entre a borda holográfica e a arte do vídeo (zero jagged edges!)
      vec3 finalFront = mix(borderFoil, finalArt, isWindow);
      gl_FragColor = vec4(finalFront, temptex.a);
    }
  }
`;

// Shader para o VERSO da carta (Bart Simpson dentro da Borda Holográfica 3D com Paralaxe e Sem Jagged Edges)
export const fragCardBack = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vWorldNormal;
  varying vec3 vViewDirection;
  varying vec3 vLocalPosition;
  varying vec3 camPos;
  varying vec3 eyeVector;
  varying vec3 vLocalViewDir;

  uniform sampler2D cardtemplate;
  uniform sampler2D backtexture;
  uniform sampler2D noiseTex;
  uniform sampler2D color;
  uniform sampler2D noise;
  uniform sampler2D bartTexture;
  uniform float time;
  uniform float holoIntensity;
  uniform float parallaxStrength;
  uniform vec2 pointerOffset;
  uniform vec3 color0;
  uniform vec3 color1;

  float Fresnel(vec3 eyeVec, vec3 worldNorm) {
    return pow(clamp(1.0 + dot(eyeVec, worldNorm), 0.0, 1.0), 1.80);
  }

  void main() {
    vec4 temptex = texture2D(cardtemplate, vUv);

    if (temptex.a < 0.05) {
      discard;
    }

    float f = Fresnel(eyeVector, normalize(vWorldNormal));

    // Máscara antisserrilhado com transição subpixel suave entre moldura e Bart:
    float isWindow = smoothstep(0.12, 0.45, temptex.g - max(temptex.r, temptex.b));

    // Janela interna (onde fica o Bart Simpson com paralaxe)
    vec2 parallax = (vLocalViewDir.xy * 0.05 + pointerOffset * 0.025) * parallaxStrength;
    vec2 bartUv = (vUv - 0.5) * 1.06 + 0.5 + parallax;
    vec4 bart = texture2D(bartTexture, clamp(bartUv, 0.0, 1.0));

    // Brilho holográfico elegante sobre o Bart
    vec3 holoSheen = f * color0 * 0.3 * holoIntensity;
    vec2 sparkleUv = bartUv * 5.0 + vec2(sin(time * 0.25) * 0.03, cos(time * 0.25) * 0.03);
    float sparkle = pow(texture2D(noiseTex, sparkleUv).r, 9.0) * 1.2 * f;
    vec3 finalBart = bart.rgb + (holoSheen + sparkle * color0) * holoIntensity;

    // Moldura holográfica ornamental do verso (cardtemplateback4.png)
    vec4 bactex = texture2D(backtexture, vUv);
    float tone = pow(clamp(dot(normalize(camPos), normalize(bactex.rgb)), 0.0, 1.0), 1.0);
    vec4 colortex = texture2D(color, vec2(tone, 0.0));

    // Sparkles dinâmicos
    vec2 uvSparkle = vUv;
    float iTime = time * 0.4;
    uvSparkle.y += iTime * 0.05;
    uvSparkle.x -= sin(iTime * 0.1) * 0.05;

    float borderSparkle = texture2D(noiseTex, mod(vUv * 4.0, 1.0) * 0.6 + vec2(iTime * -0.02)).r;
    borderSparkle *= texture2D(noiseTex, mod(uvSparkle * 4.0, 1.0) * 0.9 + vec2(iTime * 0.015)).b;
    borderSparkle = pow(borderSparkle, 8.0);

    vec3 borderEffect = colortex.rgb;
    borderEffect = mix(borderEffect, borderEffect * color0 * 1.8, 0.65);
    borderEffect += vec3(sin((tone + vUv.x + vUv.y * 0.1) * 10.0)) * 0.12;
    borderEffect += vec3(borderSparkle * 1.8) * holoIntensity;
    borderEffect += f * color0 * 0.35 * holoIntensity;

    // Mistura 100% antialiased (zero jagged edges no verso!)
    vec3 finalBack = mix(borderEffect, finalBart, isWindow);
    gl_FragColor = vec4(finalBack, temptex.a);
  }
`;
