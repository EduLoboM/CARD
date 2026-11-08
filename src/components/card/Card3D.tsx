"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture, useVideoTexture } from "@react-three/drei";
import * as THREE from "three";

import {
  CardColorSettings,
  CardStats,
  FrontFrameStyle,
  BackFrameStyle,
  HoloEffectType,
  CardFrameMode,
} from "@/types/card";
import { HOLO_EFFECT_MAP } from "@/constants/card.constants";
import {
  generateEmbeddedCardTemplate,
  generateBackCardTemplate,
} from "@/services/card/cardTemplates";
import { vertCard, fragCardFront, fragCardBack } from "@/services/card/cardShaders";
import { useSvgTexture } from "@/hooks/useSvgTexture";

// Re-exporta tipos e funções utilitárias para retrocompatibilidade
export type {
  CardColorSettings,
  CardStats,
  FrontFrameStyle,
  BackFrameStyle,
  HoloEffectType,
  CardFrameMode,
};
export { HOLO_EFFECT_MAP, generateEmbeddedCardTemplate, generateBackCardTemplate };

export interface Card3DProps {
  autoRotate: boolean;
  flipped: boolean;
  holoIntensity: number;
  parallaxStrength: number;
  frontFrameStyle: FrontFrameStyle;
  backFrameStyle: BackFrameStyle;
  holoEffect: HoloEffectType;
  colors: CardColorSettings;
  stats: CardStats;
}

// Otimização de Performance Three.js: objetos estáticos reutilizáveis para zerar alocação de memória no useFrame
const _invModelMatrix = new THREE.Matrix4();
const _localCam = new THREE.Vector3();
const _localCamBack = new THREE.Vector3();

export default function Card3D({
  autoRotate,
  flipped,
  holoIntensity,
  parallaxStrength,
  frontFrameStyle,
  backFrameStyle,
  holoEffect,
  colors,
  stats,
}: Card3DProps) {
  const cardGroupRef = useRef<THREE.Group>(null);

  // Vídeo da animação frontal em loop
  const videoTexture = useVideoTexture("/card/card_front.mp4", {
    muted: true,
    loop: true,
    start: true,
    playsInline: true,
  });

  // Texturas de assets da carta holográfica e Bart Simpson
  const textures = useTexture({
    templateFront: "/assets/cardtemplate3.png",
    templateBack: "/assets/cardtemplateback4.png",
    bartImage: "/card/bart_full_perfect.png",
    noise: "/assets/noise2.png",
    sparkleNoise: "/assets/rgbnoise2.png",
    color: "/assets/color11.png",
    backtexture: "/assets/color3.jpg",
  });

  // Geração reativa do SVG da frente
  const frontSvgStr = useMemo(() => {
    return generateEmbeddedCardTemplate(stats, frontFrameStyle);
  }, [stats.cost, stats.attack, stats.health, frontFrameStyle]);

  // Textura dinâmica com cache em memória
  const dynamicFrontTemplate = useSvgTexture(frontSvgStr);

  // Geração reativa do SVG do verso
  const backSvgStr = useMemo(() => {
    return generateBackCardTemplate(backFrameStyle);
  }, [backFrameStyle]);

  const dynamicBackTemplate = useSvgTexture(backSvgStr);

  const holoEffectCode = HOLO_EFFECT_MAP[holoEffect] ?? 0;

  const { frontMaterial, backMaterial } = useMemo(() => {
    // Face Frontal: Vídeo anime + borda holográfica com efeito e paralaxe
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
        displayMode: { value: frontFrameStyle === "full_art" ? 0 : 1 },
        holoEffectType: { value: holoEffectCode },
        color0: { value: new THREE.Vector3(...colors.border).multiplyScalar(1 / 255) },
        color1: { value: new THREE.Vector3(...colors.base).multiplyScalar(1 / 255) },
      },
      vertexShader: vertCard,
      fragmentShader: fragCardFront,
      side: THREE.FrontSide,
      transparent: true,
    });

    // Face Traseira: Bart Simpson dentro da moldura holográfica
    const bMat = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        bartTexture: { value: textures.bartImage },
        cardtemplate: { value: dynamicBackTemplate || textures.templateBack },
        backtexture: { value: textures.backtexture },
        noiseTex: { value: textures.sparkleNoise },
        color: { value: textures.color },
        holoIntensity: { value: holoIntensity },
        parallaxStrength: { value: parallaxStrength },
        pointerOffset: { value: new THREE.Vector2(0, 0) },
        localCamPos: { value: new THREE.Vector3(0, 0, -24) },
        holoEffectType: { value: holoEffectCode },
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
  }, [
    videoTexture,
    textures,
    dynamicFrontTemplate,
    dynamicBackTemplate,
    holoIntensity,
    parallaxStrength,
    frontFrameStyle,
    holoEffectCode,
    colors,
  ]);

  useFrame((state, delta) => {
    if (!cardGroupRef.current) return;

    const time = state.clock.getElapsedTime();
    const pointerX = state.pointer.x;
    const pointerY = state.pointer.y;

    // Atualiza texturas dinâmicas caso tenham mudado
    if (dynamicFrontTemplate && frontMaterial.uniforms.cardtemplate.value !== dynamicFrontTemplate) {
      frontMaterial.uniforms.cardtemplate.value = dynamicFrontTemplate;
    }
    const currentBackTex = dynamicBackTemplate || textures.templateBack;
    if (backMaterial.uniforms.cardtemplate.value !== currentBackTex) {
      backMaterial.uniforms.cardtemplate.value = currentBackTex;
    }

    // Calcula posição da câmera local sem alocar novos objetos na memória
    _invModelMatrix.copy(cardGroupRef.current.matrixWorld).invert();
    _localCam.copy(state.camera.position).applyMatrix4(_invModelMatrix);

    // Uniforms da Face Frontal
    frontMaterial.uniforms.time.value = time;
    frontMaterial.uniforms.holoIntensity.value = holoIntensity;
    frontMaterial.uniforms.parallaxStrength.value = parallaxStrength;
    frontMaterial.uniforms.pointerOffset.value.set(pointerX, pointerY);
    frontMaterial.uniforms.localCamPos.value.copy(_localCam);
    frontMaterial.uniforms.displayMode.value = frontFrameStyle === "full_art" ? 0 : 1;
    frontMaterial.uniforms.holoEffectType.value = holoEffectCode;
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
    _localCamBack.set(-_localCam.x, _localCam.y, -_localCam.z);

    backMaterial.uniforms.time.value = time;
    backMaterial.uniforms.holoIntensity.value = holoIntensity;
    backMaterial.uniforms.parallaxStrength.value = parallaxStrength;
    backMaterial.uniforms.pointerOffset.value.set(-pointerX, pointerY);
    backMaterial.uniforms.localCamPos.value.copy(_localCamBack);
    backMaterial.uniforms.holoEffectType.value = holoEffectCode;
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

    // Interpolação suave de rotação (Lerp)
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
      {/* Face Frontal (Vídeo anime + Borda frontal multiestilo) */}
      <mesh position={[0, 0, 0.02]} material={frontMaterial}>
        <planeGeometry args={[10, 15]} />
      </mesh>

      {/* Face Traseira (Bart Simpson + Borda do verso multiestilo) */}
      <mesh
        position={[0, 0, -0.02]}
        rotation={[0, Math.PI, 0]}
        material={backMaterial}
      >
        <planeGeometry args={[10, 15]} />
      </mesh>

      {/* Núcleo interno metálico com espessura realista de carta colecionável */}
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
