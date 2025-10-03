import React from 'react';
import { View, ScrollView } from 'react-native';
import { Appbar, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

export const FinanceBreakdownScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header mode="center-aligned">
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Детализация по сменам" />
      </Appbar.Header>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
        <Text>Экран детальной разбивки по сменам (MVP-заглушка)</Text>
      </ScrollView>
    </View>
  );
};
