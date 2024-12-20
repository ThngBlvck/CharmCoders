<?php

namespace App\Jobs\Admin;

use App\Exports\Admin\ReportExport;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Support\Facades\Mail;
use App\Mail\Admin\ReportReadyMail;
use Illuminate\Support\Facades\Storage;

class ExportReportJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $userEmail;

    public function __construct($userEmail)
    {
        $this->userEmail = $userEmail;
    }

    public function handle()
    {
        // Tạo file Excel dưới dạng dữ liệu thô trong bộ nhớ
        $excelData = Excel::raw(new ReportExport, \Maatwebsite\Excel\Excel::XLSX);

        // Gửi email với file Excel đính kèm
        $adminEmail = 'glowmakers6996@gmail.com';
        Mail::to($adminEmail)->send(new ReportReadyMail($excelData));
    }

}
