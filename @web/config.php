<?php
// Общая конфигурация сайта pvzqr.ru (без пер-ПВЗ файлов)

// TTL по умолчанию для QR (в секундах)
$TTL_DEFAULT = 120;

// Секрет HMAC для подписи QR (используют sign.php и validate.php)
$QR_SECRET = getenv('QR_SECRET') ?: '7b0f2a6b2e3c49c1a4d9e87f3a1c5b7d9e0c4a1f2b3c4d5e6f7a8b9c0d1e2f3a';

// Привязка ноутбука к ПВЗ: токен в куке, подписанный этим секретом
$BIND_SECRET = getenv('BIND_SECRET') ?: 'c4f1a2b3d4e5f60718a2b3c4d5e6f71829a3b4c5d6e7f8091a2b3c4d5e6f7a8b';

// Ключ админа для первичной привязки устройства (временное простое решение)
$ADMIN_KEY = getenv('ADMIN_KEY') ?: 'admin-key-34f7c2a9';


