<?php

namespace App\Http\Controllers\Admin;

use App\Models\Order;
use App\Mail\Admin\ReportReadyMail;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\OrdersExport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\Controller;

class ReportExportController extends Controller
{
    /**
     * Xuất báo cáo đơn hàng.
     *
     * @return \Illuminate\Http\Response
     */
    public function export()
    {
        // Xuất báo cáo đơn hàng thành file Excel
        $fileName = 'orders_report_' . now()->format('Y_m_d_H_i_s') . '.xlsx';
        $filePath = storage_path('app/reports/' . $fileName);

        // Lưu file Excel vào thư mục báo cáo
        Excel::store(new OrdersExport, 'reports/' . $fileName);

        // Gửi email thông báo với file đính kèm
        $this->sendReportReadyEmail($filePath);

        // Trả về thông báo thành công
        return response()->json([
            'message' => 'Báo cáo đã được xuất và gửi qua email.',
        ]);
    }

    /**
     * Gửi email thông báo báo cáo đã sẵn sàng.
     *
     * @param string $filePath
     * @return void
     */
    protected function sendReportReadyEmail($filePath)
    {
        // Gửi email cho người dùng với file báo cáo đính kèm
        Mail::to('user@example.com')->send(new ReportReadyMail($filePath));
    }
}
