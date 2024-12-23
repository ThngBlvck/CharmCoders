<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Cancelled</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
            margin: 0;
            padding: 0;
            color: #333;
        }

        .email-container {
            max-width: 800px;
            margin: 20px auto;
            background-color: #ffffff;
            border: 1px solid #ddd;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .email-header {
            background-color: #ff6b6b;
            color: #ffffff;
            text-align: center;
            padding: 20px;
        }

        .email-header h1 {
            margin: 0;
            font-size: 24px;
        }

        .email-body {
            padding: 20px;
        }

        .email-body p {
            line-height: 1.6;
            margin: 10px 0;
        }

        .email-body ul {
            list-style-type: none;
            padding: 0;
        }

        .email-body ul li {
            margin: 10px 0;
            padding: 10px;
            background-color: #f5f5f5;
            border: 1px solid #ddd;
            border-radius: 4px;
        }

        .email-footer {
            text-align: center;
            padding: 10px;
            background-color: #f1f1f1;
            font-size: 14px;
            color: #777;
        }

        .highlight {
            font-weight: bold;
            color: #ff6b6b;
        }
    </style>
</head>

<body>
    <div class="email-container">
        <div class="email-header">
            <h1>Đơn hàng #{{ $order->order_id }} đã bị hủy</h1>
        </div>
        <div class="email-body">
            <p>Xin chào <span class="highlight">{{ $order->user->name }}</span>,</p>
            <p>Đơn hàng của bạn đã bị hủy vì lý do:
                <span class="highlight">{{ $order->cancellation_reason }}</span>.
            </p>
            <p>Thông tin chi tiết đơn hàng:</p>
            <ul>
                <li><strong>Mã đơn hàng:</strong> {{ $order->order_id }}</li>
                <li><strong>Tổng tiền:</strong> {{ number_format($order->total_amount, 0, ',', '.') }} VND</li>
                <li><strong>Trạng thái:</strong> Đã hủy</li>
            </ul>
            <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>
        </div>
        <div class="email-footer">
            &copy; 2024 Company Name. All rights reserved.
        </div>
    </div>
</body>

</html>