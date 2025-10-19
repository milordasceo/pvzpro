import React from 'react';
import { View, Keyboard } from 'react-native';
import {
  Modal,
  Portal,
  TextInput,
  List,
  ActivityIndicator,
  Text,
  Button,
} from 'react-native-paper';
import MapView, { Marker, Region } from 'react-native-maps';
import { suggestAddresses, reverseGeocode } from '../../services/geo.service';

export type MapPickerResult = { lat: number; lon: number; address: string };

export const MapPickerModal: React.FC<{
  visible: boolean;
  onDismiss: () => void;
  onConfirm: (r: MapPickerResult) => void;
  initial?: { lat: number; lon: number };
}> = ({ visible, onDismiss, onConfirm, initial }) => {
  const [city, setCity] = React.useState('');
  const [street, setStreet] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [citySuggest, setCitySuggest] = React.useState<Array<{ title: string; lat: number; lon: number }>>(
    [],
  );
  const [streetSuggest, setStreetSuggest] = React.useState<Array<{ title: string; lat: number; lon: number }>>(
    [],
  );
  const [selectedCity, setSelectedCity] = React.useState<{ title: string; lat: number; lon: number } | null>(null);
  const [cityShortName, setCityShortName] = React.useState<string>(''); // Короткое имя города для поиска улиц
  const [region, setRegion] = React.useState<Region>({
    latitude: initial?.lat ?? 55.751244,
    longitude: initial?.lon ?? 37.618423,
    latitudeDelta: 0.005, // Близкий zoom для начального состояния
    longitudeDelta: 0.005,
  });
  const [marker, setMarker] = React.useState<{ lat: number; lon: number }>({
    lat: region.latitude,
    lon: region.longitude,
  });
  const [address, setAddress] = React.useState<string>('');
  const streetInputRef = React.useRef<any>(null);

  const loadCitySuggest = React.useCallback(async (q: string) => {
    setLoading(true);
    try {
      const res = await suggestAddresses(q);
      
      // Убираем дубликаты по названию
      const unique = res.filter((item, index, self) => 
        index === self.findIndex((t) => t.title === item.title)
      );
      
      setCitySuggest(unique);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadStreetSuggest = React.useCallback(async (cityName: string, streetQuery: string) => {
    setLoading(true);
    try {
      // Формируем запрос: город + улица
      const fullQuery = `${cityName}, ${streetQuery}`;
      console.log('🔍 Поиск адреса:', fullQuery);
      
      // Передаём skipCity=true, чтобы не дублировать город в результатах
      const res = await suggestAddresses(fullQuery, true);
      console.log('📍 Результаты:', res.length);
      
      // Добавляем город в начало каждого результата
      const withCity = res.map((item) => ({
        ...item,
        title: `${cityName}, ${item.title}`,
      }));
      
      // Убираем дубликаты по названию
      const unique = withCity.filter((item, index, self) => 
        index === self.findIndex((t) => t.title === item.title)
      );
      
      setStreetSuggest(unique);
    } finally {
      setLoading(false);
    }
  }, []);

  // Поиск городов
  React.useEffect(() => {
    const id = setTimeout(() => {
      if (city.trim().length >= 2 && !selectedCity) {
        loadCitySuggest(city);
      } else {
        setCitySuggest([]);
      }
    }, 350);
    return () => clearTimeout(id);
  }, [city, selectedCity]);

  // Поиск улиц в выбранном городе
  React.useEffect(() => {
    const id = setTimeout(() => {
      if (cityShortName && street.trim().length >= 2) {
        loadStreetSuggest(cityShortName, street);
      } else {
        setStreetSuggest([]);
      }
    }, 350);
    return () => clearTimeout(id);
  }, [street, cityShortName, loadStreetSuggest]);

  const handleSetCenter = async (lat: number, lon: number) => {
    // Устанавливаем регион с близким масштабом (уровень улицы)
    setRegion({
      latitude: lat,
      longitude: lon,
      latitudeDelta: 0.005, // Очень близкий zoom (было 0.05)
      longitudeDelta: 0.005,
    });
    setMarker({ lat, lon });
    const addr = await reverseGeocode(lat, lon);
    setAddress(addr);
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={{
          backgroundColor: 'white',
          margin: 12,
          borderRadius: 12,
          overflow: 'hidden',
        }}
      >
        <View style={{ height: 580 }}>
          <View style={{ padding: 12, gap: 8 }}>
            {/* Поле города */}
            <TextInput
              placeholder="Введите город"
              value={city}
              onChangeText={(text) => {
                setCity(text);
                if (selectedCity) {
                  setSelectedCity(null);
                  setStreet('');
                }
              }}
              left={<TextInput.Icon icon="city" />}
              right={
                selectedCity ? (
                  <TextInput.Icon
                    icon="check-circle"
                    color="#10B981"
                  />
                ) : undefined
              }
              disabled={!!selectedCity}
            />

            {/* Подсказки городов */}
            {citySuggest.length > 0 && !selectedCity ? (
              <View style={{ maxHeight: 150, backgroundColor: '#F9FAFB', borderRadius: 8 }}>
                {citySuggest.map((s, idx) => {
                  // Извлекаем короткое название города (первая часть до запятой)
                  const shortName = s.title.split(',')[0].trim();
                  
                  return (
                    <List.Item
                      key={idx}
                      title={s.title}
                      titleNumberOfLines={2}
                      onPress={() => {
                        setSelectedCity(s);
                        setCity(s.title);
                        setCityShortName(shortName);
                        setCitySuggest([]);
                        handleSetCenter(s.lat, s.lon);
                        console.log('✅ Выбран город:', shortName);
                      }}
                      left={(props) => <List.Icon {...props} icon="city" />}
                      style={{ paddingVertical: 2 }}
                    />
                  );
                })}
              </View>
            ) : null}

            {/* Поле адреса (улица) */}
            <TextInput
              ref={streetInputRef}
              placeholder={selectedCity ? `Введите адрес в городе ${cityShortName}` : "Сначала выберите город"}
              value={street}
              onChangeText={setStreet}
              left={<TextInput.Icon icon="map-marker" />}
              disabled={!selectedCity}
              onFocus={() => {
                // При фокусе очищаем предыдущий выбранный адрес
                if (street && !streetSuggest.length) {
                  setStreet('');
                }
              }}
            />

            {/* Подсказки улиц */}
            {streetSuggest.length > 0 ? (
              <View style={{ maxHeight: 150, backgroundColor: '#F9FAFB', borderRadius: 8 }}>
                {streetSuggest.map((s, idx) => (
                  <List.Item
                    key={idx}
                    title={s.title}
                    titleNumberOfLines={3}
                    onPress={async () => {
                      await handleSetCenter(s.lat, s.lon);
                      setStreetSuggest([]);
                      // Не очищаем поле улицы, показываем выбранный адрес
                      setStreet(s.title.replace(`${cityShortName}, `, '')); // Убираем город из адреса
                      
                      // Скрываем клавиатуру и убираем фокус
                      Keyboard.dismiss();
                      streetInputRef.current?.blur();
                    }}
                    left={(props) => <List.Icon {...props} icon="home-map-marker" />}
                    style={{ paddingVertical: 2 }}
                  />
                ))}
              </View>
            ) : null}

            {loading ? <ActivityIndicator size="small" /> : null}
          </View>
          <MapView 
            style={{ flex: 1 }} 
            region={region}
            // Убираем автоматическое обновление региона - оно вызывает бесконечный цикл
          >
            <Marker
              coordinate={{ latitude: marker.lat, longitude: marker.lon }}
              draggable
              onDragEnd={(e) =>
                handleSetCenter(
                  e.nativeEvent.coordinate.latitude,
                  e.nativeEvent.coordinate.longitude,
                )
              }
            />
          </MapView>
          <View style={{ padding: 12 }}>
            <Text numberOfLines={2} style={{ marginBottom: 8 }}>
              Адрес: {address || '—'}
            </Text>
            <Button
              mode="contained"
              onPress={() =>
                onConfirm({
                  lat: marker.lat,
                  lon: marker.lon,
                  address: address || `${marker.lat.toFixed(6)}, ${marker.lon.toFixed(6)}`,
                })
              }
            >
              Сохранить
            </Button>
          </View>
        </View>
      </Modal>
    </Portal>
  );
};
