import { CardStats, FrontFrameStyle, BackFrameStyle } from "@/types/card";

// Gera o contorno SVG de uma estrela simétrica de N pontas
export function getStarPath(
  cx: number,
  cy: number,
  rOut: number,
  rIn: number,
  points: number = 5,
  rotDeg: number = -90
): string {
  const d: string[] = [];
  const angleStep = Math.PI / points;
  const startAngle = (rotDeg * Math.PI) / 180;
  for (let i = 0; i < 2 * points; i++) {
    const r = i % 2 === 0 ? rOut : rIn;
    const angle = startAngle + i * angleStep;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    const cmd = i === 0 ? "M" : "L";
    d.push(`${cmd} ${x.toFixed(1)},${y.toFixed(1)}`);
  }
  d.push("Z");
  return d.join(" ");
}

// Gera o contorno SVG de um coração clássico simétrico
export function getHeartPath(cx: number, cy: number, scale: number = 1.0): string {
  return (
    `M ${cx},${(cy - 25 * scale).toFixed(1)} ` +
    `C ${(cx - 40 * scale).toFixed(1)},${(cy - 75 * scale).toFixed(1)} ${(cx - 85 * scale).toFixed(1)},${(cy - 35 * scale).toFixed(1)} ${(cx - 75 * scale).toFixed(1)},${(cy + 15 * scale).toFixed(1)} ` +
    `C ${(cx - 65 * scale).toFixed(1)},${(cy + 55 * scale).toFixed(1)} ${(cx - 25 * scale).toFixed(1)},${(cy + 85 * scale).toFixed(1)} ${cx},${(cy + 110 * scale).toFixed(1)} ` +
    `C ${(cx + 25 * scale).toFixed(1)},${(cy + 85 * scale).toFixed(1)} ${(cx + 65 * scale).toFixed(1)},${(cy + 55 * scale).toFixed(1)} ${(cx + 75 * scale).toFixed(1)},${(cy + 15 * scale).toFixed(1)} ` +
    `C ${(cx + 85 * scale).toFixed(1)},${(cy - 35 * scale).toFixed(1)} ${(cx + 40 * scale).toFixed(1)},${(cy - 75 * scale).toFixed(1)} ${cx},${(cy - 25 * scale).toFixed(1)} Z`
  );
}

// Ajuste dinâmico de tipografia proporcional
export function getBadgeFontSize(val: number): number {
  const len = String(val).length;
  if (len >= 3) return 82;
  if (len === 2) return 96;
  return 108;
}

