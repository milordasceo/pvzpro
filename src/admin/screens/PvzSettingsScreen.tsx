/**
 * Экран настроек конкретного ПВЗ
 * Открывается по нажатию кнопки "Настройки" в карточке ПВЗ
 */

import React, { useMemo, useState, useCallback, useEffect, useRef } from 'react';
import { View, StyleSheet, Alert, Keyboard, Pressable } from 'react-native';
import { Text, TextInput, List, Switch, Divider, ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRoute, useNavigation, type RouteProp } from '@react-navigation/native';
import { ScrollView, Card, Button } from '../../ui';
import { tokens } from '../../ui';
import { usePvzStore } from '../store/pvz.store';
import { MapPickerModal } from '../components/MapPickerModal';
import { suggestAddresses } from '../../services/geo.service';
import type { AdminTabParamList } from '../../types/navigation';
import type { AdminPvz } from '../../types/admin';

type PvzSettingsRouteProp = RouteProp<AdminTabParamList, 'PvzSettings'>;

/**
 * Экран с полными настройками ПВЗ
 */
export const PvzSettingsScreen: React.FC = () => {
  const route = useRoute<PvzSettingsRouteProp>();
  const navigation = useNavigation();
  const { pvzId } = route.params;

  // Получаем данные ПВЗ из store
  const pvzList = usePvzStore((state) => state.pvzList);
  const pvz = useMemo(() => pvzList.find((p) => p.id === pvzId), [pvzList, pvzId]);

  // Local state для редактирования
  const [editedPvz, setEditedPvz] = useState<AdminPvz | null>(pvz || null);
  const [hasChanges, setHasChanges] = useState(false);
  const [mapModalVisible, setMapModalVisible] = useState(false);
  
  // Автопоиск адреса
  const [addressQuery, setAddressQuery] = useState(editedPvz?.address || '');
  const [addressSuggestions, setAddressSuggestions] = useState<Array<{ title: string; lat: number; lon: number }>>([]);
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false); // Явное управление показом подсказок

  // Обновление полей
  const updateField = useCallback((field: keyof AdminPvz, value: any) => {
    if (!editedPvz) return;
    setEditedPvz({ ...editedPvz, [field]: value });
    setHasChanges(true);
  }, [editedPvz]);

  const updateSettings = useCallback((settingsUpdate: Partial<AdminPvz['settings']>) => {
    if (!editedPvz) return;
    setEditedPvz({
      ...editedPvz,
      settings: { ...editedPvz.settings, ...settingsUpdate },
    });
    setHasChanges(true);
  }, [editedPvz]);

  const updateGeofence = useCallback((geofenceUpdate: Partial<AdminPvz['settings']['geofence']>) => {
    if (!editedPvz) return;
    setEditedPvz({
      ...editedPvz,
      settings: {
        ...editedPvz.settings,
        geofence: { ...editedPvz.settings.geofence, ...geofenceUpdate },
      },
    });
    setHasChanges(true);
  }, [editedPvz]);

  const updateQrCodes = useCallback((qrUpdate: Partial<AdminPvz['settings']['qrCodes']>) => {
    if (!editedPvz) return;
    setEditedPvz({
      ...editedPvz,
      settings: {
        ...editedPvz.settings,
        qrCodes: { ...editedPvz.settings.qrCodes, ...qrUpdate },
      },
    });
    setHasChanges(true);
  }, [editedPvz]);

  const updateWorkingHours = useCallback((hoursUpdate: Partial<AdminPvz['settings']['workingHours']>) => {
    if (!editedPvz) return;
    setEditedPvz({
      ...editedPvz,
      settings: {
        ...editedPvz.settings,
        workingHours: { ...editedPvz.settings.workingHours, ...hoursUpdate },
      },
    });
    setHasChanges(true);
  }, [editedPvz]);

  const updateShiftRules = useCallback((rulesUpdate: Partial<AdminPvz['settings']['shiftRules']>) => {
    if (!editedPvz) return;
    setEditedPvz({
      ...editedPvz,
      settings: {
        ...editedPvz.settings,
        shiftRules: { ...editedPvz.settings.shiftRules, ...rulesUpdate },
      },
    });
    setHasChanges(true);
  }, [editedPvz]);

  // Автопоиск адресов
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (addressQuery.trim().length >= 3 && showSuggestions) {
        setIsLoadingAddress(true);
        try {
          const results = await suggestAddresses(addressQuery);
          
          // Убираем дубликаты по названию
          const unique = results.filter((item, index, self) =>
            index === self.findIndex((t) => t.title === item.title)
          );
          
          setAddressSuggestions(unique);
        } catch (error) {
          console.error('Ошибка поиска адреса:', error);
        } finally {
          setIsLoadingAddress(false);
        }
      } else {
        setAddressSuggestions([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [addressQuery, showSuggestions]);

  // Выбор адреса из подсказок
  const handleSelectAddress = useCallback((suggestion: { title: string; lat: number; lon: number }) => {
    if (!editedPvz) return;
    
    console.log('🎯 Выбран адрес:', suggestion.title);
    
    // Сначала скрываем подсказки
    setShowSuggestions(false);
    setAddressSuggestions([]);
    
    // Используем requestAnimationFrame для синхронного обновления
    requestAnimationFrame(() => {
      // Обновляем данные
      setEditedPvz({
        ...editedPvz,
        address: suggestion.title,
        coordinates: {
          latitude: suggestion.lat,
          longitude: suggestion.lon,
        },
      });
      
      // Обновляем query
      setAddressQuery(suggestion.title);
      setHasChanges(true);
      
      // Скрываем клавиатуру
      Keyboard.dismiss();
    });
  }, [editedPvz]);

  // Сохранение
  const handleSave = useCallback(() => {
    if (!editedPvz) return;

    // TODO: Интеграция с API
    // Пока обновляем только в store (когда добавим action)
    Alert.alert(
      'Настройки сохранены',
      'Изменения будут применены после интеграции с API',
      [
        {
          text: 'OK',
          onPress: () => {
            setHasChanges(false);
            navigation.goBack();
          },
        },
      ],
    );
  }, [editedPvz, navigation]);

  if (!pvz || !editedPvz) {
    return (
      <View style={styles.container}>
        <ScrollView>
          <Card>
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="store-off-outline" size={64} color={tokens.colors.text.muted} />
              <Text style={styles.emptyTitle}>ПВЗ не найден</Text>
              <Text style={styles.emptyText}>Проверьте правильность ID</Text>
            </View>
          </Card>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
          <ScrollView>
        {/* 1. Основная информация */}
        <Card>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="information-outline" size={20} color={tokens.colors.text.secondary} />
              <Text style={styles.sectionTitle}>Основная информация</Text>
            </View>

            <TextInput
              label="Название"
              value={editedPvz.name}
              onChangeText={(value) => updateField('name', value)}
              mode="outlined"
              style={styles.input}
            />
          </View>
        </Card>

        {/* 2. Адрес и локация */}
        <Card>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="map-marker" size={20} color={tokens.colors.text.secondary} />
              <Text style={styles.sectionTitle}>Адрес и локация</Text>
            </View>

            {/* Подсказки адресов - НАД полем ввода */}
            {addressSuggestions.length > 0 && showSuggestions && (
              <ScrollView 
                style={styles.suggestionsContainer}
                keyboardShouldPersistTaps="handled"
                nestedScrollEnabled={true}
              >
                {addressSuggestions.map((suggestion, idx) => (
                  <Pressable
                    key={idx}
                    onPressIn={() => {
                      console.log('🖱️ PressIn на подсказку');
                      handleSelectAddress(suggestion);
                    }}
                    style={({ pressed }) => [
                      styles.suggestionItem,
                      pressed && styles.suggestionItemPressed,
                    ]}
                  >
                    <View style={styles.suggestionContent}>
                      <MaterialCommunityIcons name="map-marker" size={20} color={tokens.colors.text.secondary} style={styles.suggestionIcon} />
                      <Text numberOfLines={2} style={styles.suggestionText}>
                        {suggestion.title}
                </Text>
                    </View>
                  </Pressable>
                ))}
              </ScrollView>
            )}

            <TextInput
              label="Адрес"
              value={addressQuery}
              onChangeText={(text) => {
                setAddressQuery(text);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              mode="outlined"
              style={styles.input}
              right={isLoadingAddress ? <TextInput.Icon icon={() => <ActivityIndicator size={20} />} /> : undefined}
            />
            
              <Button
                mode="outlined"
              icon="map-search"
              onPress={() => setMapModalVisible(true)}
              style={styles.fullWidthButton}
            >
              Выбрать на карте
              </Button>

            <Text style={styles.coordinatesText}>
              {editedPvz.coordinates.latitude.toFixed(6)}, {editedPvz.coordinates.longitude.toFixed(6)}
            </Text>

            <Divider style={styles.divider} />

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Геозона включена</Text>
                <Text style={styles.settingDescription}>
                  Радиус: 100 метров (по умолчанию)
                </Text>
              </View>
              <Switch
                value={editedPvz.settings.geofence.enabled}
                onValueChange={(value) => updateGeofence({ enabled: value })}
              />
            </View>
          </View>
        </Card>

        {/* 3. QR-коды */}
        <Card>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="qrcode" size={20} color={tokens.colors.text.secondary} />
              <Text style={styles.sectionTitle}>QR-коды</Text>
            </View>

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>QR-коды включены</Text>
                <Text style={styles.settingDescription}>
                  Сотрудники могут начать смену по QR. TTL: 5 минут (по умолчанию).
                </Text>
              </View>
              <Switch
                value={editedPvz.settings.qrCodes.enabled}
                onValueChange={(value) => updateQrCodes({ enabled: value })}
              />
            </View>
          </View>
            </Card>

        {/* 4. Рабочие часы */}
        <Card>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="clock-outline" size={20} color={tokens.colors.text.secondary} />
              <Text style={styles.sectionTitle}>Рабочие часы</Text>
        </View>

            <View style={styles.timeRow}>
                  <TextInput
                label="Открытие (час)"
                value={String(editedPvz.settings.workingHours.start)}
                onChangeText={(value) => {
                  const num = parseInt(value) || 0;
                  if (num >= 0 && num <= 23) {
                    // Если открытие >= закрытию, автоматически корректируем закрытие
                    const currentEnd = editedPvz.settings.workingHours.end;
                    const newEnd = num >= currentEnd ? num + 1 : currentEnd;
                    updateWorkingHours({ start: num, end: newEnd > 23 ? 23 : newEnd });
                  }
                }}
                mode="outlined"
                keyboardType="number-pad"
                style={styles.timeInput}
                  />
                  <TextInput
                label="Закрытие (час)"
                value={String(editedPvz.settings.workingHours.end)}
                onChangeText={(value) => {
                  const num = parseInt(value) || 0;
                  if (num >= 0 && num <= 23) {
                    // Если закрытие <= открытию, автоматически корректируем открытие
                    const currentStart = editedPvz.settings.workingHours.start;
                    const newStart = num <= currentStart ? num - 1 : currentStart;
                    updateWorkingHours({ end: num, start: newStart < 0 ? 0 : newStart });
                  }
                }}
                mode="outlined"
                keyboardType="number-pad"
                style={styles.timeInput}
              />
            </View>
            <Text style={styles.hint}>
              Укажите время в часах (0-23). Время открытия должно быть раньше времени закрытия.
            </Text>
          </View>
        </Card>

        {/* 5. Настройки перерывов */}
        <Card>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="coffee" size={20} color={tokens.colors.text.secondary} />
              <Text style={styles.sectionTitle}>Настройки перерывов</Text>
            </View>

                  <TextInput
              label="Количество перерывов"
              value={String(editedPvz.settings.shiftRules.breakCount || 3)}
              onChangeText={(value) => {
                const count = parseInt(value) || 0;
                if (count >= 0 && count <= 5) {
                  updateShiftRules({ breakCount: count });
                }
              }}
              mode="outlined"
                    keyboardType="number-pad"
              style={styles.input}
                  />

                  <TextInput
              label="Продолжительность перерыва (мин)"
              value={String(editedPvz.settings.shiftRules.maxBreakDuration)}
              onChangeText={(value) => {
                const minutes = parseInt(value) || 0;
                if (minutes >= 5 && minutes <= 60) {
                  updateShiftRules({ maxBreakDuration: minutes });
                }
              }}
              mode="outlined"
                    keyboardType="number-pad"
              style={styles.input}
                  />

            <Text style={styles.hint}>
              Перерывы: 0-5 шт • Продолжительность: 5-60 мин
                  </Text>
          </View>
        </Card>

        {/* Кнопка сохранения */}
        <View style={styles.footer}>
                  <Button
                    mode="contained"
                    icon="content-save"
            onPress={handleSave}
            disabled={!hasChanges}
                  >
            {hasChanges ? 'Сохранить изменения' : 'Нет изменений'}
                  </Button>
        </View>
      </ScrollView>

      {/* Модал с картой для выбора адреса */}
      <MapPickerModal
        visible={mapModalVisible}
        onDismiss={() => setMapModalVisible(false)}
        onConfirm={({ lat, lon, address }) => {
          setEditedPvz({
            ...editedPvz!,
            address,
            coordinates: { latitude: lat, longitude: lon },
          });
          setHasChanges(true);
          setMapModalVisible(false);
        }}
      />
    </View>
  );
};

// Стили вынесены для оптимизации
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.gray[50],
  },
  section: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: tokens.colors.text.primary,
  },
  input: {
    backgroundColor: tokens.colors.surface,
  },
  fullWidthButton: {
    marginTop: 8,
  },
  coordinatesText: {
    fontSize: 12,
    color: tokens.colors.text.secondary,
    marginTop: 8,
  },
  suggestionsContainer: {
    backgroundColor: tokens.colors.surface,
    borderRadius: 8,
    marginBottom: 8,
    maxHeight: 240,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    zIndex: 1000,
  },
  suggestionItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.gray[100],
    backgroundColor: tokens.colors.surface,
  },
  suggestionItemPressed: {
    backgroundColor: tokens.colors.gray[100],
  },
  suggestionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  suggestionIcon: {
    marginRight: 12,
  },
  suggestionText: {
    flex: 1,
    fontSize: 14,
    color: tokens.colors.text.primary,
  },
  hint: {
    fontSize: 13,
    color: tokens.colors.text.secondary,
    fontStyle: 'italic',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: tokens.colors.text.primary,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 13,
    color: tokens.colors.text.secondary,
  },
  divider: {
    marginVertical: 4,
  },
  timeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  timeInput: {
    flex: 1,
    backgroundColor: tokens.colors.surface,
  },
  footer: {
    padding: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: tokens.colors.text.primary,
    marginTop: 16,
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 14,
    color: tokens.colors.text.secondary,
  },
});

export default PvzSettingsScreen;
