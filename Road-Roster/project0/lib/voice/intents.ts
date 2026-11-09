import { tokenize, vocabulary } from './normalize';

export type VoiceIntent =
  | { type: 'call'; contactName: string }
  | { type: 'read_messages'; contactName: string }
  | { type: 'send_message'; contactName: string; body: string };

export type IgnoreReason =
  | 'no_command'
  | 'missing_contact_name'
  | 'missing_message_text';

export type ParseResult =
  | { status: 'intent'; intent: VoiceIntent }
  | { status: 'ignored'; reason: IgnoreReason };

const CALL_NOUNS = vocabulary(['कॉल', 'फोन']);
const CALL_VERBS = vocabulary(['लगाओ', 'लगा', 'लगाऊं', 'करो', 'मिलाओ']);
const MESSAGE_NOUNS = vocabulary(['मैसेज', 'संदेश']);
const READ_VERBS = vocabulary(['पढ़ो', 'पढ़', 'पढ़ें', 'सुनाओ', 'सुनाऊं']);
const SEND_VERBS = vocabulary(['भेजो', 'भेज']);
const POSSESSIVE_FILLERS = vocabulary(['का', 'की', 'के']);
const TO_MARKER = vocabulary(['को'])[0];
const BODY_MARKER = vocabulary(['कि'])[0];

function cleanContactName(tokens: string[]): string {
  return tokens.filter((token) => !POSSESSIVE_FILLERS.includes(token)).join(' ');
}

function indexOfAny(tokens: string[], candidates: string[]): number {
  return tokens.findIndex((token) => candidates.includes(token));
}

export function parseVoiceCommand(utterance: string): ParseResult {
  const tokens = tokenize(utterance);
  if (tokens.length === 0) return { status: 'ignored', reason: 'no_command' };

  const hasCallNoun = indexOfAny(tokens, CALL_NOUNS) !== -1;
  const hasCallVerb = indexOfAny(tokens, CALL_VERBS) !== -1;
  const hasMessageNoun = indexOfAny(tokens, MESSAGE_NOUNS) !== -1;
  const hasReadVerb = indexOfAny(tokens, READ_VERBS) !== -1;
  const hasSendVerb = indexOfAny(tokens, SEND_VERBS) !== -1;

  if (hasMessageNoun && hasSendVerb) {
    return parseSendMessage(tokens);
  }

  if (hasMessageNoun && hasReadVerb) {
    const contactName = contactBeforeNoun(tokens, MESSAGE_NOUNS);
    if (!contactName) return { status: 'ignored', reason: 'missing_contact_name' };
    return { status: 'intent', intent: { type: 'read_messages', contactName } };
  }

  if (hasCallNoun && hasCallVerb) {
    const contactName = contactBeforeNoun(tokens, [TO_MARKER, ...CALL_NOUNS]);
    if (!contactName) return { status: 'ignored', reason: 'missing_contact_name' };
    return { status: 'intent', intent: { type: 'call', contactName } };
  }

  return { status: 'ignored', reason: 'no_command' };
}

function contactBeforeNoun(tokens: string[], nouns: string[]): string {
  const nounIndex = indexOfAny(tokens, nouns);
  if (nounIndex <= 0) return '';
  return cleanContactName(tokens.slice(0, nounIndex));
}

function parseSendMessage(tokens: string[]): ParseResult {
  const toIndex = tokens.indexOf(TO_MARKER);
  const contactTokens = toIndex === -1 ? tokens.slice(0, indexOfAny(tokens, MESSAGE_NOUNS)) : tokens.slice(0, toIndex);
  const contactName = cleanContactName(contactTokens.filter((token) => !MESSAGE_NOUNS.includes(token)));
  if (!contactName) return { status: 'ignored', reason: 'missing_contact_name' };

  const bodyIndex = tokens.indexOf(BODY_MARKER);
  const body = bodyIndex === -1 ? '' : tokens.slice(bodyIndex + 1).join(' ');
  if (!body) return { status: 'ignored', reason: 'missing_message_text' };

  return { status: 'intent', intent: { type: 'send_message', contactName, body } };
}
