import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radius, spacing } from '@/lib/theme';

type StatCardProps = {
  label: string;
  value: string;
};

export function StatCard({ label, value }: StatCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    padding: spacing.sm,
    gap: 4,
    borderRadius: radius.lg,
    backgroundColor: colors.neutral[900],
  },
  label: {
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 18,
    color: colors.neutral[300],
  },
  value: {
    fontFamily: fonts.bold,
    fontSize: 22,
    lineHeight: 27,
    color: colors.neutral[0],
  },
});
