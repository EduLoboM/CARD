# Projeto Next.js + Three.js + R3F + Rapier

Aplicação interativa em 3D com física realista em tempo real construída com **Next.js** (App Router), **Three.js**, **React Three Fiber (R3F)**, **@react-three/drei**, **@react-three/rapier** e **Tailwind CSS**.

---

## 🚀 Tecnologias Utilizadas

- **[Next.js](https://nextjs.org/)** (v16 App Router com Turbopack)
- **[React](https://react.dev/)** (v19)
- **[Three.js](https://threejs.org/)** (Renderização WebGL 3D)
- **[@react-three/fiber](https://docs.pmnd.rs/react-three-fiber)** (Renderizador declarativo do Three.js para React)
- **[@react-three/drei](https://github.com/pmndrs/drei)** (Utilitários e controles de câmera como `OrbitControls` e `Grid`)
- **[@react-three/rapier](https://github.com/pmndrs/react-three-rapier)** (Motor de física 3D em tempo real baseado em WebAssembly/Rust)
- **[Tailwind CSS](https://tailwindcss.com/)** (Estilização da interface overlay moderna)

---

## 🎮 Funcionalidades da Demonstração

1. **Simulação Física em Tempo Real:**
   - Gravidade e colisões realistas com coeficientes de atrito e restituição (quique).
   - Paredes invisíveis e chão sólido na arena.
   - Hélice giratória cinemática no centro que colide e rebate qualquer objeto.
2. **Interatividade:**
   - Clique em qualquer objeto 3D para aplicar um impulso de força para cima e rotação aleatória.
   - Adicione dinamicamente esferas, cubos e cápsulas, ou use o botão **Chuva (+8)** para disparar múltiplos corpos rígidos.
   - Alterne o modo **Debug Wireframes** do Rapier para inspecionar os volumes de colisão (*colliders*) e contatos físicos.
   - Botão de **Reset** para recarregar o estado inicial da arena.
3. **Controles de Câmera:**
   - Arraste com o botão esquerdo para orbitar a cena.
   - Scroll para zoom in / out.

---

## 📂 Estrutura de Pastas

```text
src/
├── app/
│   ├── layout.tsx         # Configuração HTML, fontes e metadados
│   ├── page.tsx           # Gerenciamento de estado dos objetos e layout principal
│   └── globals.css        # Importação do Tailwind CSS
├── components/
│   ├── canvas/
│   │   ├── Experience.tsx      # Cena física R3F (Physics, RigidBody, colliders, spinner e iluminação)
│   │   ├── Scene.tsx           # Componente Canvas com OrbitControls e Grid
│   │   └── SceneContainer.tsx  # Dynamic Import (ssr: false) para evitar conflitos de SSR com WebGL
│   └── dom/
│       └── UIOverlay.tsx       # Interface HUD/overlay com botões de controle e contador
```

---

## 🛠️ Como Executar

### 1. Iniciar o servidor de desenvolvimento:

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

### 2. Gerar build de produção:

```bash
npm run build
```

### 3. Iniciar em modo de produção:

```bash
npm start
```
