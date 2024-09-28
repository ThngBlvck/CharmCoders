<!-- resources/views/emails/contact.blade.php -->
<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>Contact Form Submission</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            color: #333;
        }

        .container {
            width: 80%;
            margin: 0 auto;
            background-color: #fff;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }

        .header {
            background-color: #d26e4b;
            padding: 10px;
            color: #fff;
            text-align: center;
            border-radius: 5px 5px 0 0;
        }

        .content {
            margin-top: 20px;
        }

        .footer {
            margin-top: 20px;
            font-size: 12px;
            text-align: center;
            color: #777;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <h2>New Contact Form Submission</h2>
        </div>
        <div class="content">
            <p><strong>Name:</strong> {{ $name }}</p>
            <p><strong>Email:</strong> {{ $email }}</p>
            <p><strong>SDT:</strong> {{ $phone }}</p>
            <p><strong>Message:</strong></p>
            <p>{{ $messageContent }}</p>
        </div>
        <div class="footer">
            <p>This email was sent from your website contact form.</p>
        </div>
    </div>
</body>

</html>