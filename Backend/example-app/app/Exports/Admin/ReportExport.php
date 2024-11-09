<?php

namespace App\Exports\Admin;

use App\Models\Order;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class ReportExport implements FromCollection, WithHeadings
{
    /**
     * Trả về danh sách các đơn hàng có trạng thái là 3.
     *
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        // Lấy tổng `total_amount` và tổng số lượng sản phẩm cho các đơn hàng có trạng thái là 0
        $totalAmount = Order::where('status', 0)->sum('total_amount');

        // Lấy các đơn hàng với chi tiết sản phẩm
        $orders = Order::where('status', 0)->with(['details.product'])->get();

        // Biến để lưu tổng số lượng sản phẩm
        $totalQuantity = 0;

        // Tạo mảng dữ liệu cho báo cáo
        $reportData = collect([
            ['Tên báo cáo', 'Giá trị'],
            ['Tổng tiền Order', $totalAmount],
            ['Danh sách sản phẩm liên quan']
        ]);

        // Duyệt qua các đơn hàng và tính tổng số lượng sản phẩm
        foreach ($orders as $order) {
            foreach ($order->details as $detail) {
                $totalQuantity += $detail->quantity;

                $product = $detail->product;
                $reportData->push([
                    'Order ID' => $order->id,
                    'Tên sản phẩm' => $product->name,
                    'Số lượng sản phẩm' => $detail->quantity,
                    'Giá sản phẩm' => $detail->price,
                    'Giảm giá' => $detail->discount,
                    'Thành tiền' => $detail->quantity * $detail->price * (1 - $detail->discount / 100),
                ]);
            }
        }

        // Thêm tổng số lượng sản phẩm vào báo cáo
        $reportData->prepend(['Tổng số lượng sản phẩm', $totalQuantity], 3);

        return $reportData;
    }

    /**
     * Định nghĩa các tiêu đề cột cho báo cáo.
     *
     * @return array
     */
    public function headings(): array
    {
        return [
            'Thông tin',
            'Giá trị'
        ];
    }
}
