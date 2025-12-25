import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, User, MessageSquare, Plus, CheckCheck, Clock } from 'lucide-react-native';
import { theme } from '../../../shared/theme';
import { marketplaceThemes } from '../../../shared/theme/colors';
import { useShiftStore } from '../model/shift.store';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

const MOCK_CHATS = [
  { id: 1, name: 'Поддержка WB', lastMessage: 'Ваша заявка на доплату принята в работу', time: '14:20', unread: 2, status: 'delivered' },
  { id: 2, name: 'Иван Менеджер', lastMessage: 'Не забудь закрыть склад до 21:00', time: '12:05', unread: 0, status: 'read' },
  { id: 3, name: 'Общий чат ПВЗ', lastMessage: 'Кто завтра на смену? Нужна замена', time: 'Вчера', unread: 5, status: 'delivered' },
  { id: 4, name: 'Логистика', lastMessage: 'Машина будет через 15 минут', time: 'Пн', unread: 0, status: 'read' },
];

export const ChatScreen = () => {
  const { pvz } = useShiftStore();
  const currentTheme = marketplaceThemes[pvz.marketplace] || marketplaceThemes.wb;

  const handleChatPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleNewChat = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.white} translucent />
      
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.white }} edges={['top']}>
        {/* Header */}
        <View style={{ 
          height: 56, 
          paddingHorizontal: theme.spacing.md, 
          flexDirection: 'row', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.border.light
        }}>
          <View>
            <Text style={{ ...theme.typography.presets.h4, color: theme.colors.text.primary }}>Сообщения</Text>
            <Text style={{ ...theme.typography.presets.caption, color: theme.colors.text.muted, fontSize: 10 }}>4 АКТИВНЫХ ДИАЛОГА</Text>
          </View>
          <TouchableOpacity 
            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
            style={{ width: 40, height: 40, backgroundColor: theme.colors.background, borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}
          >
            <Search size={20} color={currentTheme.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView 
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 20, paddingBottom: 100, backgroundColor: theme.colors.background }} 
          showsVerticalScrollIndicator={false}
        >
          <Animated.View entering={FadeInDown.duration(400)}>
            <View style={{ backgroundColor: theme.colors.white, borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: theme.colors.border.DEFAULT, ...theme.shadows.sm }}>
              {MOCK_CHATS.map((chat, idx) => (
                <TouchableOpacity 
                  key={chat.id}
                  onPress={handleChatPress}
                  activeOpacity={0.7}
                  style={{ 
                    flexDirection: 'row', 
                    paddingHorizontal: 16, 
                    paddingVertical: 14, 
                    alignItems: 'center',
                    gap: 12,
                    borderBottomWidth: idx !== MOCK_CHATS.length - 1 ? 1 : 0,
                    borderBottomColor: theme.colors.background
                  }}
                >
                  {/* Avatar with status indicator */}
                  <View>
                    <View style={{ width: 52, height: 52, borderRadius: 18, backgroundColor: theme.colors.background, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: theme.colors.border.light }}>
                      <User size={24} color={theme.colors.text.muted} />
                    </View>
                    {chat.unread > 0 && (
                      <View style={{ position: 'absolute', top: -2, right: -2, width: 14, height: 14, borderRadius: 7, backgroundColor: currentTheme.primary, borderWidth: 2, borderColor: theme.colors.white }} />
                    )}
                  </View>

                  {/* Chat Info */}
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 }}>
                      <Text style={{ ...theme.typography.presets.bodyLarge, color: theme.colors.text.primary, fontWeight: '700' }}>{chat.name}</Text>
                      <Text style={{ ...theme.typography.presets.caption, color: chat.unread > 0 ? currentTheme.primary : theme.colors.text.muted, fontSize: 10 }}>{chat.time}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, gap: 4 }}>
                        {chat.status === 'read' && <CheckCheck size={14} color={currentTheme.primary} />}
                        <Text style={{ ...theme.typography.presets.bodySmall, color: theme.colors.text.secondary, flex: 1 }} numberOfLines={1}>
                          {chat.lastMessage}
                        </Text>
                      </View>
                      {chat.unread > 0 && (
                        <View style={{ backgroundColor: currentTheme.primary, minWidth: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 }}>
                          <Text style={{ color: pvz.marketplace === 'yandex' ? '#000' : 'white', fontSize: 10, fontWeight: 'bold' }}>{chat.unread}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>

          {/* Info Block */}
          <View style={{ marginTop: 24, padding: 16, backgroundColor: `${currentTheme.primary}05`, borderRadius: 20, borderStyle: 'dashed', borderWidth: 1, borderColor: `${currentTheme.primary}20`, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Clock size={20} color={currentTheme.primary} />
            <Text style={{ ...theme.typography.presets.bodySmall, color: currentTheme.primary, flex: 1 }}>
              Все диалоги шифруются. Поддержка отвечает в течение 5 минут.
            </Text>
          </View>
        </ScrollView>

        {/* Professional FAB with Haptics */}
        <TouchableOpacity 
          onPress={handleNewChat}
          activeOpacity={0.8}
          style={{ 
            position: 'absolute', 
            bottom: 24, 
            right: 24, 
            width: 56, 
            height: 56, 
            borderRadius: 16, 
            backgroundColor: currentTheme.secondary,
            alignItems: 'center', 
            justifyContent: 'center',
            shadowColor: currentTheme.secondary,
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.3,
            shadowRadius: 10,
            elevation: 8,
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.2)'
          }}
        >
          <Plus size={28} color="white" strokeWidth={2.5} />
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
};
