export type Tab = 'home' | 'log' | 'settings';

export type AssistantStatus = 'listening' | 'waiting' | 'sleeping';

export type ChatMessage = {
  id: string;
  from: 'driver' | 'assistant';
  text: string;
};

export type QuickAction = {
  id: string;
  label: string;
  example: string;
  icon: 'phone' | 'message' | 'navigation' | 'music' | 'map' | 'fuel';
};

export type IgnoreReason = 'no_wake_name' | 'unknown_word' | 'low_confidence' | 'wrong_transcription';

export type HeardEntry = {
  id: string;
  sentence: string;
  ignoredReason: IgnoreReason | null;
};

export type WhatsAppAction = {
  id: string;
  time: string;
  action: string;
  profile: string;
  packageName: string;
};

export type VoiceOption = 'calm' | 'normal' | 'quick';
