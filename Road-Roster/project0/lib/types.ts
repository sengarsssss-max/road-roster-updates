export const SHOW_STATUSES = ['confirmed', 'pending', 'cancelled'] as const;
export type ShowStatus = (typeof SHOW_STATUSES)[number];

export const MEMBER_CATEGORIES = ['Band', 'Crew', 'Management'] as const;
export type MemberCategory = (typeof MEMBER_CATEGORIES)[number];

export type Show = {
  id: string;
  venue: string;
  city: string;
  show_date: string;
  show_time: string | null;
  load_in: string | null;
  pay_cents: number;
  status: ShowStatus;
  notes: string | null;
};

export type ShowInput = Omit<Show, 'id'>;

export type RosterMember = {
  id: string;
  name: string;
  role: string;
  category: MemberCategory;
  phone: string | null;
  email: string | null;
};

export type RosterMemberInput = Omit<RosterMember, 'id'>;
