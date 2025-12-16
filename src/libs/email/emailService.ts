import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

// Set up the NodeMailer transporter with your SMTP details
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT as string, 10),
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_MAIL,
    pass: process.env.SMTP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
    ciphers: 'SSLv3'
  },
  connectionTimeout: 60000,
  greetingTimeout: 30000,
  socketTimeout: 60000,
  debug: true,
  logger: true
});

// Function to load and process the HTML template
function loadTemplate(templateName: string, templateData: Record<string, string>) {
  const templatePath = path.join(process.cwd(), "src", "templates", `${templateName}.html`);
  let template = fs.readFileSync(templatePath, "utf-8");

  // Replace placeholders with actual data
  for (const key in templateData) {
    const placeholder = `{{${key}}}`;
    template = template.replace(new RegExp(placeholder, "g"), templateData[key]);
  }

  return template;
}

// Function to send an email
export async function sendEmail({
  to,
  subject,
  text,
  templateName,
  templateData,
}: {
  to: string;
  subject: string;
  text: string;
  templateName?: string;
  templateData?: Record<string, string>;
}) {
  let html = "";
  if (templateName && templateData) {
    html = loadTemplate(templateName, templateData);
  }

  const mailOptions = {
    from: `"Meridian Learning Management System" <${process.env.SMTP_MAIL}>`,
    to,
    subject,
    text,
    html,
    headers: {
      'X-Mailer': 'Meridian LMS v1.0',
      'Reply-To': process.env.SMTP_MAIL,
      'List-Unsubscribe': '<mailto:unsubscribe@meqmp.com>',
      'X-Entity-ID': 'MEQMP-LMS-001',
      'Message-ID': `<${Date.now()}.${Math.random()}@meqmp.com>`
    }
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email: %s", error);
    throw error;
  }
}
