import React from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { radius, useTheme } from '@/theme';

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  testID?: string;
}

/**
 * Small centred confirmation sheet. Used before destructive actions such as
 * deleting an offline download. The scrim and the card are siblings so a press
 * on the card can never fall through to the dismiss handler.
 */
export function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = false,
  onConfirm,
  onCancel,
  testID = 'confirm-dialog',
}: ConfirmDialogProps) {
  const { colors } = useTheme();

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onCancel}
      statusBarTranslucent
    >
      <View
        testID={testID}
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          backgroundColor: colors.overlayScrim,
        }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Dismiss dialog"
          onPress={onCancel}
          style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
        />

        <View
          accessibilityViewIsModal
          style={{
            width: '100%',
            maxWidth: 420,
            padding: 22,
            gap: 8,
            borderRadius: radius.xl,
            borderWidth: 1,
            borderColor: colors.borderSubtle,
            backgroundColor: colors.surfaceRaised,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              lineHeight: 24,
              fontWeight: '600',
              letterSpacing: -0.2,
              color: colors.contentPrimary,
            }}
          >
            {title}
          </Text>
          <Text style={{ fontSize: 13, lineHeight: 20, color: colors.contentSecondary }}>
            {message}
          </Text>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              gap: 10,
              marginTop: 14,
            }}
          >
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={cancelLabel}
              testID="confirm-cancel"
              onPress={onCancel}
              style={({ pressed }) => ({
                paddingVertical: 9,
                paddingHorizontal: 15,
                borderRadius: radius.button,
                borderWidth: 1,
                borderColor: pressed ? colors.borderEmphasis : colors.borderSubtle,
                backgroundColor: pressed ? colors.surfaceSunken : 'transparent',
              })}
            >
              <Text style={{ fontSize: 13, fontWeight: '700', color: colors.contentPrimary }}>
                {cancelLabel}
              </Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel={confirmLabel}
              testID="confirm-accept"
              onPress={onConfirm}
              style={({ pressed }) => ({
                paddingVertical: 9,
                paddingHorizontal: 15,
                borderRadius: radius.button,
                borderWidth: 1,
                borderColor: destructive ? colors.statusDanger : colors.actionPrimary,
                backgroundColor: destructive
                  ? pressed
                    ? colors.actionSofter
                    : 'transparent'
                  : pressed
                    ? colors.actionPrimaryPressed
                    : colors.actionPrimary,
              })}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: '700',
                  color: destructive ? colors.statusDanger : colors.actionInk,
                }}
              >
                {confirmLabel}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
