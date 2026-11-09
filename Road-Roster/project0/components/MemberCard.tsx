import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import type { MemberCategory, RosterMember } from '@/lib/types';
import { colors, fonts, radius, spacing } from '@/lib/theme';

type MemberCardProps = {
  member: RosterMember;
  onPress: () => void;
};

const CATEGORY_STYLES: Record<MemberCategory, { background: string; text: string; avatar: string }> = {
  Band: { background: colors.primary[100], text: colors.primary[700], avatar: colors.primary[500] },
  Crew: { background: colors.secondary[100], text: colors.secondary[700], avatar: colors.secondary[500] },
  Management: { background: colors.accent[100], text: colors.accent[700], avatar: colors.accent[500] },
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  const first = parts[0].charAt(0);
  const last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : '';
  return `${first}${last}`.toUpperCase();
}

export function MemberCard({ member, onPress }: MemberCardProps) {
  const categoryStyle = CATEGORY_STYLES[member.category];
  const contact = member.phone || member.email;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${member.name}, ${member.role}`}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={[styles.avatar, { backgroundColor: categoryStyle.avatar }]}>
        <Text style={styles.initials}>{getInitials(member.name)}</Text>
      </View>

      <View style={styles.details}>
        <Text style={styles.name} numberOfLines={1}>
          {member.name}
        </Text>
        <Text style={styles.role} numberOfLines={1}>
          {member.role}
        </Text>
        <View style={styles.footerRow}>
          <View style={[styles.categoryChip, { backgroundColor: categoryStyle.background }]}>
            <Text style={[styles.categoryText, { color: categoryStyle.text }]}>{member.category}</Text>
          </View>
          {contact ? (
            <Text style={styles.contact} numberOfLines={1}>
              {contact}
            </Text>
          ) : null}
        </View>
      </View>

      <ChevronRight size={20} color={colors.neutral[400]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.sm,
    borderRadius: radius.lg,
    backgroundColor: colors.neutral[0],
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontFamily: fonts.bold,
    fontSize: 16,
    lineHeight: 20,
    color: colors.neutral[0],
  },
  details: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontFamily: fonts.bold,
    fontSize: 16,
    lineHeight: 20,
    color: colors.neutral[900],
  },
  role: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.neutral[700],
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: 4,
  },
  categoryChip: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  categoryText: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    lineHeight: 16,
  },
  contact: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 16,
    color: colors.neutral[500],
  },
});
