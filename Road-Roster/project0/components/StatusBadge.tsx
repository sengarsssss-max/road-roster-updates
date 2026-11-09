import { StyleSheet, Text, View } from 'react-native';
import type { ShowStatus } from '@/lib/types';
import { colors, fonts, radius, spacing } from '@/lib/theme';

const STATUS_STYLES: Record<ShowStatus, { label: string; background: string; text: string }> = {
  confirmed: { label: 'Confirmed', background: colors.success[50], text: colors.success[700] },
  pending: { label: 'Pending', background: colors.warning[50], text: colors.warning[700] },
  cancelled: { label: 'Cancelled', background: colors.neutral[100], text: colors.neutral[700] },
};

export function StatusBadge({ status }: { status: ShowStatus }) {
  const style = STATUS_STYLES[status];
  return (
    <View style={[styles.badge, { backgroundColor: style.background }]}>
      <Text style={[styles.label, { color: style.text }]}>{style.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  label: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    lineHeight: 14,
  },
});
