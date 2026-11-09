import { StyleSheet, Text, View } from 'react-native';
import { AlertCircle } from 'lucide-react-native';
import { colors, fonts, radius, spacing } from '@/lib/theme';

export function InlineError({ message }: { message: string }) {
  return (
    <View style={styles.container} accessibilityRole="alert">
      <AlertCircle size={18} color={colors.error[700]} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    padding: spacing.xs * 1.5,
    borderRadius: radius.md,
    backgroundColor: colors.error[50],
    borderWidth: 1,
    borderColor: colors.error[100],
  },
  text: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.error[700],
  },
});
