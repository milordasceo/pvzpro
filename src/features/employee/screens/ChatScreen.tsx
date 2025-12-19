import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, User, MessageSquare } from 'lucide-react-native';
import { theme } from '../../../shared/theme';

const MOCK_CHATS = [
  { id: 1, name: 'Поддержка WB', lastMessage: 'Ваша заявка на доплату принята в работу', time: '14:20', unread: 2, avatar: null },
  { id: 2, name: 'Иван Менеджер', lastMessage: 'Не забудь закрыть склад до 21:00', time: '12:05', unread: 0, avatar: null },
  { id: 3, name: 'Общий чат ПВЗ', lastMessage: 'Кто завтра на смену? Нужна замена', time: 'Вчера', unread: 5, avatar: null },
  { id: 4, name: 'Логистика', lastMessage: 'Машина будет через 15 минут', time: 'Пн', unread: 0, avatar: null },
];

export const ChatScreen = () => {
  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        {/* Header */}
        <View style={{ paddingHorizontal: 24, paddingVertical: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#111827' }}>Сообщения</Text>
          <TouchableOpacity style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#F9FAFB', alignItems: 'center', justifyContent: 'center' }}>
            <Search size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {MOCK_CHATS.map((chat) => (
            <TouchableOpacity 
              key={chat.id}
              style={{ 
                flexDirection: 'row', 
                paddingHorizontal: 24, 
                paddingVertical: 16, 
                alignItems: 'center',
                gap: 16,
                borderBottomWidth: 1,
                borderBottomColor: '#F9FAFB'
              }}
            >
              {/* Avatar Placeholder */}
              <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' }}>
                <User size={28} color="#D1D5DB" />
              </View>

              {/* Chat Info */}
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                  <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#111827' }}>{chat.name}</Text>
                  <Text style={{ fontSize: 12, color: chat.unread > 0 ? theme.colors.primary : '#9CA3AF' }}>{chat.time}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ fontSize: 14, color: '#6B7280', flex: 1, marginRight: 8 }} numberOfLines={1}>
                    {chat.lastMessage}
                  </Text>
                  {chat.unread > 0 && (
                    <View style={{ backgroundColor: theme.colors.primary, minWidth: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 }}>
                      <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>{chat.unread}</Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Floating Action Button for New Chat */}
        <TouchableOpacity 
          style={{ 
            position: 'absolute', 
            bottom: 24, 
            right: 24, 
            width: 60, 
            height: 60, 
            borderRadius: 30, 
            backgroundColor: theme.colors.secondary,
            alignItems: 'center', 
            justifyContent: 'center',
            shadowColor: theme.colors.secondary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 5
          }}
        >
          <MessageSquare size={24} color="white" fill="white" />
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
};
