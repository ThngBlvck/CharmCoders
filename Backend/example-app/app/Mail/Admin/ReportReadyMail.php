<?php

namespace App\Mail\Admin;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ReportReadyMail extends Mailable
{
    use Queueable, SerializesModels;

    public $filePath;

    /**
     * Tạo một instance mới.
     *
     * @param string $filePath Đường dẫn tới file báo cáo
     */
    public function __construct($filePath)
    {
        $this->filePath = $filePath;
    }

    /**
     * Xây dựng email.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject('Báo cáo đã sẵn sàng')
            ->view('emails.admin.report_ready')  // Thư mục 'admin'
            ->attach($this->filePath, [
                'as' => 'report.xlsx',
                'mime' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            ]);
    }
}
