import { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Users } from 'lucide-react-native';
import { useRoster } from '@/hooks/useRoster';
import { EmptyState } from '@/components/EmptyState';
import { FloatingAddButton } from '@/components/FloatingAddButton';
import { InlineError } from '@/components/InlineError';
import { MemberCard } from '@/components/MemberCard';
import { MemberFormModal } from '@/components/MemberFormModal';
import { SegmentedControl } from '@/components/SegmentedControl';
import { colors, fonts, spacing } from '@/lib/theme';
import type { RosterMember } from '@/lib/types';

type CategoryFilter = 'all' | 'Band' | 'Crew' | 'Management';

const FILTER_OPTIONS: { value: CategoryFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'Band', label: 'Band' },
  { value: 'Crew', label: 'Crew' },
  { value: 'Management', label: 'Management' },
];

export default function RosterScreen() {
  const { members, loading, error, reload } = useRoster();
  const [filter, setFilter] = useState<CategoryFilter>('all');
  const [formOpen, setFormOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<RosterMember | null>(null);

  const visibleMembers = useMemo(
    () => (filter === 'all' ? members : members.filter((member) => member.category === filter)),
    [members, filter]
  );

  function openCreate() {
    setSelectedMember(null);
    setFormOpen(true);
  }

  function openEdit(member: RosterMember) {
    setSelectedMember(member);
    setFormOpen(true);
  }

  function handleChanged() {
    setFormOpen(false);
    reload();
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <FlatList
        data={visibleMembers}
        keyExtractor={(member) => member.id}
        renderItem={({ item }) => <MemberCard member={item} onPress={() => openEdit(item)} />}
        contentContainerStyle={styles.listContent}
        refreshing={loading}
        onRefresh={reload}
        ListHeaderComponent={
          <View style={styles.header}>
            <View>
              <Text style={styles.eyebrow}>ROAD ROSTER</Text>
              <Text style={styles.title}>Who is on the road</Text>
              <Text style={styles.subtitle}>
                {members.length} {members.length === 1 ? 'person' : 'people'} travelling with the tour
              </Text>
            </View>

            <SegmentedControl options={FILTER_OPTIONS} value={filter} onChange={setFilter} />

            {error && members.length > 0 ? <InlineError message={error} /> : null}
          </View>
        }
        ListEmptyComponent={
          loading && members.length === 0 ? (
            <View style={styles.loading}>
              <ActivityIndicator color={colors.primary[700]} />
            </View>
          ) : error && members.length === 0 ? (
            <EmptyState
              icon={Users}
              title="Roster unavailable"
              message={error}
              actionLabel="Try again"
              onAction={reload}
            />
          ) : filter === 'all' ? (
            <EmptyState
              icon={Users}
              title="No one on the roster yet"
              message="Add the band, crew and management so everyone's contact details are in one place."
            />
          ) : (
            <EmptyState
              icon={Users}
              title={`No ${filter.toLowerCase()} members`}
              message="People in this category will appear here once they are added."
            />
          )
        }
      />

      <FloatingAddButton label="Add person" onPress={openCreate} />

      <MemberFormModal
        visible={formOpen}
        member={selectedMember}
        onClose={() => setFormOpen(false)}
        onChanged={handleChanged}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.neutral[50],
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: 120,
    gap: spacing.xs,
    flexGrow: 1,
  },
  header: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    gap: spacing.sm,
  },
  eyebrow: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 1.2,
    color: colors.primary[700],
  },
  title: {
    marginTop: 4,
    fontFamily: fonts.bold,
    fontSize: 30,
    lineHeight: 36,
    color: colors.neutral[900],
  },
  subtitle: {
    marginTop: 4,
    fontFamily: fonts.regular,
    fontSize: 15,
    lineHeight: 22,
    color: colors.neutral[500],
  },
  loading: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
});
