import React, { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { ActivityIndicator, Appbar, Text, Snackbar, Button } from 'react-native-paper';
import { CameraView, useCameraPermissions } from 'expo-camera';

export const QrScanner: React.FC<{
  onClose: () => void;
  onScanned: (data: string) => void;
}> = ({ onClose, onScanned }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [handled, setHandled] = useState(false);
  const [torch, setTorch] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!permission || !permission.granted) {
      requestPermission();
    }
  }, []);

  const handleScan = useCallback(
    ({ data }: { data: string }) => {
      if (handled) return;
      setHandled(true);
      try {
        onScanned(data);
      } catch (e) {
        setError('Ошибка обработки QR');
        setHandled(false);
      }
    },
    [handled, onScanned],
  );

  return (
    <View style={{ position: 'absolute', inset: 0 as any, backgroundColor: '#000' }}>
      <Appbar.Header mode="center-aligned" elevated>
        <Appbar.BackAction onPress={onClose} />
        <Appbar.Content title="Сканирование QR" />
        <Appbar.Action
          icon={torch ? 'flashlight-off' : 'flashlight'}
          onPress={() => setTorch((t) => !t)}
        />
      </Appbar.Header>
      {!permission ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator />
          <Text style={{ marginTop: 12 }}>Запрос доступа к камере…</Text>
        </View>
      ) : permission.granted === false ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <Text>Нет доступа к камере. Разрешите использование камеры в настройках.</Text>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <CameraView
            style={{ flex: 1 }}
            enableTorch={torch}
            barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
            onBarcodeScanned={(e) => {
              if (!handled && e?.data) handleScan({ data: e.data });
            }}
          />
          {/* Примитивный прицел */}
          <View
            style={{
              position: 'absolute',
              top: '25%',
              left: '10%',
              right: '10%',
              bottom: '25%',
              borderColor: 'rgba(255,255,255,0.9)',
              borderWidth: 2,
              borderRadius: 12,
            }}
          />
          {/* Подсказка pvzqr.ru */}
          <View
            style={{
              position: 'absolute',
              left: 16,
              right: 16,
              bottom: handled ? 72 : 24,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: 'white', textAlign: 'center', marginBottom: 8 }}>
              Откройте сайт pvzqr.ru на рабочем ноутбуке в ПВЗ и отсканируйте код
            </Text>
          </View>
          {handled ? (
            <View
              style={{
                position: 'absolute',
                bottom: 24,
                left: 16,
                right: 16,
                alignItems: 'center',
              }}
            >
              <Button mode="contained-tonal" onPress={() => setHandled(false)}>
                Сканировать снова
              </Button>
            </View>
          ) : null}
        </View>
      )}
      <Snackbar visible={!!error} onDismiss={() => setError(null)} duration={2500}>
        {error}
      </Snackbar>
    </View>
  );
};
