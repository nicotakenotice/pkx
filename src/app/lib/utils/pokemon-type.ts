import { PokemonTypeColor } from './constants';

/**
 * Returns a radial-gradient CSS string for a given Pokémon primary type.
 * Falls back to a neutral gradient if the type is unknown.
 */
export function getTypeGradient(typeName: string | undefined | null): string {
  const color = typeName ? (PokemonTypeColor[typeName] ?? '#888888') : '#888888';
  return `radial-gradient(ellipse at 50% 85%, ${hexToRgba(color, 0.4)} 0%, transparent 70%)`;
}

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
