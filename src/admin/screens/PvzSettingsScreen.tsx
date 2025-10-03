import React from 'react';
import { View } from 'react-native';
import { List, Text, TextInput, Divider } from 'react-native-paper';
import { StyledScrollView, StyledCard, StyledButton } from '../../components';
import { MapPickerModal } from '../components/MapPickerModal';

type PvzItem = {
  id: string;
  name: string;
  lat: number;
  lon: number;
  radius: number;
  qrTtlSec: number;
};

const demoData: PvzItem[] = [
  { id: 'pvz-001', name: 'ПВЗ · Герцена 12', lat: 55.026, lon: 82.921, radius: 100, qrTtlSec: 180 },
  { id: 'pvz-002', name: 'ПВЗ · Ленина 5', lat: 54.982, lon: 82.897, radius: 100, qrTtlSec: 180 },
];

export const PvzSettingsScreen: React.FC = () => {
  const [items, setItems] = React.useState<PvzItem[]>(demoData);
  const [selected, setSelected] = React.useState<PvzItem | null>(items[0]);
  const [mapOpen, setMapOpen] = React.useState(false);

  const updateSelected = (patch: Partial<PvzItem>) => {
    if (!selected) return;
    const next = { ...selected, ...patch } as PvzItem;
    setSelected(next);
    setItems((list) => list.map((it) => (it.id === next.id ? next : it)));
  };

  const isWide = false; // упрощённо: можно заменить на useWindowDimensions

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, flexDirection: isWide ? 'row' : 'column' }}>
        <View
          style={{
            width: isWide ? 320 : '100%',
            borderRightWidth: isWide ? 1 : 0,
            borderRightColor: 'rgba(0,0,0,0.06)',
          }}
        >
          <StyledScrollView>
            <StyledCard title="Точки выдачи">
              {items.length === 0 ? (
                <Text style={{ opacity: 0.7, marginBottom: 8 }}>
                  Список пуст. Создайте первый ПВЗ.
                </Text>
              ) : (
                items.map((it) => (
                  <List.Item
                    key={it.id}
                    title={it.name}
                    description={it.id}
                    onPress={() => setSelected(it)}
                    right={(props) => (
                      <List.Icon
                        {...props}
                        icon={selected?.id === it.id ? 'check-circle-outline' : 'store-outline'}
                      />
                    )}
                  />
                ))
              )}
              <Divider />
              <StyledButton
                mode="outlined"
                icon="plus"
                onPress={() => setMapOpen(true)}
                style={{ marginTop: 8 }}
              >
                Добавить ПВЗ
              </StyledButton>
            </StyledCard>
          </StyledScrollView>
        </View>
        <View style={{ flex: 1 }}>
          <StyledScrollView>
            <StyledCard title={selected ? selected.name : 'Выберите ПВЗ'}>
              {selected ? (
                <View style={{ gap: 12 }}>
                  <TextInput
                    label="Название"
                    value={selected.name}
                    onChangeText={(v) => updateSelected({ name: v })}
                  />
                  <TextInput
                    label="Широта (lat)"
                    keyboardType="decimal-pad"
                    value={String(selected.lat)}
                    onChangeText={(v) => updateSelected({ lat: Number(v) || 0 })}
                  />
                  <TextInput
                    label="Долгота (lon)"
                    keyboardType="decimal-pad"
                    value={String(selected.lon)}
                    onChangeText={(v) => updateSelected({ lon: Number(v) || 0 })}
                  />
                  <TextInput
                    label="Радиус геозоны, м"
                    keyboardType="number-pad"
                    value={String(selected.radius)}
                    onChangeText={(v) => updateSelected({ radius: Number(v) || 0 })}
                  />
                  <TextInput
                    label="TTL QR, сек"
                    keyboardType="number-pad"
                    value={String(selected.qrTtlSec)}
                    onChangeText={(v) => updateSelected({ qrTtlSec: Number(v) || 60 })}
                  />
                  <Text variant="bodySmall" style={{ opacity: 0.7 }}>
                    URL киоска: pvzqr.ru/?pvzId={selected.id}
                  </Text>
                  <StyledButton
                    mode="contained"
                    icon="content-save"
                    onPress={() => {
                      /* TODO: интеграция с API */
                    }}
                  >
                    Сохранить
                  </StyledButton>
                </View>
              ) : (
                <Text style={{ opacity: 0.7 }}>Выберите точку слева для редактирования</Text>
              )}
            </StyledCard>
          </StyledScrollView>
        </View>
      </View>
      <MapPickerModal
        visible={mapOpen}
        onDismiss={() => setMapOpen(false)}
        onConfirm={({ lat, lon, address }) => {
          setMapOpen(false);
          const n: PvzItem = {
            id: `pvz-${String(items.length + 1).padStart(3, '0')}`,
            name: address,
            lat,
            lon,
            radius: 100,
            qrTtlSec: 180,
          };
          setItems((prev) => [...prev, n]);
          setSelected(n);
        }}
      />
    </View>
  );
};

export default PvzSettingsScreen;
