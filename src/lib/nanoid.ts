// Tiny url-safe id generator
export function nanoid(size = 10): string {
  const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
  let id = "";
  const rand = typeof crypto !== "undefined" && crypto.getRandomValues
    ? Array.from(crypto.getRandomValues(new Uint8Array(size)))
    : Array.from({ length: size }, () => Math.floor(Math.random() * 256));
  for (const b of rand) id += alphabet[b % alphabet.length];
  return id;
}
