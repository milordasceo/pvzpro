<?php
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');

$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
$allowedOrigins = [ 'https://pvzqr.ru', 'http://pvzqr.ru' ];
if (in_array($origin, $allowedOrigins, true)) {
  header('Access-Control-Allow-Origin: ' . $origin);
  header('Vary: Origin');
}

require_once __DIR__ . '/../config.php';
$QR_SECRET = $QR_SECRET ?: 'change-me-in-hosting-panel';
$TTL_DEFAULT = intval(getenv('TTL_DEFAULT') ?: $TTL_DEFAULT);
$TTL_MAX = intval(getenv('MAX_TTL') ?: '3600');

// Привязка ноутбука к ПВЗ через подписанную куку bind
function read_bind($secret) {
  if (!isset($_COOKIE['bind'])) return null;
  $parts = explode('.', $_COOKIE['bind']);
  if (count($parts) !== 2) return null;
  list($pvzId, $sig) = $parts;
  $expSig = hash_hmac('sha256', $pvzId, $secret);
  if (!hash_equals($expSig, $sig)) return null;
  return $pvzId;
}

$pvzId = read_bind($BIND_SECRET);
if ($pvzId === null) {
  http_response_code(403);
  echo json_encode(['error'=>'not_bound','message'=>'Device not bound to PVZ']);
  exit;
}

$ttlSec = isset($_GET['ttlSec']) ? intval($_GET['ttlSec']) : $TTL_DEFAULT;

$ttlSec = max(30, min($ttlSec, $TTL_MAX));
$exp = time() + $ttlSec;
$mac = hash_hmac('sha256', $pvzId . ':' . $exp, $QR_SECRET);
$payload = 'wb:' . $pvzId . ':' . $exp . ':' . $mac;

echo json_encode(['success'=>true,'payload'=>$payload,'pvzId'=>$pvzId,'exp'=>$exp,'ttl'=>$ttlSec]);


