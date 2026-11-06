export interface HearthstoneStats {
  cost: number;
  attack: number;
  health: number;
  title: string;
}

export function generateHearthstoneSVG(
  stats: HearthstoneStats,
  isFullArt: boolean = false
): string {
  const { cost, attack, health, title } = stats;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 838 1275" width="838" height="1275">
  <defs>
    <!-- Filtros de sombra suave e contorno -->
    <filter id="drop-shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="5" stdDeviation="6" flood-color="#000000" flood-opacity="0.8"/>
    </filter>
    <filter id="text-shadow">
      <feDropShadow dx="0" dy="4" stdDeviation="3" flood-color="#000000" flood-opacity="0.95"/>
    </filter>

    <!-- Gradiente Dourado Metálico Clássico -->
    <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fffbeb"/>
      <stop offset="18%" stop-color="#fef08a"/>
      <stop offset="45%" stop-color="#f59e0b"/>
      <stop offset="80%" stop-color="#b45309"/>
      <stop offset="100%" stop-color="#78350f"/>
    </linearGradient>

    <!-- Moldura de Madeira Nobre / Rocha Esculpida -->
    <linearGradient id="frame-body" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3f3f46"/>
      <stop offset="35%" stop-color="#27272a"/>
      <stop offset="75%" stop-color="#18181b"/>
      <stop offset="100%" stop-color="#09090b"/>
    </linearGradient>

    <!-- Gema Azul de Mana (Custo) -->
    <radialGradient id="mana-gem" cx="35%" cy="30%" r="65%">
      <stop offset="0%" stop-color="#bfdbfe"/>
      <stop offset="25%" stop-color="#60a5fa"/>
      <stop offset="65%" stop-color="#1d4ed8"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </radialGradient>

    <!-- Escudo / Brasão Amarelo Dourado (Ataque) -->
    <radialGradient id="attack-shield" cx="35%" cy="30%" r="65%">
      <stop offset="0%" stop-color="#fef08a"/>
      <stop offset="35%" stop-color="#facc15"/>
      <stop offset="70%" stop-color="#ca8a04"/>
      <stop offset="100%" stop-color="#713f12"/>
    </radialGradient>

    <!-- Gema Vermelha / Gota de Sangue (Vida) -->
    <radialGradient id="health-gem" cx="35%" cy="30%" r="65%">
      <stop offset="0%" stop-color="#fecaca"/>
      <stop offset="25%" stop-color="#ef4444"/>
      <stop offset="65%" stop-color="#b91c1c"/>
      <stop offset="100%" stop-color="#450a0a"/>
    </radialGradient>

    ${
      !isFullArt
        ? `
    <!-- Máscara de recorte oval do retrato do lacaio -->
    <mask id="portrait-mask">
      <rect width="838" height="1275" fill="white"/>
      <ellipse cx="419" cy="530" rx="335" ry="395" fill="black"/>
    </mask>
    `
        : ""
    }
  </defs>

  ${
    !isFullArt
      ? `
  <!-- 1. MOLDURA ESCULPIDA DE LACAIO LENDÁRIO (Modo Hearthstone Clássico) -->
  <g mask="url(#portrait-mask)" filter="url(#drop-shadow)">
    <!-- Fundo de pedra escura -->
    <path d="M 30,30 L 808,30 L 808,1245 L 30,1245 Z" fill="url(#frame-body)" opacity="0.94"/>
    <!-- Borda exterior chanfrada -->
    <rect x="22" y="22" width="794" height="1231" rx="38" fill="none" stroke="url(#gold-grad)" stroke-width="16"/>
  </g>

  <!-- Anel Dourado Ornamentado ao Redor do Retrato Oval -->
  <ellipse cx="419" cy="530" rx="338" ry="398" fill="none" stroke="url(#gold-grad)" stroke-width="18" filter="url(#drop-shadow)"/>
  <ellipse cx="419" cy="530" rx="328" ry="388" fill="none" stroke="#78350f" stroke-width="4"/>

  <!-- Dragão Lendário Dourado no Topo da Carta -->
  <g transform="translate(419, 105) scale(1.15)" filter="url(#drop-shadow)">
    <path d="M-170,-8 C-100,-42 100,-42 170,-8 C130,-2 90,12 0,22 C-90,12 -130,-2 -170,-8 Z" fill="url(#gold-grad)" stroke="#451a03" stroke-width="3"/>
    <path d="M-36,-2 L0,-44 L36,-2 L0,-12 Z" fill="url(#gold-grad)" stroke="#451a03" stroke-width="3"/>
    <circle cx="0" cy="-6" r="13" fill="#f97316" stroke="#451a03" stroke-width="3"/>
  </g>

  <!-- Faixa de Nome do Card (Abaixo do Retrato) -->
  <g transform="translate(419, 895)" filter="url(#drop-shadow)">
    <path d="M-270,-34 L270,-34 L295,34 L-295,34 Z" fill="#18181b" stroke="url(#gold-grad)" stroke-width="8"/>
    <!-- Gema Central da Faixa -->
    <polygon points="0,-20 18,0 0,20 -18,0" fill="#f97316" stroke="#ffffff" stroke-width="2"/>
    <text x="0" y="12" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="36" fill="#fef08a" stroke="#451a03" stroke-width="3" paint-order="stroke fill" text-anchor="middle" filter="url(#text-shadow)">
      ${title}
    </text>
  </g>
  `
      : ""
  }

  <!-- 2. ÍCONE DE CUSTO (MANA - Topo Esquerdo) -->
  <g transform="translate(100, 115)" filter="url(#drop-shadow)">
    <!-- Borda Octagonal Dourada -->
    <polygon points="0,-72 50,-50 72,0 50,50 0,72 -50,50 -72,0 -50,-50" fill="url(#gold-grad)" stroke="#451a03" stroke-width="6"/>
    <!-- Cristal Azul Facetado -->
    <polygon points="0,-58 40,-40 58,0 40,40 0,58 -40,40 -58,0 -40,-40" fill="url(#mana-gem)" stroke="#bfdbfe" stroke-width="3"/>
    <!-- Reflexo de Luz no Topo do Cristal -->
    <polygon points="0,-50 30,-32 0,-16 -30,-32" fill="#ffffff" opacity="0.45"/>
    <!-- Número do Custo -->
    <text x="0" y="30" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="88" fill="#ffffff" stroke="#09142b" stroke-width="12" paint-order="stroke fill" text-anchor="middle" filter="url(#text-shadow)">
      ${cost}
    </text>
  </g>

  <!-- 3. ÍCONE DE ATAQUE (Inferior Esquerdo) -->
  <g transform="translate(105, 1155)" filter="url(#drop-shadow)">
    <!-- Brasão Denteado / Estrela Dourada de Batalha -->
    <g transform="scale(1.15)">
      <rect x="-46" y="-46" width="92" height="92" rx="10" fill="url(#gold-grad)" stroke="#451a03" stroke-width="5"/>
      <rect x="-46" y="-46" width="92" height="92" rx="10" transform="rotate(45)" fill="url(#gold-grad)" stroke="#451a03" stroke-width="5"/>
    </g>
    <!-- Círculo Central de Ataque -->
    <circle cx="0" cy="0" r="58" fill="url(#attack-shield)" stroke="#713f12" stroke-width="5"/>
    <!-- Número de Ataque -->
    <text x="0" y="30" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="90" fill="#fef08a" stroke="#451a03" stroke-width="12" paint-order="stroke fill" text-anchor="middle" filter="url(#text-shadow)">
      ${attack}
    </text>
  </g>

  <!-- 4. ÍCONE DE VIDA (Inferior Direito) -->
  <g transform="translate(733, 1155)" filter="url(#drop-shadow)">
    <!-- Borda Dourada da Gota de Vida -->
    <path d="M0,-76 C48,-26 70,16 70,42 C70,78 38,100 0,100 C-38,100 -70,78 -70,42 C-70,16 -48,-26 0,-76 Z" fill="url(#gold-grad)" stroke="#450a0a" stroke-width="6"/>
    <!-- Gema Vermelha Rubi -->
    <path d="M0,-62 C40,-20 58,14 58,36 C58,68 32,86 0,86 C-32,86 -58,68 -58,36 C-58,14 -40,-20 0,-62 Z" fill="url(#health-gem)" stroke="#fecaca" stroke-width="3"/>
    <!-- Brilho no Topo da Gota -->
    <ellipse cx="-18" cy="16" rx="12" ry="24" fill="#ffffff" opacity="0.4" transform="rotate(-25 -18 16)"/>
    <!-- Número da Vida -->
    <text x="0" y="50" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="90" fill="#ffffff" stroke="#450a0a" stroke-width="12" paint-order="stroke fill" text-anchor="middle" filter="url(#text-shadow)">
      ${health}
    </text>
  </g>
</svg>`;
}
