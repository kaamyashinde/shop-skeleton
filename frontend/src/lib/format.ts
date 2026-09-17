/** 3990 -> "39,90 kr". Money is øre everywhere; format only when you display it. */
export function formatOre(ore: number): string {
  const kr = (ore / 100).toLocaleString('nb-NO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  return `${kr} kr`
}
