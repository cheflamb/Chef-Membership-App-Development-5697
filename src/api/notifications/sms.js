// SMS notification service using Twilio
import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { to, message, priority = 'normal' } = req.body;

    // Validate phone number format
    if (!to || !to.match(/^\+[1-9]\d{1,14}$/)) {
      return res.status(400).json({ error: 'Invalid phone number format' });
    }

    // Check message length (SMS limit is 160 characters)
    if (message.length > 160) {
      return res.status(400).json({ error: 'Message too long (160 char max)' });
    }

    const smsMessage = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to
    });

    // Log SMS for analytics
    console.log(`SMS sent to ${to}: ${smsMessage.sid}`);

    res.status(200).json({ 
      success: true, 
      messageId: smsMessage.sid,
      status: smsMessage.status
    });
  } catch (error) {
    console.error('SMS send error:', error);
    res.status(500).json({ 
      error: 'Failed to send SMS',
      details: error.message 
    });
  }
}

// SMS templates
export const smsTemplates = {
  liveEventUrgent: (eventTitle, minutesUntil, joinUrl) => 
    `🚨 LIVE NOW: ${eventTitle} starting in ${minutesUntil} mins! Join: ${joinUrl}`,

  dailyReminder: (name) => 
    `Good morning ${name}! 🌅 Take 5 minutes today to reflect on your leadership growth. Open your journal: bit.ly/chef-journal`,

  weeklyDigest: (completedCourses, streakDays) => 
    `Weekly update: ${completedCourses} courses completed, ${streakDays}-day journal streak! Keep going! 💪`,

  emergencyAlert: (message) => 
    `🚨 BRIGADE ALERT: ${message}. Check your email for details.`,

  subscriptionReminder: (name, daysLeft) => 
    `Hi ${name}, your Brigade membership expires in ${daysLeft} days. Renew to keep your leadership journey going!`
};

// SMS compliance helpers
export const smsCompliance = {
  addUnsubscribe: (message) => {
    if (message.length <= 135) {
      return `${message}\n\nReply STOP to opt out`;
    }
    return message; // If too long, rely on Twilio's automatic opt-out
  },

  validateOptOut: async (phoneNumber, message) => {
    const optOutKeywords = ['STOP', 'QUIT', 'CANCEL', 'UNSUBSCRIBE', 'END'];
    if (optOutKeywords.includes(message.toUpperCase())) {
      // Handle opt-out in your database
      await handleSMSOptOut(phoneNumber);
      return true;
    }
    return false;
  }
};

async function handleSMSOptOut(phoneNumber) {
  // Update user's SMS notification preferences
  console.log(`Processing SMS opt-out for ${phoneNumber}`);
  // This would update your database to disable SMS for this number
}