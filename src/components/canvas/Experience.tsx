"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import {
  Physics,
  RigidBody,
  RapierRigidBody,
  CuboidCollider,
} from "@react-three/rapier";
import * as THREE from "three";

export interface PhysicsObjectData {
  id: string;
  type: "box" | "sphere" | "capsule";
  position: [number, number, number];
  color: string;
  scale: number;
}

interface ExperienceProps {
  debug: boolean;
  objects: PhysicsObjectData[];
  onObjectClick?: (id: string) => void;
}

// Obstáculo cinemático que gira continuamente e rebate objetos
function KineticSpinner() {
  const spinnerRef = useRef<RapierRigidBody>(null);

  useFrame((state) => {
    if (!spinnerRef.current) return;
    const time = state.clock.getElapsedTime();
    const euler = new THREE.Euler(0, time * 1.5, 0);
    const quat = new THREE.Quaternion().setFromEuler(euler);
    spinnerRef.current.setNextKinematicRotation(quat);
  });

  return (
    <RigidBody
      ref={spinnerRef}
      type="kinematicPosition"
      position={[0, 0.4, 0]}
      colliders="cuboid"
      restitution={0.8}
      friction={0.2}
    >
      <mesh castShadow receiveShadow>
        <boxGeometry args={[4, 0.5, 0.4]} />
        <meshStandardMaterial
          color="#38bdf8"
          roughness={0.2}
          metalness={0.8}
          emissive="#0284c7"
          emissiveIntensity={0.2}
        />
      </mesh>
      {/* Marcador central */}
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.3, 16]} />
        <meshStandardMaterial color="#f43f5e" emissive="#e11d48" emissiveIntensity={0.5} />
      </mesh>
    </RigidBody>
  );
}

// Componente para renderizar objeto dinâmico interativo
function InteractiveObject({
  item,
  onClick,
}: {
  item: PhysicsObjectData;
  onClick?: () => void;
}) {
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const [hovered, setHovered] = useState(false);

  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    if (rigidBodyRef.current) {
      // Aplica impulso vertical e aleatório ao clicar
      const forceY = 6 + Math.random() * 4;
      const forceX = (Math.random() - 0.5) * 5;
      const forceZ = (Math.random() - 0.5) * 5;
      rigidBodyRef.current.applyImpulse({ x: forceX, y: forceY, z: forceZ }, true);
      rigidBodyRef.current.applyTorqueImpulse(
        {
          x: (Math.random() - 0.5) * 2,
          y: (Math.random() - 0.5) * 2,
          z: (Math.random() - 0.5) * 2,
        },
        true
      );
    }
    onClick?.();
  };

  return (
    <RigidBody
      ref={rigidBodyRef}
      colliders={
        item.type === "sphere"
          ? "ball"
          : item.type === "capsule"
          ? "hull"
          : "cuboid"
      }
      position={item.position}
      restitution={item.type === "sphere" ? 0.85 : 0.4}
      friction={0.4}
      linearDamping={0.1}
      angularDamping={0.1}
    >
      <mesh
        castShadow
        receiveShadow
        onClick={handleClick}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
        scale={hovered ? item.scale * 1.08 : item.scale}
      >
        {item.type === "box" && <boxGeometry args={[1, 1, 1]} />}
        {item.type === "sphere" && <sphereGeometry args={[0.55, 32, 32]} />}
        {item.type === "capsule" && <capsuleGeometry args={[0.3, 0.7, 16, 32]} />}

        <meshStandardMaterial
          color={item.color}
          roughness={0.25}
          metalness={0.3}
          emissive={hovered ? item.color : "#000000"}
          emissiveIntensity={hovered ? 0.35 : 0}
        />
      </mesh>
    </RigidBody>
  );
}

export default function Experience({
  debug,
  objects,
  onObjectClick,
}: ExperienceProps) {
  return (
    <>
      {/* Iluminação */}
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[10, 15, 10]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-camera-near={1}
        shadow-camera-far={30}
      />
      <pointLight position={[-8, 6, -8]} intensity={0.8} color="#a855f7" />
      <pointLight position={[8, 4, 8]} intensity={0.5} color="#06b6d4" />

      {/* Simulação física Rapier */}
      <Physics gravity={[0, -9.81, 0]} debug={debug}>
        {/* Chão e paredes invisíveis para manter os objetos na arena */}
        <RigidBody type="fixed" restitution={0.3} friction={0.6}>
          {/* Superfície visível do chão */}
          <mesh receiveShadow position={[0, -0.25, 0]}>
            <boxGeometry args={[16, 0.5, 16]} />
            <meshStandardMaterial
              color="#0f172a"
              roughness={0.8}
              metalness={0.2}
            />
          </mesh>

          {/* Bordas elevadas da arena */}
          <mesh position={[0, 0.25, 8.1]}>
            <boxGeometry args={[16.4, 0.5, 0.2]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          <mesh position={[0, 0.25, -8.1]}>
            <boxGeometry args={[16.4, 0.5, 0.2]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          <mesh position={[8.1, 0.25, 0]}>
            <boxGeometry args={[0.2, 0.5, 16.4]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          <mesh position={[-8.1, 0.25, 0]}>
            <boxGeometry args={[0.2, 0.5, 16.4]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
        </RigidBody>

        {/* Paredes de colisão para que os corpos rígidos não fujam */}
        <CuboidCollider args={[8, 5, 0.5]} position={[0, 5, 8.5]} />
        <CuboidCollider args={[8, 5, 0.5]} position={[0, 5, -8.5]} />
        <CuboidCollider args={[0.5, 5, 8]} position={[8.5, 5, 0]} />
        <CuboidCollider args={[0.5, 5, 8]} position={[-8.5, 5, 0]} />

        {/* Hélice giratória (Kinematic) */}
        <KineticSpinner />

        {/* Objetos dinâmicos instanciados */}
        {objects.map((obj) => (
          <InteractiveObject
            key={obj.id}
            item={obj}
            onClick={() => onObjectClick?.(obj.id)}
          />
        ))}
      </Physics>
    </>
  );
}
