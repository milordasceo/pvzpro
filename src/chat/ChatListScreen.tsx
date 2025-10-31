import React from 'react';
import { View } from 'react-native';
import { Appbar, Avatar, Badge, Text, TouchableRipple, useTheme } from 'react-native-paper';
import { tokens, ScrollView, Title, Body, Caption, Label } from '../ui';

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
        color: tokens.colors.primary.main,
        pinned: true,
      },
      {
        id: 'pvz',
        title: 'ПВЗ Герцена 12',
        lastMessage: 'Фото: Инвентаризация витрины',
        at: Date.now() - 40 * 60_000,
        unreadCount: 0,
        initials: 'ПВ',
        color: tokens.colors.success.main,
        muted: true,
      },
    ],
    [],
  );

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header mode="center-aligned" style={{ backgroundColor: theme.colors.surface }}>
        <Appbar.Content title="Чаты" />
        <Appbar.Action icon="magnify" onPress={() => {}} />
      </Appbar.Header>
      <View style={{ height: 1, backgroundColor: tokens.colors.border }} />
      <ScrollView>
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
                    <Title size="medium" style={{ flexShrink: 1 }} numberOfLines={1}>
                      {item.title}
                    </Title>
                    {item.pinned ? (
                      <Text style={{ marginLeft: 6, color: tokens.colors.text.muted }}>📌</Text>
                    ) : null}
                    {item.muted ? (
                      <Text style={{ marginLeft: 4, color: tokens.colors.text.muted }}>🔕</Text>
                    ) : null}
                  </View>
                  <Caption numberOfLines={1}>
                    {item.lastMessage}
                  </Caption>
                </View>
                <View style={{ alignItems: 'flex-end', width: 64 }}>
                  <Label size="small">{timeFrom(item.at)}</Label>
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
            <View style={{ height: 1, backgroundColor: tokens.colors.border, marginLeft: 76 }} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};
