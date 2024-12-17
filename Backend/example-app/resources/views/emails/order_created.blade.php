<!DOCTYPE html>
<html lang="vi">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Đơn hàng thành công</title>
    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body {
            background: linear-gradient(to right, #56CCF2, #2F80ED);
            color: #333;
            font-family: Arial, sans-serif;
        }

        .order-card {
            max-width: 800px;
            margin: 50px auto;
            background-color: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
        }

        .order-header {
            background: linear-gradient(90deg, #27AE60, #2ECC71);
            color: white;
            padding: 30px 0;
            text-align: center;
        }

        .order-header h1 {
            margin: 0;
            font-size: 2rem;
        }

        .list-group-item {
            background-color: #f8f9fa;
            border: none;
            padding: 15px;
            font-size: 1.1rem;
        }

        .list-group-item strong {
            color: #2F80ED;
        }

        .btn-custom {
            background-color: #F2994A;
            color: white;
            font-weight: bold;
            padding: 10px 20px;
            border-radius: 25px;
            transition: 0.3s;
        }

        .btn-custom:hover {
            background-color: #EB5757;
            color: white;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="order-card">
            <!-- Header -->
            <div class="order-header">
                <h1>🎉 Cảm ơn đã mua hàng 🎉</h1>
            </div>
            <!-- Body -->
            <div class="card-body p-4">
                <p class="text-center fs-5 mb-3">Xin chào, <strong>{{ $order->user->name }}</strong>!</p>
                <p class="text-center text-muted mb-4">Đơn hàng của bạn đã được tạo thành công. Dưới đây là chi tiết:
                </p>

                <!-- Chi tiết đơn hàng -->
                <ul class="list-group list-group-flush mb-4">
                    <li class="list-group-item"><strong>Mã đơn hàng:</strong> {{ $order->order_id}}</li>
                    <li class="list-group-item"><strong>Tổng tiền:</strong> <span
                            class="text-success fw-bold">{{ number_format($order->total_amount) }} VND</span></li>
                    <li class="list-group-item">
                        <strong>Phương thức thanh toán:</strong>
                        @if($order->payment_method == 1)
                            Thanh toán khi nhận hàng
                        @elseif($order->payment_method == 2)
                            Thanh toán chuyển khoản
                        @else
                            Không xác định
                        @endif
                    </li>
                    <li class="list-group-item"><strong>Địa chỉ giao hàng:</strong> {{ $order->address }}</li>
                    <li class="list-group-item"><strong>Số điện thoại:</strong> {{ $order->phone }}</li>
                </ul>
                <p class="text-center mb-3 fs-5">Chúng tôi sẽ sớm giao hàng đến bạn. Cảm ơn bạn đã tin tưởng và sử dụng
                    dịch vụ! 🚚</p>

                <!-- Button -->
                <div class="text-center">
                    <a href="http://localhost:3000/home" class="btn btn-succes shadow-sm">Ghé thăm Website </a>
                </div>
            </div>
        </div>
    </div>

    <!-- Bootstrap 5 JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>

</html>