<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class OrderCreatedMail extends Mailable
{
    use Queueable, SerializesModels;

    public $order; // Biến để truyền dữ liệu đơn hàng vào mail

    /**
     * Create a new message instance.
     */
    public function __construct($order)
    {
        $this->order = $order; // Truyền đơn hàng vào mailable
    }

    /**
     * Build the message.
     */
    public function build()
    {
        return $this->subject('Xác nhận đơn hàng thành công')
            ->view('emails.order_created')
            ->with([
                'order' => $this->order,
            ]);
    }
}
