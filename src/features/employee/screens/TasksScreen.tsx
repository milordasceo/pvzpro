import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CheckCircle2, Circle, Clock, AlertCircle } from 'lucide-react-native';
import { theme } from '../../../shared/theme';

const MOCK_TASKS = [
  { id: 1, title: 'Приемка товара', description: 'Разгрузить машину и отсканировать коробки', status: 'in_progress', priority: 'high', time: '10:00' },
  { id: 2, title: 'Выдача заказов', description: 'Обработать очередь клиентов', status: 'pending', priority: 'medium', time: 'Весь день' },
  { id: 3, title: 'Инвентаризация', description: 'Проверить полку А1-А12', status: 'pending', priority: 'low', time: '14:00' },
  { id: 4, title: 'Уборка помещения', description: 'Протереть стойку выдачи', status: 'completed', priority: 'low', time: '09:00' },
];

export const TasksScreen = () => {
  return (
    <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <View style={{ padding: 24, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#F3F4F6' }}>
          <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#111827' }}>Задачи</Text>
          <Text style={{ color: '#6B7280', marginTop: 4 }}>План на текущую смену</Text>
        </View>

        <ScrollView contentContainerStyle={{ padding: 20 }}>
          {MOCK_TASKS.map((task) => (
            <TouchableOpacity 
              key={task.id}
              style={{ 
                backgroundColor: 'white', 
                padding: 16, 
                borderRadius: 20, 
                marginBottom: 12,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 16,
                borderWidth: 1,
                borderColor: task.status === 'in_progress' ? theme.colors.primary + '30' : '#F3F4F6',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
                elevation: 2
              }}
            >
              {task.status === 'completed' ? (
                <CheckCircle2 size={24} color={theme.colors.success} />
              ) : task.status === 'in_progress' ? (
                <Clock size={24} color={theme.colors.primary} />
              ) : (
                <Circle size={24} color="#D1D5DB" />
              )}

              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <Text style={{ fontSize: 16, fontWeight: 'bold', color: task.status === 'completed' ? '#9CA3AF' : '#111827' }}>
                    {task.title}
                  </Text>
                  {task.priority === 'high' && (
                    <AlertCircle size={14} color={theme.colors.danger} />
                  )}
                </View>
                <Text style={{ fontSize: 13, color: '#6B7280' }} numberOfLines={1}>
                  {task.description}
                </Text>
              </View>

              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#9CA3AF' }}>{task.time}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

