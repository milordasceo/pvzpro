import React from 'react';
import { View, StyleSheet, RefreshControl } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyledScrollView } from '../../../components';

interface CalendarTabProps {
  loading: boolean;
  onRefresh: () => void;
}

/**
 * Вкладка "Календарь" в модуле График
 * Заглушка для будущего функционала
 */
export const CalendarTab = React.memo<CalendarTabProps>(({ loading, onRefresh }) => {
  return (
    <StyledScrollView
      style={{ backgroundColor: '#F3F4F6' }}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={onRefresh} />
      }
    >
      <View style={styles.container}>
        <MaterialCommunityIcons 
          name="calendar-month-outline" 
          size={64} 
          color="#9CA3AF" 
          style={styles.icon}
        />
        <Text variant="headlineSmall" style={styles.title}>
          Календарь
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Раздел находится в разработке
        </Text>
      </View>
    </StyledScrollView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    minHeight: 400,
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    color: '#9CA3AF',
    textAlign: 'center',
  },
});

CalendarTab.displayName = 'CalendarTab';

