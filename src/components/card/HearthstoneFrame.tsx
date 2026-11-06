"use client";

import { useMemo } from "react";
import { Text } from "@react-three/drei";
import * as THREE from "three";

export interface HearthstoneStats {
  cost: number;
  attack: number;
  health: number;
  title: string;
}

interface HearthstoneFrameProps {
  stats: HearthstoneStats;
  isFullArt?: boolean;
}

export default function HearthstoneFrame({
  stats,
  isFullArt = false,
}: HearthstoneFrameProps) {
  // Materiais compartilhados
  const goldMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#fbbf24",
        metalness: 0.85,
        roughness: 0.25,
      }),
    []
  );

  const darkGoldMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#b45309",
        metalness: 0.8,
        roughness: 0.35,
      }),
    []
  );

  const blueGemMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#1d4ed8",
        roughness: 0.15,
        metalness: 0.3,
        emissive: "#1e40af",
        emissiveIntensity: 0.25,
      }),
    []
  );

  const redGemMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#dc2626",
        roughness: 0.15,
        metalness: 0.25,
        emissive: "#991b1b",
        emissiveIntensity: 0.3,
      }),
    []
  );

  const attackShieldMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#d97706",
        roughness: 0.25,
        metalness: 0.65,
        emissive: "#b45309",
        emissiveIntensity: 0.2,
      }),
    []
  );

  return (
    <group position={[0, 0, 0.08]}>
      {/* 1. MOLDURA DE LACAIO LENDÁRIO (Estilo Hearthstone) */}
      {!isFullArt && (
        <group position={[0, 0, 0]}>
          {/* Dragon Arch superior (Coroa lendária no topo) */}
          <mesh position={[0, 7.3, 0.04]} material={goldMaterial}>
            <boxGeometry args={[7.2, 0.45, 0.1]} />
          </mesh>
          <mesh position={[-2.8, 7.55, 0.06]} material={goldMaterial} rotation={[0, 0, -0.3]}>
            <coneGeometry args={[0.35, 0.9, 16]} />
          </mesh>
          <mesh position={[2.8, 7.55, 0.06]} material={goldMaterial} rotation={[0, 0, 0.3]}>
            <coneGeometry args={[0.35, 0.9, 16]} />
          </mesh>
          <mesh position={[0, 7.65, 0.08]} material={goldMaterial}>
            <octahedronGeometry args={[0.45]} />
          </mesh>

          {/* Bordas laterais esculpidas */}
          <mesh position={[-4.75, 0.5, 0.03]} material={darkGoldMaterial}>
            <boxGeometry args={[0.45, 12.8, 0.08]} />
          </mesh>
          <mesh position={[4.75, 0.5, 0.03]} material={darkGoldMaterial}>
            <boxGeometry args={[0.45, 12.8, 0.08]} />
          </mesh>

          {/* Borda inferior */}
          <mesh position={[0, -7.25, 0.03]} material={darkGoldMaterial}>
            <boxGeometry args={[9.5, 0.45, 0.08]} />
          </mesh>

          {/* Placa de Nome / Banner Scroll (Abaixo do retrato do lacaio) */}
          <group position={[0, -4.5, 0.08]}>
            {/* Banner de fundo */}
            <mesh>
              <boxGeometry args={[6.8, 1.25, 0.08]} />
              <meshStandardMaterial
                color="#18181b"
                metalness={0.7}
                roughness={0.3}
              />
            </mesh>
            {/* Moldura dourada do banner */}
            <mesh position={[0, 0, 0.02]} material={goldMaterial}>
              <boxGeometry args={[7.0, 0.12, 0.1]} />
            </mesh>
            <mesh position={[0, -0.6, 0.02]} material={goldMaterial}>
              <boxGeometry args={[7.0, 0.12, 0.1]} />
            </mesh>

            {/* Gema lendária no centro do banner */}
            <mesh position={[0, 0, 0.08]}>
              <octahedronGeometry args={[0.25]} />
              <meshStandardMaterial
                color="#f97316"
                emissive="#ea580c"
                emissiveIntensity={0.6}
              />
            </mesh>

            {/* Texto do Nome da Carta */}
            <Text
              position={[0, 0.05, 0.06]}
              fontSize={0.48}
              color="#fef08a"
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.035}
              outlineColor="#18181b"
              font="/fonts/Geist-Bold.ttf" // fallback padrão do drei Troika
            >
              {stats.title.toUpperCase()}
            </Text>
          </group>
        </group>
      )}

      {/* 2. CRISTAL DE MANA (CUSTO - Topo Esquerdo) */}
      <group position={[-4.2, 6.3, 0.1]}>
        {/* Anel dourado externo */}
        <mesh rotation={[Math.PI / 2, 0, 0]} material={goldMaterial}>
          <cylinderGeometry args={[1.22, 1.22, 0.1, 8]} />
        </mesh>
        {/* Núcleo facetado de cristal azul */}
        <mesh position={[0, 0, 0.05]} rotation={[Math.PI / 2, 0, 0]} material={blueGemMaterial}>
          <cylinderGeometry args={[0.98, 0.98, 0.14, 8]} />
        </mesh>
        {/* Brilho interno do cristal */}
        <mesh position={[0, 0, 0.12]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.65, 0.65, 0.05]} />
          <meshStandardMaterial color="#60a5fa" emissive="#3b82f6" emissiveIntensity={0.5} />
        </mesh>

        {/* Número do Custo */}
        <Text
          position={[0, 0, 0.2]}
          fontSize={1.15}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.08}
          outlineColor="#09142b"
        >
          {stats.cost}
        </Text>
      </group>

      {/* 3. ÍCONE DE ATAQUE (Inferior Esquerdo) */}
      <group position={[-4.0, -6.1, 0.1]}>
        {/* Brasão denteado / Estrela de 8 pontas dourada */}
        <mesh position={[0, 0, 0]} material={darkGoldMaterial}>
          <boxGeometry args={[2.0, 2.0, 0.08]} />
        </mesh>
        <mesh position={[0, 0, 0.01]} rotation={[0, 0, Math.PI / 4]} material={darkGoldMaterial}>
          <boxGeometry args={[2.0, 2.0, 0.08]} />
        </mesh>

        {/* Círculo interno dourado de ataque */}
        <mesh position={[0, 0, 0.05]} rotation={[Math.PI / 2, 0, 0]} material={attackShieldMaterial}>
          <cylinderGeometry args={[0.92, 0.92, 0.12, 24]} />
        </mesh>

        {/* Espadas cruzadas de relevo no fundo */}
        <mesh position={[0, 0, 0.1]} rotation={[0, 0, 0.78]}>
          <boxGeometry args={[1.2, 0.15, 0.04]} />
          <meshStandardMaterial color="#451a03" />
        </mesh>
        <mesh position={[0, 0, 0.1]} rotation={[0, 0, -0.78]}>
          <boxGeometry args={[1.2, 0.15, 0.04]} />
          <meshStandardMaterial color="#451a03" />
        </mesh>

        {/* Número do Ataque */}
        <Text
          position={[0, 0, 0.2]}
          fontSize={1.15}
          color="#fef08a"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.08}
          outlineColor="#451a03"
        >
          {stats.attack}
        </Text>
      </group>

      {/* 4. ÍCONE DE VIDA (Inferior Direito) */}
      <group position={[4.0, -6.1, 0.1]}>
        {/* Moldura dourada da gota/escudo de sangue */}
        <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]} material={goldMaterial}>
          <cylinderGeometry args={[1.2, 1.2, 0.1, 24]} />
        </mesh>

        {/* Gema de rubi vermelha em forma de gota */}
        <mesh position={[0, -0.05, 0.05]} rotation={[Math.PI / 2, 0, 0]} material={redGemMaterial}>
          <cylinderGeometry args={[0.95, 0.95, 0.14, 24]} />
        </mesh>
        {/* Ponta superior da gota de vida */}
        <mesh position={[0, 0.85, 0.07]} rotation={[0, 0, Math.PI]} material={redGemMaterial}>
          <coneGeometry args={[0.5, 0.75, 16]} />
        </mesh>

        {/* Número de Vida */}
        <Text
          position={[0, -0.05, 0.2]}
          fontSize={1.15}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.08}
          outlineColor="#450a0a"
        >
          {stats.health}
        </Text>
      </group>
    </group>
  );
}
