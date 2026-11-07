"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture, useVideoTexture } from "@react-three/drei";
import * as THREE from "three";
import { vertCard, fragCardFront, fragCardBack } from "./CardShaders";
import { CardStats } from "./CardHUD";

export interface CardColorSettings {
  border: [number, number, number];
  base: [number, number, number];
}

export type CardFrameMode = "original" | "full_art";

interface Card3DProps {
  autoRotate: boolean;
  flipped: boolean;
  holoIntensity: number;
  parallaxStrength: number;
  frameMode: CardFrameMode;
  colors: CardColorSettings;
  stats: CardStats;
}

// Gera o template na estética 100% autêntica da carta original:
// Moldura branca holográfica pura, com contornos icônicos e esculturais:
// - Topo-Esquerdo: Cristal de Mana multifacetado para Custo
// - Inferior-Esquerdo: Brasão/Escudo Heráldico de Ataque para Ataque (o 13 original)
// - Inferior-Direito: Coração simétrico escultural de Vida para Pontos de Vida
// - Dígitos recortados em verde croma stencil para o vídeo com paralaxe 3D passar através deles
export function generateEmbeddedCardTemplate(stats: CardStats): string {
  const { cost, attack, health } = stats;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 838 1275" width="838" height="1275">
  <defs>
    <clipPath id="card-clip">
      <rect x="0" y="0" width="838" height="1275" rx="38" ry="38" />
    </clipPath>
  </defs>

  <g clip-path="url(#card-clip)">
    <!-- Janela Verde Croma (Onde o vídeo anime com paralaxe 3D é renderizado) -->
    <rect x="0" y="0" width="838" height="1275" fill="#00ff00" />

    <!-- 1. Borda Branca Holográfica Externa (32px de espessura original) -->
    <rect x="0" y="0" width="838" height="32" fill="#ffffff" />
    <rect x="0" y="1243" width="838" height="32" fill="#ffffff" />
    <rect x="0" y="0" width="32" height="1275" fill="#ffffff" />
    <rect x="806" y="0" width="32" height="1275" fill="#ffffff" />

    <!-- 2. TOPO ESQUERDO: CRISTAL DE MANA (Custo) -->
    <!-- Contorno facetado de gema/cristal conectado perfeitamente à moldura -->
    <path d="M 0,0 L 210,0 L 210,32 L 205,75 L 175,145 L 120,195 L 65,190 L 32,165 L 0,165 Z" fill="#ffffff" />

    <!-- 3. INFERIOR ESQUERDO: BRASÃO DE ATAQUE COM LÂMINAS (Ataque - O 13 original) -->
    <!-- Contorno heráldico de escudo com crista de pontas duplas e corpo curvado de proteção -->
    <path d="M 0,1275 L 245,1275 L 245,1243 C 248,1180 240,1125 218,1075 C 196,1035 165,1025 135,1040 C 105,1025 74,1035 52,1075 C 38,1100 34,1130 32,1165 L 0,1165 Z" fill="#ffffff" />

    <!-- 4. INFERIOR DIREITO: CORAÇÃO DE VIDA (Vida) -->
    <!-- Contorno escultural simétrico de Coração com lóbulos arqueados e fenda central bem definida -->
    <path d="M 838,1275 L 605,1275 L 605,1243 C 605,1180 615,1125 640,1075 C 652,1045 672,1025 694,1035 C 708,1042 713,1055 715,1075 C 717,1055 722,1042 736,1035 C 758,1025 778,1045 790,1075 C 802,1100 806,1130 806,1165 L 838,1165 Z" fill="#ffffff" />

    <!-- 5. VALORES VAZADOS EM VERDE CROMA (Stencil com vídeo anime em paralaxe passando pelos números) -->
    <text x="105" y="105" font-size="116" font-family="system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" font-weight="900" fill="#00ff00" text-anchor="middle" dominant-baseline="central">${cost}</text>
    <text x="128" y="1150" font-size="116" font-family="system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" font-weight="900" fill="#00ff00" text-anchor="middle" dominant-baseline="central">${attack}</text>
    <text x="715" y="1150" font-size="116" font-family="system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" font-weight="900" fill="#00ff00" text-anchor="middle" dominant-baseline="central">${health}</text>
  </g>
</svg>`;
}

// Hook para gerar dinamicamente o template vetorial supersampled em 2X (zero jagged edges)
function useDynamicCardTemplate(stats: CardStats): THREE.Texture | null {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const textureRef = useRef<THREE.Texture | null>(null);

  useEffect(() => {
    const svgStr = generateEmbeddedCardTemplate(stats);
    const blob = new Blob([svgStr], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const img = new Image();

    img.onload = () => {
      // Resolução 2x supersampled (1676x2550) com antialiasing subpixel perfeito
      const width = 1676;
      const height = 2550;

      if (!textureRef.current) {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          ctx.drawImage(img, 0, 0, width, height);
        }

        const tex = new THREE.CanvasTexture(canvas);
        tex.minFilter = THREE.LinearMipmapLinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.generateMipmaps = true;
        tex.needsUpdate = true;
        textureRef.current = tex;
        setTexture(tex);
      } else {
        const tex = textureRef.current;
        const canvas = tex.image as HTMLCanvasElement;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          ctx.clearRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);
        }
        tex.needsUpdate = true;
        setTexture(tex);
      }

      URL.revokeObjectURL(url);
    };

    img.src = url;

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [stats.cost, stats.attack, stats.health]);

  return texture;
}

export default function Card3D({
  autoRotate,
  flipped,
  holoIntensity,
  parallaxStrength,
  frameMode,
  colors,
  stats,
}: Card3DProps) {
  const cardGroupRef = useRef<THREE.Group>(null);

  // Vídeo da animação frontal (CARD_FRONT.gif acelerado)
  const videoTexture = useVideoTexture("/card/card_front.mp4", {
    muted: true,
    loop: true,
    start: true,
    playsInline: true,
  });

  // Texturas originais da carta holográfica e imagem do Bart Simpson
  const textures = useTexture({
    templateFront: "/assets/cardtemplate3.png",
    templateBack: "/assets/cardtemplateback4.png",
    bartImage: "/card/bart_full_perfect.png",
    noise: "/assets/noise2.png",
    sparkleNoise: "/assets/rgbnoise2.png",
    color: "/assets/color11.png",
    backtexture: "/assets/color3.jpg",
  });

  // Template vetorial com os emblemas descritivos no estilo original (zero serrilhado)
  const dynamicFrontTemplate = useDynamicCardTemplate(stats);

  const { frontMaterial, backMaterial } = useMemo(() => {
    // Face Frontal: Vídeo anime dentro da borda com emblemas descritivos no estilo original e paralaxe
    const fMat = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        videoTexture: { value: videoTexture },
        cardtemplate: { value: dynamicFrontTemplate || textures.templateFront },
        backtexture: { value: textures.backtexture },
        noise: { value: textures.noise },
        noiseTex: { value: textures.sparkleNoise },
        color: { value: textures.color },
        holoIntensity: { value: holoIntensity },
        parallaxStrength: { value: parallaxStrength },
        pointerOffset: { value: new THREE.Vector2(0, 0) },
        localCamPos: { value: new THREE.Vector3(0, 0, 24) },
        displayMode: { value: frameMode === "full_art" ? 0 : 1 },
        color0: { value: new THREE.Vector3(...colors.border).multiplyScalar(1 / 255) },
        color1: { value: new THREE.Vector3(...colors.base).multiplyScalar(1 / 255) },
      },
      vertexShader: vertCard,
      fragmentShader: fragCardFront,
      side: THREE.FrontSide,
      transparent: true,
    });

    // Face Traseira: Bart Simpson dentro da borda original cardtemplateback4.png com paralaxe
    const bMat = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        bartTexture: { value: textures.bartImage },
        cardtemplate: { value: textures.templateBack },
        backtexture: { value: textures.backtexture },
        noiseTex: { value: textures.sparkleNoise },
        color: { value: textures.color },
        holoIntensity: { value: holoIntensity },
        parallaxStrength: { value: parallaxStrength },
        pointerOffset: { value: new THREE.Vector2(0, 0) },
        localCamPos: { value: new THREE.Vector3(0, 0, -24) },
        color0: { value: new THREE.Vector3(...colors.border).multiplyScalar(1 / 255) },
        color1: { value: new THREE.Vector3(...colors.base).multiplyScalar(1 / 255) },
      },
      vertexShader: vertCard,
      fragmentShader: fragCardBack,
      side: THREE.FrontSide,
      transparent: true,
    });

    return {
      frontMaterial: fMat,
      backMaterial: bMat,
    };
  }, [videoTexture, textures, dynamicFrontTemplate, holoIntensity, parallaxStrength, frameMode, colors]);

  useFrame((state, delta) => {
    if (!cardGroupRef.current) return;

    const time = state.clock.getElapsedTime();
    const pointerX = state.pointer.x;
    const pointerY = state.pointer.y;

    // Atualiza textura dinâmica da frente quando atualizada
    if (dynamicFrontTemplate && frontMaterial.uniforms.cardtemplate.value !== dynamicFrontTemplate) {
      frontMaterial.uniforms.cardtemplate.value = dynamicFrontTemplate;
    }

    // Converte a posição da câmera para o espaço local da carta para cálculo de paralaxe consistente
    const invModelMatrix = new THREE.Matrix4();
    invModelMatrix.copy(cardGroupRef.current.matrixWorld).invert();
    const localCam = state.camera.position.clone().applyMatrix4(invModelMatrix);

    // Uniforms da Face Frontal
    frontMaterial.uniforms.time.value = time;
    frontMaterial.uniforms.holoIntensity.value = holoIntensity;
    frontMaterial.uniforms.parallaxStrength.value = parallaxStrength;
    frontMaterial.uniforms.pointerOffset.value.set(pointerX, pointerY);
    frontMaterial.uniforms.localCamPos.value.copy(localCam);
    frontMaterial.uniforms.displayMode.value = frameMode === "full_art" ? 0 : 1;
    frontMaterial.uniforms.color0.value.set(
      colors.border[0] / 255,
      colors.border[1] / 255,
      colors.border[2] / 255
    );
    frontMaterial.uniforms.color1.value.set(
      colors.base[0] / 255,
      colors.base[1] / 255,
      colors.base[2] / 255
    );

    // Uniforms da Face Traseira
    const localCamBack = localCam.clone();
    localCamBack.x = -localCamBack.x;
    localCamBack.z = -localCamBack.z;

    backMaterial.uniforms.time.value = time;
    backMaterial.uniforms.holoIntensity.value = holoIntensity;
    backMaterial.uniforms.parallaxStrength.value = parallaxStrength;
    backMaterial.uniforms.pointerOffset.value.set(-pointerX, pointerY);
    backMaterial.uniforms.localCamPos.value.copy(localCamBack);
    backMaterial.uniforms.color0.value.set(
      colors.border[0] / 255,
      colors.border[1] / 255,
      colors.border[2] / 255
    );
    backMaterial.uniforms.color1.value.set(
      colors.base[0] / 255,
      colors.base[1] / 255,
      colors.base[2] / 255
    );

    // Rotação suave baseada em autoRotate ou movimento do mouse
    const targetRotY = flipped ? Math.PI : 0;

    if (autoRotate) {
      cardGroupRef.current.rotation.y += delta * 0.9;
      cardGroupRef.current.position.y = Math.sin(time * 1.5) * 0.25;
    } else {
      const tiltX = pointerX * 0.45;
      const tiltY = -pointerY * 0.45;

      cardGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        cardGroupRef.current.rotation.y,
        targetRotY + tiltX,
        0.08
      );
      cardGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        cardGroupRef.current.rotation.x,
        tiltY,
        0.08
      );
      cardGroupRef.current.position.y = THREE.MathUtils.lerp(
        cardGroupRef.current.position.y,
        0,
        0.08
      );
    }
  });

  return (
    <group ref={cardGroupRef} position={[0, 0, 0]}>
      {/* Face Frontal (Vídeo do anime + Borda no Estilo Original com Emblemas Descritivos e Paralaxe) */}
      <mesh position={[0, 0, 0.02]} material={frontMaterial}>
        <planeGeometry args={[10, 15]} />
      </mesh>

      {/* Face Traseira (Bart Simpson + Borda Holográfica cardtemplateback4.png com Paralaxe) */}
      <mesh
        position={[0, 0, -0.02]}
        rotation={[0, Math.PI, 0]}
        material={backMaterial}
      >
        <planeGeometry args={[10, 15]} />
      </mesh>

      {/* Núcleo interno metálico elegante com chanfro sutil */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[9.95, 14.95, 0.036]} />
        <meshStandardMaterial
          color="#090d16"
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>
    </group>
  );
}
