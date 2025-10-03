// Google Apps Script — Web App для генерации подписанного QR
// Формат полезной нагрузки: wb:{pvzId}:{exp}:{hmacHex}

function doGet(e) {
  var pvzId = (e && e.parameter && e.parameter.pvzId) ? String(e.parameter.pvzId) : 'pvz-dev';
  var ttl = Number((e && e.parameter && e.parameter.ttl) ? e.parameter.ttl : 180);
  if (!isFinite(ttl) || ttl <= 0) ttl = 180;

  var secret = PropertiesService.getScriptProperties().getProperty('QR_SECRET');
  if (!secret) {
    return ContentService.createTextOutput('QR_SECRET is not set in Script Properties').setMimeType(ContentService.MimeType.TEXT);
  }

  var exp = Math.floor(Date.now() / 1000) + Math.floor(ttl);
  var macHex = hmacHex_(secret, pvzId + ':' + exp);
  var payload = 'wb:' + pvzId + ':' + exp + ':' + macHex;

  var fmt = (e && e.parameter && e.parameter.format) ? String(e.parameter.format) : 'html';
  if (fmt === 'json') {
    var json = JSON.stringify({ payload: payload, exp: exp, pvzId: pvzId });
    return ContentService.createTextOutput(json).setMimeType(ContentService.MimeType.JSON);
  }

  var html = HtmlService.createHtmlOutput(renderHtml_(payload, exp, pvzId));
  html.setTitle('WB QR: ' + pvzId);
  return html;
}

function hmacHex_(secret, message) {
  var sig = Utilities.computeHmacSha256Signature(message, secret);
  var hex = '';
  for (var i = 0; i < sig.length; i++) {
    var b = sig[i];
    if (b < 0) b += 256;
    hex += (b + 256).toString(16).slice(-2);
  }
  return hex;
}

function renderHtml_(payload, exp, pvzId) {
  var expDate = new Date(exp * 1000).toLocaleString();
  return (
    '<!doctype html>'+
    '<html><head><meta charset="utf-8"/>'+
    '<meta name="viewport" content="width=device-width,initial-scale=1"/>'+
    '<title>WB ПВЗ · QR</title>'+
    '<style>'+
    ':root{--bg:#FBFCFE;--surface:#FFFFFF;--outline:#E5E7EB;--primary:#4F46E5;--onSurface:#111827;--onSurfaceVar:#6B7280;--radius:12px}'+
    'body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Helvetica,Arial,sans-serif;margin:0;background:var(--bg);color:var(--onSurface)}'+
    '.wrap{padding:24px;display:flex;justify-content:center}'+
    '.card{width:min(560px,100%);background:var(--surface);border:1px solid var(--outline);border-radius:var(--radius);box-shadow:0 2px 6px rgba(0,0,0,.06)}'+
    '.header{padding:16px 20px;border-bottom:1px solid var(--outline);display:flex;align-items:center;gap:8px}'+
    '.title{margin:0;font-size:18px;font-weight:600}'+
    '.badge{margin-left:auto;padding:4px 10px;border-radius:999px;background:rgba(79,70,229,.08);color:var(--primary);font-weight:600;font-size:12px}'+
    '.content{padding:20px}'+
    '#qrcode{display:flex;justify-content:center;margin:8px 0 12px}'+
    '.row{margin:8px 0;color:var(--onSurface)} .muted{color:var(--onSurfaceVar)}'+
    'code{background:#F3F4F6;border:1px solid #E5E7EB;padding:6px 8px;border-radius:8px;display:block;overflow:auto;word-break:break-all}'+
    '.hint{margin-top:6px;color:var(--onSurfaceVar)}'+
    '.footer{display:none}'+
    '</style>'+
    '<script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>'+
    '</head><body>'+
    '<div class="wrap">'+
      '<div class="card">'+
        '<div class="header">'+
          '<div class="dot" style="width:10px;height:10px;border-radius:50%;background:var(--primary);"></div>'+
          '<h1 class="title">QR для '+ pvzId +'</h1>'+
          '<div class="badge">MD3</div>'+
        '</div>'+
        '<div class="content">'+
          '<div id="qrcode"></div>'+
          '<div class="row"><div class="muted" style="margin-bottom:4px">Payload</div><code>'+ payload +'</code></div>'+
          '<div class="row"><span class="muted">Действителен до:</span> '+ expDate +' <span class="muted">('+ exp +')</span></div>'+
          '<div class="hint">Сканируйте в приложении «WB ПВЗ»</div>'+
        '</div>'+
        ''+
      '</div>'+
    '</div>'+
    '<script>'+
      'new QRCode(document.getElementById("qrcode"), { text: '+ JSON.stringify(payload) +', width:256, height:256 });'+
    '</script>'+
    '</body></html>'
  );
}


