import React from 'react';
import { Pressable, Text, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import { motion, radius, useTheme } from '@/theme';

type Variant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps {
  label: string;
  variant?: Variant;
  icon?: React.ReactNode;
  onPress?: () => void;
  size?: 'sm' | 'md' | 'lg';
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  testID?: string;
  accessibilityLabel?: string;
}

/**
 * Phase 6 §4 — primary is the only filled variant. Hover / pressed are driven
 * from state so they behave the same on web and native.
 */
export function Button({
  label,
  variant = 'secondary',
  icon,
  onPress,
  size = 'md',
  style,
  textStyle,
  testID,
  accessibilityLabel,
}: ButtonProps) {
  const { colors } = useTheme();
  const [hovered, setHovered] = React.useState(false);
  const [pressed, setPressed] = React.useState(false);
  const [focused, setFocused] = React.useState(false);

  // Phase 6 §4 sizes: 32 compact / 36 desktop / 44 touch-lg.
  const height = size === 'lg' ? 44 : size === 'sm' ? 32 : 36;
  // The reference primary button measures 119px at compact size — one less
  // pixel of inline padding than phase-4's 14px (its icon+gap carry the rest);
  // the bordered ghost measures 73px, i.e. exactly phase-4's 14px.
  const padX =
    size === 'lg' ? 18 : size === 'sm' ? (variant === 'primary' ? 13 : 14) : 14;
  const font = size === 'sm' ? 12.5 : 13;

  const bg = (() => {
    if (variant === 'primary') {
      if (pressed) return colors.actionPrimaryPressed;
      if (hovered) return colors.actionPrimaryHover;
      return colors.actionPrimary;
    }
    if (pressed) return colors.surfaceSunken;
    if (hovered) return colors.surfaceRaised;
    return 'transparent';
  })();

  const fg =
    variant === 'primary'
      ? colors.actionInk
      : variant === 'ghost'
        ? hovered
          ? colors.contentPrimary
          : colors.contentSecondary
        : colors.contentPrimary;

  // Phase 4 `.btn` gives every variant a 1px border in `--line` (= borderSubtle;
  // the reference ghost measures #282e38). Primary keeps the border for sizing
  // but paints it with its own fill so it stays invisible.
  const border =
    variant === 'primary'
      ? bg
      : hovered
        ? colors.borderEmphasis
        : colors.borderSubtle;

  const focusRing = variant === 'primary' ? colors.focusRingOnAccent : colors.focusRing;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      testID={testID}
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={({ pressed: p }) => [
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          height,
          paddingLeft: padX,
          paddingRight: padX,
          borderRadius: radius.button,
          backgroundColor: bg,
          borderWidth: 1,
          borderColor: border,
          transform: [{ scale: p || pressed ? 0.98 : 1 }],
          transitionDuration: `${motion.fast}ms`,
        } as ViewStyle,
        focused
          ? ({
              outlineStyle: 'solid',
              outlineWidth: 2,
              outlineOffset: 2,
              outlineColor: focusRing,
            } as ViewStyle)
          : null,
        style,
      ]}
    >
      {icon}
      <Text
        numberOfLines={1}
        style={[
          {
            color: fg,
            fontSize: font,
            fontWeight: '700',
            letterSpacing: 0,
          },
          textStyle,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}
