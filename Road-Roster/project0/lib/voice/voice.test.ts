import { describe, expect, it } from 'vitest';
import { parseVoiceCommand } from './intents';
import { advanceConfirmation, classifyAnswer, startConfirmation } from './confirmation';
import { normalizeDevanagari, tokenize } from './normalize';

const ORDINARY_CONVERSATION = [
  'आज मौसम बहुत अच्छा है',
  'बेटी ने खाना खा लिया क्या',
  'चलो चाय पीते हैं',
  'पटना में ट्रैफिक बहुत है',
  'तुम्हारा भाई कल आ रहा है',
  'गाड़ी में पेट्रोल कम है',
  'मैं आज देर से पहुँचूँगा',
  'ये गाना बहुत सुंदर है',
  'रात के खाने में क्या बनेगा',
  'मेरा फोन चार्ज नहीं हो रहा',
  'उसने मुझे कल फोन पर बताया था',
  'संदेश का जवाब बाद में देंगे',
  'मैसेज अभी मत भेजो, पहले गाड़ी रोको',
  'कॉल की बात बाद में करना',
  'पढ़ाई अच्छी चल रही है',
  'सुनाओ कोई कहानी',
  'हाँ सही कह रहे हो',
  'ना भाई, ऐसा नहीं है',
  'जी हाँ, वो घर पर है',
  'बच्चे स्कूल से लौट आए',
];

describe('normalizeDevanagari', () => {
  it('removes nukta, punctuation and extra spaces', () => {
    expect(normalizeDevanagari('  ज़रूर।  हाँ, ठीक है!  ')).toBe('जरूर हाँ ठीक है');
  });

  it('tokenizes an empty string to no tokens', () => {
    expect(tokenize('   ')).toEqual([]);
  });
});

describe('parseVoiceCommand', () => {
  it('parses a call request with a contact name', () => {
    expect(parseVoiceCommand('राम को कॉल लगाओ')).toEqual({
      status: 'intent',
      intent: { type: 'call', contactName: 'राम' },
    });
  });

  it('parses a read-messages request', () => {
    expect(parseVoiceCommand('सीमा का मैसेज पढ़ो')).toEqual({
      status: 'intent',
      intent: { type: 'read_messages', contactName: 'सीमा' },
    });
  });

  it('parses a send-message request with body text', () => {
    expect(parseVoiceCommand('पत्नी को मैसेज भेजो कि खाना खा लो')).toEqual({
      status: 'intent',
      intent: { type: 'send_message', contactName: 'पत्नी', body: 'खाना खा लो' },
    });
  });

  it('ignores a send request that has no message text', () => {
    expect(parseVoiceCommand('पत्नी को मैसेज भेजो')).toEqual({
      status: 'ignored',
      reason: 'missing_message_text',
    });
  });

  it('ignores a call request with no contact name', () => {
    expect(parseVoiceCommand('कॉल लगाओ')).toEqual({
      status: 'ignored',
      reason: 'missing_contact_name',
    });
  });

  it.each(ORDINARY_CONVERSATION)('does not wake on ordinary conversation: %s', (utterance) => {
    expect(parseVoiceCommand(utterance).status).toBe('ignored');
  });
});

describe('classifyAnswer', () => {
  it.each(['हाँ', 'हां', 'जी हाँ', 'ठीक है'])('treats %s as yes', (answer) => {
    expect(classifyAnswer(answer)).toBe('yes');
  });

  it.each(['ना', 'नहीं', 'रहने दो', 'मत करो'])('treats %s as no', (answer) => {
    expect(classifyAnswer(answer)).toBe('no');
  });

  it('treats mixed or unrelated speech as unclear', () => {
    expect(classifyAnswer('हाँ ना')).toBe('unclear');
    expect(classifyAnswer('गाड़ी रोको')).toBe('unclear');
  });
});

describe('confirmation flow', () => {
  const call = { type: 'call' as const, contactName: 'राम' };
  const message = { type: 'send_message' as const, contactName: 'पत्नी', body: 'घर पहुँच रहा हूँ' };

  it('asks for confirmation before any action', () => {
    const step = startConfirmation(call);
    expect(step.outcome).toBe('pending');
    if (step.outcome === 'pending') expect(step.prompt).toBe('राम को कॉल लगा दूँ?');
  });

  it('reads the message text back before sending', () => {
    const step = startConfirmation(message);
    if (step.outcome !== 'pending') throw new Error('expected pending');
    expect(step.prompt).toContain('घर पहुँच रहा हूँ');
  });

  it('confirms only after an explicit yes', () => {
    const started = startConfirmation(call);
    const step = advanceConfirmation(started.state, 'हाँ');
    expect(step.outcome).toBe('confirmed');
  });

  it('declines on no', () => {
    const started = startConfirmation(message);
    expect(advanceConfirmation(started.state, 'ना').outcome).toBe('declined');
  });

  it('asks once more on an unclear answer, then cancels with no action', () => {
    const started = startConfirmation(call);
    const retry = advanceConfirmation(started.state, 'गाड़ी रोको');
    expect(retry.outcome).toBe('pending');
    if (retry.outcome !== 'pending') throw new Error('expected pending');

    const finalStep = advanceConfirmation(retry.state, 'अच्छा सुनो बाद में बात होगी');
    expect(finalStep.outcome).toBe('no_answer');
    expect(finalStep.state).toEqual({ status: 'idle' });
  });

  it('succeeds on the retry if the answer is clear', () => {
    const started = startConfirmation(call);
    const retry = advanceConfirmation(started.state, 'हम्म');
    if (retry.outcome !== 'pending') throw new Error('expected pending');
    expect(advanceConfirmation(retry.state, 'हाँ').outcome).toBe('confirmed');
  });

  it('never confirms when the answer is ambiguous', () => {
    const started = startConfirmation(message);
    const step = advanceConfirmation(started.state, 'हाँ ना');
    expect(step.outcome).toBe('pending');
  });
});
