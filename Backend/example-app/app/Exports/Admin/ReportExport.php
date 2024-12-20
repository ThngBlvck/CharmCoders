<?php

namespace App\Exports\Admin;

use App\Models\Order;
use App\Models\Product;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class ReportExport implements FromCollection, WithHeadings
{
    public function collection()
    {
        // Lấy tổng `total_amount` và tổng số lượng sản phẩm cho các đơn hàng có trạng thái là 3 và định dạng lại
        $totalAmountStatus3 = number_format(Order::where('status', 3)->sum('total_amount'), 0, ',', '.');

        // Lấy các đơn hàng với chi tiết sản phẩm cho trạng thái là 0
        $orders = Order::where('status', 0)->with(['details.product'])->get();

        // Biến để lưu tổng số lượng sản phẩm
        $totalQuantity = 0;

        // Biến để lưu tổng số lượng của từng sản phẩm
        $productQuantities = [];

        // Tạo mảng dữ liệu cho báo cáo
        $reportData = collect([
            ['Tổng doanh thu', $totalAmountStatus3],
            ['Danh sách số sản phẩm', 'Số lượng sản phẩm ']
        ]);

        // Duyệt qua các đơn hàng và tính tổng số lượng sản phẩm
        foreach ($orders as $order) {
            foreach ($order->details as $detail) {
                $totalQuantity += $detail->quantity;

                // Tính tổng số lượng cho mỗi sản phẩm
                $product = $detail->product;
                if (isset($productQuantities[$product->id])) {
                    $productQuantities[$product->id] += $detail->quantity;
                } else {
                    $productQuantities[$product->id] = $detail->quantity;
                }

                // Thêm thông tin đơn hàng vào báo cáo
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



        // Lấy thông tin về các sản phẩm trong kho
        $products = Product::all();

        // Duyệt qua các sản phẩm và thêm vào báo cáo tổng số lượng trong kho
        foreach ($products as $product) {
            $reportData->push([
                'Tên sản phẩm' => $product->name,
                'Số lượng trong kho' => $product->quantity,
                'Giá sản phẩm' => $product->price,
                'Giảm giá' => 0, // Giảm giá có thể lấy từ bảng chi tiết đơn hàng hoặc sản phẩm tùy theo yêu cầu
                'Thành tiền' => $product->quantity * $product->price
            ]);
        }
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
