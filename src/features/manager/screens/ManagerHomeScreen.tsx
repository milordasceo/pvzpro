import React from 'react';
import { View, Text, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LayoutDashboard, LogOut } from 'lucide-react-native';
import { useAuthStore } from '../../auth/model/auth.store';
import { theme } from '../../../shared/theme';
import { Button } from '../../../shared/ui/Button';
import Animated, { FadeInDown } from 'react-native-reanimated';

export const ManagerHomeScreen = () => {
  const logout = useAuthStore((state) => state.logout);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.white} />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1, padding: theme.spacing.xl, justifyContent: 'center', alignItems: 'center' }}>
          <Animated.View entering={FadeInDown.duration(600)} style={{ alignItems: 'center' }}>
            <View style={{ width: 80, height: 80, borderRadius: 24, backgroundColor: `${theme.colors.primary}10`, alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
              <LayoutDashboard size={40} color={theme.colors.primary} />
            </View>
            <Text style={{ ...theme.typography.presets.h2, color: theme.colors.text.primary, marginBottom: 8 }}>Панель Менеджера</Text>
            <Text style={{ ...theme.typography.presets.body, color: theme.colors.text.secondary, textAlign: 'center', marginBottom: 40, paddingHorizontal: 20 }}>
              Модуль управления сотрудниками и ПВЗ находится в разработке.
            </Text>
            
            <Button 
              variant="flat" 
              color="danger" 
              startContent={<LogOut size={18} />}
              onPress={logout}
              style={{ width: '100%', height: 56, borderRadius: 16 }}
            >
              ВЫЙТИ ИЗ СИСТЕМЫ
            </Button>
          </Animated.View>
        </View>
      </SafeAreaView>
    </View>
  );
};