// Definições reutilizáveis de texturas, gradientes e padrões SVG
export const COMMON_SVG_DEFS = `
  <defs>
    <clipPath id="card-clip">
      <rect x="0" y="0" width="838" height="1275" rx="38" ry="38" />
    </clipPath>
    <!-- Gradientes de Ouro Imperial 24K -->
    <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#bf953f" />
      <stop offset="25%" stop-color="#fcf6ba" />
      <stop offset="50%" stop-color="#b38728" />
      <stop offset="75%" stop-color="#fbf5b7" />
      <stop offset="100%" stop-color="#aa771c" />
    </linearGradient>
    <linearGradient id="gold-bright" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#e5c07b" />
      <stop offset="50%" stop-color="#fff4d0" />
      <stop offset="100%" stop-color="#d19a66" />
    </linearGradient>
    <!-- Textura de Pedra Obsidiana Negra -->
    <pattern id="p-obsidian" width="40" height="40" patternUnits="userSpaceOnUse">
      <rect width="40" height="40" fill="#101216" />
      <path d="M 0,20 L 40,20 M 20,0 L 20,40 M 0,0 L 40,40 M 40,0 L 0,40" stroke="#1c1f26" stroke-width="1.5" />
      <circle cx="20" cy="20" r="2" fill="#282c37" />
    </pattern>
    <!-- Textura de Fibra de Carbono Cyberpunk -->
    <pattern id="p-carbon" width="20" height="20" patternUnits="userSpaceOnUse">
      <rect width="20" height="20" fill="#0b0e14" />
      <path d="M 0,0 L 10,10 M 10,0 L 0,10 M 10,10 L 20,20 M 20,10 L 10,20" stroke="#161c28" stroke-width="2" />
      <circle cx="10" cy="10" r="1.5" fill="#00f0ff" opacity="0.3" />
    </pattern>
    <!-- Gradiente Neon Cyberpunk -->
    <linearGradient id="cyber-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00f0ff" />
      <stop offset="50%" stop-color="#7000ff" />
      <stop offset="100%" stop-color="#ff007f" />
    </linearGradient>
    <!-- Textura de Granito Rúnico Arcano -->
    <pattern id="p-stone" width="30" height="30" patternUnits="userSpaceOnUse">
      <rect width="30" height="30" fill="#1b1c1e" />
      <path d="M 0,15 Q 15,10 30,15 M 15,0 Q 10,15 15,30" stroke="#25272b" stroke-width="1.5" />
      <circle cx="15" cy="15" r="1.5" fill="#383b42" />
    </pattern>
    <!-- Gradiente Rúnico Esmeralda e Ouro Antigo -->
    <linearGradient id="runic-gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#d4af37" />
      <stop offset="50%" stop-color="#10b981" />
      <stop offset="100%" stop-color="#f59e0b" />
    </linearGradient>
    <!-- Gradiente Sunset Retro Synthwave 80s -->
    <linearGradient id="synth-sunset" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1a0033" />
      <stop offset="35%" stop-color="#3a0ca3" />
      <stop offset="70%" stop-color="#f72585" />
      <stop offset="100%" stop-color="#ffb703" />
    </linearGradient>
    <!-- Grid Wireframe de Horizonte Synthwave -->
    <pattern id="p-synth-grid" width="32" height="32" patternUnits="userSpaceOnUse">
      <rect width="32" height="32" fill="none" />
      <line x1="0" y1="32" x2="32" y2="32" stroke="#f72585" stroke-width="2" opacity="0.7" />
      <line x1="16" y1="0" x2="16" y2="32" stroke="#4cc9f0" stroke-width="1.5" opacity="0.6" />
    </pattern>
    <!-- Textura Retrô Reticulada Halftone Mangá -->
    <pattern id="p-halftone" width="18" height="18" patternUnits="userSpaceOnUse">
      <rect width="18" height="18" fill="#fdf0d5" />
      <circle cx="5" cy="5" r="3" fill="#c1121f" />
      <circle cx="14" cy="14" r="3" fill="#003049" />
    </pattern>
    <!-- Céu Azul com Nuvens de Springfield (Os Simpsons) -->
    <linearGradient id="simpsons-sky" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#4aa5d8" />
      <stop offset="40%" stop-color="#6ec5e9" />
      <stop offset="100%" stop-color="#9ddbf5" />
    </linearGradient>
    <!-- Donut com Glacê Rosa e Granulados do Homer Simpson -->
    <pattern id="p-donut-sprinkles" width="48" height="48" patternUnits="userSpaceOnUse">
      <rect width="48" height="48" fill="#ff69b4" />
      <line x1="8" y1="12" x2="16" y2="16" stroke="#fed90f" stroke-width="4" stroke-linecap="round" />
      <line x1="28" y1="8" x2="36" y2="10" stroke="#ffffff" stroke-width="4" stroke-linecap="round" />
      <line x1="12" y1="32" x2="20" y2="28" stroke="#00f0ff" stroke-width="4" stroke-linecap="round" />
      <line x1="32" y1="30" x2="40" y2="38" stroke="#4ade80" stroke-width="4" stroke-linecap="round" />
      <line x1="22" y1="20" x2="26" y2="24" stroke="#fb923c" stroke-width="4" stroke-linecap="round" />
      <line x1="4" y1="42" x2="12" y2="44" stroke="#fed90f" stroke-width="4" stroke-linecap="round" />
      <line x1="38" y1="20" x2="44" y2="16" stroke="#c084fc" stroke-width="4" stroke-linecap="round" />
    </pattern>
  </defs>
`;

