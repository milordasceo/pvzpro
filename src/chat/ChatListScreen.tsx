import React from 'react';
import { View } from 'react-native';
import { Appbar, Avatar, Badge, Text, TouchableRipple, useTheme } from 'react-native-paper';
import { StyledScrollView } from '../components';

type ChatListItem = {
  id: string;
  title: string;
  lastMessage: string;
  at: number;
  unreadCount?: number;
  pinned?: boolean;
  muted?: boolean;
  initials: string;
  color: string;
};

function timeFrom(ts: number) {
  const date = new Date(ts);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export const ChatListScreen: React.FC<any> = ({ navigation }) => {
  const theme = useTheme();
  const items: ChatListItem[] = React.useMemo(
    () => [
      {
        id: 'admin',
        title: 'Администратор',
        lastMessage: 'Здравствуйте! Чем могу помочь?',
        at: Date.now() - 5 * 60_000,
        unreadCount: 2,
        initials: 'АД',
        color: '#60A5FA',
        pinned: true,
      },
      {
        id: 'pvz',
        title: 'ПВЗ Герцена 12',
        lastMessage: 'Фото: Инвентаризация витрины',
        at: Date.now() - 40 * 60_000,
        unreadCount: 0,
        initials: 'ПВ',
        color: '#34D399',
        muted: true,
      },
    ],
    [],
  );

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header mode="center-aligned" style={{ backgroundColor: theme.colors.surface }}>
        <Appbar.Content title="Чаты" titleStyle={{ fontSize: 18, fontWeight: '600' }} />
        <Appbar.Action icon="magnify" onPress={() => {}} />
      </Appbar.Header>
      <View style={{ height: 1, backgroundColor: '#E5E7EB' }} />
      <StyledScrollView>
        {items.map((item) => (
          <View key={item.id}>
            <TouchableRipple
              onPress={() => navigation.navigate('Chat', { chatId: item.id, title: item.title })}
              style={{ borderRadius: 0 }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  alignItems: 'center',
                }}
              >
                <Avatar.Text
                  size={48}
                  label={item.initials}
                  style={{ backgroundColor: item.color }}
                />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text
                      style={{ fontWeight: '600', fontSize: 16, flexShrink: 1 }}
                      numberOfLines={1}
                    >
                      {item.title}
                    </Text>
                    {item.pinned ? (
                      <Text style={{ marginLeft: 6, color: '#9CA3AF' }}>📌</Text>
                    ) : null}
                    {item.muted ? (
                      <Text style={{ marginLeft: 4, color: '#9CA3AF' }}>🔕</Text>
                    ) : null}
                  </View>
                  <Text style={{ color: '#6B7280' }} numberOfLines={1}>
                    {item.lastMessage}
                  </Text>
                </View>
                <View style={{ alignItems: 'flex-end', width: 64 }}>
                  <Text style={{ color: '#9CA3AF', fontSize: 12 }}>{timeFrom(item.at)}</Text>
                  {item.unreadCount ? (
                    <Badge
                      style={{ marginTop: 6, backgroundColor: theme.colors.primary }}
                      size={20}
                    >
                      {item.unreadCount}
                    </Badge>
                  ) : null}
                </View>
              </View>
            </TouchableRipple>
            <View style={{ height: 1, backgroundColor: '#E5E7EB', marginLeft: 76 }} />
          </View>
        ))}
      </StyledScrollView>
    </View>
  );
};
