"use client";

import { useRef, useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { vertCard, fragCardFront, fragCardBack } from "./CardShaders";
import SkullHologram from "./SkullHologram";

export interface CardColorSettings {
  border: [number, number, number];
  base: [number, number, number];
  eye: [number, number, number];
}

interface Card3DProps {
  colors: CardColorSettings;
  backMode: "holographic" | "example_png";
  autoRotate: boolean;
  flipped: boolean;
}

export default function Card3D({
  colors,
  backMode,
  autoRotate,
  flipped,
}: Card3DProps) {
  const cardGroupRef = useRef<THREE.Group>(null);
  const [skullTexture, setSkullTexture] = useState<THREE.Texture | null>(null);
  const [currentEuler, setCurrentEuler] = useState<THREE.Euler>(new THREE.Euler());

  // Carrega todas as texturas necessárias
  const textures = useTexture({
    templateFront: "/assets/cardtemplate3.png",
    templateBack: "/assets/cardtemplateback4.png",
    exampleCardBack: "/card/CARD_BACK.png",
    flower: "/assets/flower3.png",
    noise: "/assets/noise2.png",
    color: "/assets/color11.png",
    backtexture: "/assets/color3.jpg",
    sparkleNoise: "/assets/rgbnoise2.png",
  });

  // Configuração dos ShaderMaterials
  const { frontMaterial, backMaterialHolo, backMaterialPng } = useMemo(() => {
    // Material frontal holográfico
    const fMat = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        cardtemplate: { value: textures.templateFront },
        backtexture: { value: textures.backtexture },
        noise: { value: textures.noise },
        skullrender: { value: null },
        noiseTex: { value: textures.sparkleNoise },
        color: { value: textures.color },
      },
      vertexShader: vertCard,
      fragmentShader: fragCardFront,
      transparent: true,
      side: THREE.FrontSide,
    });

    // Material traseiro holográfico
    const bMatHolo = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        cardtemplate: { value: textures.templateBack },
        backtexture: { value: textures.backtexture },
        noise: { value: textures.noise },
        flower: { value: textures.flower },
        noiseTex: { value: textures.sparkleNoise },
        color: { value: textures.color },
      },
      vertexShader: vertCard,
      fragmentShader: fragCardBack,
      transparent: true,
      side: THREE.FrontSide,
    });

    // Material traseiro alternativo (CARD_BACK.png)
    const bMatPng = new THREE.MeshStandardMaterial({
      map: textures.exampleCardBack,
      roughness: 0.25,
      metalness: 0.5,
      side: THREE.FrontSide,
    });

    return {
      frontMaterial: fMat,
      backMaterialHolo: bMatHolo,
      backMaterialPng: bMatPng,
    };
  }, [textures]);

  // Atualiza texture do crânio assim que renderizado no FBO
  const handleTextureReady = (tex: THREE.Texture) => {
    if (frontMaterial.uniforms.skullrender.value !== tex) {
      frontMaterial.uniforms.skullrender.value = tex;
      setSkullTexture(tex);
    }
  };

  useFrame((state, delta) => {
    if (!cardGroupRef.current) return;

    const time = state.clock.getElapsedTime();
    frontMaterial.uniforms.time.value = time;
    backMaterialHolo.uniforms.time.value = time;

    // Rotação suave ou inclinação pelo ponteiro
    const targetRotY = flipped ? Math.PI : 0;
    
    if (autoRotate) {
      cardGroupRef.current.rotation.y += delta * 0.8;
      cardGroupRef.current.position.y = Math.sin(time * 1.5) * 0.25;
    } else {
      // Suave interpolação com a posição do mouse quando parado
      const pointerX = state.pointer.x * 0.35;
      const pointerY = -state.pointer.y * 0.35;

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

    setCurrentEuler(cardGroupRef.current.rotation.clone());
  });

  return (
    <>
      {/* Gerador de FBO Holográfico do Crânio */}
      <SkullHologram
        color0={colors.border}
        color1={colors.base}
        eyeColor={colors.eye}
        onTextureReady={handleTextureReady}
        cardRotation={currentEuler}
      />

      <group ref={cardGroupRef} position={[0, 0, 0]}>
        {/* Face Frontal */}
        <mesh position={[0, 0, 0.02]} material={frontMaterial}>
          <planeGeometry args={[10, 15]} />
        </mesh>

        {/* Face Traseira */}
        <mesh
          position={[0, 0, -0.02]}
          rotation={[0, Math.PI, 0]}
          material={backMode === "holographic" ? backMaterialHolo : backMaterialPng}
        >
          <planeGeometry args={[10, 15]} />
        </mesh>

        {/* Borda chanfrada sólida 3D da carta */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[10.04, 15.04, 0.035]} />
          <meshStandardMaterial
            color="#27272a"
            metalness={0.85}
            roughness={0.2}
          />
        </mesh>
      </group>
    </>
  );
}
