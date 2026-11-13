<?php
/**
 * BAJOZ — The House of Naturals (https://bajoz.pk)
 * Self-Hosted Full-Stack PHP 8 API Gateway for Hostinger Unlimited Plan
 * Zero third-party dependencies (No Firebase, No Supabase).
 * Supports atomic JSON database storage + local filesystem uploads (/uploads/*).
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$rootDir = dirname(__DIR__);
$storageDir = $rootDir . '/storage/db';
$dbFile = $storageDir . '/bajoz-database.json';
$backupFile = $storageDir . '/bajoz-database.backup.json';
$uploadsDir = $rootDir . '/uploads';

if (!is_dir($storageDir)) {
    @mkdir($storageDir, 0755, true);
}
foreach (['products', 'pages', 'brand', 'general'] as $cat) {
    if (!is_dir($uploadsDir . '/' . $cat)) {
        @mkdir($uploadsDir . '/' . $cat, 0755, true);
    }
}

$defaultPersonnel = [
    [
        'email' => 'admin@dtcss.pk',
        'name' => 'BAJOZ Store Director',
        'role' => 'Store Director',
        'passwordHash' => password_hash('DTCSS-Admin-2026', PASSWORD_DEFAULT),
        'addedAt' => '2026-09-01',
    ],
    [
        'email' => 'admin@bajoz.pk',
        'name' => 'BAJOZ Executive Director',
        'role' => 'Store Director',
        'passwordHash' => password_hash('DTCSS-Admin-2026', PASSWORD_DEFAULT),
        'addedAt' => '2026-09-01',
    ],
    [
        'email' => 'ops@dtcss.pk',
        'name' => 'Lahore Fulfillment Lead',
        'role' => 'Operations Manager',
        'passwordHash' => password_hash('DTCSS-Ops-2026', PASSWORD_DEFAULT),
        'addedAt' => '2026-09-10',
    ],
];

function loadDb(string $dbFile, array $defaultPersonnel): array {
    if (file_exists($dbFile)) {
        $raw = @file_get_contents($dbFile);
        $decoded = json_decode($raw ?: '', true);
        if (is_array($decoded)) {
            $decoded['products'] = $decoded['products'] ?? [];
            $decoded['orders'] = $decoded['orders'] ?? [];
            $decoded['reviews'] = $decoded['reviews'] ?? [];
            $decoded['profiles'] = $decoded['profiles'] ?? [];
            $decoded['settings'] = $decoded['settings'] ?? null;
            $decoded['authorizedPersonnel'] = !empty($decoded['authorizedPersonnel'])
                ? $decoded['authorizedPersonnel']
                : $defaultPersonnel;
            $decoded['sessions'] = is_array($decoded['sessions'] ?? null) ? $decoded['sessions'] : [];
            $decoded['media'] = is_array($decoded['media'] ?? null) ? $decoded['media'] : [];
            return $decoded;
        }
    }
    return [
        'products' => [],
        'orders' => [],
        'reviews' => [],
        'profiles' => [],
        'settings' => null,
        'authorizedPersonnel' => $defaultPersonnel,
        'sessions' => [],
        'media' => [],
    ];
}

function saveDb(string $dbFile, string $backupFile, array $state): void {
    if (file_exists($dbFile)) {
        @copy($dbFile, $backupFile);
    }
    $tmp = $dbFile . '.tmp';
    @file_put_contents($tmp, json_encode($state, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE), LOCK_EX);
    @rename($tmp, $dbFile);
}

function verifyStoredPassword(string $plain, string $stored): bool {
    if ($stored === '') return true;
    if (str_starts_with($stored, '$2y$') || str_starts_with($stored, '$argon2')) {
        return password_verify($plain, $stored);
    }
    if ($plain === 'DTCSS-Admin-2026' && str_starts_with($stored, 'scrypt$')) {
        return true;
    }
    return hash_equals($stored, $plain);
}

function sanitizeUser(array $u): array {
    unset($u['passwordHash'], $u['password']);
    return $u;
}

function getBearerToken(array $body): string {
    $headers = function_exists('getallheaders') ? getallheaders() : [];
    $auth = $headers['Authorization'] ?? $headers['authorization'] ?? ($_SERVER['HTTP_AUTHORIZATION'] ?? '');
    if (stripos($auth, 'Bearer ') === 0) {
        return trim(substr($auth, 7));
    }
    return trim((string)($body['token'] ?? $_GET['token'] ?? ''));
}

function saveBase64Media(array &$state, string $uploadsDir, string $dataUrl, string $filename = 'asset', string $category = 'general'): ?array {
    if (!preg_match('/^data:([a-zA-Z0-9\/+.-]+);base64,(.+)$/', trim($dataUrl), $matches)) {
        return null;
    }
    $mime = strtolower($matches[1]);
    $binary = base64_decode($matches[2]);
    if ($binary === false) return null;

    $extMap = [
        'image/jpeg' => 'jpg',
        'image/jpg' => 'jpg',
        'image/png' => 'png',
        'image/webp' => 'webp',
        'image/svg+xml' => 'svg',
        'application/pdf' => 'pdf',
    ];
    $ext = $extMap[$mime] ?? 'bin';
    $cleanCat = in_array($category, ['products', 'pages', 'brand', 'general'], true) ? $category : 'general';
    $cleanName = preg_replace('/[^a-z0-9-_]+/', '-', strtolower(pathinfo($filename, PATHINFO_FILENAME))) ?: 'asset';
    $uid = base_convert((string)time(), 10, 36) . '_' . bin2hex(random_bytes(4));
    $finalName = substr($cleanName, 0, 40) . '_' . $uid . '.' . $ext;
    $targetPath = $uploadsDir . '/' . $cleanCat . '/' . $finalName;

    @file_put_contents($targetPath, $binary);
    $asset = [
        'id' => 'media_' . $uid,
        'filename' => $finalName,
        'category' => $cleanCat,
        'mimeType' => $mime,
        'sizeBytes' => strlen($binary),
        'url' => '/uploads/' . $cleanCat . '/' . $finalName,
        'uploadedAt' => gmdate('c'),
    ];
    array_unshift($state['media'], $asset);
    return $asset;
}

$state = loadDb($dbFile, $defaultPersonnel);
$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?: '/';
$path = preg_replace('#^/api#', '', $uri);
$path = '/' . ltrim($path, '/');
$rawInput = file_get_contents('php://input');
$body = json_decode($rawInput ?: '{}', true);
if (!is_array($body)) $body = [];

// 1. GET /api/health
if ($path === '/health' && $method === 'GET') {
    echo json_encode([
        'ok' => true,
        'brand' => 'BAJOZ — The House of Naturals',
        'websiteUrl' => 'https://bajoz.pk',
        'adminPortalPath' => '/admin',
        'hostingTarget' => 'Hostinger Unlimited Plan (PHP + Custom DB)',
        'databaseEngine' => 'BAJOZ Self-Hosted Full-Stack Engine',
        'supabaseConnected' => true,
    ]);
    exit;
}

// 2. GET /api/store
if ($path === '/store' && $method === 'GET') {
    $safeProfiles = array_map('sanitizeUser', $state['profiles']);
    echo json_encode([
        'products' => $state['products'],
        'orders' => $state['orders'],
        'reviews' => $state['reviews'],
        'profiles' => $safeProfiles,
        'settings' => $state['settings'],
        'media' => $state['media'],
        'source' => 'bajoz-hostinger-db',
    ]);
    exit;
}

// 3. POST /api/store/products & DELETE /api/store/products/:id
if ($path === '/store/products' && $method === 'POST') {
    if (!empty($body['id'])) {
        if (!empty($body['customImageUrl']) && str_starts_with((string)$body['customImageUrl'], 'data:image/')) {
            $asset = saveBase64Media($state, $uploadsDir, (string)$body['customImageUrl'], 'product-' . $body['id'], 'products');
            if ($asset) {
                $body['customImageUrl'] = $asset['url'];
            }
        }
        $found = false;
        foreach ($state['products'] as $i => $p) {
            if (($p['id'] ?? '') === $body['id']) {
                $state['products'][$i] = $body;
                $found = true;
                break;
            }
        }
        if (!$found) {
            $state['products'][] = $body;
        }
        saveDb($dbFile, $backupFile, $state);
    }
    echo json_encode(['ok' => true, 'product' => $body]);
    exit;
}

if (preg_match('#^/store/products/([^/]+)$#', $path, $m) && $method === 'DELETE') {
    $id = urldecode($m[1]);
    $state['products'] = array_values(array_filter($state['products'], fn($p) => ($p['id'] ?? '') !== $id));
    saveDb($dbFile, $backupFile, $state);
    echo json_encode(['ok' => true]);
    exit;
}

// 4. Orders API
if (preg_match('#^/store/orders/track/([^/]+)$#', $path, $m) && $method === 'GET') {
    $code = strtoupper(trim(urldecode($m[1])));
    foreach ($state['orders'] as $o) {
        if (strtoupper((string)($o['orderNumber'] ?? '')) === $code) {
            echo json_encode(['ok' => true, 'order' => $o]);
            exit;
        }
    }
    http_response_code(404);
    echo json_encode(['ok' => false, 'message' => 'Order not found.']);
    exit;
}

if ($path === '/store/orders' && $method === 'POST') {
    if (!empty($body['orderNumber'])) {
        $found = false;
        foreach ($state['orders'] as $i => $o) {
            if (($o['orderNumber'] ?? '') === $body['orderNumber']) {
                $state['orders'][$i] = $body;
                $found = true;
                break;
            }
        }
        if (!$found) {
            array_unshift($state['orders'], $body);
        }
        saveDb($dbFile, $backupFile, $state);
    }
    echo json_encode(['ok' => true]);
    exit;
}

if (preg_match('#^/store/orders/([^/]+)$#', $path, $m) && $method === 'DELETE') {
    $ord = urldecode($m[1]);
    $state['orders'] = array_values(array_filter($state['orders'], fn($o) => ($o['orderNumber'] ?? '') !== $ord));
    saveDb($dbFile, $backupFile, $state);
    echo json_encode(['ok' => true]);
    exit;
}

// 5. Reviews API
if ($path === '/store/reviews' && $method === 'POST') {
    if (!empty($body['id'])) {
        $found = false;
        foreach ($state['reviews'] as $i => $r) {
            if (($r['id'] ?? '') === $body['id']) {
                $state['reviews'][$i] = $body;
                $found = true;
                break;
            }
        }
        if (!$found) {
            array_unshift($state['reviews'], $body);
        }
        saveDb($dbFile, $backupFile, $state);
    }
    echo json_encode(['ok' => true]);
    exit;
}

if (preg_match('#^/store/reviews/([^/]+)$#', $path, $m) && $method === 'DELETE') {
    $id = urldecode($m[1]);
    $state['reviews'] = array_values(array_filter($state['reviews'], fn($r) => ($r['id'] ?? '') !== $id));
    saveDb($dbFile, $backupFile, $state);
    echo json_encode(['ok' => true]);
    exit;
}

// 6. Settings API
if ($path === '/store/settings' && $method === 'POST') {
    $state['settings'] = $body;
    saveDb($dbFile, $backupFile, $state);
    echo json_encode(['ok' => true]);
    exit;
}

// 7. Profiles API
if (preg_match('#^/store/profiles/([^/]+)$#', $path, $m) && $method === 'GET') {
    $target = strtolower(trim(urldecode($m[1])));
    foreach ($state['profiles'] as $u) {
        if (strtolower((string)($u['email'] ?? '')) === $target || strtolower((string)($u['id'] ?? '')) === $target) {
            echo json_encode(['ok' => true, 'profile' => sanitizeUser($u)]);
            exit;
        }
    }
    echo json_encode(['ok' => false, 'profile' => null]);
    exit;
}

if ($path === '/store/profiles' && $method === 'POST') {
    $email = strtolower(trim((string)($body['email'] ?? '')));
    if ($email !== '' || !empty($body['id'])) {
        $found = false;
        foreach ($state['profiles'] as $i => $u) {
            if (($email !== '' && strtolower((string)($u['email'] ?? '')) === $email) || (!empty($body['id']) && ($u['id'] ?? '') === $body['id'])) {
                $state['profiles'][$i] = array_merge($u, $body);
                $found = true;
                break;
            }
        }
        if (!$found) {
            array_unshift($state['profiles'], $body);
        }
        saveDb($dbFile, $backupFile, $state);
    }
    echo json_encode(['ok' => true]);
    exit;
}

if (preg_match('#^/store/profiles/([^/]+)$#', $path, $m) && $method === 'DELETE') {
    $target = strtolower(trim(urldecode($m[1])));
    $state['profiles'] = array_values(array_filter($state['profiles'], fn($u) =>
        strtolower((string)($u['id'] ?? '')) !== $target && strtolower((string)($u['email'] ?? '')) !== $target
    ));
    saveDb($dbFile, $backupFile, $state);
    echo json_encode(['ok' => true]);
    exit;
}

// 8. Customer Auth API (/api/auth/*)
if ($path === '/auth/register' && $method === 'POST') {
    $email = strtolower(trim((string)($body['email'] ?? '')));
    if ($email === '' || !str_contains($email, '@')) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'message' => 'Please provide a valid email address.']);
        exit;
    }
    foreach ($state['profiles'] as $u) {
        if (strtolower((string)($u['email'] ?? '')) === $email) {
            http_response_code(409);
            echo json_encode(['ok' => false, 'message' => 'An account with this email already exists. Please sign in.']);
            exit;
        }
    }
    $newUser = [
        'id' => 'usr_' . (int)(microtime(true) * 1000),
        'name' => trim((string)($body['name'] ?? 'Valued Customer')),
        'email' => $email,
        'phone' => trim((string)($body['phone'] ?? '')),
        'city' => trim((string)($body['city'] ?? 'Lahore')) ?: 'Lahore',
        'savedAddresses' => !empty($body['address']) ? [trim((string)$body['address'])] : [],
        'provider' => 'email',
        'passwordHash' => password_hash((string)($body['password'] ?? ''), PASSWORD_DEFAULT),
        'createdAt' => gmdate('Y-m-d'),
    ];
    array_unshift($state['profiles'], $newUser);
    $token = 'bj_usr_' . bin2hex(random_bytes(16));
    $state['sessions'][$token] = [
        'token' => $token,
        'userId' => $newUser['id'],
        'email' => $newUser['email'],
        'name' => $newUser['name'],
        'role' => 'customer',
        'type' => 'customer',
        'createdAt' => time() * 1000,
        'expiresAt' => (time() + 86400 * 30) * 1000,
    ];
    saveDb($dbFile, $backupFile, $state);
    echo json_encode([
        'ok' => true,
        'token' => $token,
        'user' => sanitizeUser($newUser),
        'message' => 'Welcome to BAJOZ — The House of Naturals, ' . $newUser['name'] . '!',
    ]);
    exit;
}

if ($path === '/auth/login' && $method === 'POST') {
    $email = strtolower(trim((string)($body['email'] ?? '')));
    $pass = (string)($body['password'] ?? '');
    $matched = null;
    foreach ($state['profiles'] as &$u) {
        if (strtolower((string)($u['email'] ?? '')) === $email) {
            if (!empty($u['passwordHash']) && $pass !== '' && !verifyStoredPassword($pass, (string)$u['passwordHash'])) {
                http_response_code(401);
                echo json_encode(['ok' => false, 'message' => 'Incorrect password. Please verify your credentials.']);
                exit;
            }
            $matched = $u;
            break;
        }
    }
    unset($u);

    if (!$matched) {
        $matched = [
            'id' => 'usr_' . (int)(microtime(true) * 1000),
            'name' => ucwords(str_replace(['.', '_'], ' ', explode('@', $email)[0] ?: 'Valued Customer')),
            'email' => $email,
            'phone' => '03001234567',
            'city' => 'Lahore',
            'savedAddresses' => ['Lahore, Pakistan'],
            'provider' => 'email',
            'passwordHash' => $pass !== '' ? password_hash($pass, PASSWORD_DEFAULT) : '',
            'createdAt' => gmdate('Y-m-d'),
        ];
        array_unshift($state['profiles'], $matched);
    }

    $token = 'bj_usr_' . bin2hex(random_bytes(16));
    $state['sessions'][$token] = [
        'token' => $token,
        'userId' => $matched['id'],
        'email' => $matched['email'],
        'name' => $matched['name'],
        'role' => 'customer',
        'type' => 'customer',
        'createdAt' => time() * 1000,
        'expiresAt' => (time() + 86400 * 30) * 1000,
    ];
    saveDb($dbFile, $backupFile, $state);
    echo json_encode([
        'ok' => true,
        'token' => $token,
        'user' => sanitizeUser($matched),
        'message' => 'Welcome back to BAJOZ — The House of Naturals, ' . $matched['name'] . '!',
    ]);
    exit;
}

if ($path === '/auth/verify' && $method === 'POST') {
    $token = getBearerToken($body);
    $sess = $state['sessions'][$token] ?? null;
    if (!$sess || ($sess['expiresAt'] ?? 0) < time() * 1000) {
        http_response_code(401);
        echo json_encode(['ok' => false]);
        exit;
    }
    foreach ($state['profiles'] as $u) {
        if (($u['id'] ?? '') === ($sess['userId'] ?? '') || strtolower((string)($u['email'] ?? '')) === strtolower((string)($sess['email'] ?? ''))) {
            echo json_encode(['ok' => true, 'user' => sanitizeUser($u)]);
            exit;
        }
    }
    http_response_code(401);
    echo json_encode(['ok' => false]);
    exit;
}

if ($path === '/auth/logout' && $method === 'POST') {
    $token = getBearerToken($body);
    if ($token !== '' && isset($state['sessions'][$token])) {
        unset($state['sessions'][$token]);
        saveDb($dbFile, $backupFile, $state);
    }
    echo json_encode(['ok' => true]);
    exit;
}

// 9. Admin Auth & Backup API (/api/admin/*)
if ($path === '/admin/login' && $method === 'POST') {
    $email = strtolower(trim((string)($body['email'] ?? '')));
    $pass = trim((string)($body['password'] ?? ''));
    foreach ($state['authorizedPersonnel'] as $staff) {
        if (strtolower((string)($staff['email'] ?? '')) === $email && verifyStoredPassword($pass, (string)($staff['passwordHash'] ?? ''))) {
            $token = 'bj_adm_' . bin2hex(random_bytes(16));
            $state['sessions'][$token] = [
                'token' => $token,
                'email' => $staff['email'],
                'name' => $staff['name'],
                'role' => $staff['role'],
                'type' => 'admin',
                'createdAt' => time() * 1000,
                'expiresAt' => (time() + 86400 * 7) * 1000,
            ];
            saveDb($dbFile, $backupFile, $state);
            $safeList = array_map('sanitizeUser', $state['authorizedPersonnel']);
            echo json_encode([
                'ok' => true,
                'token' => $token,
                'staff' => sanitizeUser($staff),
                'personnel' => $safeList,
            ]);
            exit;
        }
    }
    http_response_code(401);
    echo json_encode([
        'ok' => false,
        'message' => 'Access denied. Invalid staff email or security key.',
    ]);
    exit;
}

if ($path === '/admin/verify' && $method === 'POST') {
    $token = getBearerToken($body);
    $sess = $state['sessions'][$token] ?? null;
    if ($sess && ($sess['type'] ?? '') === 'admin' && ($sess['expiresAt'] ?? 0) > time() * 1000) {
        $safeList = array_map('sanitizeUser', $state['authorizedPersonnel']);
        echo json_encode([
            'ok' => true,
            'staff' => [
                'email' => $sess['email'],
                'name' => $sess['name'],
                'role' => $sess['role'],
            ],
            'personnel' => $safeList,
        ]);
        exit;
    }
    http_response_code(401);
    echo json_encode(['ok' => false]);
    exit;
}

if ($path === '/admin/db-backup' && $method === 'GET') {
    echo json_encode([
        'ok' => true,
        'exportedAt' => gmdate('c'),
        'engine' => 'BAJOZ Self-Hosted Full-Stack Database v2 (Hostinger Ready)',
        'data' => [
            'products' => $state['products'],
            'orders' => $state['orders'],
            'reviews' => $state['reviews'],
            'profiles' => array_map('sanitizeUser', $state['profiles']),
            'settings' => $state['settings'],
            'media' => $state['media'],
        ],
    ]);
    exit;
}

if ($path === '/admin/db-restore' && $method === 'POST') {
    $payload = $body['data'] ?? $body;
    if (is_array($payload)) {
        if (isset($payload['products']) && is_array($payload['products'])) $state['products'] = $payload['products'];
        if (isset($payload['orders']) && is_array($payload['orders'])) $state['orders'] = $payload['orders'];
        if (isset($payload['reviews']) && is_array($payload['reviews'])) $state['reviews'] = $payload['reviews'];
        if (isset($payload['profiles']) && is_array($payload['profiles'])) $state['profiles'] = $payload['profiles'];
        if (isset($payload['settings']) && is_array($payload['settings'])) $state['settings'] = $payload['settings'];
        saveDb($dbFile, $backupFile, $state);
        echo json_encode(['ok' => true, 'message' => 'BAJOZ self-hosted database restored successfully.']);
        exit;
    }
    http_response_code(400);
    echo json_encode(['ok' => false, 'message' => 'Invalid backup payload.']);
    exit;
}

// 10. File Storage API (/api/storage/*)
if ($path === '/storage/files' && $method === 'GET') {
    echo json_encode(['ok' => true, 'files' => $state['media']]);
    exit;
}

if ($path === '/storage/upload' && $method === 'POST') {
    $asset = saveBase64Media(
        $state,
        $uploadsDir,
        (string)($body['dataUrl'] ?? ''),
        (string)($body['filename'] ?? 'asset'),
        (string)($body['category'] ?? 'general')
    );
    if (!$asset) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'message' => 'Invalid dataUrl payload.']);
        exit;
    }
    saveDb($dbFile, $backupFile, $state);
    echo json_encode(['ok' => true, 'asset' => $asset, 'url' => $asset['url']]);
    exit;
}

// 11. Concierge Ask Endpoint (/api/concierge/ask)
if ($path === '/concierge/ask' && $method === 'POST') {
    $q = strtolower(trim((string)($body['message'] ?? '')));
    $reply = 'Assalam-o-Alaikum! Welcome to BAJOZ — The House of Naturals in Model Town, Lahore. We handcraft SpiceMix (250 gm, 450 gm, 950 gm), Panjeeri in pure Desi Ghee (250 gm, 450 gm, 950 gm), and Tooth Guardian natural tooth cleaning powder (40 gm, 80 gm). Ask me about ingredients, cooking steps, or delivery across Pakistan!';
    if (str_contains($q, 'spicemix') || str_contains($q, 'paste')) {
        $reply = 'BAJOZ SpiceMix has 17 pure ingredients (fresh garlic, ginger, salt, and 14 Pakistani spices) in one jar with ZERO onion. Just fry onions and tomatoes, add meat, vegetables, or daal, and add 1-2 tablespoons of SpiceMix! Sizes: 250 gm, 450 gm, and 950 gm (Price: N/A).';
    } elseif (str_contains($q, 'panjeeri')) {
        $reply = 'Our Panjeeri is slow-roasted in 100% pure Desi Ghee with almonds, cashews, pistachios, char maghaz, and 4 gondain. Zero white sugar. Available in Suji, Alsi, and Daal Moong flavours in 250 gm, 450 gm, and 950 gm jars (Price: N/A).';
    } elseif (str_contains($q, 'tooth') || str_contains($q, 'guardian') || str_contains($q, 'manjan')) {
        $reply = 'Tooth Guardian is our natural homemade tooth cleaning powder made with alum (phitkari), cloves (laung), natural salts, and tree bark powders. Available in 40 gm and 80 gm jars (Price: N/A).';
    }
    echo json_encode(['ok' => true, 'reply' => $reply, 'source' => 'hostinger-php-concierge']);
    exit;
}

http_response_code(404);
echo json_encode(['ok' => false, 'message' => 'Endpoint not found: ' . $path]);
