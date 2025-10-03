import React from 'react';
import { View } from 'react-native';
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
  const [query, setQuery] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [suggest, setSuggest] = React.useState<Array<{ title: string; lat: number; lon: number }>>(
    [],
  );
  const [region, setRegion] = React.useState<Region>({
    latitude: initial?.lat ?? 55.751244,
    longitude: initial?.lon ?? 37.618423,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  const [marker, setMarker] = React.useState<{ lat: number; lon: number }>({
    lat: region.latitude,
    lon: region.longitude,
  });
  const [address, setAddress] = React.useState<string>('');

  const loadSuggest = React.useCallback(async (q: string) => {
    setLoading(true);
    try {
      const res = await suggestAddresses(q);
      setSuggest(res);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    const id = setTimeout(() => {
      if (query.trim().length >= 3) loadSuggest(query);
      else setSuggest([]);
    }, 350);
    return () => clearTimeout(id);
  }, [query]);

  const handleSetCenter = async (lat: number, lon: number) => {
    setRegion((r) => ({ ...r, latitude: lat, longitude: lon }));
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
        <View style={{ height: 520 }}>
          <View style={{ padding: 12 }}>
            <TextInput
              placeholder="Поиск адреса"
              value={query}
              onChangeText={setQuery}
              left={<TextInput.Icon icon="magnify" />}
            />
            {loading ? <ActivityIndicator style={{ marginTop: 8 }} /> : null}
            {suggest.length > 0 ? (
              <View style={{ maxHeight: 160 }}>
                {suggest.map((s, idx) => (
                  <List.Item
                    key={idx}
                    title={s.title}
                    onPress={() => handleSetCenter(s.lat, s.lon)}
                  />
                ))}
              </View>
            ) : null}
          </View>
          <MapView style={{ flex: 1 }} region={region} onRegionChangeComplete={(r) => setRegion(r)}>
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
