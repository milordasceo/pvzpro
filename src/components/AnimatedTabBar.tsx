import React, { useEffect, useRef, ReactNode } from 'react';
import { View, Pressable, StyleSheet, Animated, useWindowDimensions } from 'react-native';
import { Text } from 'react-native-paper';
import { placeholderColor } from '../theme';

export interface AnimatedTab {
  key: string;
  label: string;
  badge?: ReactNode; // Опциональный бэйдж (например, Badge компонент)
}

interface AnimatedTabBarProps {
  tabs: AnimatedTab[];
  activeIndex: number;
  onTabPress: (index: number) => void;
}

export const AnimatedTabBar: React.FC<AnimatedTabBarProps> = ({
  tabs,
  activeIndex,
  onTabPress,
}) => {
  const { width } = useWindowDimensions();
  const tabWidth = width / tabs.length;
  
  const indicatorPosition = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(indicatorPosition, {
      toValue: activeIndex * tabWidth,
      useNativeDriver: true,
      tension: 100, // Увеличено с 68 (быстрее)
      friction: 10,  // Уменьшено с 12 (быстрее)
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
            <Text style={[styles.tabLabel, activeIndex === index && styles.tabLabelActive]}>
              {tab.label}
            </Text>
            {tab.badge}
          </View>
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
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
    backgroundColor: '#111827',
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: placeholderColor,
  },
  tabLabelActive: {
    color: '#111827',
  },
});

