// Email notification service using SendGrid or similar
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { to, subject, html, text, templateId, templateData } = req.body;

    let msg;

    if (templateId) {
      // Use SendGrid template
      msg = {
        to,
        from: {
          email: 'noreply@successfulchefbrigade.com',
          name: 'The Successful Chef Brigade'
        },
        templateId,
        dynamicTemplateData: templateData
      };
    } else {
      // Send custom email
      msg = {
        to,
        from: {
          email: 'noreply@successfulchefbrigade.com',
          name: 'The Successful Chef Brigade'
        },
        subject,
        text,
        html
      };
    }

    await sgMail.send(msg);

    res.status(200).json({ success: true, messageId: 'sent' });
  } catch (error) {
    console.error('Email send error:', error);
    res.status(500).json({ 
      error: 'Failed to send email',
      details: error.message 
    });
  }
}

// Email templates
export const emailTemplates = {
  welcome: {
    subject: 'Welcome to The Successful Chef Brigade! 🎉',
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background: linear-gradient(135deg, #8b0000 0%, #dc2626 100%); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">The Successful Chef Brigade</h1>
        </div>
        <div style="padding: 30px; background: white;">
          <h2>Welcome to The Brigade! 🎉</h2>
          <p>You've just joined a community of culinary leaders committed to growth and excellence.</p>
          <div style="background: #f8f8f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>What's next?</h3>
            <ul>
              <li>Complete your profile setup</li>
              <li>Start with Kitchen Leadership 101</li>
              <li>Join the Chef's Table community</li>
              <li>Begin your leadership journal</li>
            </ul>
          </div>
          <a href="{dashboardUrl}" style="background: #8b0000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Get Started
          </a>
        </div>
      </div>
    `
  },
  
  liveEventReminder: {
    subject: 'Live Session Starting Soon! 📺',
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background: #8b0000; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Live Session Reminder</h1>
        </div>
        <div style="padding: 30px; background: white;">
          <h2>{eventTitle}</h2>
          <p><strong>Starting in {timeUntilStart} minutes!</strong></p>
          <p>{eventDescription}</p>
          <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>📅 Date:</strong> {eventDate}</p>
            <p><strong>🕒 Time:</strong> {eventTime}</p>
            <p><strong>👨‍🍳 Instructor:</strong> {instructor}</p>
          </div>
          <a href="{joinUrl}" style="background: #8b0000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Join Now
          </a>
        </div>
      </div>
    `
  },

  contentRelease: {
    subject: 'New Leadership Content Available! 📚',
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background: #8b0000; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">New Content Available</h1>
        </div>
        <div style="padding: 30px; background: white;">
          <h2>{contentTitle}</h2>
          <p>{contentDescription}</p>
          <div style="background: #f8f8f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Content Type:</strong> {contentType}</p>
            <p><strong>Duration:</strong> {duration}</p>
            <p><strong>Difficulty:</strong> {difficulty}</p>
          </div>
          <a href="{contentUrl}" style="background: #8b0000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Start Learning
          </a>
        </div>
      </div>
    `
  }
};