import { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CalendarX } from 'lucide-react-native';
import { useShows } from '@/hooks/useShows';
import { EmptyState } from '@/components/EmptyState';
import { FloatingAddButton } from '@/components/FloatingAddButton';
import { InlineError } from '@/components/InlineError';
import { SegmentedControl } from '@/components/SegmentedControl';
import { ShowCard } from '@/components/ShowCard';
import { ShowFormModal } from '@/components/ShowFormModal';
import { StatCard } from '@/components/StatCard';
import { todayIsoDate } from '@/lib/dates';
import { formatCurrency } from '@/lib/money';
import { colors, fonts, spacing } from '@/lib/theme';
import type { Show } from '@/lib/types';

type ScheduleFilter = 'upcoming' | 'past' | 'all';

const FILTER_OPTIONS: { value: ScheduleFilter; label: string }[] = [
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'past', label: 'Past' },
  { value: 'all', label: 'All' },
];

const EMPTY_MESSAGES: Record<ScheduleFilter, { title: string; message: string }> = {
  upcoming: { title: 'No upcoming shows', message: 'Add your next gig and it will appear here, in date order.' },
  past: { title: 'No past shows yet', message: 'Shows move here automatically once their date has passed.' },
  all: { title: 'Your tour is empty', message: 'Add your first show to start building the tour schedule.' },
};

export default function ShowsScreen() {
  const { shows, loading, error, reload } = useShows();
  const [filter, setFilter] = useState<ScheduleFilter>('upcoming');
  const [formOpen, setFormOpen] = useState(false);
  const [selectedShow, setSelectedShow] = useState<Show | null>(null);

  const today = todayIsoDate();

  const upcoming = useMemo(() => shows.filter((show) => show.show_date >= today), [shows, today]);
  const past = useMemo(
    () =>
      shows
        .filter((show) => show.show_date < today)
        .sort((a, b) => b.show_date.localeCompare(a.show_date)),
    [shows, today]
  );
  const visibleShows = filter === 'upcoming' ? upcoming : filter === 'past' ? past : shows;

  const upcomingFeeCents = upcoming
    .filter((show) => show.status === 'confirmed')
    .reduce((sum, show) => sum + show.pay_cents, 0);

  function openCreate() {
    setSelectedShow(null);
    setFormOpen(true);
  }

  function openEdit(show: Show) {
    setSelectedShow(show);
    setFormOpen(true);
  }

  function handleChanged() {
    setFormOpen(false);
    reload();
  }

  const emptyCopy = EMPTY_MESSAGES[filter];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <FlatList
        data={visibleShows}
        keyExtractor={(show) => show.id}
        renderItem={({ item }) => <ShowCard show={item} onPress={() => openEdit(item)} />}
        contentContainerStyle={styles.listContent}
        refreshing={loading}
        onRefresh={reload}
        ListHeaderComponent={
          <View style={styles.header}>
            <View>
              <Text style={styles.eyebrow}>ROAD ROSTER</Text>
              <Text style={styles.title}>Tour schedule</Text>
            </View>

            <View style={styles.statRow}>
              <StatCard label="Upcoming shows" value={String(upcoming.length)} />
              <StatCard label="Confirmed fees" value={formatCurrency(upcomingFeeCents)} />
            </View>

            <SegmentedControl options={FILTER_OPTIONS} value={filter} onChange={setFilter} />

            {error && shows.length > 0 ? <InlineError message={error} /> : null}
          </View>
        }
        ListEmptyComponent={
          loading && shows.length === 0 ? (
            <View style={styles.loading}>
              <ActivityIndicator color={colors.primary[700]} />
            </View>
          ) : error && shows.length === 0 ? (
            <EmptyState
              icon={CalendarX}
              title="Schedule unavailable"
              message={error}
              actionLabel="Try again"
              onAction={reload}
            />
          ) : (
            <EmptyState icon={CalendarX} title={emptyCopy.title} message={emptyCopy.message} />
          )
        }
      />

      <FloatingAddButton label="Add show" onPress={openCreate} />

      <ShowFormModal
        visible={formOpen}
        show={selectedShow}
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
    gap: spacing.sm,
    flexGrow: 1,
  },
  header: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
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
  statRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  loading: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
});
