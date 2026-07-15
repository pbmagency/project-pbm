<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pembayaran Berhasil</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f4f5; margin: 0; padding: 40px 20px;">
    
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
        
        <!-- Header -->
        <tr>
            <td style="background: linear-gradient(135deg, #0f172a, #1e293b); padding: 48px 32px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.02em;">🎉 Pembayaran Berhasil!</h1>
                <p style="color: #cbd5e1; margin: 12px 0 0; font-size: 16px;">Terima kasih, kamu sudah resmi terdaftar.</p>
            </td>
        </tr>

        <!-- Body -->
        <tr>
            <td style="padding: 40px 32px;">
                <p style="font-size: 16px; color: #1e293b; margin: 0 0 16px 0;">Hai <strong>{{ $order->name }}</strong>,</p>
                <p style="color: #475569; font-size: 15px; line-height: 1.6; margin: 0 0 32px 0;">
                    Selamat! Pembayaranmu untuk <strong>Webinar The Silent Conversion Leak</strong> telah berhasil dikonfirmasi. 
                    Detail pesanan dan akses digital kamu ada di bawah ini.
                </p>

                <!-- Order Box -->
                <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin-bottom: 32px;">
                    <p style="font-size: 12px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.08em; margin: 0 0 16px 0;">Detail Pesanan</p>
                    
                    <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 14px; color: #334155;">
                        <tr>
                            <td style="padding-bottom: 12px; color: #64748b;">No. Order</td>
                            <td style="padding-bottom: 12px; text-align: right; font-weight: 600; color: #0f172a;">{{ $order->order_number }}</td>
                        </tr>
                        <tr>
                            <td style="padding-bottom: 12px; color: #64748b;">Nama</td>
                            <td style="padding-bottom: 12px; text-align: right; font-weight: 500;">{{ $order->name }}</td>
                        </tr>
                        <tr>
                            <td style="padding-bottom: 12px; color: #64748b;">Email</td>
                            <td style="padding-bottom: 12px; text-align: right; font-weight: 500;">{{ $order->email }}</td>
                        </tr>
                        <tr>
                            <td style="padding-bottom: 16px; color: #64748b;">Total</td>
                            <td style="padding-bottom: 16px; text-align: right; font-weight: 700; color: #2563eb; font-size: 16px;">Rp{{ number_format($order->amount, 0, ',', '.') }}</td>
                        </tr>
                        <tr>
                            <td colspan="2" style="border-top: 1px dashed #cbd5e1; padding-top: 16px;"></td>
                        </tr>
                        <tr>
                            <td style="padding-bottom: 12px; color: #64748b;">Waktu Event</td>
                            <td style="padding-bottom: 12px; text-align: right; font-weight: 600; color: #0f172a;">{{ $eventDate }}<br><span style="font-size: 13px; color: #64748b; font-weight: 400;">Pukul {{ $eventTime }}</span></td>
                        </tr>
                        <tr>
                            <td style="padding-bottom: 0; color: #64748b;">Platform</td>
                            <td style="padding-bottom: 0; text-align: right; font-weight: 500;">{{ $eventVenue }}</td>
                        </tr>
                    </table>
                </div>

                @if($zoomLink)
                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                    <tr>
                        <td align="center">
                            <table cellpadding="0" cellspacing="0" style="width: 100%; max-width: 400px; font-size: 14px;">
                                <tr>
                                    <td style="padding: 10px 16px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; color: #64748b; font-weight: 600; text-align: center; width: 40%;">
                                        Link Webinar:
                                    </td>
                                    <td style="width: 12px;"></td>
                                    <td style="padding: 10px 16px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; text-align: center; width: 60%;">
                                        <a href="{{ $zoomLink }}" style="color: #475569; text-decoration: none; word-break: break-all;">{{ $zoomLink }}</a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
                @endif

                <p style="font-size: 12px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.08em; margin: 0 0 16px 0; text-align: center;">Langkah Selanjutnya</p>
                
                <!-- Buttons stacked using tables for Gmail compatibility -->
                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 8px;">
                    <tr>
                        <td align="center">
                            <a href="{{ $waGroupUrl }}" style="display: inline-block; width: 100%; max-width: 300px; background-color: #10b981; color: #ffffff; padding: 14px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; text-align: center;">💬 Bergabung WhatsApp Group</a>
                        </td>
                    </tr>
                </table>

                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 8px;">
                    <tr>
                        <td align="center">
                            <a href="{{ $ebookUrl }}" style="display: inline-block; width: 100%; max-width: 300px; background-color: #3b82f6; color: #ffffff; padding: 14px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; text-align: center;">📥 Download Ebook Bonus</a>
                        </td>
                    </tr>
                </table>

                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 16px;">
                    <tr>
                        <td align="center">
                            <a href="{{ $calendarUrl }}" style="display: inline-block; width: 100%; max-width: 300px; background-color: #ffffff; color: #475569; padding: 14px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; text-align: center; border: 1px solid #cbd5e1;">📅 Tambahkan ke Google Calendar</a>
                        </td>
                    </tr>
                </table>

                <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;">
                
                <p style="font-size: 14px; color: #64748b; line-height: 1.6; margin: 0; text-align: center;">
                    Ada pertanyaan? Hubungi kami melalui WhatsApp di <a href="https://wa.me/{{ $waSupportNumber }}" style="color: #2563eb; text-decoration: none; font-weight: 600;">{{ $waSupportNumber }}</a><br>atau balas langsung email ini.
                </p>
            </td>
        </tr>

        <!-- Footer -->
        <tr>
            <td style="background-color: #f8fafc; padding: 24px 32px; text-align: center; border-top: 1px solid #f1f5f9;">
                <p style="color: #94a3b8; font-size: 13px; margin: 0 0 8px 0;">© {{ date('Y') }} PBM Agency. All rights reserved.</p>
                <p style="color: #94a3b8; font-size: 12px; margin: 0;">Email ini dikirim otomatis ke {{ $order->email }}</p>
            </td>
        </tr>
    </table>
</body>
</html>