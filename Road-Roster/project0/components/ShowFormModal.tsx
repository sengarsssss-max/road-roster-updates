import { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { FormModal } from './FormModal';
import { FormField } from './FormField';
import { SegmentedControl } from './SegmentedControl';
import { AppButton } from './AppButton';
import { InlineError } from './InlineError';
import { createShow, deleteShow, updateShow } from '@/lib/shows';
import { isValidIsoDate, isValidTime, todayIsoDate } from '@/lib/dates';
import { parseDollarsToCents } from '@/lib/money';
import { SHOW_STATUSES, type Show, type ShowInput, type ShowStatus } from '@/lib/types';
import { colors, fonts } from '@/lib/theme';

type ShowFormModalProps = {
  visible: boolean;
  show: Show | null;
  onClose: () => void;
  onChanged: () => void;
};

const STATUS_OPTIONS = SHOW_STATUSES.map((status) => ({
  value: status,
  label: status.charAt(0).toUpperCase() + status.slice(1),
}));

export function ShowFormModal({ visible, show, onClose, onChanged }: ShowFormModalProps) {
  const [venue, setVenue] = useState('');
  const [city, setCity] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [loadIn, setLoadIn] = useState('');
  const [fee, setFee] = useState('');
  const [status, setStatus] = useState<ShowStatus>('confirmed');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!visible) return;
    setVenue(show?.venue ?? '');
    setCity(show?.city ?? '');
    setDate(show?.show_date ?? todayIsoDate());
    setTime(show?.show_time ?? '');
    setLoadIn(show?.load_in ?? '');
    setFee(show ? (show.pay_cents / 100).toFixed(2) : '');
    setStatus(show?.status ?? 'confirmed');
    setNotes(show?.notes ?? '');
    setSaving(false);
    setDeleting(false);
    setConfirmingDelete(false);
    setError(null);
  }, [visible, show]);

  function validate(): ShowInput | string {
    const trimmedVenue = venue.trim();
    const trimmedCity = city.trim();
    if (!trimmedVenue || !trimmedCity) return 'Add a venue and a city.';
    if (!isValidIsoDate(date.trim())) return 'Enter the date as YYYY-MM-DD, for example 2026-12-04.';
    if (time.trim() && !isValidTime(time.trim())) return 'Enter the show time in 24-hour format, for example 20:00.';
    if (loadIn.trim() && !isValidTime(loadIn.trim())) return 'Enter the load-in time in 24-hour format, for example 16:00.';
    const payCents = parseDollarsToCents(fee);
    if (payCents === null) return 'Enter the fee as a number, for example 1500 or 850.50.';

    return {
      venue: trimmedVenue,
      city: trimmedCity,
      show_date: date.trim(),
      show_time: time.trim() || null,
      load_in: loadIn.trim() || null,
      pay_cents: payCents,
      status,
      notes: notes.trim() || null,
    };
  }

  async function handleSave() {
    const result = validate();
    if (typeof result === 'string') {
      setError(result);
      return;
    }

    setSaving(true);
    setError(null);
    try {
      if (show) {
        await updateShow(show.id, result);
      } else {
        await createShow(result);
      }
      onChanged();
    } catch {
      setError("We couldn't save this show. Check your connection and try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!show) return;
    setDeleting(true);
    setError(null);
    try {
      await deleteShow(show.id);
      onChanged();
    } catch {
      setError("We couldn't delete this show. Please try again.");
      setConfirmingDelete(false);
    } finally {
      setDeleting(false);
    }
  }

  const busy = saving || deleting;

  const footer = (
    <>
      {error ? <InlineError message={error} /> : null}
      {show && confirmingDelete ? (
        <>
          <AppButton title="Delete show" variant="danger" onPress={handleDelete} loading={deleting} disabled={busy} />
          <AppButton title="Keep show" variant="secondary" onPress={() => setConfirmingDelete(false)} disabled={busy} />
        </>
      ) : (
        <>
          <AppButton title={show ? 'Save changes' : 'Add show'} onPress={handleSave} loading={saving} disabled={busy} />
          {show ? (
            <AppButton title="Remove this show" variant="secondary" onPress={() => setConfirmingDelete(true)} disabled={busy} />
          ) : null}
        </>
      )}
    </>
  );

  return (
    <FormModal visible={visible} title={show ? 'Edit show' : 'New show'} onClose={onClose} footer={footer}>
      <FormField label="Venue" value={venue} onChangeText={setVenue} placeholder="The Fillmore" />
      <FormField label="City" value={city} onChangeText={setCity} placeholder="San Francisco" />
      <FormField
        label="Date"
        value={date}
        onChangeText={setDate}
        placeholder="2026-12-04"
        hint="Format: YYYY-MM-DD"
        autoCapitalize="none"
      />
      <FormField
        label="Show time"
        value={time}
        onChangeText={setTime}
        placeholder="20:00"
        hint="24-hour time, optional"
        autoCapitalize="none"
      />
      <FormField
        label="Load-in time"
        value={loadIn}
        onChangeText={setLoadIn}
        placeholder="16:00"
        hint="24-hour time, optional"
        autoCapitalize="none"
      />
      <FormField
        label="Fee (USD)"
        value={fee}
        onChangeText={setFee}
        placeholder="1500.00"
        keyboardType="decimal-pad"
        autoCapitalize="none"
      />
      <Text style={styles.sectionLabel}>Status</Text>
      <SegmentedControl options={STATUS_OPTIONS} value={status} onChange={setStatus} />
      <FormField label="Notes" value={notes} onChangeText={setNotes} placeholder="Backline, hotel, catering..." multiline />
    </FormModal>
  );
}

const styles = StyleSheet.create({
  sectionLabel: {
    fontFamily: fonts.semibold,
    fontSize: 14,
    lineHeight: 18,
    color: colors.neutral[700],
  },
});
