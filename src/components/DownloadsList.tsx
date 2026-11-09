import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { downloads as seed, type Download } from '@/data/catalog';
import { removeSaved, useSavedDownloads } from '@/data/saved';
import { useLayout } from '@/hooks/useLayout';
import { radius, useTheme } from '@/theme';
import { Art } from './Art';
import { ConfirmDialog } from './ConfirmDialog';
import { Icon } from './Icons';
import { useToast } from './Toast';

/**
 * Downloads — the offline library that replaces My List in the tab bar.
 * Seed rows are the local demo state; rows fetched from the media server carry
 * their real byte size and play from the downloaded blob.
 */
export function DownloadsList() {
  const { colors } = useTheme();
  const router = useRouter();
  const toast = useToast();
  const layout = useLayout();
  const [seedRows, setSeedRows] = React.useState<Download[]>(seed);
  const savedRows = useSavedDownloads();
  const [pendingDelete, setPendingDelete] = React.useState<Download | null>(null);

  const items = React.useMemo(
    () => [
      ...seedRows,
      ...savedRows.filter(
        (saved) => !seedRows.some((row) => row.id === saved.id),
      ),
    ],
    [seedRows, savedRows],
  );

  const confirmRemove = () => {
    if (!pendingDelete) return;
    if (savedRows.some((row) => row.id === pendingDelete.id)) {
      removeSaved(pendingDelete.id);
    } else {
      setSeedRows((current) => current.filter((entry) => entry.id !== pendingDelete.id));
    }
    toast.show(`Removed ${pendingDelete.title} from Downloads`);
    setPendingDelete(null);
  };

  const ready = items.filter((item) => item.status === 'ready').length;
  const active = items.length - ready;

  return (
    <View testID="section-downloads" style={{ position: 'relative' }}>
      {items.length === 0 ? (
        <View
          style={{
            alignItems: 'flex-start',
            gap: 8,
            paddingVertical: 42,
            paddingHorizontal: 4,
          }}
        >
          <Icon name="download" size={28} color={colors.contentTertiary} />
          <Text style={{ fontSize: 16, fontWeight: '600', color: colors.contentPrimary }}>
            No downloads yet.
          </Text>
          <Text style={{ fontSize: 13, lineHeight: 19, color: colors.contentSecondary }}>
            Save a title from Browse to watch it offline.
          </Text>
          <Pressable
            accessibilityRole="link"
            accessibilityLabel="Browse titles"
            onPress={() => router.push('/browse')}
            style={{ marginTop: 6, paddingVertical: 6 }}
          >
            <Text style={{ fontSize: 12, fontWeight: '700', color: colors.link }}>
              Browse titles →
            </Text>
          </Pressable>
        </View>
      ) : (
        <>
          <Text style={{ fontSize: 12, color: colors.contentSecondary, marginBottom: 10 }}>
            {ready} ready
            {active ? ` · ${active} in progress` : ''} · {items.length} total
          </Text>

          <View
            style={{
              borderWidth: 1,
              borderColor: colors.borderSubtle,
              borderRadius: radius.xl,
              overflow: 'hidden',
              backgroundColor: colors.surfaceCard,
            }}
          >
            {items.map((item, index) => (
              <View
                key={item.id}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                  padding: layout.compact ? 10 : 12,
                  borderTopWidth: index === 0 ? 0 : 1,
                  borderTopColor: colors.borderSubtle,
                }}
              >
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Play ${item.title}`}
                  onPress={() =>
                    router.push({
                      pathname: '/watch',
                      params: { id: item.id, offline: '1' },
                    })
                  }
                  style={({ pressed }) => ({
                    flex: 1,
                    minWidth: 0,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 12,
                    opacity: pressed ? 0.85 : 1,
                  })}
                >
                  <Art
                    tone={item.tone}
                    poster={item.poster}
                    slash={false}
                    veil={false}
                    style={{
                      width: layout.compact ? 72 : 96,
                      aspectRatio: 16 / 9,
                      borderRadius: 6,
                      flexShrink: 0,
                    }}
                  />

                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text
                      numberOfLines={1}
                      style={{ fontSize: 13, fontWeight: '600', color: colors.contentPrimary }}
                    >
                      {item.title}
                    </Text>
                    <Text
                      numberOfLines={1}
                      style={{ fontSize: 11, color: colors.contentSecondary, marginTop: 2 }}
                    >
                      {item.quality} · {item.size} · {item.meta}
                    </Text>

                    {item.status === 'downloading' ? (
                      <View style={{ marginTop: 7 }}>
                        <View
                          style={{
                            height: 3,
                            borderRadius: 3,
                            backgroundColor: colors.borderSubtle,
                            overflow: 'hidden',
                          }}
                        >
                          <View
                            style={{
                              width: `${item.percent}%`,
                              height: '100%',
                              backgroundColor: colors.actionPrimary,
                            }}
                          />
                        </View>
                        <Text
                          style={{
                            fontSize: 10,
                            fontWeight: '600',
                            color: colors.contentSecondary,
                            marginTop: 4,
                          }}
                        >
                          Downloading · {item.percent}%
                        </Text>
                      </View>
                    ) : (
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 5,
                          marginTop: 5,
                        }}
                      >
                        <Icon name="check" size={10} color={colors.statusSuccess} />
                        <Text
                          style={{
                            fontSize: 10,
                            fontWeight: '700',
                            color: colors.statusSuccess,
                          }}
                        >
                          Ready to play offline
                        </Text>
                      </View>
                    )}
                  </View>
                </Pressable>

                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Delete download ${item.title}`}
                  onPress={() => setPendingDelete(item)}
                  hitSlop={10}
                  style={({ pressed }) => ({
                    padding: 8,
                    borderRadius: 8,
                    backgroundColor: pressed ? colors.surfaceRaised : 'transparent',
                  })}
                >
                  <Icon name="trash" size={16} color={colors.contentSecondary} />
                </Pressable>
              </View>
            ))}
          </View>
        </>
      )}

      <ConfirmDialog
        visible={pendingDelete !== null}
        title="Delete download?"
        message={
          pendingDelete
            ? `“${pendingDelete.title}” will be removed from this device. You can download it again later.`
            : ''
        }
        confirmLabel="Delete"
        cancelLabel="Keep"
        destructive
        onConfirm={confirmRemove}
        onCancel={() => setPendingDelete(null)}
        testID="delete-download-dialog"
      />
    </View>
  );
}
