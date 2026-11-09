import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';
import { colors, fonts, radius, spacing } from '@/lib/theme';

type FormFieldProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  hint?: string;
  keyboardType?: TextInputProps['keyboardType'];
  autoCapitalize?: TextInputProps['autoCapitalize'];
  multiline?: boolean;
};

export function FormField({
  label,
  value,
  onChangeText,
  placeholder,
  hint,
  keyboardType,
  autoCapitalize = 'sentences',
  multiline = false,
}: FormFieldProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.neutral[500]}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        multiline={multiline}
        style={[styles.input, multiline && styles.multiline]}
      />
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  label: {
    fontFamily: fonts.semibold,
    fontSize: 14,
    lineHeight: 18,
    color: colors.neutral[700],
  },
  input: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: colors.neutral[300],
    borderRadius: radius.md,
    backgroundColor: colors.neutral[0],
    paddingHorizontal: spacing.xs * 2,
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.neutral[900],
  },
  multiline: {
    minHeight: 96,
    paddingTop: spacing.xs * 1.5,
    textAlignVertical: 'top',
  },
  hint: {
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 18,
    color: colors.neutral[500],
  },
});
