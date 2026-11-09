import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Clock, MapPin } from 'lucide-react-native';
import type { Show } from '@/lib/types';
import { formatTime, parseIsoDate } from '@/lib/dates';
import { formatCurrency } from '@/lib/money';
import { colors, fonts, radius, spacing } from '@/lib/theme';
import { StatusBadge } from './StatusBadge';

type ShowCardProps = {
  show: Show;
  onPress: () => void;
};

export function ShowCard({ show, onPress }: ShowCardProps) {
  const date = parseIsoDate(show.show_date);
  const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  const day = date.getDate();
  const isCancelled = show.status === 'cancelled';

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${show.venue}, ${show.city}`}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={[styles.dateBlock, isCancelled && styles.dateBlockMuted]}>
        <Text style={styles.month}>{month}</Text>
        <Text style={styles.day}>{day}</Text>
      </View>

      <View style={styles.details}>
        <View style={styles.titleRow}>
          <Text style={[styles.venue, isCancelled && styles.textMuted]} numberOfLines={1}>
            {show.venue}
          </Text>
          <StatusBadge status={show.status} />
        </View>
        <View style={styles.metaRow}>
          <MapPin size={14} color={colors.neutral[500]} />
          <Text style={styles.meta} numberOfLines={1}>
            {show.city}
          </Text>
        </View>
        <View style={styles.metaRow}>
          <Clock size={14} color={colors.neutral[500]} />
          <Text style={styles.meta} numberOfLines={1}>
            {show.show_time ? `Show ${formatTime(show.show_time)}` : 'Time TBC'}
            {show.load_in ? `  ·  Load-in ${formatTime(show.load_in)}` : ''}
          </Text>
        </View>
        <Text style={styles.pay}>{formatCurrency(show.pay_cents)}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.sm,
    borderRadius: radius.lg,
    backgroundColor: colors.neutral[0],
    borderWidth: 1,
    borderColor: colors.neutral[200],
    shadowColor: colors.neutral[900],
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  dateBlock: {
    width: 64,
    borderRadius: radius.md,
    backgroundColor: colors.primary[100],
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xs,
  },
  dateBlockMuted: {
    backgroundColor: colors.neutral[100],
  },
  month: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.5,
    color: colors.primary[700],
  },
  day: {
    fontFamily: fonts.bold,
    fontSize: 26,
    lineHeight: 31,
    color: colors.neutral[900],
  },
  details: {
    flex: 1,
    gap: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.xs,
  },
  venue: {
    flex: 1,
    fontFamily: fonts.bold,
    fontSize: 16,
    lineHeight: 20,
    color: colors.neutral[900],
  },
  textMuted: {
    color: colors.neutral[500],
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  meta: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 18,
    color: colors.neutral[500],
  },
  pay: {
    marginTop: 4,
    fontFamily: fonts.semibold,
    fontSize: 14,
    lineHeight: 18,
    color: colors.secondary[700],
  },
});
