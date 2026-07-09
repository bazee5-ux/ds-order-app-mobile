const nodemailer = require('nodemailer');
const { Resend } = require('resend');
const twilio = require('twilio');

// Helper to format products for email body
const formatProductsForEmail = (products) => {
  return products.map((p, idx) => {
    return `  ${idx + 1}. Brand: ${p.brand} | Model: ${p.model} | Quantity: ${p.quantity}`;
  }).join('\n');
};

// Helper to format products for WhatsApp body
const formatProductsForWhatsApp = (products) => {
  return products.map(p => `${p.brand} ${p.model} × ${p.quantity}`).join('\n');
};

const sendEmailNotification = async (order) => {
  const adminEmail = process.env.ADMIN_EMAIL || 'dsengineering.py@gmail.com';
  const { customerDetails, orderId, date, time, products } = order;

  // Clean, readable plain-text format with colons
  const bodyText = `--- New Product Enquiry ---

Customer Name : ${customerDetails.name}
Company       : ${customerDetails.company}
Phone         : ${customerDetails.phone}
Email         : ${customerDetails.email || 'N/A'}
Address       : ${customerDetails.address}
Remarks       : ${customerDetails.remarks || 'None'}

Order ID      : ${orderId}
Order Date    : ${date} ${time}

Products Requested:
${formatProductsForEmail(products)}

---------------------------`;

  // Check if Resend is configured
  if (!process.env.RESEND_API_KEY) {
    console.log('\n--- [SANDBOX MODE] EMAIL NOTIFICATION LOG ---');
    console.log(`To: ${adminEmail}`);
    console.log(`Subject: New Product Enquiry - ${orderId}`);
    console.log('Body:\n' + bodyText);
    console.log('----------------------------------------------\n');
    return { success: true, mode: 'sandbox' };
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const data = await resend.emails.send({
      from: 'onboarding@resend.dev', // Default testing domain for Resend
      to: adminEmail,
      subject: `New Product Enquiry - ${orderId}`,
      text: bodyText,
    });

    console.log(`Email notification sent successfully via Resend: ${data.id}`);
    return { success: true, data };
  } catch (error) {
    console.error('Failed to send email notification:', error);
    throw error;
  }
};

const sendWhatsAppNotification = async (order) => {
  const adminPhone = process.env.ADMIN_WHATSAPP_NUMBER || '+919944182596';
  const { customerDetails, orderId, products } = order;

  // Build WhatsApp text body exactly matching requested format
  const messageText = `🟢 New Order Received

Customer
${customerDetails.name}

Company
${customerDetails.company}

Phone
${customerDetails.phone}

Products
${formatProductsForWhatsApp(products)}

Remarks
${customerDetails.remarks || 'None'}

Order ID
${orderId}`;

  // Check if Twilio is configured
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_WHATSAPP_FROM) {
    console.log('\n--- [SANDBOX MODE] WHATSAPP NOTIFICATION LOG ---');
    console.log(`To (WhatsApp): ${adminPhone}`);
    console.log('Message:\n' + messageText);
    console.log('-------------------------------------------------\n');
    return { success: true, mode: 'sandbox' };
  }

  try {
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    const message = await client.messages.create({
      body: messageText,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_FROM}`,
      to: `whatsapp:${adminPhone}`
    });
    console.log(`WhatsApp message sent successfully: ${message.sid}`);
    return { success: true, sid: message.sid };
  } catch (error) {
    console.error('Failed to send WhatsApp notification:', error);
    throw error;
  }
};

module.exports = {
  sendEmailNotification,
  sendWhatsAppNotification
};
