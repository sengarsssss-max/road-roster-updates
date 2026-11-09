import { supabase } from './supabase';
import type { Show, ShowInput } from './types';

const SHOW_COLUMNS = 'id, venue, city, show_date, show_time, load_in, pay_cents, status, notes';

export async function fetchShows(): Promise<Show[]> {
  const { data, error } = await supabase
    .from('shows')
    .select(SHOW_COLUMNS)
    .order('show_date', { ascending: true });
  if (error) throw error;
  return (data ?? []) as Show[];
}

export async function createShow(input: ShowInput): Promise<void> {
  const { error } = await supabase.from('shows').insert(input);
  if (error) throw error;
}

export async function updateShow(id: string, input: ShowInput): Promise<void> {
  const { error } = await supabase.from('shows').update(input).eq('id', id);
  if (error) throw error;
}

export async function deleteShow(id: string): Promise<void> {
  const { error } = await supabase.from('shows').delete().eq('id', id);
  if (error) throw error;
}
