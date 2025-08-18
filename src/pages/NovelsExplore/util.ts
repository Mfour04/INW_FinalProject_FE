import { CHIPS, RINGS } from "./constant";

function getSeedIndex(seed: string, mod: number) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) | 0;
  }
  return Math.abs(h) % mod;
}

export function variantFromSeed(seed: string) {
  const i = getSeedIndex(seed, RINGS.length);
  return { ring: RINGS[i], chip: CHIPS[i] };
}

export function variantFromSeedRing(seed: string) {
  const i = getSeedIndex(seed, RINGS.length);
  return { ring: RINGS[i] };
}

export const fmt = (n: number) =>
  Intl.NumberFormat("en", { notation: "compact" }).format(n);
