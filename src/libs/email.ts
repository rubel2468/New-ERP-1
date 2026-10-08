import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Sends a low stock notification email to staff/admin
 */
export async function sendLowStockAlertEmail(
  toEmail: string,
  productName: string,
  sku: string,
  currentStock: number,
  lowStockLimit: number
) {
  try {
    const mailOptions = {
      from: `"ERP Alert System" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: `🚨 Low Stock Alert: ${productName}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #f87171; border-radius: 8px; max-width: 600px;">
          <h2 style="color: #dc2626; margin-top: 0;">Stock Alert: Limit Reached</h2>
          <p>The following product has dropped below its safe threshold level:</p>
          <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #e2e8f0;">Product Name:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">${productName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #e2e8f0;">SKU:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">${sku}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #e2e8f0; color: #dc2626;">Current Stock:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #dc2626;">${currentStock}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #e2e8f0;">Low Stock Limit:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">${lowStockLimit}</td>
            </tr>
          </table>
          <p style="margin-top: 20px; font-size: 12px; color: #64748b;">This is an automated system email. Please restock this item soon.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Low stock alert email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Failed to send low stock email:', error);
    return { success: false, error };
  }
}

/**
 * Sends an invoice PDF email directly to the customer
 */
export async function sendInvoiceEmail(
  toEmail: string,
  invoiceNumber: string,
  pdfBuffer: Buffer
) {
  try {
    const mailOptions = {
      from: `"Accounts Dept" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: `Invoice #${invoiceNumber} from ERP Inc.`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
          <h2>Thank you for your order!</h2>
          <p>Please find attached invoice <strong>#${invoiceNumber}</strong> detailing your recent purchase transaction.</p>
          <p>If you have any questions or queries regarding this bill, feel free to reply directly to this mail.</p>
          <br/>
          <p style="font-size: 12px; color: #64748b;">Regards,<br/>ERP Accounts Dept</p>
        </div>
      `,
      attachments: [
        {
          filename: `Invoice-${invoiceNumber}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Invoice email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Failed to send invoice email:', error);
    return { success: false, error };
  }
}
