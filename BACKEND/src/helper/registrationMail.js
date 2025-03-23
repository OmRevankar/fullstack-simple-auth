export const registrationMail = (fullName) => {

    return (`
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registration Confirmation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
            text-align: center;
        }
        .header {
            background-color: #007bff;
            color: white;
            padding: 15px;
            font-size: 20px;
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
        }
        .content {
            padding: 20px;
            font-size: 16px;
            color: #333;
        }
        .button {
            display: inline-block;
            background-color: #007bff;
            color: white;
            padding: 12px 20px;
            text-decoration: none;
            font-size: 16px;
            font-weight: bold;
            border-radius: 5px;
            margin-top: 20px;
        }
        .button:hover {
            background-color: #0056b3;
        }
        .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">Welcome to OM Bhai's Website 🎉</div>
        <div class="content">
            <p>Dear <strong>${fullName}</strong>,</p>
            <p>Thank you for registering with us! We are excited to have you on board.</p>
            <p>Please click the button below to visit our website and start exploring.</p>
            <a href=${process.env.FRONTEND_URL} class="button">Go to Website</a>
            <p>If the button above doesn’t work, you can also copy and paste this link into your browser:</p>
            <p><a href=${process.env.FRONTEND_URL}>${process.env.FRONTEND_URL}</a></p>
        </div>
        <div class="footer">
            &copy; 2024 OM Bhai. All Rights Reserved.
        </div>
    </div>
</body>
</html>
`)

}