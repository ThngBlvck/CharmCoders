<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class SendMailContact extends Mailable
{
    use Queueable, SerializesModels;

    public $name;
    public $email;
    public $phone;  // Thêm biến số điện thoại
    public $messageContent;

    /**
     * Create a new message instance.
     */
    public function __construct($name, $email, $phone, $messageContent)
    {
        $this->name = $name;
        $this->email = $email;
        $this->phone = $phone;  // Gán số điện thoại
        $this->messageContent = $messageContent;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            from: new Address($this->email, $this->name),
            subject: 'Phản hồi từ khách hàng: ' . $this->name  // Tiêu đề email
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.contact',  // Đường dẫn đến Blade template của email
            with: [
                'name' => $this->name,
                'email' => $this->email,
                'phone' => $this->phone,  // Gửi số điện thoại vào Blade template
                'messageContent' => $this->messageContent,//dd
            ],
        );
    }

    /**
     * Get the attachments for the message.
     */
    public function attachments(): array
    {
        return [];
    }
}


