"use client";

import { useState, useEffect, useRef } from "react";
import * as THREE from "three";

// Cache em memória para texturas já renderizadas, evitando re-desenhar o canvas repetidamente
const textureCache = new Map<string, THREE.CanvasTexture>();

/**
 * Converte uma string SVG em uma textura Three.js CanvasTexture 2X supersampled.
 * Implementa cacheamento de texturas para performance ultra-rápida na troca de estilos.
 */
export function useSvgTexture(svgStr: string | null): THREE.Texture | null {
  const [texture, setTexture] = useState<THREE.Texture | null>(() => {
    return svgStr ? textureCache.get(svgStr) ?? null : null;
  });
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!svgStr) {
      setTexture(null);
      return;
    }

    // Se já estiver em cache, aplica instantaneamente com zero overhead
    const cached = textureCache.get(svgStr);
    if (cached) {
      setTexture(cached);
      return;
    }

    const blob = new Blob([svgStr], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const img = new Image();

    img.onload = () => {
      if (!isMountedRef.current) {
        URL.revokeObjectURL(url);
        return;
      }

      const width = 1676;
      const height = 2550;

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

      // Guarda no cache
      textureCache.set(svgStr, tex);

      if (isMountedRef.current) {
        setTexture(tex);
      }

      URL.revokeObjectURL(url);
    };

    img.src = url;

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [svgStr]);

  return texture;
}
