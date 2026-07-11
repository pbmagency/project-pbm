<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pembayaran Berhasil</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f4f4f5; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
        .header { background: linear-gradient(135deg, #2563eb, #1d4ed8); padding: 40px 32px; text-align: center; }
        .header h1 { color: #fff; margin: 0; font-size: 24px; font-weight: 700; }
        .header p { color: rgba(255,255,255,0.85); margin: 8px 0 0; }
        .body { padding: 32px; }
        .greeting { font-size: 16px; color: #111; margin-bottom: 16px; }
        .order-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 24px 0; }
        .order-box p { margin: 4px 0; color: #374151; font-size: 14px; }
        .order-box strong { color: #111; }
        .btn { display: inline-block; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; text-align: center; }
        .btn-primary { background: #2563eb; color: #fff; }
        .btn-green { background: #16a34a; color: #fff; }
        .btn-outline { background: #fff; color: #2563eb; border: 2px solid #2563eb; }
        .buttons { display: flex; flex-direction: column; gap: 12px; margin: 24px 0; }
        .divider { border: none; border-top: 1px solid #e2e8f0; margin: 28px 0; }
        .footer { background: #f8fafc; padding: 24px 32px; text-align: center; color: #6b7280; font-size: 13px; }
        .footer a { color: #2563eb; }
        .section-title { font-size: 13px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px; }
    </style>
</head>
<body>
<div class="container">
    <div class="header">
        <h1>🎉 Pembayaran Berhasil!</h1>
        <p>Terima kasih, kamu sudah resmi terdaftar.</p>
    </div>
    <div class="body">
        <p class="greeting">Hai <strong>{{ $order->name }}</strong>,</p>
        <p style="color:#374151; font-size:15px; line-height:1.6;">
            Selamat! Pembayaranmu untuk <strong>Webinar The Silent Conversion Leak</strong> telah berhasil dikonfirmasi.
            Detail event dan akses digital akan dikirim ke email ini.
        </p>

        <div class="order-box">
            <p class="section-title" style="margin-bottom:12px;">Detail Order</p>
            <p><strong>No. Order:</strong> {{ $order->order_number }}</p>
            <p><strong>Nama:</strong> {{ $order->name }}</p>
            <p><strong>Email:</strong> {{ $order->email }}</p>
            <p><strong>Total:</strong> Rp{{ number_format($order->amount, 0, ',', '.') }}</p>
            <p><strong>Tanggal Event:</strong> {{ $eventDate }}</p>
            <p><strong>Platform:</strong> {{ $eventVenue }}</p>
        </div>

        <p class="section-title">Langkah Selanjutnya</p>
        <div class="buttons">
            <a href="{{ $waGroupUrl }}" class="btn btn-green">💬 Bergabung WhatsApp Group</a>
            <a href="{{ $ebookUrl }}" class="btn btn-primary">📥 Download Ebook Bonus</a>
            <a href="{{ $calendarUrl }}" class="btn btn-outline">📅 Tambahkan ke Google Calendar</a>
        </div>

        <hr class="divider">
        <p style="font-size:14px; color:#374151; line-height:1.6;">
            Ada pertanyaan? Hubungi kami melalui WhatsApp di
            <a href="https://wa.me/628XXXXXXXXXX" style="color:#2563eb;">628XXXXXXXXXX</a>
            atau balas email ini.
        </p>
    </div>
    <div class="footer">
        <p>© {{ date('Y') }} PBM Agency. All rights reserved.</p>
        <p>Email ini dikirim ke {{ $order->email }}</p>
    </div>
</div>
</body>
</html>
