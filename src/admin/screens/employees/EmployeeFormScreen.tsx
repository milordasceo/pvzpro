import React, { useState } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { tokens, ScrollView, Button, SelectModal, LoadingState } from '../../../ui';
import type { SelectOption } from '../../../ui/components/inputs/SelectModal';
import { AdminTabParamList } from '../../../types/navigation';
import { useEmployeeForm } from './hooks/useEmployeeForm';

type EmployeeFormScreenRouteProp = RouteProp<AdminTabParamList, 'EmployeeForm'>;
type EmployeeFormScreenNavigationProp = NativeStackNavigationProp<AdminTabParamList, 'EmployeeForm'>;

export const EmployeeFormScreen = () => {
  const route = useRoute<EmployeeFormScreenRouteProp>();
  const navigation = useNavigation<EmployeeFormScreenNavigationProp>();
  const { employeeId } = route.params || {};

  const {
    formData,
    errors,
    loading,
    submitting,
    updateField,
    submitForm,
  } = useEmployeeForm(employeeId);

  const [showPositionModal, setShowPositionModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showPvzModal, setShowPvzModal] = useState(false);

  const positionOptions: SelectOption[] = [
    { id: 'trainee', label: 'Стажёр' },
    { id: 'employee', label: 'Сотрудник' },
    { id: 'senior', label: 'Старший сотрудник' },
    { id: 'manager', label: 'Менеджер' },
  ];

  const statusOptions: SelectOption[] = [
    { id: 'working', label: 'На смене' },
    { id: 'day_off', label: 'Выходной' },
    { id: 'sick_leave', label: 'Больничный' },
    { id: 'vacation', label: 'Отпуск' },
    { id: 'fired', label: 'Уволен' },
  ];

  const pvzOptions: SelectOption[] = [
    { id: 'pvz-1', label: 'ПВЗ Московская, 12' },
    { id: 'pvz-2', label: 'ПВЗ Ленина, 45' },
    { id: 'pvz-3', label: 'ПВЗ Советская, 78' },
  ];

  const handleSubmit = async () => {
    const result = await submitForm();
    
    if (result.success) {
      Alert.alert(
        'Успешно',
        employeeId ? 'Данные сотрудника обновлены' : 'Сотрудник добавлен',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } else {
      Alert.alert('Ошибка', result.error || 'Не удалось сохранить данные');
    }
  };

  const getPositionLabel = (value: string) => {
    return positionOptions.find(opt => opt.id === value)?.label || value;
  };

  const getStatusLabel = (value: string) => {
    return statusOptions.find(opt => opt.id === value)?.label || value;
  };

  const getPvzLabel = (value: string) => {
    return pvzOptions.find(opt => opt.id === value)?.label || value;
  };

  if (loading) {
    return <LoadingState />;
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Заголовок */}
        <View style={styles.header}>
          <Text style={styles.title}>
            {employeeId ? 'Редактировать сотрудника' : 'Добавить сотрудника'}
          </Text>
          <Text style={styles.subtitle}>
            Заполните информацию о сотруднике
          </Text>
        </View>

        {/* Основная информация */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Основная информация</Text>

          <TextInput
            label="Имя и фамилия *"
            value={formData.name}
            onChangeText={(value) => updateField('name', value)}
            error={!!errors.name}
            placeholder="Иван Иванов"
            mode="outlined"
            style={styles.input}
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

          <TextInput
            label="Телефон *"
            value={formData.phone}
            onChangeText={(value) => updateField('phone', value)}
            error={!!errors.phone}
            placeholder="+7 (999) 123-45-67"
            keyboardType="phone-pad"
            mode="outlined"
            style={styles.input}
          />
          {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

          <TextInput
            label="Email"
            value={formData.email}
            onChangeText={(value) => updateField('email', value)}
            error={!!errors.email}
            placeholder="example@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            mode="outlined"
            style={styles.input}
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>

        {/* Должность и статус */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Должность и статус</Text>

          <TouchableOpacity onPress={() => setShowPositionModal(true)} activeOpacity={0.7}>
            <TextInput
              label="Должность *"
              value={getPositionLabel(formData.position)}
              editable={false}
              mode="outlined"
              style={styles.input}
              right={<TextInput.Icon icon="chevron-down" />}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setShowStatusModal(true)} activeOpacity={0.7}>
            <TextInput
              label="Статус занятости *"
              value={getStatusLabel(formData.employmentStatus)}
              editable={false}
              mode="outlined"
              style={styles.input}
              right={<TextInput.Icon icon="chevron-down" />}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setShowPvzModal(true)} activeOpacity={0.7}>
            <TextInput
              label="ПВЗ *"
              value={formData.pvzId ? getPvzLabel(formData.pvzId) : ''}
              editable={false}
              error={!!errors.pvzId}
              placeholder="Выберите ПВЗ"
              mode="outlined"
              style={styles.input}
              right={<TextInput.Icon icon="chevron-down" />}
            />
          </TouchableOpacity>
          {errors.pvzId && <Text style={styles.errorText}>{errors.pvzId}</Text>}
        </View>

        {/* Финансы */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Финансы</Text>

          <TextInput
            label="Базовая зарплата"
            value={formData.baseSalary?.toString() || ''}
            onChangeText={(value) => updateField('baseSalary', value ? parseInt(value) : undefined)}
            placeholder="40000"
            keyboardType="numeric"
            mode="outlined"
            style={styles.input}
            right={<TextInput.Icon icon="currency-rub" />}
          />
        </View>

        {/* Примечание */}
        <View style={styles.noteContainer}>
          <Text style={styles.noteText}>
            * — обязательные поля
          </Text>
        </View>
      </ScrollView>

      {/* Кнопки действий */}
      <View style={styles.footer}>
        <Button
          mode="outlined"
          onPress={() => navigation.goBack()}
          style={{ flex: 1 }}
        >
          Отмена
        </Button>
        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={submitting}
          style={{ flex: 1 }}
        >
          {employeeId ? 'Сохранить' : 'Добавить'}
        </Button>
      </View>

      {/* Модальные окна выбора */}
      <SelectModal
        visible={showPositionModal}
        onClose={() => setShowPositionModal(false)}
        title="Выберите должность"
        options={positionOptions}
        onSelect={(option) => {
          updateField('position', option.id as any);
        }}
      />

      <SelectModal
        visible={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        title="Выберите статус"
        options={statusOptions}
        onSelect={(option) => {
          updateField('employmentStatus', option.id as any);
        }}
      />

      <SelectModal
        visible={showPvzModal}
        onClose={() => setShowPvzModal(false)}
        title="Выберите ПВЗ"
        options={pvzOptions}
        onSelect={(option) => {
          updateField('pvzId', option.id);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.screenBackground,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: tokens.colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: tokens.colors.text.secondary,
  },
  section: {
    marginBottom: 24,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: tokens.colors.text.primary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: tokens.colors.surface,
  },
  errorText: {
    fontSize: 12,
    color: tokens.colors.error.main,
    marginTop: -8,
    marginBottom: 8,
  },
  noteContainer: {
    padding: 12,
    backgroundColor: tokens.colors.info.light,
    borderRadius: 8,
    marginTop: 8,
  },
  noteText: {
    fontSize: 12,
    color: tokens.colors.text.secondary,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    backgroundColor: tokens.colors.surface,
    borderTopWidth: 1,
    borderTopColor: tokens.colors.gray[200],
  },
});
