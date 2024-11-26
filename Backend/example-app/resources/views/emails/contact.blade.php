<!-- resources/views/emails/contact.blade.php -->
<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contact Form Submission</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body {
            background-color: #f7f9fc;
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
        }

        .card-header {
            background: linear-gradient(45deg, #6a11cb, #2575fc);
            color: #fff;
            font-size: 1.5rem; /* Header lớn hơn */
        }

        .card-body p {
            font-size: 1.125rem; /* Nội dung lớn hơn */
        }

        .card-body p strong {
            color: #2575fc;
        }

        .message-box {
            background-color: #eef5ff;
            border-left: 4px solid #2575fc;
            padding: 15px;
            border-radius: 5px;
            font-style: italic;
            font-size: 1.125rem; /* Message lớn hơn */
        }

        .card-footer {
            background-color: #f1f3f5;
            color: #6c757d;
            font-size: 0.95rem; /* Footer vừa phải */
        }

        .card-footer a {
            color: #2575fc;
            text-decoration: none;
            font-weight: bold;
        }

        .card-footer a:hover {
            text-decoration: underline;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="card shadow-sm w-100" style="max-width: 600px;">
            <div class="card-header text-center">
                <h2 class="mb-0">📧 Tin nhắn liên hệ</h2>
            </div>
            <div class="card-body">
                <p><strong>Tên khách hàng:</strong> {{ $name }}</p>
                <p><strong>Email:</strong> {{ $email }}</p>
                <p><strong>Số điện thoại:</strong> {{ $phone }}</p>
                <p><strong>Nội dung:</strong></p>
                <div class="message-box">
                    {{ $messageContent }}
                </div>
            </div>
            <div class="card-footer text-center">
                <p class="mb-1">Email này được gửi từ liên hệ trên trang của bạn.</p>
                <a href="http://localhost:3000">Ghé thăm</a>
            </div>
        </div>
    </div>
</body>

</html>
