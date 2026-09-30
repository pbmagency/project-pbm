<?php

$publicPath = __DIR__.'/public';

$uri = urldecode(
    parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?? ''
);

$filePath = $publicPath.$uri;

// Enable CORS for static assets & dev origins (localhost vs 127.0.0.1)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, HEAD, OPTIONS');

// Fast-path landing page cache
$landingCache = __DIR__.'/storage/framework/cache/landing.html';
$buildManifest = __DIR__.'/public/build/manifest.json';
if ($uri === '/' && empty($_SERVER['HTTP_X_INERTIA']) && file_exists($landingCache)) {
    if (file_exists($buildManifest) && filemtime($landingCache) < filemtime($buildManifest)) {
        @unlink($landingCache);
        @unlink(__DIR__.'/storage/framework/cache/landing.html.gz');
    } else {
        $acceptEncoding = $_SERVER['HTTP_ACCEPT_ENCODING'] ?? '';
        header('Content-Type: text/html; charset=UTF-8');
        if (strpos($acceptEncoding, 'gzip') !== false && file_exists(__DIR__.'/storage/framework/cache/landing.html.gz')) {
            header('Content-Encoding: gzip');
            header('Vary: Accept-Encoding');
            header('Content-Length: '.(string) filesize(__DIR__.'/storage/framework/cache/landing.html.gz'));
            readfile(__DIR__.'/storage/framework/cache/landing.html.gz');
            exit;
        }
        header('Content-Length: '.(string) filesize(__DIR__.'/storage/framework/cache/landing.html'));
        readfile(__DIR__.'/storage/framework/cache/landing.html');
        exit;
    }
}

// Handle static files in public/
if ($uri !== '/' && file_exists($filePath) && ! is_dir($filePath)) {
    $acceptEncoding = $_SERVER['HTTP_ACCEPT_ENCODING'] ?? '';
    $ext = pathinfo($filePath, PATHINFO_EXTENSION);

    $mimeTypes = [
        'css' => 'text/css; charset=UTF-8',
        'js' => 'application/javascript; charset=UTF-8',
        'json' => 'application/json; charset=UTF-8',
        'svg' => 'image/svg+xml',
        'webp' => 'image/webp',
        'png' => 'image/png',
        'jpg' => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'ico' => 'image/x-icon',
        'woff' => 'font/woff',
        'woff2' => 'font/woff2',
        'ttf' => 'font/ttf',
    ];

    $mime = $mimeTypes[$ext] ?? (mime_content_type($filePath) ?: 'application/octet-stream');

    // Serve pre-compressed gzip if supported and exists
    if (strpos($acceptEncoding, 'gzip') !== false && file_exists($filePath.'.gz')) {
        header('Content-Type: '.$mime);
        header('Content-Encoding: gzip');
        header('Vary: Accept-Encoding');
        if (str_starts_with($uri, '/build/') || str_starts_with($uri, '/assets/')) {
            header('Cache-Control: public, max-age=31536000, immutable');
        }
        header('Content-Length: '.(string) filesize($filePath.'.gz'));
        readfile($filePath.'.gz');
        exit;
    }

    return false;
}

require_once $publicPath.'/index.php';
