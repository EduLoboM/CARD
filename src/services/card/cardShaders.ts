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

// Fragment Shader Comum: Funções de Padrões Holográficos
const commonHoloGLSL = /* glsl */ `
  float Fresnel(vec3 eyeVec, vec3 worldNorm) {
    return pow(clamp(1.0 + dot(eyeVec, worldNorm), 0.0, 1.0), 1.80);
  }

  vec3 rainbow(float t) {
    return 0.5 + 0.5 * cos(6.28318 * (t + vec3(0.0, 0.33, 0.67)));
  }

  // Gera os padrões de foil holográfico colecionáveis:
  // 0 = Cosmic Galaxy (Arco-Íris Cósmico)
  // 1 = Stars (Estrelas Cintilantes / Starlight Rare)
  // 2 = Checkerboard (Xadrez / Secret Rare Mosaic)
  // 3 = Cracked Ice (Gelo Quebrado / Shattered Glass)
  // 4 = Prismatic Pillars (Colunas de Luz Laser)
  // 5 = Gold 3D Relief (Ouro 24K Relevo / Ultimate Rare)
  // 6 = Cyber Glitch Matrix (Matrix Neon Digital)
  vec3 calcHoloPattern(
    int type,
    vec2 uv,
    vec3 viewDir,
    vec3 norm,
    float fresnel,
    float time,
    vec3 color0,
    sampler2D noiseTex
  ) {
    float angleFactor = dot(viewDir, norm) + (uv.x + uv.y * 0.5);

    if (type == 0) {
      // 0 = Cosmic Galaxy
      vec3 holoRainbow = rainbow(angleFactor * 1.5 + time * 0.15) * pow(fresnel, 1.4);
      float sparkle = texture2D(noiseTex, mod(uv * 4.5, 1.0) * 0.6 + vec2(time * -0.008)).r;
      sparkle *= texture2D(noiseTex, mod(uv * 5.5, 1.0) * 0.9 + vec2(time * 0.006)).b;
      sparkle = pow(sparkle, 7.5) * 2.8;
      return holoRainbow * 0.7 + sparkle * rainbow(angleFactor * 2.0);
    }
    else if (type == 1) {
      // 1 = Stars (Estrelas Holográficas / Starlight Rare)
      vec2 starGrid = uv * vec2(22.0, 33.0);
      vec2 starId = floor(starGrid);
      vec2 starF = fract(starGrid) - 0.5;

      float rnd1 = fract(sin(dot(starId, vec2(127.1, 311.7))) * 43758.5453);
      float rnd2 = fract(sin(dot(starId, vec2(269.5, 183.3))) * 43758.5453);
      vec2 starPos = vec2(rnd1 - 0.5, rnd2 - 0.5) * 0.45;
      vec2 d = starF - starPos;

      float dist = length(d);
      float rays = max(0.0, 1.0 - pow(abs(d.x * d.y) * 160.0, 0.35)) * smoothstep(0.45, 0.05, dist);
      float core = smoothstep(0.12, 0.0, dist);
      float starShape = max(core, rays * 1.5);

      float starPhase = dot(viewDir.xy * 9.0, vec2(rnd1, rnd2)) + rnd1 * 6.283 + time * 1.2;
      float twinkle = pow(clamp(sin(starPhase) * 0.5 + 0.5, 0.0, 1.0), 8.0);
      vec3 starRainbow = rainbow(rnd1 * 3.0 + angleFactor * 1.2 + time * 0.1);

      float micro = pow(texture2D(noiseTex, uv * 8.0).r, 8.0) * 1.2;
      return starRainbow * (starShape * twinkle * 4.0 + micro * 0.8) * (fresnel * 0.8 + 0.3);
    }
    else if (type == 2) {
      // 2 = Checkerboard / Xadrez (Secret Rare Mosaic)
      vec2 checkGrid = uv * vec2(24.0, 36.0);
      vec2 checkCell = floor(checkGrid);
      vec2 checkF = fract(checkGrid);
      float checker = mod(checkCell.x + checkCell.y, 2.0);

      float tileAngle = checker * 1.5708;
      vec2 tileDir = vec2(cos(tileAngle), sin(tileAngle));
      float viewDot = dot(viewDir.xy, tileDir) + (checkCell.x * 0.06 + checkCell.y * 0.08);

      float checkPhase = viewDot * 3.0 + time * 0.2;
      vec3 checkRainbow = rainbow(checkPhase);

      float edge = smoothstep(0.0, 0.08, checkF.x) * smoothstep(1.0, 0.92, checkF.x) *
                   smoothstep(0.0, 0.08, checkF.y) * smoothstep(1.0, 0.92, checkF.y);
      float tileFlash = pow(clamp(sin(viewDot * 6.28 + time * 0.6) * 0.5 + 0.5, 0.0, 1.0), 5.0);

      return checkRainbow * (tileFlash * 2.5 + 0.3) * edge * (fresnel * 0.7 + 0.4);
    }
    else if (type == 3) {
      // 3 = Cracked Ice / Gelo Quebrado (Shattered Glass Foil)
      vec2 shardGrid = uv * vec2(12.0, 18.0);
      vec2 shardId = floor(shardGrid);
      vec2 shardF = fract(shardGrid);

      float minD = 2.0;
      vec2 bestCell = vec2(0.0);
      for (int j = -1; j <= 1; j++) {
        for (int i = -1; i <= 1; i++) {
          vec2 cell = vec2(float(i), float(j));
          vec2 id = shardId + cell;
          float h1 = fract(sin(dot(id, vec2(127.1, 311.7))) * 43758.5453);
          float h2 = fract(sin(dot(id, vec2(269.5, 183.3))) * 43758.5453);
          vec2 pt = cell + vec2(h1, h2);
          float dist = length(shardF - pt);
          if (dist < minD) {
            minD = dist;
            bestCell = id;
          }
        }
      }

      float shardRnd = fract(sin(dot(bestCell, vec2(41.2, 89.4))) * 19283.31);
      float shardAngle = shardRnd * 6.28318;
      vec3 shardNorm = normalize(vec3(cos(shardAngle) * 0.5, sin(shardAngle) * 0.5, 0.85));
      float shardSpec = pow(clamp(dot(reflect(-viewDir, shardNorm), vec3(0.0, 0.0, 1.0)), 0.0, 1.0), 10.0);
      vec3 shardRainbow = rainbow(shardRnd * 3.5 + dot(viewDir, shardNorm) * 2.2 + time * 0.15);

      float shardEdge = smoothstep(0.03, 0.09, minD);
      return (shardRainbow * shardSpec * 3.5 + shardRainbow * 0.25) * shardEdge * (fresnel * 0.8 + 0.3);
    }
    else if (type == 4) {
      // 4 = Prismatic Pillars (Colunas de Luz)
      float colX = uv.x * 24.0 + sin(uv.y * 3.0 + time * 0.4) * 1.5;
      float colStripes = pow(sin(colX * 3.14159) * 0.5 + 0.5, 6.0);
      float diagBeam = pow(sin((uv.x * 1.4 - uv.y * 1.8 + dot(viewDir.xy, vec2(1.0))) * 10.0 + time * 0.7) * 0.5 + 0.5, 8.0);
      vec3 pillarRainbow = rainbow(uv.x * 2.8 + time * 0.2);
      return pillarRainbow * (colStripes * 2.0 + diagBeam * 2.6) * (fresnel * 0.8 + 0.3);
    }
    else if (type == 5) {
      // 5 = Gold 3D Relief (Ouro 3D Relevo / Ultimate Rare)
      vec3 goldBase = vec3(1.0, 0.84, 0.35);
      vec3 amberBase = vec3(0.85, 0.48, 0.10);
      float goldTone = pow(clamp(dot(normalize(viewDir), norm), 0.0, 1.0), 1.8);
      vec3 goldSheen = mix(amberBase, goldBase, goldTone) * 2.2;
      float starSparkle = pow(texture2D(noiseTex, mod(uv * 5.5, 1.0) + vec2(sin(time * 0.3) * 0.02)).r, 7.0) * 3.2 * fresnel;
      return goldSheen * (starSparkle * 0.8 + 0.4) + vec3(1.0, 0.95, 0.75) * pow(fresnel, 1.4) * 0.8;
    }
    else {
      // 6 = Cyber Glitch Matrix (Cyberpunk Digital)
      float scanline = sin(uv.y * 240.0 + time * 8.0) * 0.18;
      vec3 neonShift = vec3(
        sin(uv.x * 8.0 + time * 1.2) * 0.5 + 0.5,
        sin(uv.y * 8.0 - time * 1.0) * 0.5 + 0.5,
        cos((uv.x + uv.y) * 6.0 + time * 1.5) * 0.5 + 0.5
      );
      vec2 blockUv = floor(uv * vec2(28.0, 42.0)) / vec2(28.0, 42.0);
      float digitalNoise = texture2D(noiseTex, blockUv + vec2(time * 0.03)).r;
      return (neonShift * 1.6 + scanline + digitalNoise * neonShift * 0.9) * (fresnel * 0.8 + 0.4);
    }
  }
`;

