import React from 'react';
import { Pressable, View, type ViewStyle } from 'react-native';
import { motion, radius, useTheme } from '@/theme';

interface SwitchProps {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  disabled?: boolean;
  testID?: string;
}

/** Phase 6 §5.4 — 40×23 track, knob position is the second signal. */
export function Switch({ checked, onChange, label, disabled, testID }: SwitchProps) {
  const { colors } = useTheme();
  const [hovered, setHovered] = React.useState(false);
  const [focused, setFocused] = React.useState(false);

  const w = 40;
  const h = 23;
  const knob = h - 6;

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={label}
      accessibilityState={{ checked, disabled: !!disabled }}
      disabled={disabled}
      testID={testID}
      onPress={() => onChange(!checked)}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={
        {
          width: w,
          height: h,
          borderRadius: radius.pill,
          justifyContent: 'center',
          paddingHorizontal: 3,
          backgroundColor:
            hovered && !checked ? colors.borderEmphasis : checked ? colors.switchOn : colors.switchOff,
          opacity: disabled ? 0.95 : 1,
          ...(focused
            ? {
                outlineStyle: 'solid',
                outlineWidth: 2,
                outlineOffset: 2,
                outlineColor: colors.focusRing,
              }
            : {}),
          transitionDuration: `${motion.base}ms`,
        } as ViewStyle
      }
    >
      <View
        style={
          {
            width: knob,
            height: knob,
            borderRadius: knob / 2,
            backgroundColor: checked ? colors.switchKnobOn : colors.switchKnob,
            alignSelf: checked ? 'flex-end' : 'flex-start',
            transitionDuration: `${motion.base}ms`,
          } as ViewStyle
        }
      />
    </Pressable>
  );
}
