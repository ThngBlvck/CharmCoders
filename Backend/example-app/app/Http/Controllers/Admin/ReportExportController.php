<?php

namespace App\Http\Controllers\Admin;

use App\Exports\Admin\ReportExport;
use App\Jobs\Admin\ExportReportJob;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\Controller;

class ReportExportController extends Controller
{
    /**
     * Xuất báo cáo thống kê đơn hàng có trạng thái 3 và gửi qua email.
     */
    public function export(Request $request)
    {
        // Lấy email của người dùng đã đăng nhập
        $userEmail = $request->user()->email;

        // Dispatch công việc export báo cáo vào queue
        ExportReportJob::dispatch($userEmail);

        // Trả về phản hồi cho người dùng
        return response()->json(['message' => 'Báo cáo đang được tạo và sẽ gửi qua email.']);
    }
}
