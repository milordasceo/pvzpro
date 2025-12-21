import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, Clock, ChevronLeft, ChevronRight, Info, AlertCircle } from 'lucide-react-native';
import { theme } from '../../../shared/theme';
import { marketplaceThemes } from '../../../shared/theme/colors';
import { useShiftStore } from '../model/shift.store';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

export const ScheduleScreen = () => {
  const { pvz } = useShiftStore();
  const currentTheme = marketplaceThemes[pvz.marketplace] || marketplaceThemes.wb;

  const handleAction = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  const SELECTED_DAYS = [2, 3, 5, 6]; // Mock working days

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar barStyle="light-content" backgroundColor={currentTheme.primary} translucent />
      
      <View style={{ 
        position: 'absolute', 
        top: 0, left: 0, right: 0, 
        height: 180, 
        backgroundColor: currentTheme.bg, 
        borderBottomLeftRadius: theme.layout.radius['5xl'], 
        borderBottomRightRadius: theme.layout.radius['5xl'] 
      }} />

      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <View style={{ marginTop: theme.spacing.xs, marginBottom: theme.spacing.md, paddingHorizontal: theme.spacing.md }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <View>
              <Text style={{ ...theme.typography.presets.h3, color: theme.colors.white }}>График работы</Text>
              <Text style={{ ...theme.typography.presets.caption, color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>ДЕКАБРЬ 2025</Text>
            </View>
            <TouchableOpacity 
              onPress={handleAction}
              style={{ width: 40, height: 40, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' }}
            >
              <Info size={20} color={theme.colors.white} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeInDown.duration(400)}>
            {/* Month Navigator */}
            <View style={{ backgroundColor: theme.colors.white, borderRadius: 24, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: theme.colors.border.DEFAULT, ...theme.shadows.sm }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <TouchableOpacity onPress={handleAction}><ChevronLeft size={24} color={theme.colors.text.primary} /></TouchableOpacity>
                <Text style={{ ...theme.typography.presets.bodyLarge, fontWeight: '800', color: theme.colors.text.primary }}>Декабрь</Text>
                <TouchableOpacity onPress={handleAction}><ChevronRight size={24} color={theme.colors.text.primary} /></TouchableOpacity>
              </View>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                {DAYS.map(day => (
                  <Text key={day} style={{ ...theme.typography.presets.caption, color: theme.colors.text.muted, width: 36, textAlign: 'center' }}>{day}</Text>
                ))}
              </View>

              {/* Mock Calendar Grid */}
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'space-between' }}>
                {Array.from({ length: 31 }).map((_, i) => {
                  const isWorking = SELECTED_DAYS.includes(i % 7);
                  return (
                    <TouchableOpacity 
                      key={i} 
                      onPress={handleAction}
                      style={{ 
                        width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center',
                        backgroundColor: isWorking ? currentTheme.primary : theme.colors.background,
                        borderWidth: i + 1 === 21 ? 2 : 0,
                        borderColor: currentTheme.secondary
                      }}
                    >
                      <Text style={{ ...theme.typography.presets.bodySmall, fontWeight: '700', color: isWorking ? (pvz.marketplace === 'yandex' ? '#000' : '#fff') : theme.colors.text.primary }}>{i + 1}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Shift Details */}
            <View style={{ backgroundColor: theme.colors.white, borderRadius: 24, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: theme.colors.border.DEFAULT }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: `${currentTheme.primary}10`, alignItems: 'center', justifyContent: 'center' }}>
                  <Clock size={20} color={currentTheme.primary} />
                </View>
                <View>
                  <Text style={{ ...theme.typography.presets.bodySmall, color: theme.colors.text.secondary }}>Ближайшая смена</Text>
                  <Text style={{ ...theme.typography.presets.bodyLarge, fontWeight: '800', color: theme.colors.text.primary }}>Завтра, 09:00 — 21:00</Text>
                </View>
              </View>
              
              <View style={{ padding: 12, backgroundColor: theme.colors.background, borderRadius: 16, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <AlertCircle size={18} color={theme.colors.warning} />
                <Text style={{ ...theme.typography.presets.caption, color: theme.colors.text.secondary, flex: 1, fontSize: 10 }}>
                  Если не сможете выйти, сообщите менеджеру минимум за 24 часа.
                </Text>
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};
