<?php

namespace App\Mail;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class OrderConfirmationMail extends Mailable implements ShouldQueue
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
                'eventDate' => 'TBA', // Update this with actual event date
                'eventVenue' => 'Online via Zoom',
                'waGroupUrl' => 'https://chat.whatsapp.com/PLACEHOLDER',
                'ebookUrl' => config('app.url') . '/ebook',
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
