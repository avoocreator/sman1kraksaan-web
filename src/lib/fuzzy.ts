
export function normalizeText(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const curr = [i];
    for (let j = 1; j <= b.length; j++) {
      curr[j] = Math.min(
        prev[j] + 1, // hapus
        curr[j - 1] + 1, // sisip
        prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1), // ganti
      );
    }
    prev = curr;
  }
  return prev[b.length];
}

function isSubsequence(q: string, t: string): boolean {
  let i = 0;
  for (let j = 0; j < t.length && i < q.length; j++) {
    if (q[i] === t[j]) i++;
  }
  return i === q.length;
}

function typoTolerance(word: string): number {
  if (word.length >= 6) return 2;
  if (word.length >= 4) return 1;
  return 0;
}

export function fuzzyScore(query: string, title: string, description = ""): number {
  const q = normalizeText(query);
  if (!q) return 0;

  const t = normalizeText(title);
  const d = normalizeText(description);
  const tTokens = t.split(" ").filter(Boolean);
  const dTokens = d.split(" ").filter(Boolean);

  if (t.includes(q)) return 1000 - Math.min(t.indexOf(q), 200);
  if (d && d.includes(q)) return 700;

  let total = 0;
  for (const qt of q.split(" ").filter(Boolean)) {
    let s = 0;
    if (tTokens.includes(qt)) s = Math.max(s, 220);
    if (tTokens.some((tt) => tt.startsWith(qt))) s = Math.max(s, 170);
    if (t.includes(qt)) s = Math.max(s, 130);
    if (dTokens.includes(qt)) s = Math.max(s, 80);
    if (d.includes(qt)) s = Math.max(s, 60);

    if (s === 0) {
      const tol = typoTolerance(qt);
      const nearTitle = Math.min(...tTokens.map((tt) => levenshtein(tt, qt)), Infinity);
      const nearDesc = Math.min(...dTokens.map((dt) => levenshtein(dt, qt)), Infinity);
      if (nearTitle <= tol) s = 100;
      else if (nearDesc <= tol) s = 40;
      else if (isSubsequence(qt, t)) s = 45;
    }
    total += s;
  }
  return total;
}

export function similarity(a: string, b: string): number {
  const x = normalizeText(a);
  const y = normalizeText(b);
  if (!x || !y) return 0;
  const dist = levenshtein(x, y);
  return 1 - dist / Math.max(x.length, y.length);
}
