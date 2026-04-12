export function otpTemplate(OTP){
    return {
        subject: "OTP for email verification",
        html: `<!DOCTYPE html>
<html lang="en" style="margin:0; padding:0;">
<head>
  <meta charset="UTF-8" />
  <title>OTP Verification</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background: #f1f5f9;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      color: #1e293b;
    }

    .container {
      max-width: 600px;
      margin: 40px auto;
      background: #ffffff;
      border-radius: 14px;
      overflow: hidden;
      box-shadow: 0 8px 25px rgba(0,0,0,0.08);
    }

    .header {
      padding: 25px;
      text-align: center;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: #ffffff;
    }

    .header h1 {
      margin: 0;
      font-size: 24px;
      letter-spacing: 1px;
    }

    .content {
      padding: 35px 30px;
      text-align: center;
    }

    .content p {
      font-size: 15px;
      line-height: 1.6;
      color: #475569;
    }

    .otp-box {
      display: inline-block;
      margin: 25px 0;
      padding: 16px 28px;
      font-size: 30px;
      font-weight: bold;
      letter-spacing: 8px;
      color: #4f46e5;
      background: #eef2ff;
      border: 2px dashed #6366f1;
      border-radius: 10px;
    }

    .info {
      font-size: 14px;
      color: #64748b;
      margin-top: 10px;
    }

    .footer {
      background: #f8fafc;
      text-align: center;
      padding: 18px;
      font-size: 12px;
      color: #94a3b8;
    }

    .footer a {
      color: #6366f1;
      text-decoration: none;
    }

    .brand {
      font-weight: bold;
      color: #6366f1;
    }
  </style>
</head>

<body>
  <div class="container">

    <!-- Header -->
    <div class="header">
      <h1>🔐 Verify Your Email</h1>
    </div>

    <!-- Content -->
    <div class="content">
      <p>Hello 👋,</p>
      <p>
        Use the One-Time Password (OTP) below to complete your verification.
      </p>

      <div class="otp-box">${OTP}</div>

      <p class="info">
        This OTP is valid for <strong>5 minutes</strong>.<br/>
        Do not share it with anyone.
      </p>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p>
        © 2026 <span class="brand">YourApp</span>. All rights reserved.
      </p>
      <p>
        Need help? <a href="mailto:support@yourapp.com">Contact Support</a>
      </p>
    </div>

  </div>
</body>
</html>`
    }
}