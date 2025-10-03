// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - типы недоступны в среде RN, приемлемо для нашего использования
// Клиент больше не хранит секреты. Проверка подписи выполняется на сервере pvzqr.ru.

export { ParsedQr, parseQrPayload, isExpired, verifyMac } from '../utils/qr';
