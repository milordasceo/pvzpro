/**
 * 🎨 UI Catalog FAB - Плавающая кнопка для доступа к UI каталогу
 * 
 * Отображается только в DEV режиме
 * Позволяет открыть UI Catalog из любого места приложения
 * 
 * Особенности:
 * - Работает только в __DEV__
 * - Тройной тап для открытия
 * - Можно перетаскивать
 * - Полупрозрачная, не мешает работе
 */

import React, { useState, useRef } from 'react';
import { View, StyleSheet, Animated, PanResponder, Pressable, Platform, Alert } from 'react-native';
import { Portal } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { tokens } from '../../theme';

export interface UICatalogFABProps {
  /** Показывать FAB (по умолчанию только в DEV) */
  visible?: boolean;
}

/**
 * 🛠️ UICatalogFAB - FAB для быстрого доступа к каталогу компонентов
 * 
 * Dev-инструмент для разработчиков. Показывается только в DEV режиме.
 * Тройной тап открывает UI каталог. Можно перетаскивать по экрану.
 * 
 * @example
 * ```tsx
 * // В AppProvider
 * <UICatalogFAB />
 * ```
 * 
 * @example
 * ```tsx
 * // Принудительно показать в production (не рекомендуется)
 * <UICatalogFAB visible={true} />
 * ```
 */
export const UICatalogFAB = React.memo<UICatalogFABProps>(({ 
  visible = __DEV__ 
}) => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [tapCount, setTapCount] = useState(0);
  const tapTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Анимация для перетаскивания
  const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  
  // Обработчик перетаскивания
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({
          x: (pan.x as any)._value,
          y: (pan.y as any)._value,
        });
      },
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: () => {
        pan.flattenOffset();
      },
    })
  ).current;

  const handlePress = () => {
    // Сброс предыдущего таймаута
    if (tapTimeoutRef.current) {
      clearTimeout(tapTimeoutRef.current);
    }

    const newTapCount = tapCount + 1;
    setTapCount(newTapCount);

    if (newTapCount === 3) {
      // Тройной тап - открываем UI Catalog
      setTapCount(0);
      openUICatalog();
    } else {
      // Ждём следующий тап (800мс)
      tapTimeoutRef.current = setTimeout(() => {
        setTapCount(0);
      }, 800);
    }
  };

  const openUICatalog = () => {
    try {
      // Пытаемся навигировать на UICatalogScreen
      // Работает если мы в Admin навигации
      (navigation as any).navigate('ПВЗ');
    } catch (error) {
      // Если не получилось, показываем подсказку
      Alert.alert(
        '🎨 UI Catalog',
        'Откройте Админ панель → Таб "UI" для просмотра каталога компонентов',
        [{ text: 'OK' }]
      );
    }
  };

  if (!visible) {
    return null;
  }

  return (
    <Portal>
      <Animated.View
        style={[
          styles.container,
          {
            transform: [
              { translateX: pan.x },
              { translateY: pan.y },
            ],
          },
        ]}
        {...panResponder.panHandlers}
      >
        <Pressable
          onPress={handlePress}
          style={({ pressed }) => [
            styles.fab,
            pressed && styles.fabPressed,
          ]}
        >
          <MaterialCommunityIcons
            name="palette"
            size={24}
            color={tokens.colors.surface}
          />
          {tapCount > 0 && (
            <View style={styles.badge}>
              <MaterialCommunityIcons
                name="numeric-3-circle"
                size={16}
                color={tokens.colors.warning.main}
              />
            </View>
          )}
        </Pressable>
      </Animated.View>
    </Portal>
  );
});

UICatalogFAB.displayName = 'UICatalogFAB';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 16,
    bottom: Platform.OS === 'ios' ? 100 : 80,
    zIndex: 9999,
  },
  
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: tokens.colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    opacity: 0.8,
  },
  
  fabPressed: {
    opacity: 1,
    transform: [{ scale: 0.95 }],
  },
  
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: tokens.colors.surface,
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
});

