import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { Text, Snackbar, Badge } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { ProcessTab } from './tabs/ProcessTab';
import { TasksTab } from './tabs/TasksTab';
import { useTasksCounter } from './tasks/TasksCounterContext';
import { useShiftStatus } from '../store/shift.store';
import { AnimatedTabBar, AnimatedTab } from '../components';

const TopTabs = createMaterialTopTabNavigator();

// Кастомный таб-бар с блокировкой доступа к задачам
const CustomShiftTabBar: React.FC<{ 
  navigation: any; 
  state: any;
  onShowHint: () => void;
}> = ({ navigation, state, onShowHint }) => {
  const { pendingCount } = useTasksCounter();
  const shiftStatus = useShiftStatus();
  const isShiftStarted = shiftStatus === 'active' || shiftStatus === 'break';

  // Всегда показываем оба таба
  const shiftTabs: AnimatedTab[] = [
    { key: 'overview', label: 'Обзор' },
    { 
      key: 'tasks', 
      label: 'Задачи',
      badge: pendingCount > 0 ? (
        <Badge size={18} style={{ backgroundColor: '#EF4444', fontSize: 12 }}>
          {pendingCount > 99 ? '99+' : pendingCount}
        </Badge>
      ) : undefined,
    },
  ];

  const handleTabPress = (index: number) => {
    // Блокируем переход на "Задачи" (индекс 1), если смена не начата
    if (index === 1 && !isShiftStarted) {
      onShowHint(); // Показываем общую подсказку
      return;
    }
    
    const tabName = index === 0 ? 'Обзор' : 'Задачи';
    navigation.navigate(tabName);
  };

  return <AnimatedTabBar tabs={shiftTabs} activeIndex={state.index} onTabPress={handleTabPress} />;
};

export const EmployeeHomeScreen: React.FC = () => {
  const shiftStatus = useShiftStatus();
  const isShiftStarted = shiftStatus === 'active' || shiftStatus === 'break';
  const [hintVisible, setHintVisible] = useState(false);

  // Показываем подсказку при первой загрузке, если смена не начата
  useEffect(() => {
    if (!isShiftStarted) {
      const timer = setTimeout(() => {
        setHintVisible(true);
      }, 800); // Задержка 800мс после загрузки
      return () => clearTimeout(timer);
    }
  }, [isShiftStarted]);

  // Функция для показа подсказки (вызывается при клике на таб)
  const handleShowHint = () => {
    setHintVisible(true);
  };

  return (
    <View style={{ flex: 1 }}>
      <TopTabs.Navigator
        initialRouteName="Обзор"
        screenOptions={{
          swipeEnabled: isShiftStarted, // Свайп доступен только после начала смены
          lazy: false,
        }}
        tabBar={(props) => <CustomShiftTabBar {...props} onShowHint={handleShowHint} />}
      >
        <TopTabs.Screen 
          name="Обзор" 
          component={ProcessTab} 
        />
        <TopTabs.Screen 
          name="Задачи" 
          component={TasksTab}
        />
      </TopTabs.Navigator>

      {/* Подсказка о недоступности задач - вверху экрана */}
      <Snackbar
        visible={hintVisible && !isShiftStarted}
        onDismiss={() => setHintVisible(false)}
        duration={3500}
        action={{
          label: 'Понятно',
          onPress: () => setHintVisible(false),
        }}
        wrapperStyle={{ top: 0 }}
      >
        💡 Задачи станут доступны после начала смены
      </Snackbar>
    </View>
  );
};
