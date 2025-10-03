import React, { useCallback, useState } from 'react';
import { View } from 'react-native';
import { Text, Button, Snackbar } from 'react-native-paper';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { StyledCard } from '../../components';
import { APP_CONFIG } from '../../config/app';

export const DevicePairScreen: React.FC<{ pvzId: string }> = ({ pvzId }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [handled, setHandled] = useState(false);
  const [snack, setSnack] = useState<string | null>(null);
  const [paired, setPaired] = useState(false);

  const startCamera = useCallback(async () => {
    if (!permission || !permission.granted) {
      await requestPermission();
    }
  }, [permission]);

  const handleScan = useCallback(
    async ({ data }: { data: string }) => {
      if (handled) return;
      setHandled(true);
      try {
        // Ожидаем формат: bind:{nonce}
        if (!data || !data.startsWith('bind:')) {
          setSnack('Неверный QR для привязки');
          setHandled(false);
          return;
        }
        const nonce = data.slice(5);
        const url = `${APP_CONFIG.QR.BIND_URL}?pvzId=${encodeURIComponent(pvzId)}&nonce=${encodeURIComponent(nonce)}`;
        const resp = await fetch(url, { method: 'GET' });
        const json = await resp.json();
        if (!json?.ok) {
          setSnack('Не удалось привязать');
          setHandled(false);
          return;
        }
        setPaired(true);
        setSnack('Ноутбук привязан');
      } catch (e) {
        setSnack('Ошибка привязки');
        setHandled(false);
      }
    },
    [handled, pvzId],
  );

  return (
    <View style={{ flex: 1 }}>
      <StyledCard title="Привязка ноутбука">
        {!paired ? (
          <>
            <Text>
              Откройте на ноутбуке pvzqr.ru и нажмите «Привязать ноутбук», затем сканируйте QR.
            </Text>
            <View style={{ height: 16 }} />
            <View style={{ height: 420, borderRadius: 12, overflow: 'hidden' }}>
              <CameraView
                style={{ flex: 1 }}
                barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
                onBarcodeScanned={(e) => {
                  if (!handled && e?.data) handleScan({ data: e.data });
                }}
              />
            </View>
            <View style={{ height: 12 }} />
            <Button mode="contained" onPress={startCamera}>
              Разрешить камеру
            </Button>
          </>
        ) : (
          <Text>Готово. Откройте pvzqr.ru — на ноутбуке будет показан рабочий QR.</Text>
        )}
      </StyledCard>
      <Snackbar visible={!!snack} onDismiss={() => setSnack(null)} duration={2500}>
        {snack}
      </Snackbar>
    </View>
  );
};
