export const courseExpiryNotification = (data) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #ff5722; color: white; padding: 20px; text-align: center; }
    .content { background: #f9f9f9; padding: 20px; }
    .footer { text-align: center; padding: 20px; color: #666; }
    .button { background: #ff5722; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>⚠️ Course Expiry Notice</h1>
    </div>
    <div class="content">
      <h2>Hello ${data.userName},</h2>
      <p>This is to inform you that the course <strong>${data.courseTitle}</strong> will expire on <strong>${data.expiryDate}</strong>.</p>
      <p>Please complete the course before the expiry date to maintain access.</p>
      <p style="text-align: center; margin: 30px 0;">
        <a href="${data.courseUrl}" class="button">Continue Learning</a>
      </p>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} Meridian LMS. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;
