/**
 * Habilidades e Traits inspiradas nas mecânicas de Plants vs. Zombies Heroes.
 */
export type CardTrait =
  | "Amphibious"    // Pode ser jogado em pistas aquáticas (Lane 4)
  | "Bullseye"      // O dano causado não carrega o Super-Block Meter do herói inimigo
  | "Strikethrough" // Ataca o lacaio inimigo e o herói na mesma pista simultaneamente
  | "Frenzy"        // Se destruir um lacaio inimigo, ataca novamente
  | "Armored"       // Reduz todo o dano recebido em 1 (mínimo 1 de dano restante)
  | "Deadly"        // Qualquer dano causado destrói o lacaio inimigo instantaneamente
  | "AntiHero"      // Ganha bônus de ataque quando não há inimigo na sua pista
  | "TeamUp"        // Permite jogar dois lacaios na mesma pista
  | "Untrickable";  // Imune a cartas de truques inimigos
