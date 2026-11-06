"use client";

import { useMemo, useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { useFBO } from "@react-three/drei";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { vertSkull, fragSkull } from "./CardShaders";

interface SkullHologramProps {
  color0: [number, number, number];
  color1: [number, number, number];
  eyeColor: [number, number, number];
  onTextureReady: (texture: THREE.Texture) => void;
  cardRotation: THREE.Euler;
}

export default function SkullHologram({
  color0,
  color1,
  eyeColor,
  onTextureReady,
  cardRotation,
}: SkullHologramProps) {
  const fbo = useFBO(512, 512, {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBAFormat,
  });

  const obj = useLoader(OBJLoader, "/assets/skull5.obj");

  const { rttScene, rttCamera, skullMaterial, eyeMaterial, modelGroup } =
    useMemo(() => {
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x020617);

      const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 1000);
      camera.position.set(0, -3.5, 30);
      camera.lookAt(0, -3.5, 0);

      const mat = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          color0: { value: new THREE.Vector3(...color0).multiplyScalar(1 / 255) },
          color1: { value: new THREE.Vector3(...color1).multiplyScalar(1 / 255) },
        },
        vertexShader: vertSkull,
        fragmentShader: fragSkull,
        transparent: true,
        side: THREE.DoubleSide,
      });

      const eyeMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(...eyeColor.map((c) => c / 255)),
      });

      const group = new THREE.Group();

      // Olhos brilhantes
      const sphereGeo = new THREE.SphereGeometry(1.4, 24, 24);
      const eyeL = new THREE.Mesh(sphereGeo, eyeMat);
      const eyeR = new THREE.Mesh(sphereGeo, eyeMat);
      eyeL.position.set(-2.2, -2.2, -6.6);
      eyeR.position.set(2.2, -2.2, -6.6);
      group.add(eyeL);
      group.add(eyeR);

      // Crânio 3D
      const skullClone = obj.clone();
      skullClone.position.set(0, 0, -10);
      skullClone.rotation.set(Math.PI, 0, Math.PI);
      skullClone.scale.set(8, 8, 8);

      skullClone.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          mesh.geometry.computeVertexNormals();
          mesh.material = mat;
        }
      });

      group.add(skullClone);
      scene.add(group);

      return {
        rttScene: scene,
        rttCamera: camera,
        skullMaterial: mat,
        eyeMaterial: eyeMat,
        modelGroup: group,
      };
    }, [obj]);

  useFrame(({ gl, clock, camera }) => {
    const time = clock.getElapsedTime();

    // Atualiza uniforms do shader
    skullMaterial.uniforms.time.value = time;
    skullMaterial.uniforms.color0.value.set(
      color0[0] / 255,
      color0[1] / 255,
      color0[2] / 255
    );
    skullMaterial.uniforms.color1.value.set(
      color1[0] / 255,
      color1[1] / 255,
      color1[2] / 255
    );
    eyeMaterial.color.setRGB(
      eyeColor[0] / 255,
      eyeColor[1] / 255,
      eyeColor[2] / 255
    );

    // Efeito de paralaxe baseado no ângulo de visualização
    modelGroup.rotation.y = -cardRotation.y * 0.7 - camera.rotation.y * 0.4;
    modelGroup.rotation.x = -cardRotation.x * 0.7 + camera.rotation.x * 0.4;

    // Renderiza a cena RTT no FBO
    gl.setRenderTarget(fbo);
    gl.clear();
    gl.render(rttScene, rttCamera);
    gl.setRenderTarget(null);

    onTextureReady(fbo.texture);
  });

  return null;
}
