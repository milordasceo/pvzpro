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

$payload = isset($_REQUEST['payload']) ? trim($_REQUEST['payload']) : '';
if ($payload === '' || strpos($payload, 'wb:') !== 0) { http_response_code(400); echo json_encode(['isValid'=>false,'error'=>'invalid_payload']); exit; }

$parts = explode(':', $payload);
if (count($parts) !== 4) { http_response_code(400); echo json_encode(['isValid'=>false,'error'=>'invalid_format']); exit; }

list($_prefix, $pvzId, $expStr, $mac) = $parts;
$exp = intval($expStr);
if ($pvzId === '' || $exp <= 0 || strlen($mac) < 16) { http_response_code(400); echo json_encode(['isValid'=>false,'error'=>'invalid_fields']); exit; }

$expected = hash_hmac('sha256', $pvzId . ':' . $exp, $QR_SECRET);
$now = time();
$isExpired = $now > $exp;
$ok = hash_equals($expected, $mac) && !$isExpired;

echo json_encode(['isValid'=>$ok,'pvzId'=>$pvzId,'exp'=>$exp,'now'=>$now,'reason'=>$ok?null:($isExpired?'expired':'bad_mac')]);


