# Visualizador 3D de Carta Holográfica

Aplicação interativa em 3D construída com **Next.js (App Router)**, **React Three Fiber (R3F)**, **Three.js**, **GLSL Shaders** e **Postprocessing Bloom**.

---

## 🎴 Estrutura da Carta

1. **Frente da Carta (`CARD_FRONT`):**
   - Reproduz a animação contínua e fluida de [`EXAMPLE_CARD/CARD_FRONT.gif`](file:///home/eduardolm/Documents/JOTA/EXAMPLE_CARD/CARD_FRONT.gif) (otimizada em alta taxa de quadros e sem travamentos).
   - Acabamento iridescente e reflexivo holográfico (Foil Shader) com partículas de glitter e resposta à luz.
   - Camada frontal de profundidade em relevo 3D inspirada na mecânica de [`EXAMPLE_CARD/CARD_FRONT/`](file:///home/eduardolm/Documents/JOTA/EXAMPLE_CARD/CARD_FRONT/).
   - Opção de alternar entre o modo **Full Art** e o modo **Moldura TCG**.

2. **Verso da Carta (`CARD_BACK`):**
   - Ilustração do **Bart Simpson** de [`EXAMPLE_CARD/CARD_BACK.png`](file:///home/eduardolm/Documents/JOTA/EXAMPLE_CARD/CARD_BACK.png).
   - Efeito holográfico suave no verso com reflexo cintilante conforme a carta é inclinada.

---

## 🎮 Interatividade

- 🖱️ **Órbita 3D (360°):** Clique e arraste com o botão esquerdo para girar a carta em qualquer direção.
- 🔍 **Zoom:** Roda do mouse (*scroll*).
- ✨ **Parallax do Mouse:** A carta inclina-se suavemente acompanhando o cursor do mouse.
- 🔄 **Virar Carta (180°):** Alterna com transição suave entre a Frente (Animação) e o Verso (Bart Simpson).
- 🎴 **Modo de Moldura:** Alterna entre *Full Art* e *Moldura TCG*.
- ⏸️ **Giro 360° Automático:** Modo vitrine contínuo com flutuação gravitacional.
- ✨ **Controle de Foil e Bloom:** Sliders para controlar a intensidade holográfica e o brilho (*glow*).

---

## 🚀 Como Rodar

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador.
