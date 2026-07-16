<?php

namespace App\Mail;

use App\Models\MiniAudit;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\SerializesModels;

class MiniAuditNotification extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(public MiniAudit $lead) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '🎯 New Qualified Lead: ' . $this->lead->nama,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.mini_audit_notification',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
