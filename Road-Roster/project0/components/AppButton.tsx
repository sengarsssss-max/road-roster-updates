import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { colors, fonts, radius, spacing } from '@/lib/theme';

type AppButtonProps = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  loading?: boolean;
  disabled?: boolean;
};

export function AppButton({ title, onPress, variant = 'primary', loading = false, disabled = false }: AppButtonProps) {
  const isDisabled = disabled || loading;
  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.base,
        variantStyles[variant].container,
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
      ]}>
      {loading ? (
        <ActivityIndicator color={variantStyles[variant].text.color} />
      ) : (
        <Text style={[styles.label, variantStyles[variant].text]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    borderRadius: radius.md,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    fontFamily: fonts.semibold,
    fontSize: 16,
    lineHeight: 20,
  },
});

const variantStyles = {
  primary: {
    container: { backgroundColor: colors.primary[500] },
    text: { color: colors.neutral[900] },
  },
  secondary: {
    container: { backgroundColor: colors.neutral[0], borderWidth: 1, borderColor: colors.neutral[300] },
    text: { color: colors.neutral[900] },
  },
  danger: {
    container: { backgroundColor: colors.error[500] },
    text: { color: colors.neutral[0] },
  },
} as const;
