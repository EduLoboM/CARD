# Visualizador 3D de Carta Holográfica (Next.js + Three.js / R3F)

Visualizador interativo em 3D da carta presente em [`EXAMPLE_CARD`](file:///home/eduardolm/Documents/JOTA/EXAMPLE_CARD/), recriada em **Next.js (App Router)** com **React Three Fiber (R3F)**, **Three.js**, **GLSL Shaders**, **Render-to-Texture (FBO)** e **Postprocessing Bloom**.

---

## 🎴 O que foi implementado

1. **Frente da Carta Holográfica:**
   - Shaders GLSL customizados com efeito iridescente/arco-íris e ruído cintilante (*sparkle noise*).
   - Detecção da janela interna de ilustração.
   - **Holograma 3D Interno:** Crânio tridimensional (`skull5.obj`) com olhos incandescentes e efeito de fogo procedural (*FBM noise*), renderizado em tempo real via FBO offscreen.
   - **Efeito Parallax / Lenticular:** O modelo 3D no interior da carta responde à inclinação da carta e do cursor do mouse.

2. **Verso da Carta:**
   - Modo 1: **Holográfico Original** (com o emblema floral e borda iridescente).
   - Modo 2: **[`CARD_BACK.png`](file:///home/eduardolm/Documents/JOTA/EXAMPLE_CARD/CARD_BACK.png)** texturizado com reflexão e acabamento metálico.

3. **Interatividade e Controles:**
   - **Órbita 3D Livre (360°):** Arraste com o botão esquerdo para inspecionar qualquer ângulo.
   - **Zoom:** Roda do mouse (*scroll*).
   - **Inclinação Holográfica:** A carta se inclina suavemente acompanhando o ponteiro do mouse quando estática.
   - **Botão Virar Carta (180°):** Alterna suavemente entre frente e verso.
   - **Giro Automático:** Modo vitrine giratório contínuo com flutuação suave.
   - **Paletas de Cor Holográfica:**
     - *Roxo Místico*
     - *Ciano Cyber*
     - *Fogo Dourado*
     - *Esmeralda*
   - **Efeito Glow / Bloom:** Controle de intensidade de brilho pós-processado.

---

## 🚀 Como Executar

### Iniciar o servidor de desenvolvimento:

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

### Gerar build de produção:

```bash
npm run build
npm start
```
