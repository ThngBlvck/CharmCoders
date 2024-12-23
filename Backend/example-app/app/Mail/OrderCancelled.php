<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class OrderCancelled extends Mailable
{
    public $order;

    public function __construct($order)
    {
        $this->order = $order;
    }

    public function build()
    {
        return $this->subject('Thông báo hủy đơn hàng')
            ->view('emails.orders.cancelled')
            ->with([
                'order' => $this->order,
                'cancellationReason' => $this->order->cancellation_reason, // Lấy lý do từ cơ sở dữ liệu
            ]);
    }
}

