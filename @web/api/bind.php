<?php
// Привязка текущего устройства (браузера) к конкретному ПВЗ.
// Требует ADMIN_KEY (передаётся как ?adminKey=... или в POST), и pvzId.

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');

require_once __DIR__ . '/../config.php';

$pvzId = isset($_REQUEST['pvzId']) ? trim($_REQUEST['pvzId']) : '';
$nonce = isset($_REQUEST['nonce']) ? trim($_REQUEST['nonce']) : '';
if ($pvzId === '' || $nonce === '') { http_response_code(400); echo json_encode(['ok'=>false,'error'=>'bad_request']); exit; }
if (strlen($pvzId) > 64) { http_response_code(400); echo json_encode(['ok'=>false,'error'=>'pvz_too_long']); exit; }

// Проверка нонса
$storeDir = __DIR__ . '/../_pair';
$path = $storeDir . '/' . $nonce . '.json';
if (!file_exists($path)) { http_response_code(400); echo json_encode(['ok'=>false,'error'=>'nonce_not_found']); exit; }
$rec = json_decode(@file_get_contents($path), true) ?: null;
if (!$rec || !isset($rec['exp']) || !isset($rec['used']) || $rec['used']) { http_response_code(400); echo json_encode(['ok'=>false,'error'=>'nonce_invalid']); exit; }
if (time() > intval($rec['exp'])) { @unlink($path); http_response_code(400); echo json_encode(['ok'=>false,'error'=>'nonce_expired']); exit; }

// Отметить использованным
$rec['used'] = true;
@file_put_contents($path, json_encode($rec));

// Сформировать и установить куку привязки
$sig = hash_hmac('sha256', $pvzId, $BIND_SECRET);
$cookie = $pvzId . '.' . $sig;
setcookie('bind', $cookie, time()+3600*24*365, '/', '', isset($_SERVER['HTTPS']) && $_SERVER['HTTPS']==='on', false);

echo json_encode(['ok'=>true, 'pvzId'=>$pvzId]);


