"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture, useVideoTexture } from "@react-three/drei";
import * as THREE from "three";
import { vertCard, fragCardFront, fragCardBack } from "./CardShaders";
import HearthstoneFrame, { HearthstoneStats } from "./HearthstoneFrame";

export interface CardColorSettings {
  border: [number, number, number];
  base: [number, number, number];
}

interface Card3DProps {
  autoRotate: boolean;
  flipped: boolean;
  holoIntensity: number;
  frameMode: "full_art" | "hearthstone";
  colors: CardColorSettings;
  stats: HearthstoneStats;
}

export default function Card3D({
  autoRotate,
  flipped,
  holoIntensity,
  frameMode,
  colors,
  stats,
}: Card3DProps) {
  const cardGroupRef = useRef<THREE.Group>(null);

  // Vídeo da animação frontal (CARD_FRONT.gif em MP4 acelerado)
  const videoTexture = useVideoTexture("/card/card_front.mp4", {
    muted: true,
    loop: true,
    start: true,
    playsInline: true,
  });

  // Texturas originais e Bart preenchendo 100% da carta
  const textures = useTexture({
    templateFront: "/assets/cardtemplate3.png",
    templateBack: "/assets/cardtemplateback4.png",
    bartImage: "/card/bart_full_cover.png",
    noise: "/assets/noise2.png",
    sparkleNoise: "/assets/rgbnoise2.png",
    color: "/assets/color11.png",
    backtexture: "/assets/color3.jpg",
  });

  const { frontMaterial, backMaterial } = useMemo(() => {
    // Face Frontal: Animação anime com acabamento Hearthstone
    const fMat = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        videoTexture: { value: videoTexture },
        cardtemplate: { value: textures.templateFront },
        backtexture: { value: textures.backtexture },
        noise: { value: textures.noise },
        noiseTex: { value: textures.sparkleNoise },
        color: { value: textures.color },
        holoIntensity: { value: holoIntensity },
        displayMode: { value: frameMode === "full_art" ? 0 : 1 },
      },
      vertexShader: vertCard,
      fragmentShader: fragCardFront,
      side: THREE.FrontSide,
      transparent: true,
    });

    // Face Traseira: Bart Simpson preenchendo 100% do fundo com a borda holográfica
    const bMat = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        bartTexture: { value: textures.bartImage },
        cardtemplate: { value: textures.templateBack },
        backtexture: { value: textures.backtexture },
        noise: { value: textures.noise },
        noiseTex: { value: textures.sparkleNoise },
        color: { value: textures.color },
        holoIntensity: { value: holoIntensity },
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
  }, [videoTexture, textures, holoIntensity, frameMode, colors]);

  useFrame((state, delta) => {
    if (!cardGroupRef.current) return;

    const time = state.clock.getElapsedTime();
    frontMaterial.uniforms.time.value = time;
    frontMaterial.uniforms.holoIntensity.value = holoIntensity;
    frontMaterial.uniforms.displayMode.value = frameMode === "full_art" ? 0 : 1;

    backMaterial.uniforms.time.value = time;
    backMaterial.uniforms.holoIntensity.value = holoIntensity;
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

    const targetRotY = flipped ? Math.PI : 0;

    if (autoRotate) {
      cardGroupRef.current.rotation.y += delta * 0.9;
      cardGroupRef.current.position.y = Math.sin(time * 1.5) * 0.25;
    } else {
      const pointerX = state.pointer.x * 0.45;
      const pointerY = -state.pointer.y * 0.45;

      cardGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        cardGroupRef.current.rotation.y,
        targetRotY + pointerX,
        0.08
      );
      cardGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        cardGroupRef.current.rotation.x,
        pointerY,
        0.08
      );
      cardGroupRef.current.position.y = THREE.MathUtils.lerp(
        cardGroupRef.current.position.y,
        Math.sin(time * 1.2) * 0.15,
        0.08
      );
    }
  });

  return (
    <group ref={cardGroupRef} position={[0, 0, 0]}>
      {/* Face Frontal (Vídeo do CARD_FRONT.gif) */}
      <mesh position={[0, 0, 0.02]} material={frontMaterial}>
        <planeGeometry args={[10, 15]} />
      </mesh>

      {/* Interface Hearthstone 3D com Custo, Ataque, Vida e Nome */}
      <HearthstoneFrame stats={stats} isFullArt={frameMode === "full_art"} />

      {/* Face Traseira (Bart Simpson preenchendo 100% da carta com a Borda Holográfica) */}
      <mesh
        position={[0, 0, -0.02]}
        rotation={[0, Math.PI, 0]}
        material={backMaterial}
      >
        <planeGeometry args={[10, 15]} />
      </mesh>

      {/* Borda sólida da carta com acabamento chanfrado escuro metálico */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[10.05, 15.05, 0.038]} />
        <meshStandardMaterial
          color="#1e293b"
          metalness={0.9}
          roughness={0.15}
        />
      </mesh>
    </group>
  );
}
