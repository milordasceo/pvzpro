import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Wallet, TrendingUp, ArrowDownCircle, ArrowUpCircle, Info, Calendar } from 'lucide-react-native';
import { theme } from '../../../shared/theme';
import { marketplaceThemes } from '../../../shared/theme/colors';
import { useShiftStore } from '../model/shift.store';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

export const FinanceScreen = () => {
  const { pvz, shift } = useShiftStore();
  const currentTheme = marketplaceThemes[pvz.marketplace] || marketplaceThemes.wb;

  const handleAction = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar barStyle="light-content" backgroundColor={currentTheme.primary} translucent />
      
      <View style={{ 
        position: 'absolute', 
        top: 0, left: 0, right: 0, 
        height: 200, 
        backgroundColor: currentTheme.bg, 
        borderBottomLeftRadius: theme.layout.radius['5xl'], 
        borderBottomRightRadius: theme.layout.radius['5xl'] 
      }} />

      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <View style={{ marginTop: theme.spacing.xs, marginBottom: theme.spacing.md, paddingHorizontal: theme.spacing.md }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <View>
              <Text style={{ ...theme.typography.presets.h3, color: theme.colors.white }}>Финансы</Text>
              <Text style={{ ...theme.typography.presets.caption, color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>ВАШ ЗАРАБОТОК</Text>
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
            {/* Total Earnings Card */}
            <View style={{ backgroundColor: theme.colors.white, borderRadius: 28, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: theme.colors.border.DEFAULT, ...theme.shadows.md }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: `${theme.colors.success}15`, alignItems: 'center', justifyContent: 'center' }}>
                  <TrendingUp size={24} color={theme.colors.success} />
                </View>
                <View>
                  <Text style={{ ...theme.typography.presets.bodySmall, color: theme.colors.text.secondary }}>Доступно к выводу</Text>
                  <Text style={{ ...theme.typography.presets.h2, color: theme.colors.text.primary }}>12 450 ₽</Text>
                </View>
              </View>
              
              <TouchableOpacity 
                onPress={() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)}
                activeOpacity={0.8}
                style={{ height: 52, backgroundColor: currentTheme.primary, borderRadius: 16, alignItems: 'center', justifyContent: 'center', shadowColor: currentTheme.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 }}
              >
                <Text style={{ ...theme.typography.presets.label, color: pvz.marketplace === 'yandex' ? '#000' : 'white', fontWeight: '800' }}>ВЫВЕСТИ СРЕДСТВА</Text>
              </TouchableOpacity>
            </View>

            {/* Stats Grid */}
            <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
              <View style={{ flex: 1, backgroundColor: theme.colors.white, borderRadius: 20, padding: 16, borderWidth: 1, borderColor: theme.colors.border.DEFAULT }}>
                <ArrowUpCircle size={20} color={theme.colors.success} style={{ marginBottom: 8 }} />
                <Text style={{ ...theme.typography.presets.caption, color: theme.colors.text.secondary }}>БОНУСЫ</Text>
                <Text style={{ ...theme.typography.presets.bodyLarge, color: theme.colors.text.primary, fontWeight: '700' }}>+1 200 ₽</Text>
              </View>
              <View style={{ flex: 1, backgroundColor: theme.colors.white, borderRadius: 20, padding: 16, borderWidth: 1, borderColor: theme.colors.border.DEFAULT }}>
                <ArrowDownCircle size={20} color={theme.colors.danger} style={{ marginBottom: 8 }} />
                <Text style={{ ...theme.typography.presets.caption, color: theme.colors.text.secondary }}>ШТРАФЫ</Text>
                <Text style={{ ...theme.typography.presets.bodyLarge, color: theme.colors.text.primary, fontWeight: '700' }}>-150 ₽</Text>
              </View>
            </View>

            {/* History Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12, marginLeft: 4 }}>
              <Calendar size={16} color={theme.colors.text.muted} />
              <Text style={{ ...theme.typography.presets.caption, color: theme.colors.text.muted, fontWeight: '800' }}>ПОСЛЕДНИЕ НАЧИСЛЕНИЯ</Text>
            </View>

            {/* Placeholder List */}
            <View style={{ backgroundColor: theme.colors.white, borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: theme.colors.border.DEFAULT }}>
              {[1, 2, 3].map((item, idx) => (
                <View key={item} style={{ padding: 16, borderBottomWidth: idx !== 2 ? 1 : 0, borderBottomColor: theme.colors.background, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View>
                    <Text style={{ ...theme.typography.presets.bodySmall, color: theme.colors.text.primary, fontWeight: '700' }}>Смена {20 - idx} дек</Text>
                    <Text style={{ ...theme.typography.presets.caption, color: theme.colors.text.secondary, fontSize: 10 }}>12 часов отработано</Text>
                  </View>
                  <Text style={{ ...theme.typography.presets.bodyLarge, color: theme.colors.text.primary, fontWeight: '800' }}>3 500 ₽</Text>
                </View>
              ))}
            </View>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};
