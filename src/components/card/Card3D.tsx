"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture, useVideoTexture } from "@react-three/drei";
import * as THREE from "three";
import { vertCard, fragCardFront, fragCardBack } from "./CardShaders";

interface Card3DProps {
  autoRotate: boolean;
  flipped: boolean;
  holoIntensity: number;
  frameMode: "full_art" | "tcg_frame";
}

export default function Card3D({
  autoRotate,
  flipped,
  holoIntensity,
  frameMode,
}: Card3DProps) {
  const cardGroupRef = useRef<THREE.Group>(null);

  // Carrega vídeo da animação frontal (CARD_FRONT.gif convertido para MP4 de alta performance)
  const videoTexture = useVideoTexture("/card/card_front.mp4", {
    muted: true,
    loop: true,
    start: true,
    playsInline: true,
  });

  // Carrega imagem do verso (Bart Simpson - CARD_BACK.png) e ruído de glitter
  const textures = useTexture({
    backImage: "/card/CARD_BACK.png",
    noise: "/assets/rgbnoise2.png",
  });

  // Configuração dos materiais com Shaders
  const { frontMaterial, backMaterial } = useMemo(() => {
    // Face Frontal: Vídeo com efeito holográfico
    const fMat = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        videoTexture: { value: videoTexture },
        noiseTex: { value: textures.noise },
        holoIntensity: { value: holoIntensity },
        displayMode: { value: frameMode === "full_art" ? 0 : 1 },
      },
      vertexShader: vertCard,
      fragmentShader: fragCardFront,
      side: THREE.FrontSide,
    });

    // Face Traseira: Bart Simpson com acabamento holográfico
    const bMat = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        backImage: { value: textures.backImage },
        noiseTex: { value: textures.noise },
        holoIntensity: { value: holoIntensity },
      },
      vertexShader: vertCard,
      fragmentShader: fragCardBack,
      side: THREE.FrontSide,
    });

    return {
      frontMaterial: fMat,
      backMaterial: bMat,
    };
  }, [videoTexture, textures, holoIntensity, frameMode]);

  useFrame((state, delta) => {
    if (!cardGroupRef.current) return;

    const time = state.clock.getElapsedTime();
    frontMaterial.uniforms.time.value = time;
    frontMaterial.uniforms.holoIntensity.value = holoIntensity;
    frontMaterial.uniforms.displayMode.value = frameMode === "full_art" ? 0 : 1;

    backMaterial.uniforms.time.value = time;
    backMaterial.uniforms.holoIntensity.value = holoIntensity;

    const targetRotY = flipped ? Math.PI : 0;

    if (autoRotate) {
      cardGroupRef.current.rotation.y += delta * 0.9;
      cardGroupRef.current.position.y = Math.sin(time * 1.5) * 0.25;
    } else {
      // Interpolação suave acompanhando a posição do cursor na tela (efeito parallax 3D)
      const pointerX = state.pointer.x * 0.4;
      const pointerY = -state.pointer.y * 0.4;

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

      {/* Face Traseira (Bart Simpson - CARD_BACK.png) */}
      <mesh
        position={[0, 0, -0.02]}
        rotation={[0, Math.PI, 0]}
        material={backMaterial}
      >
        <planeGeometry args={[10, 15]} />
      </mesh>

      {/* Camada flutuante frontal 3D pop-out (Inspirada no efeito hover de CARD_FRONT/) */}
      <mesh position={[0, -6.2, 0.12]}>
        <planeGeometry args={[8.6, 1.4]} />
        <meshStandardMaterial
          color="#0f172a"
          transparent
          opacity={0.85}
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>

      {/* Borda sólida da carta colecionável com acabamento chanfrado metálico */}
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
