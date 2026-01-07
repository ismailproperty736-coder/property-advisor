const { Resend } = require('resend');

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Send email notification for new lead
async function sendLeadNotification(leadData) {
  try {
    const emailContent = `
🏠 NEW PROPERTY LEAD RECEIVED! 🏠

📋 Lead Details:
• Name: ${leadData.name}
• Email: ${leadData.email}
• Phone: ${leadData.phone}

📝 Property Requirements:
${leadData.requirements}

📅 Submitted: ${new Date().toLocaleString()}

🔥 Contact this lead immediately for best conversion rate!

---
Property Advisor System
    `;

    const result = await resend.emails.send({
      from: 'Property Advisor <onboarding@resend.dev>',
      to: process.env.NOTIFICATION_EMAIL || 'ismailproperty736@gmail.com',
      subject: `🏠 New Property Lead: ${leadData.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px; text-align: center;">
            <h2>🏠 NEW PROPERTY LEAD RECEIVED!</h2>
            <p>A potential client is interested in your property services!</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h3>📋 Lead Details:</h3>
            <p><strong>Name:</strong> ${leadData.name}</p>
            <p><strong>Email:</strong> ${leadData.email}</p>
            <p><strong>Phone:</strong> ${leadData.phone}</p>
          </div>
          
          <div style="background: #e9ecef; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h3>📝 Property Requirements:</h3>
            <pre style="white-space: pre-wrap; background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #667eea;">${leadData.requirements}</pre>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <div style="background: #28a745; color: white; padding: 15px; border-radius: 10px; display: inline-block;">
              <strong>🔥 Contact this lead immediately for best conversion rate!</strong>
            </div>
          </div>
          
          <div style="text-align: center; color: #6c757d; margin-top: 30px;">
            <p>Submitted: ${new Date().toLocaleString()}</p>
            <p>— Property Advisor System —</p>
          </div>
        </div>
      `
    });

    console.log('✅ Resend email sent:', result.id);
    return true;
  } catch (error) {
    console.error('❌ Error sending Resend email:', error);
    return false;
  }
}

module.exports = { sendLeadNotification };
