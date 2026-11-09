import { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { FormModal } from './FormModal';
import { FormField } from './FormField';
import { SegmentedControl } from './SegmentedControl';
import { AppButton } from './AppButton';
import { InlineError } from './InlineError';
import { createRosterMember, deleteRosterMember, updateRosterMember } from '@/lib/roster';
import { MEMBER_CATEGORIES, type MemberCategory, type RosterMember, type RosterMemberInput } from '@/lib/types';
import { colors, fonts } from '@/lib/theme';

type MemberFormModalProps = {
  visible: boolean;
  member: RosterMember | null;
  onClose: () => void;
  onChanged: () => void;
};

const CATEGORY_OPTIONS = MEMBER_CATEGORIES.map((category) => ({ value: category, label: category }));

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function MemberFormModal({ visible, member, onClose, onChanged }: MemberFormModalProps) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [category, setCategory] = useState<MemberCategory>('Crew');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!visible) return;
    setName(member?.name ?? '');
    setRole(member?.role ?? '');
    setCategory(member?.category ?? 'Crew');
    setPhone(member?.phone ?? '');
    setEmail(member?.email ?? '');
    setSaving(false);
    setDeleting(false);
    setConfirmingDelete(false);
    setError(null);
  }, [visible, member]);

  function validate(): RosterMemberInput | string {
    const trimmedName = name.trim();
    const trimmedRole = role.trim();
    const trimmedEmail = email.trim();
    if (!trimmedName) return 'Add a name for this person.';
    if (!trimmedRole) return 'Add their job on the tour, for example Drummer or Tour manager.';
    if (trimmedEmail && !EMAIL_PATTERN.test(trimmedEmail)) return 'That email address does not look right.';

    return {
      name: trimmedName,
      role: trimmedRole,
      category,
      phone: phone.trim() || null,
      email: trimmedEmail || null,
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
      if (member) {
        await updateRosterMember(member.id, result);
      } else {
        await createRosterMember(result);
      }
      onChanged();
    } catch {
      setError("We couldn't save this person. Check your connection and try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!member) return;
    setDeleting(true);
    setError(null);
    try {
      await deleteRosterMember(member.id);
      onChanged();
    } catch {
      setError("We couldn't remove this person. Please try again.");
      setConfirmingDelete(false);
    } finally {
      setDeleting(false);
    }
  }

  const busy = saving || deleting;

  const footer = (
    <>
      {error ? <InlineError message={error} /> : null}
      {member && confirmingDelete ? (
        <>
          <AppButton title="Remove from roster" variant="danger" onPress={handleDelete} loading={deleting} disabled={busy} />
          <AppButton title="Keep on roster" variant="secondary" onPress={() => setConfirmingDelete(false)} disabled={busy} />
        </>
      ) : (
        <>
          <AppButton title={member ? 'Save changes' : 'Add to roster'} onPress={handleSave} loading={saving} disabled={busy} />
          {member ? (
            <AppButton title="Remove from roster" variant="secondary" onPress={() => setConfirmingDelete(true)} disabled={busy} />
          ) : null}
        </>
      )}
    </>
  );

  return (
    <FormModal visible={visible} title={member ? 'Edit person' : 'Add person'} onClose={onClose} footer={footer}>
      <FormField label="Full name" value={name} onChangeText={setName} placeholder="Jordan Lee" />
      <FormField label="Role on tour" value={role} onChangeText={setRole} placeholder="Tour manager" />
      <Text style={styles.sectionLabel}>Category</Text>
      <SegmentedControl options={CATEGORY_OPTIONS} value={category} onChange={setCategory} />
      <FormField
        label="Phone"
        value={phone}
        onChangeText={setPhone}
        placeholder="+1 555 010 2030"
        keyboardType="phone-pad"
        autoCapitalize="none"
      />
      <FormField
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="jordan@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
      />
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
