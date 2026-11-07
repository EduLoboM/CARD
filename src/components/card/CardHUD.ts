export interface CardStats {
  cost: number;
  attack: number;
  health: number;
  title: string;
}

export function generateHolographicHUD(
  stats: CardStats,
  borderColorHex: string = "#c551f5"
): string {
  const { cost, attack, health, title } = stats;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 838 1275" width="838" height="1275">
  <defs>
    <!-- Filtros de brilho neon holográfico suave -->
    <filter id="neon-glow" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="6" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>

    <filter id="badge-shadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#000000" flood-opacity="0.9" />
    </filter>

    <linearGradient id="glass-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e293b" stop-opacity="0.9" />
      <stop offset="100%" stop-color="#090d16" stop-opacity="0.95" />
    </linearGradient>
  </defs>

  <!-- 1. BADGE DE MANA / CUSTO (Hexágono Crystalline Top-Left) -->
  <g transform="translate(100, 110)" filter="url(#badge-shadow)">
    <!-- Base de vidro translúcido -->
    <polygon points="0,-48 42,-24 42,24 0,48 -42,24 -42,-24" fill="url(#glass-grad)" stroke="${borderColorHex}" stroke-width="4.5" filter="url(#neon-glow)" />
    <!-- Borda interna neon -->
    <polygon points="0,-40 35,-20 35,20 0,40 -35,20 -35,-20" fill="none" stroke="#38bdf8" stroke-width="1.8" opacity="0.8" />
    <!-- Rótulo e Valor -->
    <text x="0" y="-12" font-size="12" font-family="system-ui, -apple-system, sans-serif" font-weight="800" fill="#93c5fd" letter-spacing="1.5" text-anchor="middle">MANA</text>
    <text x="0" y="24" font-size="36" font-family="system-ui, -apple-system, sans-serif" font-weight="900" fill="#ffffff" text-anchor="middle">${cost}</text>
  </g>

  <!-- 2. PLACA DE TÍTULO HOLOGRÁFICA (Pill Glass Bottom-Center) -->
  <g transform="translate(419, 1175)" filter="url(#badge-shadow)">
    <!-- Base de vidro translúcido -->
    <rect x="-190" y="-26" width="380" height="52" rx="26" fill="url(#glass-grad)" stroke="${borderColorHex}" stroke-width="3.5" filter="url(#neon-glow)" />
    <rect x="-182" y="-20" width="364" height="40" rx="20" fill="none" stroke="#ffffff" stroke-width="1" opacity="0.3" />
    <!-- Título da Carta -->
    <text x="0" y="8" font-size="20" font-family="system-ui, -apple-system, sans-serif" font-weight="800" fill="#ffffff" letter-spacing="3" text-anchor="middle">
      ${title.toUpperCase()}
    </text>
  </g>

  <!-- 3. BADGE DE ATAQUE (Shield Hex Bottom-Left) -->
  <g transform="translate(115, 1170)" filter="url(#badge-shadow)">
    <circle cx="0" cy="0" r="42" fill="url(#glass-grad)" stroke="#f59e0b" stroke-width="4.5" filter="url(#neon-glow)" />
    <circle cx="0" cy="0" r="35" fill="none" stroke="#fbbf24" stroke-width="1.5" opacity="0.7" />
    <text x="0" y="-10" font-size="11" font-family="system-ui, -apple-system, sans-serif" font-weight="800" fill="#fde68a" letter-spacing="1.5" text-anchor="middle">ATK</text>
    <text x="0" y="22" font-size="32" font-family="system-ui, -apple-system, sans-serif" font-weight="900" fill="#ffffff" text-anchor="middle">${attack}</text>
  </g>

  <!-- 4. BADGE DE VIDA / DEFESA (Shield Gem Bottom-Right) -->
  <g transform="translate(723, 1170)" filter="url(#badge-shadow)">
    <circle cx="0" cy="0" r="42" fill="url(#glass-grad)" stroke="#ef4444" stroke-width="4.5" filter="url(#neon-glow)" />
    <circle cx="0" cy="0" r="35" fill="none" stroke="#f87171" stroke-width="1.5" opacity="0.7" />
    <text x="0" y="-10" font-size="11" font-family="system-ui, -apple-system, sans-serif" font-weight="800" fill="#fca5a5" letter-spacing="1.5" text-anchor="middle">HP</text>
    <text x="0" y="22" font-size="32" font-family="system-ui, -apple-system, sans-serif" font-weight="900" fill="#ffffff" text-anchor="middle">${health}</text>
  </g>
</svg>`;
}
