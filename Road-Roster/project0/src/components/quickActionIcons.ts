import { Fuel, Map as MapIcon, MessageSquare, Music, Navigation, Phone } from 'lucide-react';
import type { QuickAction } from '@/types/roadRoster';

export const QUICK_ACTION_ICONS: Record<QuickAction['icon'], typeof Phone> = {
  phone: Phone,
  message: MessageSquare,
  navigation: Navigation,
  music: Music,
  map: MapIcon,
  fuel: Fuel,
};