// Shader para a FRENTE da carta (Animação anime + Borda Holográfica Multiestilo e Paralaxe)
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
  uniform int displayMode; // 0 = Full Art, 1 = Borda com Estilo Selecionado
  uniform int holoEffectType;
  uniform vec3 color0;
  uniform vec3 color1;

  ${commonHoloGLSL}

  void main() {
    float f = Fresnel(eyeVector, normalize(vWorldNormal));

    // Vetor de paralaxe suave combinado (perspectiva 3D + ponteiro)
    vec2 parallax = (vLocalViewDir.xy * 0.045 + pointerOffset * 0.025) * parallaxStrength;

    if (displayMode == 0) {
      // 0 = Full Art: vídeo cobrindo toda a face com o padrão holográfico selecionado
      vec2 fullUv = (vUv - 0.5) * 0.96 + 0.5 + parallax;
      fullUv.x = (fullUv.x - 0.5) * 0.72 + 0.5;
      vec4 animColor = texture2D(videoTexture, clamp(fullUv, 0.0, 1.0));

      vec3 holoOverlay = calcHoloPattern(holoEffectType, vUv, vViewDirection, normalize(vWorldNormal), f, time, color0, noiseTex);
      vec3 finalRgb = animColor.rgb + holoOverlay * 0.42 * holoIntensity;
      gl_FragColor = vec4(finalRgb, 1.0);
    } else {
      // 1 = Borda Holográfica com Estilos Selecionados
      vec4 temptex = texture2D(cardtemplate, vUv);

      if (temptex.a < 0.05) {
        discard;
      }

      // Máscara subpixel contínua (elimina 100% dos jagged edges nas curvas):
      float isWindow = smoothstep(0.12, 0.45, temptex.g - max(temptex.r, temptex.b));

      // Janela interna e números recortados: Vídeo anime com leve paralaxe
      vec2 animUv = (vUv - 0.5) * 1.08 + 0.5 + parallax;
      animUv.x = (animUv.x - 0.5) * 0.72 + 0.5;
      vec4 animColor = texture2D(videoTexture, clamp(animUv, 0.0, 1.0));

      // Efeito holográfico suave sobre a arte do anime
      vec3 artHolo = calcHoloPattern(holoEffectType, animUv, vViewDirection, normalize(vWorldNormal), f, time, color0, noiseTex);
      vec3 finalArt = animColor.rgb + artHolo * 0.28 * holoIntensity;

      // Efeito na borda (preserva texturas, materiais e ilustrações da moldura SVG)
      vec3 borderBase = temptex.rgb;
      vec4 bactex = texture2D(backtexture, vUv);
      float tone = pow(clamp(dot(normalize(camPos), normalize(bactex.rgb)), 0.0, 1.0), 1.0);
      vec4 colortex = texture2D(color, vec2(tone, 0.0));

      vec3 holoPattern = calcHoloPattern(holoEffectType, vUv, vViewDirection, normalize(vWorldNormal), f, time, color0, noiseTex);

      float lum = dot(borderBase, vec3(0.299, 0.587, 0.114));
      vec3 tintedBorder;
      if (lum > 0.98 && abs(borderBase.r - borderBase.b) < 0.05) {
        // Estilo clássico branco: brilha com o gradiente metálico e paleta selecionada
        tintedBorder = mix(colortex.rgb, colortex.rgb * color0 * 1.8, 0.65);
        tintedBorder += vec3(sin((tone + vUv.x + vUv.y * 0.1) * 10.0)) * 0.12;
      } else {
        // Estilos ricos (Ouro & Obsidiana, Cyber Mecha, Arcano Rúnico, Synthwave, Comic):
        // Preserva os materiais, texturas de pedra/madeira/carbono e filigranas douradas
        tintedBorder = borderBase * (colortex.rgb * 0.35 + 0.75);
      }

      vec3 finalBorder = tintedBorder + holoPattern * holoIntensity * 1.35;
      finalBorder += f * color0 * 0.25 * holoIntensity;

      // Mistura 100% antialiased entre a borda holográfica e a arte do vídeo
      vec3 finalFront = mix(finalBorder, finalArt, isWindow);
      gl_FragColor = vec4(finalFront, temptex.a);
    }
  }
