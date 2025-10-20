import React from 'react';
import { View, StyleSheet, RefreshControl } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { tokens, ScrollView } from '../../../ui';

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
    <ScrollView
      style={{ backgroundColor: tokens.colors.gray[100] }}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={onRefresh} />
      }
    >
      <View style={styles.container}>
        <MaterialCommunityIcons 
          name="calendar-month-outline" 
          size={64} 
          color={tokens.colors.text.muted} 
          style={styles.icon}
        />
        <Text variant="headlineSmall" style={styles.title}>
          Календарь
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Раздел находится в разработке
        </Text>
      </View>
    </ScrollView>
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
    color: tokens.colors.text.muted,
    textAlign: 'center',
  },
});

CalendarTab.displayName = 'CalendarTab';

