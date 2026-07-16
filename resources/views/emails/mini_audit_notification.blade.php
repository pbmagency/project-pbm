<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
        }

        .header {
            background: linear-gradient(135deg, #7c3aed, #4f46e5);
            color: white;
            padding: 20px;
            border-radius: 8px 8px 0 0;
        }

        .content {
            background: #f9fafb;
            padding: 20px;
            border: 1px solid #e5e7eb;
        }

        .field {
            margin-bottom: 12px;
        }

        .label {
            font-weight: bold;
            color: #6b7280;
            font-size: 12px;
            text-transform: uppercase;
        }

        .value {
            font-size: 16px;
            color: #111827;
        }

        .badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
        }

        .qualified {
            background: #d1fae5;
            color: #065f46;
        }

        .footer {
            padding: 16px 20px;
            background: #f3f4f6;
            border-radius: 0 0 8px 8px;
            font-size: 12px;
            color: #9ca3af;
        }
    </style>
</head>

<body>
    <div class="header">
        <h1 style="margin:0;">🎯 New Qualified Lead</h1>
        <p style="margin:4px 0 0;">A new qualified lead has submitted the mini audit form.</p>
    </div>

    <div class="content">
        <div class="field">
            <div class="label">Nama</div>
            <div class="value">{{ $lead->nama }}</div>
        </div>
        <div class="field">
            <div class="label">Email</div>
            <div class="value">{{ $lead->email }}</div>
        </div>
        <div class="field">
            <div class="label">WhatsApp</div>
            <div class="value">{{ $lead->whatsapp }}</div>
        </div>
        <div class="field">
            <div class="label">Website</div>
            <div class="value"><a href="{{ $lead->website }}">{{ $lead->website }}</a></div>
        </div>

        <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0;">

        <div class="field">
            <div class="label">Traffic</div>
            <div class="value">{{ $lead->traffic }}</div>
        </div>
        <div class="field">
            <div class="label">Omzet</div>
            <div class="value">{{ $lead->omzet }}</div>
        </div>
        <div class="field">
            <div class="label">Tantangan</div>
            <div class="value">
                {{ $lead->tantangan }}{{ $lead->tantangan_lainnya ? ': ' . $lead->tantangan_lainnya : '' }}</div>
        </div>

        <div class="field" style="margin-top:16px;">
            <span class="badge qualified">✅ QUALIFIED</span>
        </div>
    </div>

    <div class="footer">
        Submitted at {{ $lead->created_at->format('d M Y H:i') }} — PBM Agency Mini Audit
    </div>
</body>

</html>