`;

// Shader para o VERSO da carta (Bart Simpson dentro da Borda Holográfica 3D com Paralaxe)
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
  uniform int holoEffectType;
  uniform vec3 color0;
  uniform vec3 color1;

  ${commonHoloGLSL}

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

    // Brilho holográfico sobre o Bart
    vec3 bartHolo = calcHoloPattern(holoEffectType, bartUv, vViewDirection, normalize(vWorldNormal), f, time, color0, noiseTex);
    vec3 finalBart = bart.rgb + (f * color0 * 0.25 + bartHolo * 0.30) * holoIntensity;

    // Moldura holográfica do verso
    vec3 borderBase = temptex.rgb;
    vec4 bactex = texture2D(backtexture, vUv);
    float tone = pow(clamp(dot(normalize(camPos), normalize(bactex.rgb)), 0.0, 1.0), 1.0);
    vec4 colortex = texture2D(color, vec2(tone, 0.0));

    vec3 holoPattern = calcHoloPattern(holoEffectType, vUv, vViewDirection, normalize(vWorldNormal), f, time, color0, noiseTex);

    float lum = dot(borderBase, vec3(0.299, 0.587, 0.114));
    vec3 tintedBorder;
    if (lum > 0.98 && abs(borderBase.r - borderBase.b) < 0.05) {
      tintedBorder = colortex.rgb;
      tintedBorder = mix(tintedBorder, tintedBorder * color0 * 1.8, 0.65);
      tintedBorder += vec3(sin((tone + vUv.x + vUv.y * 0.1) * 10.0)) * 0.12;
    } else {
      tintedBorder = borderBase * (colortex.rgb * 0.35 + 0.75);
    }

    vec3 borderEffect = tintedBorder + holoPattern * holoIntensity * 1.35;
    borderEffect += f * color0 * 0.25 * holoIntensity;

    // Mistura 100% antialiased (zero jagged edges no verso!)
    vec3 finalBack = mix(borderEffect, finalBart, isWindow);
    gl_FragColor = vec4(finalBack, temptex.a);
  }
`;
