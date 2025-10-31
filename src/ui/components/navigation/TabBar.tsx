import React, { useEffect, useRef, ReactNode } from 'react';
import { View, Pressable, StyleSheet, Animated, useWindowDimensions } from 'react-native';
import { Text } from 'react-native-paper';
import { tokens } from '../../theme';
import { Label } from '../typography';

export interface Tab {
  key: string;
  label: string;
  badge?: ReactNode; // Опциональный бэйдж (например, Badge компонент)
}

export interface TabBarProps {
  tabs: Tab[];
  activeIndex: number;
  onTabPress: (index: number) => void;
}

/**
 * 📑 TabBar - Анимированная панель вкладок
 * 
 * Компонент панели вкладок с плавной анимацией индикатора.
 * Поддерживает бейджи для отображения уведомлений.
 * 
 * @example
 * ```tsx
 * <TabBar
 *   tabs={[
 *     { key: 'tab1', label: 'Вкладка 1' },
 *     { key: 'tab2', label: 'Вкладка 2', badge: <Badge>5</Badge> },
 *   ]}
 *   activeIndex={activeTab}
 *   onTabPress={setActiveTab}
 * />
 * ```
 */
export const TabBar: React.FC<TabBarProps> = ({
  tabs,
  activeIndex,
  onTabPress,
}) => {
  const { width } = useWindowDimensions();
  const tabWidth = width / tabs.length;
  
  const indicatorPosition = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(indicatorPosition, {
      toValue: activeIndex * tabWidth,
      duration: 200, // Быстрая анимация 200мс
      useNativeDriver: true,
    }).start();
  }, [activeIndex, tabWidth]);

  return (
    <View style={styles.tabBar}>
      {/* Анимированный индикатор */}
      <Animated.View
        style={[
          styles.indicator,
          {
            width: tabWidth,
            transform: [{ translateX: indicatorPosition }],
          },
        ]}
      />

      {/* Табы */}
      {tabs.map((tab, index) => (
        <Pressable
          key={tab.key}
          style={styles.tab}
          onPress={() => onTabPress(index)}
        >
          <View style={styles.tabContent}>
            <Label 
              size="medium"
              color={activeIndex === index ? 'primary' : 'muted'}
            >
              {tab.label}
            </Label>
            {tab.badge}
          </View>
        </Pressable>
      ))}
    </View>
  );
};

TabBar.displayName = 'TabBar';

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: tokens.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.border,
    position: 'relative',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    zIndex: 1,
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: 2,
    backgroundColor: tokens.colors.text.primary,
  },
});

