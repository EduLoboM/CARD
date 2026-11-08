# Visualizador 3D de Carta Holográfica

Aplicação interativa em 3D construída com **Next.js (App Router)**, **React Three Fiber (R3F)**, **Three.js**, **GLSL Shaders** e **Tailwind CSS**.

---

## 🎴 Estrutura da Carta

1. **Frente da Carta:**
   - Reproduz a animação contínua e fluida de anime em alta taxa de quadros e sem travamentos.
   - Ícones de jogo embutidos e ampliados com numerais recortados em croma verde: **Custo 🔵**, **Ataque ⭐** e **Vida ❤️**.
   - Shaders holográficos procedurais com reflexo físico baseado na rotação e incidência de luz.
   - 9 estilos ricos de moldura com texturas e materiais distintos.

2. **Verso da Carta:**
   - Ilustração do **Bart Simpson** com profundidade e efeito 3D de paralaxe.
   - Moldura correspondente sincronizada com o tema frontal (incluindo o tema exclusivo de **Os Simpsons** com nuvens e placa de Springfield).

---

## ✨ Efeitos Holográficos (Shaders GLSL Procedurais)

- ⭐ **Estrelas Starlight (*Starlight Rare*)**: Padrão de estrelas cintilantes com reflexo iridescente que piscam conforme a carta se move no espaço 3D.
- 🏁 **Xadrez Mosaic (*Secret Rare*)**: Malha xadrez com facetas reflexivas alternadas em 90° e clarões prismáticos geométricos.
- ❄️ **Gelo Quebrado (*Cracked Ice*)**: Padrão facetado com reflexo cristalino pontiagudo.
- ⚡ **Colunas Laser (*Prismatic Pillars*)**: Feixes verticais prismáticos de alta intensidade com varredura dinâmica.
- 🌈 **Arco-Íris Cósmico (*Cosmic Galaxy*)**: Gradiente cósmico com micropartículas de glitter estelar.
- 🌟 **Ouro 3D Relevo (*Ultimate Rare*)**: Textura metálica dourada com relevo e brilho quente escovado.
- 👾 **Cyber Glitch (*Matrix Neon*)**: Linhas digitais com interferência cromática RGB.

---

## 🎨 Estilos de Borda Disponíveis

1. 🍩 **Os Simpsons**: Céu azul e nuvens clássicas de Springfield, moldura amarela cartoon, donut do Homer e placa de Springfield.
2. 👑 **Ouro & Obsidiana**: Pedra obsidiana negra texturizada com chanfros em ouro 24K e filigranas reais.
3. ⚡ **Cyberpunk Carbon**: Trama de fibra de carbono real com circuitos neon ciano e magenta.
4. 🔮 **Arcano & Runas**: Granito ancestral entalhado com inscrições rúnicas celtas em esmeralda e ouro antigo.
5. 🌆 **Retro Synthwave**: Gradiente sunset anos 80 com grid wireframe no horizonte.
6. 💥 **Pop-Art Mangá**: Textura halftone pontilhada com contornos pretos em nanquim e rajadas comic.
7. 🎴 **Clássico TCG**: Borda sólida perolada inspirada em cartas colecionáveis tradicionais.
8. ✨ **Minimalista Neon**: Traços duplos de laser futurista.
9. 🖼️ **Full Art**: Arte limpa de borda a borda com badges flutuantes.

---

## 🏛️ Arquitetura do Projeto

```
src/
├── types/
│   └── card.ts                 # Contratos de tipos de domínio (CardStats, FrontFrameStyle, etc.)
├── constants/
│   └── card.constants.ts       # Presets, listas de efeitos e configurações padrão
├── services/card/
│   ├── cardTemplates.ts        # Geradores de SVG e geometria vetorial (desacoplados de React)
│   └── cardShaders.ts          # Shaders GLSL encapsulados e reutilizáveis
├── hooks/
│   └── useSvgTexture.ts        # Hook de supersampling com cache em memória
├── components/card/
│   ├── Card3D.tsx              # Componente 3D Three.js otimizado (zero GC no useFrame)
│   ├── CardScene.tsx           # Setup do Canvas 3D, OrbitControls e iluminação
│   ├── CardSceneContainer.tsx  # Dynamic wrapper SSR:false
│   └── CardUI.tsx              # HUD e controles interativos
└── app/
    └── page.tsx                # Página principal com sincronização de bordas
```

---

## 🚀 Como Rodar

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador.
