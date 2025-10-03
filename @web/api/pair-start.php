<?php
// Старт привязки: выдаёт одноразовый nonce с TTL. Храним нонсы во временной папке.
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');

require_once __DIR__ . '/../config.php';

$PAIR_TTL = 120; // сек
$storeDir = __DIR__ . '/../_pair';
if (!is_dir($storeDir)) { @mkdir($storeDir, 0700, true); }

function random_hex($len){
  $bytes = random_bytes(intval($len/2));
  return bin2hex($bytes);
}

// зачистка старых
$now = time();
foreach (@scandir($storeDir) ?: [] as $f) {
  if ($f === '.' || $f === '..') continue;
  $p = $storeDir . '/' . $f;
  if (@filemtime($p) + 3600 < $now) { @unlink($p); }
}

$nonce = random_hex(32);
$record = [ 'nonce' => $nonce, 'exp' => $now + $PAIR_TTL, 'used' => false ];
@file_put_contents($storeDir . '/' . $nonce . '.json', json_encode($record));

echo json_encode([ 'nonce' => $nonce, 'exp' => $record['exp'] ]);