// Gera o template da BORDA FRONTAL de acordo com o estilo selecionado
export function generateEmbeddedCardTemplate(
  stats: CardStats,
  style: FrontFrameStyle = "simpsons"
): string {
  let activeStyle = style;
  if ((style as string) === "cyber") activeStyle = "cyber_matrix";
  if ((style as string) === "fantasy") activeStyle = "ancient_runic";

  const { cost, attack, health } = stats;

  const costCx = 108;
  const costCy = 110;
  const costR = 102;

  const atkCx = 120;
  const atkCy = 1154;
  const atkROut = 126;
  const atkRIn = 75;

  const hpCx = 718;
  const hpCy = 1140;
  const hpScale = 1.35;

  const costFontSize = getBadgeFontSize(cost);
  const atkFontSize = getBadgeFontSize(attack);
  const hpFontSize = getBadgeFontSize(health);

  // 1. OS SIMPSONS
  if (activeStyle === "simpsons") {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 838 1275" width="838" height="1275">
      ${COMMON_SVG_DEFS}
      <g clip-path="url(#card-clip)">
        <rect x="0" y="0" width="838" height="1275" fill="#00ff00" />
        <path d="M 0,0 L 838,0 L 838,1275 L 0,1275 Z M 48,72 L 790,72 L 790,1203 L 48,1203 Z" fill="url(#simpsons-sky)" fill-rule="evenodd" />
        <path d="M 50,45 C 50,25 75,15 95,30 C 115,15 150,18 165,35 C 185,30 205,48 198,68 C 175,70 140,70 110,68 C 80,70 50,68 50,45 Z" fill="#ffffff" opacity="0.95" />
        <path d="M 640,42 C 640,24 665,16 685,28 C 705,14 740,16 755,32 C 775,28 795,44 790,65 C 770,68 730,68 700,66 C 670,68 640,65 640,42 Z" fill="#ffffff" opacity="0.95" />
        <path d="M 280,1235 C 280,1210 320,1205 350,1220 C 380,1205 430,1208 460,1225 C 490,1210 535,1215 550,1235 Z" fill="#ffffff" opacity="0.95" />
        <rect x="18" y="18" width="802" height="1239" rx="24" fill="none" stroke="#fed90f" stroke-width="18" />
        <rect x="18" y="18" width="802" height="1239" rx="24" fill="none" stroke="#111111" stroke-width="4" />
        <rect x="42" y="66" width="754" height="1143" rx="14" fill="none" stroke="#111111" stroke-width="10" />
        <rect x="330" y="30" width="178" height="34" rx="17" fill="url(#p-donut-sprinkles)" stroke="#111111" stroke-width="4" />

        <circle cx="${costCx}" cy="${costCy}" r="${costR + 6}" fill="#fed90f" stroke="#111111" stroke-width="8" />
        <circle cx="${costCx}" cy="${costCy}" r="${costR - 2}" fill="url(#p-donut-sprinkles)" stroke="#111111" stroke-width="4" />
        <circle cx="${costCx}" cy="${costCy}" r="38" fill="#fed90f" stroke="#111111" stroke-width="4" />

        <path d="${getStarPath(atkCx + 5, atkCy + 5, atkROut + 6, atkRIn + 4, 5, -90)}" fill="#111111" />
        <path d="${getStarPath(atkCx, atkCy, atkROut + 6, atkRIn + 4, 5, -90)}" fill="#fed90f" stroke="#111111" stroke-width="8" />

        <path d="${getHeartPath(hpCx + 5, hpCy + 5, hpScale * 1.05)}" fill="#111111" />
        <path d="${getHeartPath(hpCx, hpCy, hpScale * 1.05)}" fill="#ff3366" stroke="#111111" stroke-width="8" />
        <ellipse cx="${hpCx - 28}" cy="${hpCy - 20}" rx="16" ry="8" transform="rotate(-30 ${hpCx - 28} ${hpCy - 20})" fill="#ffffff" opacity="0.6" />

        <text x="${costCx}" y="${costCy}" font-size="${costFontSize}" font-family="system-ui, Impact, sans-serif" font-weight="900" fill="#00ff00" text-anchor="middle" dominant-baseline="central">${cost}</text>
        <text x="${atkCx}" y="${atkCy}" font-size="${atkFontSize}" font-family="system-ui, Impact, sans-serif" font-weight="900" fill="#00ff00" text-anchor="middle" dominant-baseline="central">${attack}</text>
        <text x="${hpCx}" y="${hpCy + 28}" font-size="${hpFontSize}" font-family="system-ui, Impact, sans-serif" font-weight="900" fill="#00ff00" text-anchor="middle" dominant-baseline="central">${health}</text>
      </g>
    </svg>`;
  }

  // 2. OURO IMPERIAL & OBSIDIANA
  if (activeStyle === "gold_obsidian") {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 838 1275" width="838" height="1275">
      ${COMMON_SVG_DEFS}
      <g clip-path="url(#card-clip)">
        <rect x="0" y="0" width="838" height="1275" fill="#00ff00" />
        <path d="M 0,0 L 838,0 L 838,1275 L 0,1275 Z M 52,78 L 78,52 L 760,52 L 786,78 L 786,1197 L 760,1223 L 78,1223 L 52,1197 Z" fill="url(#p-obsidian)" fill-rule="evenodd" />
        <rect x="18" y="18" width="802" height="1239" rx="26" fill="none" stroke="url(#gold-grad)" stroke-width="12" />
        <polygon points="52,78 78,52 760,52 786,78 786,1197 760,1223 78,1223 52,1197" fill="none" stroke="url(#gold-bright)" stroke-width="4" />
        <polygon points="419,16 385,52 453,52" fill="url(#gold-grad)" />
        <circle cx="419" cy="40" r="6" fill="#101216" />
        <polygon points="32,32 75,32 32,75" fill="url(#gold-grad)" />
        <polygon points="806,32 763,32 806,75" fill="url(#gold-grad)" />
        <polygon points="32,1243 75,1243 32,1200" fill="url(#gold-grad)" />
        <polygon points="806,1243 763,1243 806,1200" fill="url(#gold-grad)" />

        <circle cx="${costCx}" cy="${costCy}" r="${costR + 8}" fill="url(#gold-grad)" />
        <circle cx="${costCx}" cy="${costCy}" r="${costR}" fill="#101216" stroke="url(#gold-bright)" stroke-width="8" />
        <path d="${getStarPath(atkCx, atkCy, atkROut + 10, atkRIn + 6, 5, -90)}" fill="url(#gold-grad)" />
        <path d="${getStarPath(atkCx, atkCy, atkROut, atkRIn, 5, -90)}" fill="#101216" stroke="url(#gold-bright)" stroke-width="8" />
        <path d="${getHeartPath(hpCx, hpCy, hpScale * 1.08)}" fill="url(#gold-grad)" />
        <path d="${getHeartPath(hpCx, hpCy, hpScale)}" fill="#101216" stroke="url(#gold-bright)" stroke-width="8" />

        <text x="${costCx}" y="${costCy}" font-size="${costFontSize}" font-family="system-ui, sans-serif" font-weight="900" fill="#00ff00" text-anchor="middle" dominant-baseline="central">${cost}</text>
        <text x="${atkCx}" y="${atkCy}" font-size="${atkFontSize}" font-family="system-ui, sans-serif" font-weight="900" fill="#00ff00" text-anchor="middle" dominant-baseline="central">${attack}</text>
        <text x="${hpCx}" y="${hpCy + 28}" font-size="${hpFontSize}" font-family="system-ui, sans-serif" font-weight="900" fill="#00ff00" text-anchor="middle" dominant-baseline="central">${health}</text>
      </g>
    </svg>`;
  }

  // 3. CYBERPUNK & FIBRA DE CARBONO
  if (activeStyle === "cyber_matrix") {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 838 1275" width="838" height="1275">
      ${COMMON_SVG_DEFS}
      <g clip-path="url(#card-clip)">
        <rect x="0" y="0" width="838" height="1275" fill="#00ff00" />
        <path d="M 0,0 L 838,0 L 838,1275 L 0,1275 Z M 48,76 L 76,48 L 762,48 L 790,76 L 790,1199 L 762,1227 L 76,1227 L 48,1199 Z" fill="url(#p-carbon)" fill-rule="evenodd" />
        <rect x="18" y="18" width="802" height="1239" rx="20" fill="none" stroke="#00f0ff" stroke-width="6" />
        <polygon points="48,76 76,48 762,48 790,76 L 790,1199 L 762,1227 L 76,1227 L 48,1199" fill="none" stroke="#ff007f" stroke-width="4" />
        <polygon points="370,44 468,44 448,76 390,76" fill="url(#cyber-grad)" />
        <rect x="22" y="580" width="16" height="120" rx="4" fill="#00f0ff" />
        <rect x="800" y="580" width="16" height="120" rx="4" fill="#ff007f" />

        <circle cx="${costCx}" cy="${costCy}" r="${costR + 6}" fill="url(#cyber-grad)" />
        <circle cx="${costCx}" cy="${costCy}" r="${costR}" fill="#0b0e14" stroke="#00f0ff" stroke-width="8" />
        <path d="${getStarPath(atkCx, atkCy, atkROut + 8, atkRIn + 4, 8, 0)}" fill="url(#cyber-grad)" />
        <path d="${getStarPath(atkCx, atkCy, atkROut, atkRIn, 8, 0)}" fill="#0b0e14" stroke="#00f0ff" stroke-width="8" />
        <path d="${getHeartPath(hpCx, hpCy, hpScale * 1.06)}" fill="url(#cyber-grad)" />
        <path d="${getHeartPath(hpCx, hpCy, hpScale)}" fill="#0b0e14" stroke="#ff007f" stroke-width="8" />

        <text x="${costCx}" y="${costCy}" font-size="${costFontSize}" font-family="system-ui, sans-serif" font-weight="900" fill="#00ff00" text-anchor="middle" dominant-baseline="central">${cost}</text>
        <text x="${atkCx}" y="${atkCy}" font-size="${atkFontSize}" font-family="system-ui, sans-serif" font-weight="900" fill="#00ff00" text-anchor="middle" dominant-baseline="central">${attack}</text>
        <text x="${hpCx}" y="${hpCy + 28}" font-size="${hpFontSize}" font-family="system-ui, sans-serif" font-weight="900" fill="#00ff00" text-anchor="middle" dominant-baseline="central">${health}</text>
      </g>
    </svg>`;
  }

  // 4. ARCANO & RUNAS CÉLTICAS
  if (activeStyle === "ancient_runic") {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 838 1275" width="838" height="1275">
      ${COMMON_SVG_DEFS}
      <g clip-path="url(#card-clip)">
        <rect x="0" y="0" width="838" height="1275" fill="#00ff00" />
        <path d="M 0,0 L 838,0 L 838,1275 L 0,1275 Z M 52,90 C 52,58 215,48 419,48 C 623,48 786,58 786,90 L 786,1223 L 52,1223 Z" fill="url(#p-stone)" fill-rule="evenodd" />
        <rect x="18" y="18" width="802" height="1239" rx="26" fill="none" stroke="url(#runic-gold)" stroke-width="8" />
        <polygon points="419,16 385,55 453,55" fill="url(#runic-gold)" />
        <text x="419" y="38" font-size="28" font-family="serif" font-weight="bold" fill="#1b1c1e" text-anchor="middle">᚛ ᚠ ᚢ ᚦ ᚨ ᚱ ᚲ ᚷ ᚜</text>

        <circle cx="${costCx}" cy="${costCy}" r="${costR + 8}" fill="url(#runic-gold)" />
        <circle cx="${costCx}" cy="${costCy}" r="${costR}" fill="#1b1c1e" stroke="url(#runic-gold)" stroke-width="6" />
        <path d="${getStarPath(atkCx, atkCy, atkROut + 8, atkRIn + 4, 8, 0)}" fill="url(#runic-gold)" />
        <path d="${getStarPath(atkCx, atkCy, atkROut, atkRIn, 8, 0)}" fill="#1b1c1e" stroke="url(#runic-gold)" stroke-width="6" />
        <path d="${getHeartPath(hpCx, hpCy, hpScale * 1.06)}" fill="url(#runic-gold)" />
        <path d="${getHeartPath(hpCx, hpCy, hpScale)}" fill="#1b1c1e" stroke="url(#runic-gold)" stroke-width="6" />

        <text x="${costCx}" y="${costCy}" font-size="${costFontSize}" font-family="system-ui, sans-serif" font-weight="900" fill="#00ff00" text-anchor="middle" dominant-baseline="central">${cost}</text>
        <text x="${atkCx}" y="${atkCy}" font-size="${atkFontSize}" font-family="system-ui, sans-serif" font-weight="900" fill="#00ff00" text-anchor="middle" dominant-baseline="central">${attack}</text>
        <text x="${hpCx}" y="${hpCy + 28}" font-size="${hpFontSize}" font-family="system-ui, sans-serif" font-weight="900" fill="#00ff00" text-anchor="middle" dominant-baseline="central">${health}</text>
      </g>
    </svg>`;
  }

  // 5. RETRO SYNTHWAVE & HORIZON GRID
  if (activeStyle === "retro_synthwave") {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 838 1275" width="838" height="1275">
      ${COMMON_SVG_DEFS}
      <g clip-path="url(#card-clip)">
        <rect x="0" y="0" width="838" height="1275" fill="#00ff00" />
        <path d="M 0,0 L 838,0 L 838,1275 L 0,1275 Z M 48,72 L 790,72 L 790,1203 L 48,1203 Z" fill="url(#synth-sunset)" fill-rule="evenodd" />
        <rect x="48" y="1050" width="742" height="153" fill="url(#p-synth-grid)" />
        <rect x="18" y="18" width="802" height="1239" rx="24" fill="none" stroke="#f72585" stroke-width="10" />
        <rect x="30" y="30" width="778" height="1215" rx="18" fill="none" stroke="#4cc9f0" stroke-width="4" />

        <circle cx="${costCx}" cy="${costCy}" r="${costR + 6}" fill="#f72585" />
        <circle cx="${costCx}" cy="${costCy}" r="${costR}" fill="#1a0033" stroke="#4cc9f0" stroke-width="8" />
        <path d="${getStarPath(atkCx, atkCy, atkROut + 8, atkRIn + 4, 4, -90)}" fill="#f72585" />
        <path d="${getStarPath(atkCx, atkCy, atkROut, atkRIn, 4, -90)}" fill="#1a0033" stroke="#4cc9f0" stroke-width="8" />
        <path d="${getHeartPath(hpCx, hpCy, hpScale * 1.06)}" fill="#f72585" />
        <path d="${getHeartPath(hpCx, hpCy, hpScale)}" fill="#1a0033" stroke="#ffb703" stroke-width="8" />

        <text x="${costCx}" y="${costCy}" font-size="${costFontSize}" font-family="system-ui, sans-serif" font-weight="900" fill="#00ff00" text-anchor="middle" dominant-baseline="central">${cost}</text>
        <text x="${atkCx}" y="${atkCy}" font-size="${atkFontSize}" font-family="system-ui, sans-serif" font-weight="900" fill="#00ff00" text-anchor="middle" dominant-baseline="central">${attack}</text>
        <text x="${hpCx}" y="${hpCy + 28}" font-size="${hpFontSize}" font-family="system-ui, sans-serif" font-weight="900" fill="#00ff00" text-anchor="middle" dominant-baseline="central">${health}</text>
      </g>
    </svg>`;
  }

  // 6. POP-ART MANGÁ & HALFTONE
  if (activeStyle === "comic_manga") {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 838 1275" width="838" height="1275">
      ${COMMON_SVG_DEFS}
      <g clip-path="url(#card-clip)">
        <rect x="0" y="0" width="838" height="1275" fill="#00ff00" />
        <path d="M 0,0 L 838,0 L 838,1275 L 0,1275 Z M 48,72 L 790,72 L 790,1203 L 48,1203 Z" fill="url(#p-halftone)" fill-rule="evenodd" />
        <rect x="18" y="18" width="802" height="1239" rx="20" fill="none" stroke="#111111" stroke-width="18" />
        <rect x="42" y="66" width="754" height="1143" rx="10" fill="none" stroke="#111111" stroke-width="8" />
        <polygon points="36,36 120,48 48,120" fill="#ffbe0b" stroke="#111111" stroke-width="4" />
        <polygon points="802,36 718,48 790,120" fill="#ffbe0b" stroke="#111111" stroke-width="4" />

        <circle cx="${costCx + 8}" cy="${costCy + 8}" r="${costR}" fill="#111111" />
        <circle cx="${costCx}" cy="${costCy}" r="${costR}" fill="#ffbe0b" stroke="#111111" stroke-width="10" />
        <path d="${getStarPath(atkCx + 8, atkCy + 8, atkROut, atkRIn, 5, -90)}" fill="#111111" />
        <path d="${getStarPath(atkCx, atkCy, atkROut, atkRIn, 5, -90)}" fill="#e63946" stroke="#111111" stroke-width="10" />
        <path d="${getHeartPath(hpCx + 8, hpCy + 8, hpScale)}" fill="#111111" />
        <path d="${getHeartPath(hpCx, hpCy, hpScale)}" fill="#e63946" stroke="#111111" stroke-width="10" />

        <text x="${costCx}" y="${costCy}" font-size="${costFontSize}" font-family="system-ui, sans-serif" font-weight="900" fill="#00ff00" text-anchor="middle" dominant-baseline="central">${cost}</text>
        <text x="${atkCx}" y="${atkCy}" font-size="${atkFontSize}" font-family="system-ui, sans-serif" font-weight="900" fill="#00ff00" text-anchor="middle" dominant-baseline="central">${attack}</text>
        <text x="${hpCx}" y="${hpCy + 28}" font-size="${hpFontSize}" font-family="system-ui, sans-serif" font-weight="900" fill="#00ff00" text-anchor="middle" dominant-baseline="central">${health}</text>
      </g>
    </svg>`;
  }

  // 7. MINIMALISTA NEON
  if (activeStyle === "minimal") {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 838 1275" width="838" height="1275">
      ${COMMON_SVG_DEFS}
      <g clip-path="url(#card-clip)">
        <rect x="0" y="0" width="838" height="1275" fill="#00ff00" />
        <rect x="18" y="18" width="802" height="1239" rx="26" fill="none" stroke="#ffffff" stroke-width="18" />
        <rect x="42" y="42" width="754" height="1191" rx="16" fill="none" stroke="#ffffff" stroke-width="4" />
        <circle cx="${costCx}" cy="${costCy}" r="96" fill="#ffffff" />
        <path d="${getStarPath(atkCx, atkCy, 118, 70, 5, -90)}" fill="#ffffff" />
        <path d="${getHeartPath(hpCx, hpCy, 1.25)}" fill="#ffffff" />
        <text x="${costCx}" y="${costCy}" font-size="96" font-family="system-ui, sans-serif" font-weight="900" fill="#00ff00" text-anchor="middle" dominant-baseline="central">${cost}</text>
        <text x="${atkCx}" y="${atkCy}" font-size="92" font-family="system-ui, sans-serif" font-weight="900" fill="#00ff00" text-anchor="middle" dominant-baseline="central">${attack}</text>
        <text x="${hpCx}" y="${hpCy + 28}" font-size="96" font-family="system-ui, sans-serif" font-weight="900" fill="#00ff00" text-anchor="middle" dominant-baseline="central">${health}</text>
      </g>
    </svg>`;
  }

  // 8. FULL ART
  if (activeStyle === "full_art") {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 838 1275" width="838" height="1275">
      ${COMMON_SVG_DEFS}
      <g clip-path="url(#card-clip)">
        <rect x="0" y="0" width="838" height="1275" fill="#00ff00" />
        <circle cx="${costCx}" cy="${costCy}" r="92" fill="#ffffff" opacity="0.9" />
        <path d="${getStarPath(atkCx, atkCy, 112, 65, 5, -90)}" fill="#ffffff" opacity="0.9" />
        <path d="${getHeartPath(hpCx, hpCy, 1.2)}" fill="#ffffff" opacity="0.9" />
        <text x="${costCx}" y="${costCy}" font-size="96" font-family="system-ui, sans-serif" font-weight="900" fill="#00ff00" text-anchor="middle" dominant-baseline="central">${cost}</text>
        <text x="${atkCx}" y="${atkCy}" font-size="92" font-family="system-ui, sans-serif" font-weight="900" fill="#00ff00" text-anchor="middle" dominant-baseline="central">${attack}</text>
        <text x="${hpCx}" y="${hpCy + 28}" font-size="96" font-family="system-ui, sans-serif" font-weight="900" fill="#00ff00" text-anchor="middle" dominant-baseline="central">${health}</text>
      </g>
    </svg>`;
  }

  // 9. CLÁSSICO TCG (Padrão)
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 838 1275" width="838" height="1275">
    ${COMMON_SVG_DEFS}
    <g clip-path="url(#card-clip)">
      <rect x="0" y="0" width="838" height="1275" fill="#00ff00" />
      <rect x="0" y="0" width="838" height="32" fill="#ffffff" />
      <rect x="0" y="1243" width="838" height="32" fill="#ffffff" />
      <rect x="0" y="0" width="32" height="1275" fill="#ffffff" />
      <rect x="806" y="0" width="32" height="1275" fill="#ffffff" />

      <path d="M 0,0 L 108,0 L 108,32 C 68,32 32,68 32,110 L 0,110 Z" fill="#ffffff" />
      <circle cx="${costCx}" cy="${costCy}" r="${costR}" fill="#ffffff" />
      <path d="${getStarPath(atkCx, atkCy, atkROut, atkRIn, 5, -90)}" fill="#ffffff" />
      <path d="${getHeartPath(hpCx, hpCy, hpScale)}" fill="#ffffff" />

      <text x="${costCx}" y="${costCy}" font-size="${costFontSize}" font-family="system-ui, -apple-system, sans-serif" font-weight="900" fill="#00ff00" text-anchor="middle" dominant-baseline="central">${cost}</text>
      <text x="${atkCx}" y="${atkCy}" font-size="${atkFontSize}" font-family="system-ui, -apple-system, sans-serif" font-weight="900" fill="#00ff00" text-anchor="middle" dominant-baseline="central">${attack}</text>
      <text x="${hpCx}" y="${hpCy + 28}" font-size="${hpFontSize}" font-family="system-ui, -apple-system, sans-serif" font-weight="900" fill="#00ff00" text-anchor="middle" dominant-baseline="central">${health}</text>
    </g>
  </svg>`;
}

// Gera o template da BORDA DO VERSO (Traseira da Carta com Bart Simpson)
export function generateBackCardTemplate(style: BackFrameStyle): string | null {
  if (style === "original") {
    return null; // Usa o cardtemplateback4.png clássico dos assets
  }

  let activeStyle = style;
  if ((style as string) === "cyber") activeStyle = "cyber_matrix";
  if ((style as string) === "fantasy") activeStyle = "ancient_runic";

  // 1. VERSO OS SIMPSONS
  if (activeStyle === "simpsons") {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 838 1275" width="838" height="1275">
      ${COMMON_SVG_DEFS}
      <g clip-path="url(#card-clip)">
        <rect x="0" y="0" width="838" height="1275" fill="#00ff00" />
        <path d="M 0,0 L 838,0 L 838,1275 L 0,1275 Z M 48,72 L 790,72 L 790,1203 L 48,1203 Z" fill="url(#simpsons-sky)" fill-rule="evenodd" />
        <path d="M 60,65 C 60,35 100,20 130,40 C 160,20 210,25 230,50 C 260,40 290,65 280,95 C 240,100 180,100 140,95 C 100,100 60,95 60,65 Z" fill="#ffffff" opacity="0.95" />
        <path d="M 550,55 C 550,30 590,15 620,35 C 650,15 700,20 720,45 C 750,35 780,60 770,90 C 730,95 670,95 630,90 C 590,95 550,90 550,55 Z" fill="#ffffff" opacity="0.95" />
        <path d="M 220,1230 C 220,1195 280,1190 320,1210 C 360,1190 420,1195 450,1218 C 490,1198 550,1205 570,1230 Z" fill="#ffffff" opacity="0.95" />

        <rect x="18" y="18" width="802" height="1239" rx="24" fill="none" stroke="#fed90f" stroke-width="18" />
        <rect x="18" y="18" width="802" height="1239" rx="24" fill="none" stroke="#111111" stroke-width="4" />
        <rect x="42" y="66" width="754" height="1143" rx="14" fill="none" stroke="#111111" stroke-width="10" />

        <rect x="330" y="30" width="178" height="34" rx="17" fill="url(#p-donut-sprinkles)" stroke="#111111" stroke-width="4" />
        <rect x="330" y="1210" width="178" height="34" rx="17" fill="#fed90f" stroke="#111111" stroke-width="4" />
        <text x="419" y="1227" font-size="18" font-family="system-ui, Impact, sans-serif" font-weight="900" fill="#111111" text-anchor="middle" dominant-baseline="central">SPRINGFIELD</text>
      </g>
    </svg>`;
  }

  // 2. VERSO OURO IMPERIAL & OBSIDIANA
  if (activeStyle === "gold_obsidian") {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 838 1275" width="838" height="1275">
      ${COMMON_SVG_DEFS}
      <g clip-path="url(#card-clip)">
        <rect x="0" y="0" width="838" height="1275" fill="#00ff00" />
        <path d="M 0,0 L 838,0 L 838,1275 L 0,1275 Z M 56,92 L 92,56 L 746,56 L 782,92 L 782,1183 L 746,1219 L 92,1219 L 56,1183 Z" fill="url(#p-obsidian)" fill-rule="evenodd" />
        <rect x="20" y="20" width="798" height="1235" rx="28" fill="none" stroke="url(#gold-grad)" stroke-width="14" />
        <polygon points="56,92 92,56 746,56 782,92 782,1183 746,1219 92,1219 56,1183" fill="none" stroke="url(#gold-bright)" stroke-width="4" />
        <polygon points="419,25 350,60 380,75 419,50 458,75 488,60" fill="url(#gold-grad)" />
        <polygon points="419,1250 350,1215 380,1200 419,1225 458,1200 488,1215" fill="url(#gold-grad)" />
      </g>
    </svg>`;
  }

  // 3. VERSO CYBER MATRIX & CARBONO
  if (activeStyle === "cyber_matrix") {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 838 1275" width="838" height="1275">
      ${COMMON_SVG_DEFS}
      <g clip-path="url(#card-clip)">
        <rect x="0" y="0" width="838" height="1275" fill="#00ff00" />
        <path d="M 0,0 L 838,0 L 838,1275 L 0,1275 Z M 52,90 L 90,52 L 748,52 L 786,90 L 786,1185 L 748,1223 L 90,1223 L 52,1185 Z" fill="url(#p-carbon)" fill-rule="evenodd" />
        <rect x="18" y="18" width="802" height="1239" rx="20" fill="none" stroke="#00f0ff" stroke-width="8" />
        <polygon points="52,90 90,52 748,52 786,90 786,1185 L 748,1223 L 90,1223 L 52,1185 Z" fill="none" stroke="#ff007f" stroke-width="4" />
        <polygon points="419,25 350,60 380,75 419,50 458,75 488,60" fill="url(#cyber-grad)" />
        <polygon points="419,1250 350,1215 380,1200 419,1225 458,1200 488,1215" fill="url(#cyber-grad)" />
      </g>
    </svg>`;
  }

  // 4. VERSO ARCANO RÚNICO
  if (activeStyle === "ancient_runic") {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 838 1275" width="838" height="1275">
      ${COMMON_SVG_DEFS}
      <g clip-path="url(#card-clip)">
        <rect x="0" y="0" width="838" height="1275" fill="#00ff00" />
        <path d="M 0,0 L 838,0 L 838,1275 L 0,1275 Z M 48,95 C 48,60 220,50 419,50 C 618,50 790,60 790,95 L 790,1180 C 790,1215 618,1225 419,1225 C 220,1225 48,1215 48,1180 Z" fill="url(#p-stone)" fill-rule="evenodd" />
        <rect x="22" y="22" width="794" height="1231" rx="28" fill="none" stroke="url(#runic-gold)" stroke-width="8" />
        <polygon points="419,15 390,60 448,60" fill="url(#runic-gold)" />
        <polygon points="419,1260 390,1215 448,1215" fill="url(#runic-gold)" />
      </g>
    </svg>`;
  }

  // 5. VERSO RETRO SYNTHWAVE
  if (activeStyle === "retro_synthwave") {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 838 1275" width="838" height="1275">
      ${COMMON_SVG_DEFS}
      <g clip-path="url(#card-clip)">
        <rect x="0" y="0" width="838" height="1275" fill="#00ff00" />
        <path d="M 0,0 L 838,0 L 838,1275 L 0,1275 Z M 48,72 L 790,72 L 790,1203 L 48,1203 Z" fill="url(#synth-sunset)" fill-rule="evenodd" />
        <rect x="48" y="1050" width="742" height="153" fill="url(#p-synth-grid)" />
        <rect x="18" y="18" width="802" height="1239" rx="24" fill="none" stroke="#f72585" stroke-width="10" />
        <rect x="30" y="30" width="778" height="1215" rx="18" fill="none" stroke="#4cc9f0" stroke-width="4" />
      </g>
    </svg>`;
  }

  // 6. VERSO POP-ART MANGÁ
  if (activeStyle === "comic_manga") {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 838 1275" width="838" height="1275">
      ${COMMON_SVG_DEFS}
      <g clip-path="url(#card-clip)">
        <rect x="0" y="0" width="838" height="1275" fill="#00ff00" />
        <path d="M 0,0 L 838,0 L 838,1275 L 0,1275 Z M 48,72 L 790,72 L 790,1203 L 48,1203 Z" fill="url(#p-halftone)" fill-rule="evenodd" />
        <rect x="18" y="18" width="802" height="1239" rx="20" fill="none" stroke="#111111" stroke-width="18" />
        <polygon points="36,36 120,48 48,120" fill="#ffbe0b" stroke="#111111" stroke-width="4" />
        <polygon points="802,36 718,48 790,120" fill="#ffbe0b" stroke="#111111" stroke-width="4" />
        <polygon points="36,1239 120,1227 48,1155" fill="#ffbe0b" stroke="#111111" stroke-width="4" />
        <polygon points="802,1239 718,1227 790,1155" fill="#ffbe0b" stroke="#111111" stroke-width="4" />
      </g>
    </svg>`;
  }

  // 7. VERSO MINIMALISTA NEON
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 838 1275" width="838" height="1275">
    ${COMMON_SVG_DEFS}
    <g clip-path="url(#card-clip)">
      <rect x="0" y="0" width="838" height="1275" fill="#00ff00" />
      <rect x="20" y="20" width="798" height="1235" rx="30" fill="none" stroke="#ffffff" stroke-width="18" />
      <rect x="44" y="44" width="750" height="1187" rx="20" fill="none" stroke="#ffffff" stroke-width="6" />
    </g>
  </svg>`;
}
