import { containsPhrase, tokenize, vocabulary } from './normalize';
import type { VoiceIntent } from './intents';

export type ConfirmationAction = VoiceIntent;

export type ConfirmationState =
  | { status: 'idle' }
  | { status: 'awaiting'; action: ConfirmationAction; retriesLeft: number };

export type ConfirmationStep =
  | { outcome: 'pending'; state: ConfirmationState; prompt: string }
  | { outcome: 'confirmed'; state: ConfirmationState; action: ConfirmationAction }
  | { outcome: 'declined'; state: ConfirmationState; action: ConfirmationAction }
  | { outcome: 'no_answer'; state: ConfirmationState; action: ConfirmationAction };

const YES_PHRASES = [['हाँ'], ['हां'], ['हा'], ['जी'], ['ठीक', 'है'], ['कर', 'दो']].map(vocabulary);
const NO_PHRASES = [['ना'], ['नहीं'], ['मत'], ['रहने', 'दो'], ['रद्द']].map(vocabulary);

const MAX_RETRIES = 1;

export function startConfirmation(action: ConfirmationAction): ConfirmationStep {
  return {
    outcome: 'pending',
    state: { status: 'awaiting', action, retriesLeft: MAX_RETRIES },
    prompt: confirmationQuestion(action),
  };
}

export function advanceConfirmation(state: ConfirmationState, utterance: string): ConfirmationStep {
  if (state.status !== 'awaiting') {
    throw new Error('No action is waiting for confirmation.');
  }

  const answer = classifyAnswer(utterance);
  const { action } = state;

  if (answer === 'yes') {
    return { outcome: 'confirmed', state: { status: 'idle' }, action };
  }
  if (answer === 'no') {
    return { outcome: 'declined', state: { status: 'idle' }, action };
  }

  if (state.retriesLeft > 0) {
    return {
      outcome: 'pending',
      state: { status: 'awaiting', action, retriesLeft: state.retriesLeft - 1 },
      prompt: `समझ नहीं आया। हाँ या ना बोलिए। ${confirmationQuestion(action)}`,
    };
  }

  return { outcome: 'no_answer', state: { status: 'idle' }, action };
}

export function classifyAnswer(utterance: string): 'yes' | 'no' | 'unclear' {
  const tokens = tokenize(utterance);
  const saysYes = YES_PHRASES.some((phrase) => containsPhrase(tokens, phrase));
  const saysNo = NO_PHRASES.some((phrase) => containsPhrase(tokens, phrase));

  if (saysYes && !saysNo) return 'yes';
  if (saysNo && !saysYes) return 'no';
  return 'unclear';
}

export function confirmationQuestion(action: ConfirmationAction): string {
  if (action.type === 'call') {
    return `${action.contactName} को कॉल लगा दूँ?`;
  }
  if (action.type === 'read_messages') {
    return `${action.contactName} के मैसेज पढ़कर सुनाऊँ?`;
  }
  return `${action.contactName} को मैसेज भेज दूँ: ${action.body}?`;
}
