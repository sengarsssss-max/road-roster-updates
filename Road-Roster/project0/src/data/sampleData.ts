import type { ChatMessage, HeardEntry, QuickAction, WhatsAppAction } from '@/types/roadRoster';

export const WAKE_NAME = 'पहलवान';

export const QUICK_ACTIONS: QuickAction[] = [
  { id: 'call', label: 'कॉल', example: `${WAKE_NAME}, रीना को कॉल करो`, icon: 'phone' },
  { id: 'message', label: 'मैसेज', example: `${WAKE_NAME}, पापा को मैसेज करो कि मैं पहुँच रहा हूँ`, icon: 'message' },
  { id: 'route', label: 'रास्ता', example: `${WAKE_NAME}, पटना का रास्ता बताओ`, icon: 'navigation' },
  { id: 'song', label: 'गाना', example: `${WAKE_NAME}, कोई भोजपुरी गाना लगाओ`, icon: 'music' },
  { id: 'toilet', label: 'टॉयलेट', example: `${WAKE_NAME}, नज़दीकी टॉयलेट कहाँ है`, icon: 'map' },
  { id: 'petrol', label: 'पेट्रोल', example: `${WAKE_NAME}, नज़दीकी पेट्रोल पंप कहाँ है`, icon: 'fuel' },
];

export const SAMPLE_CHAT: ChatMessage[] = [
  { id: 'c1', from: 'driver', text: `${WAKE_NAME}, नज़दीकी पेट्रोल पंप कहाँ है` },
  { id: 'c2', from: 'assistant', text: 'दो किलोमीटर आगे बाएँ तरफ़ पेट्रोल पंप है।' },
  { id: 'c3', from: 'driver', text: `${WAKE_NAME}, रीना को कॉल करो` },
  { id: 'c4', from: 'assistant', text: 'रीना को कॉल कर रहा हूँ।' },
];

export const HEARD_ENTRIES: HeardEntry[] = [
  { id: 'h1', sentence: `${WAKE_NAME}, रीना को कॉल करो`, ignoredReason: null },
  { id: 'h2', sentence: 'अरे भाई गाड़ी धीरे चलाओ', ignoredReason: 'no_wake_name' },
  { id: 'h3', sentence: `${WAKE_NAME} वो वाला वाला कुछ`, ignoredReason: 'low_confidence' },
  { id: 'h4', sentence: `${WAKE_NAME}, पटना का रस्ता`, ignoredReason: 'unknown_word' },
];

export const WHATSAPP_ACTIONS: WhatsAppAction[] = [
  { id: 'w1', time: '10:42', action: 'मैसेज भेजा: पापा को', profile: 'क्लोन प्रोफ़ाइल', packageName: 'com.whatsapp.w4b' },
  { id: 'w2', time: '09:15', action: 'कॉल किया: रीना', profile: 'क्लोन प्रोफ़ाइल', packageName: 'com.whatsapp.w4b' },
];
