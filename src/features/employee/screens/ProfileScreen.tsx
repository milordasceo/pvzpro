import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  User,
  Settings,
  ChevronRight,
  LogOut,
  Phone,
  Mail,
  MapPin,
  Star,
  Bell,
  ShieldCheck,
  HelpCircle,
  Smartphone,
  ChevronLeft
} from 'lucide-react-native';
import { theme } from '../../../shared/theme';
import { marketplaceThemes } from '../../../shared/theme/colors';
import { useShiftStore, MarketplaceType } from '../model/shift.store';
import { useAuthStore } from '../../auth/model/auth.store';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useNavigation } from '@react-navigation/native';

export const ProfileScreen = () => {
  const navigation = useNavigation();
  const { employee, pvz, setMarketplace } = useShiftStore();
  const { logout } = useAuthStore();
  const currentTheme = marketplaceThemes[pvz.marketplace] || marketplaceThemes.wb;

  const handleLogout = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    logout();
  };

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.goBack();
  };

  const renderItem = (label: string, value?: string, icon?: React.ReactNode, color?: string, onPress?: () => void) => (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
      style={styles.itemRow}
    >
      <View style={styles.itemLeft}>
        <View style={[styles.iconContainer, { backgroundColor: color || theme.colors.background }]}>
          {icon}
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.itemLabel}>{label}</Text>
          {value && <Text style={styles.itemValue}>{value}</Text>}
        </View>
      </View>
      {onPress && <ChevronRight size={20} color={theme.colors.text.muted} />}
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />

      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        {/* Header Navigation */}
        <View style={styles.headerNav}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <ChevronLeft size={24} color={theme.colors.text.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeInDown.duration(400)}>

            {/* Title */}
            <Text style={styles.screenTitle}>Профиль</Text>

            {/* User Card */}
            <View style={styles.userCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.userName}>{employee.name}</Text>
                <Text style={[styles.userRole, { color: currentTheme.primary }]}>{employee.role}</Text>
                <View style={[styles.marketplaceBadge, { backgroundColor: `${currentTheme.primary}15` }]}>
                  <Text style={[styles.marketplaceText, { color: currentTheme.primary }]}>
                    {pvz.marketplace === 'wb' ? 'Wildberries' : pvz.marketplace === 'ozon' ? 'Ozon' : 'Яндекс'}
                  </Text>
                </View>
              </View>
              <View style={[styles.avatar, { borderColor: theme.colors.border.light }]}>
                {employee.avatarUrl ? (
                  <Image source={{ uri: employee.avatarUrl }} style={styles.avatarImage} />
                ) : (
                  <Text style={{ fontSize: 32, fontWeight: '500', color: theme.colors.text.primary }}>
                    {employee.name.split(' ')[0][0]}
                  </Text>
                )}
              </View>
            </View>

            {/* Marketplace Switcher */}
            <View style={styles.switcherContainer}>
              {(['wb', 'ozon', 'yandex'] as MarketplaceType[]).map((m) => {
                const isActive = pvz.marketplace === m;
                const mTheme = marketplaceThemes[m];
                return (
                  <TouchableOpacity
                    key={m}
                    onPress={() => setMarketplace(m)}
                    style={[
                      styles.switcherOption,
                      isActive && { backgroundColor: theme.colors.white, ...theme.shadows.sm }
                    ]}
                  >
                    <Text style={[
                      styles.switcherText,
                      isActive ? { color: mTheme.primary } : { color: theme.colors.text.muted }
                    ]}>
                      {m === 'wb' ? 'WB' : m === 'ozon' ? 'OZON' : 'YANDEX'}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Info Group */}
            <View style={styles.groupContainer}>
              <Text style={styles.groupTitle}>ИНФОРМАЦИЯ</Text>
              <View style={styles.card}>
                {renderItem('Телефон', '+7 (999) 123-45-67', <Phone size={20} color={theme.colors.text.primary} />, theme.colors.background)}
                <View style={styles.divider} />
                {renderItem('Email', 'alex@pvz.pro', <Mail size={20} color={theme.colors.text.primary} />, theme.colors.background)}
                <View style={styles.divider} />
                {renderItem('Пункт выдачи', pvz.address, <MapPin size={20} color={theme.colors.text.primary} />, theme.colors.background)}
                <View style={styles.divider} />
                {renderItem('Рейтинг: 5.0', 'Отличная работа!', <Star size={20} color={theme.colors.warning} />, `${theme.colors.warning}15`)}
              </View>
            </View>

            {/* Settings Group */}
            <View style={styles.groupContainer}>
              <Text style={styles.groupTitle}>НАСТРОЙКИ</Text>
              <View style={styles.card}>
                {renderItem('Уведомления', undefined, <Bell size={20} color={theme.colors.text.primary} />, theme.colors.background, () => { })}
                <View style={styles.divider} />
                {renderItem('Безопасность', undefined, <ShieldCheck size={20} color={theme.colors.success} />, `${theme.colors.success}15`, () => { })}
                <View style={styles.divider} />
                {renderItem('Помощь', undefined, <HelpCircle size={20} color={theme.colors.primary} />, `${theme.colors.primary}15`, () => { })}
              </View>
            </View>

            {/* Logout */}
            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
              <LogOut size={20} color={theme.colors.danger} />
              <Text style={styles.logoutText}>Выйти из аккаунта</Text>
            </TouchableOpacity>

            <Text style={styles.versionText}>Версия 2.4.12 • Build 1403</Text>

          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  headerNav: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    alignItems: 'flex-start',
  },
  backButton: {
    width: 40, height: 40,
    alignItems: 'center', justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: 40,
  },
  screenTitle: {
    ...theme.typography.presets.h1,
    marginBottom: theme.spacing.lg,
    color: theme.colors.text.primary,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  userName: {
    ...theme.typography.presets.h3,
    marginBottom: 4,
  },
  userRole: {
    ...theme.typography.presets.bodySmall,
    textTransform: 'uppercase',
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  marketplaceBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  marketplaceText: {
    ...theme.typography.presets.caption,
    fontWeight: '700',
  },
  avatar: {
    width: 80, height: 80,
    borderRadius: 40,
    borderWidth: 1,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: theme.colors.white,
    marginLeft: 16,
    ...theme.shadows.sm,
  },
  avatarImage: {
    width: '100%', height: '100%', borderRadius: 40,
  },
  switcherContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.card,
    padding: 4,
    borderRadius: 16,
    marginBottom: theme.spacing['2xl'],
    gap: 8,
  },
  switcherOption: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: theme.colors.background,
  },
  switcherText: {
    ...theme.typography.presets.label,
    fontWeight: '700',
    fontSize: 12,
  },
  groupContainer: {
    marginBottom: theme.spacing.xl,
  },
  groupTitle: {
    ...theme.typography.presets.caption,
    color: theme.colors.text.muted,
    marginBottom: theme.spacing.sm,
    marginLeft: theme.spacing.xs,
  },
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: 20,
    padding: 4,
    ...theme.shadows.sm,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 16,
  },
  iconContainer: {
    width: 44, height: 44,
    borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
  },
  itemLabel: {
    ...theme.typography.presets.body,
    fontWeight: '600',
    marginBottom: 2,
  },
  itemValue: {
    ...theme.typography.presets.caption,
    color: theme.colors.text.secondary,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border.light,
    marginLeft: 72,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 20,
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: `${theme.colors.danger}30`,
    marginBottom: theme.spacing.xl,
  },
  logoutText: {
    ...theme.typography.presets.body,
    color: theme.colors.danger,
    fontWeight: '700',
  },
  versionText: {
    textAlign: 'center',
    ...theme.typography.presets.caption,
    color: theme.colors.text.muted,
    opacity: 0.5,
  }
});
