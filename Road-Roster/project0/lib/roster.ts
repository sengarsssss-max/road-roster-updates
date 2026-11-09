import { supabase } from './supabase';
import type { RosterMember, RosterMemberInput } from './types';

const ROSTER_COLUMNS = 'id, name, role, category, phone, email';

export async function fetchRosterMembers(): Promise<RosterMember[]> {
  const { data, error } = await supabase
    .from('roster_members')
    .select(ROSTER_COLUMNS)
    .order('name', { ascending: true });
  if (error) throw error;
  return (data ?? []) as RosterMember[];
}

export async function createRosterMember(input: RosterMemberInput): Promise<void> {
  const { error } = await supabase.from('roster_members').insert(input);
  if (error) throw error;
}

export async function updateRosterMember(id: string, input: RosterMemberInput): Promise<void> {
  const { error } = await supabase.from('roster_members').update(input).eq('id', id);
  if (error) throw error;
}

export async function deleteRosterMember(id: string): Promise<void> {
  const { error } = await supabase.from('roster_members').delete().eq('id', id);
  if (error) throw error;
}
