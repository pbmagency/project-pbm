<?php

namespace App\Mail;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class OrderConfirmationMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public readonly Order $order) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '✅ Pembayaran Berhasil — Webinar The Silent Conversion Leak',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.order-confirmation',
            with: [
                'order' => $this->order,
                'eventDate' => \App\Models\Setting::where('key', 'event_date')->value('value') ?? '16 JULI 2026',
                'eventTime' => \App\Models\Setting::where('key', 'event_time')->value('value') ?? '19:00 - 20:30 WIB',
                'eventVenue' => 'Online via Zoom',
                'zoomLink' => \App\Models\Setting::where('key', 'zoom_link')->value('value'),
                'waGroupUrl' => \App\Models\Setting::where('key', 'wa_group_link')->value('value') ?? 'https://chat.whatsapp.com/PLACEHOLDER',
                'waSupportNumber' => \App\Models\Setting::where('key', 'wa_support_number')->value('value') ?? '6285931018333',
                'ebookUrl' => config('app.url') . '/PBM_Ebook_Boncos.pdf',
                'calendarUrl' => $this->buildCalendarUrl(),
            ],
        );
    }

    private function buildCalendarUrl(): string
    {
        $title = urlencode('Webinar: The Silent Conversion Leak');
        $details = urlencode('Webinar bersama PBM Agency. Order: ' . $this->order->order_number);
        $location = urlencode('Online via Zoom');

        return "https://www.google.com/calendar/render?action=TEMPLATE&text={$title}&details={$details}&location={$location}";
    }
}