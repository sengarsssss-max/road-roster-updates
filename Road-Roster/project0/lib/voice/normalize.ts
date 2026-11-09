const PUNCTUATION_PATTERN = /[।,.!?;:"'()\-]/g;
const NUKTA_PATTERN = /\u093C/g;
const ZERO_WIDTH_PATTERN = /[\u200B-\u200D\uFEFF]/g;

export function normalizeDevanagari(text: string): string {
  return text
    .normalize('NFD')
    .replace(ZERO_WIDTH_PATTERN, '')
    .replace(NUKTA_PATTERN, '')
    .normalize('NFC')
    .replace(PUNCTUATION_PATTERN, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function vocabulary(words: string[]): string[] {
  return words.map(normalizeDevanagari);
}

export function tokenize(text: string): string[] {
  const normalized = normalizeDevanagari(text);
  return normalized === '' ? [] : normalized.split(' ');
}

export function containsPhrase(tokens: string[], phrase: string[]): boolean {
  if (phrase.length === 0 || phrase.length > tokens.length) return false;
  for (let start = 0; start <= tokens.length - phrase.length; start++) {
    let matches = true;
    for (let offset = 0; offset < phrase.length; offset++) {
      if (tokens[start + offset] !== phrase[offset]) {
        matches = false;
        break;
      }
    }
    if (matches) return true;
  }
  return false;
}
