# 🤖 Guia de Desenvolvimento para Agentes de IA (AGENTS.md)

Este documento foi projetado para orientar agentes de IA (Antigravity, Cursor, Claude, Copilot, Codex, etc.) no entendimento, extensão e manutenção deste repositório.

---

## 🎯 Visão do Projeto

O projeto é um **Jogo de Cartas Colecionáveis em 3D por Pistas (Lane-Based CCG)** fortemente inspirado nas mecânicas de **Plants vs. Zombies Heroes (PvZ Heroes)**, combinado com cartas holográficas tridimensionais colecionáveis renderizadas em WebGL.

### Stack Tecnológica
- **Framework:** Next.js 16 (App Router + Turbopack)
- **3D & Shaders:** Three.js + React Three Fiber (`@react-three/fiber`) + `@react-three/drei` + GLSL Shaders customizados
- **Estilização:** Tailwind CSS v4
- **Testes:** Node.js Native Test Runner com `tsx`
- **Linguagem:** TypeScript estrito

---

## 📂 Mapa da Arquitetura

```
src/
├── types/
│   ├── card.ts                 # Tipos visuais da carta 3D (FrontFrameStyle, HoloEffectType, etc.)
│   └── game/                   # Tipos do motor de jogo PvZ Heroes
│       ├── traits.ts           # Habilidades (Bullseye, Amphibious, Strikethrough, Frenzy, etc.)
│       ├── card.ts             # Definição de cartas de combate, lacaios e truques
│       ├── lane.ts             # Estrutura das 5 pistas (Heights, Ground, Water)
│       ├── hero.ts             # Heróis, Super-Block Meter e Superpoderes
│       └── gameState.ts        # Fases de turno, recursos (Sol/Cérebros) e estado da mesa
│
├── constants/
│   └── card.constants.ts       # Presets de cores, mapeamento de efeitos e configurações padrão
│
├── data/
│   └── cards/                  # Catálogo declarativo de cartas do jogo
│       └── starterDeck.ts      # Baralhos iniciais de Plantas e Zumbis
│
├── engine/                     # Motor de regras determinístico e desacoplado de UI
│   ├── gameState.ts            # Inicialização de partida, validação e jogada em pistas
│   └── combat.ts               # Resolução de combate canônica pista por pista (0 a 4)
│
├── services/card/              # Serviços gráficos puros
│   ├── cardTemplates.ts        # Geradores de SVG e geometria vetorial (Simpsons, Ouro, Cyber, etc.)
│   └── cardShaders.ts          # Shaders GLSL de foil holográfico procedurais
│
├── hooks/
│   └── useSvgTexture.ts        # Conversão SVG ➔ CanvasTexture 2X com cache em memória
│
├── components/card/            # Componentes visuais
│   ├── Card3D.tsx              # Componente 3D Three.js otimizado (zero GC no useFrame)
│   ├── CardScene.tsx           # Setup do Canvas 3D, OrbitControls e iluminação
│   ├── CardSceneContainer.tsx  # Dynamic wrapper SSR:false
│   └── CardUI.tsx              # HUD 2D e controles de seleção de estilos e efeitos
│
├── app/
│   └── page.tsx                # Página principal da aplicação
│
└── tests/
    └── engine/                 # Testes unitários do motor de regras (executados com `npm test`)
```

---

## 🎮 Regras e Mecânicas de Jogo (PvZ Heroes)

### 1. Sistema de 5 Pistas (*5 Lanes*)
O tabuleiro possui exatamente 5 pistas numeradas de 0 a 4:
- **Pista 0 (HEIGHTS):** Terreno elevado. Unidades jogadas aqui recebem bônus de altura (+1 de ataque).
- **Pistas 1, 2 e 3 (GROUND):** Terreno padrão terrestre.
- **Pista 4 (WATER):** Pista aquática. **Apenas unidades com o trait `Amphibious` podem ser jogadas aqui**.

### 2. Ciclo de Turnos Canônico
1. **ZOMBIE_MINIONS:** Jogador Zumbi joga criaturas nas pistas.
2. **PLANT_PLAY:** Jogador Planta joga criaturas e truques nas pistas.
3. **ZOMBIE_TRICKS:** Jogador Zumbi joga truques e feitiços.
4. **COMBAT:** Resolução automática pista por pista da esquerda para a direita (0 a 4).
5. **ROUND_END:** Compra de cartas, incremento de Sol/Cérebros máximos (+1 por turno).

### 3. Habilidades Especiais (*Traits*)
- **`Amphibious`**: Pode ser jogado na pista aquática (Pista 4).
- **`Bullseye`**: O dano causado não carrega o Super-Block Meter do herói inimigo.
- **`Strikethrough`**: Ataca o lacaio inimigo e o herói na mesma pista simultaneamente.
- **`Frenzy`**: Quando destrói um lacaio inimigo e sobrevive, ataca novamente imediatamente.
- **`Armored`**: Reduz todo o dano recebido em 1 (mínimo de 1 de dano restante).
- **`Deadly`**: Qualquer dano destrói a criatura inimiga instantaneamente.
- **`AntiHero`**: Ganha +2 de ataque quando a pista correspondente estiver vazia (sem bloqueador).

### 4. Super-Block Meter
- Cada Herói começa com 20 de Vida e um medidor de 8 seções.
- Ao sofrer dano direto de criaturas sem `Bullseye`, o medidor carrega.
- Ao atingir 8 seções, o medidor ativa o **Super-Block**: bloqueia 100% daquele dano e concede um superpoder ao herói.

---

## 🛠️ Comandos de Desenvolvimento

Qualquer agente de IA que fizer alterações **DEVE** rodar os comandos abaixo para garantir integridade:

```bash
# Executa a suite de testes unitários do motor de regras
npm test

# Valida a tipagem estrita do TypeScript sem compilar o bundle
npm run type-check

# Valida o build completo de produção do Next.js
npm run build

# Inicia o servidor local de desenvolvimento
npm run dev
```

---

## 📋 Diretrizes para Agentes de IA

1. **Separação Rígida de Camadas**:
   - As regras de jogo ficam em `src/engine/` e devem ser **funções puras e determinísticas**, sem importar Three.js, React ou DOM.
   - Os testes ficam em `tests/` e devem cobrir qualquer nova mecânica adicionada.

2. **Como Adicionar uma Nova Carta**:
   - Defina a carta em `src/data/cards/starterDeck.ts` utilizando a interface `GameCardDefinition`.
   - Especifique traits, custo, ataque, vida e atributos visuais (estilo de borda e efeito holográfico).

3. **Performance no Three.js / WebGL (60 FPS)**:
   - **NUNCA** instancie objetos (`new THREE.Matrix4()`, `new THREE.Vector3()`, `new THREE.Color()`) dentro do loop de `useFrame`.
   - Hoiste instâncias estáticas para fora do componente para evitar sobrecarga de Garbage Collection.

4. **Princípio YAGNI e Clean Code**:
   - Não crie abstrações antecipadas ou arquivos sem utilidade imediata.
   - Mantenha funções pequenas e com responsabilidade única.
