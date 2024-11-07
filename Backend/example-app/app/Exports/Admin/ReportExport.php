<?php

namespace App\Exports\Admin;

use App\Models\Order;
use Maatwebsite\Excel\Concerns\FromCollection;

class ReportExport implements FromCollection
{
    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        return Order::all();
    }
    public function headings(): array
    {
        return [
            'ID',
            'Tên khách hàng',
            'Địa chỉ',
            'Tổng tiền',
            'Trạng thái',
            'Ngày tạo',
        ];
    }
}
