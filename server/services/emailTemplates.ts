interface EmailTemplate {
  subject: string;
  html: (data: any) => string;
}

export const emailTemplates = {
  welcome: {
    subject: 'Welcome to Smart Ship Rates!',
    html: (data: { shopName: string }) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #5C6AC4; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Welcome to Smart Ship Rates!</h1>
        </div>
        <div style="padding: 20px; background-color: #f9f9f9;">
          <p>Dear ${data.shopName},</p>
          <p>Thank you for installing Music Player! We're excited to help you create beautiful music playlists and enhance your store's customer experience!</p>
          <p>Here's what you can do next:</p>
          <ul>
            <li>Create your first music playlist</li>
            <li>Add your favorite tracks</li>
            <li>Customize your player theme</li>
            <li>Set up your mini player</li>
          </ul>
          <p>If you have any questions, our support team is here to help at support@indusenigma.net</p>
          <p>Best regards,<br>The Music Player Team</p>
        </div>
      </div>
    `
  },

  errorNotification: {
    subject: 'Music Player Error Notification',
    html: (data: { error: string, shopName: string }) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #D82C0D; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Error Notification</h1>
        </div>
        <div style="padding: 20px; background-color: #f9f9f9;">
          <p>Dear ${data.shopName},</p>
          <p>We've detected an error in your Music Player app:</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <pre style="margin: 0; white-space: pre-wrap;">${data.error}</pre>
          </div>
          <p>Our team has been notified and will look into this issue immediately.</p>
          <p>Best regards,<br>The Music Player Team</p>
        </div>
      </div>
    `
  },

  trialEnding: {
    subject: 'Your Music Player Trial is Ending Soon',
    html: (data: { shopName: string, daysLeft: number }) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #50B83C; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Trial Ending Soon</h1>
        </div>
        <div style="padding: 20px; background-color: #f9f9f9;">
          <p>Dear ${data.shopName},</p>
          <p>Your Music Player trial will end in ${data.daysLeft} days. Don't miss out on these great features:</p>
          <ul>
            <li>Unlimited playlists and tracks</li>
            <li>Advanced player customization</li>
            <li>Priority support</li>
            <li>Analytics and reporting</li>
          </ul>
          <p>Upgrade now to continue using all features!</p>
          <p>Best regards,<br>The Music Player Team</p>
        </div>
      </div>
    `
  },

  accountDeactivated: {
    subject: 'Your Music Player Account Has Been Deactivated',
    html: (data: { shopName: string }) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #637381; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Account Deactivated</h1>
        </div>
        <div style="padding: 20px; background-color: #f9f9f9;">
          <p>Dear ${data.shopName},</p>
          <p>Your Music Player account has been deactivated. This could be due to:</p>
          <ul>
            <li>Trial period expiration</li>
            <li>Payment issues</li>
            <li>Account violation</li>
          </ul>
          <p>To reactivate your account, please contact our support team at support@indusenigma.net</p>
          <p>Best regards,<br>The Music Player Team</p>
        </div>
      </div>
    `
  },

  passwordReset: {
    subject: 'Reset Your Music Player Password',
    html: (data: { resetLink: string, shopName: string }) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #5C6AC4; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Password Reset</h1>
        </div>
        <div style="padding: 20px; background-color: #f9f9f9;">
          <p>Dear ${data.shopName},</p>
          <p>We received a request to reset your password. Click the button below to create a new password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.resetLink}" style="background-color: #5C6AC4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Reset Password</a>
          </div>
          <p>If you didn't request this, you can safely ignore this email.</p>
          <p>Best regards,<br>The Music Player Team</p>
        </div>
      </div>
    `
  },

  planUpgraded: {
    subject: 'Welcome to Smart Ship Rates Pro!',
    html: (data: { shopName: string, planName: string }) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #50B83C; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Welcome to Pro!</h1>
        </div>
        <div style="padding: 20px; background-color: #f9f9f9;">
          <p>Dear ${data.shopName},</p>
          <p>Congratulations! You've successfully upgraded to Smart Ship Rates Pro. You now have access to unlimited shipping conditions and advanced features!</p>
          <p>Your new Pro features include:</p>
          <ul>
            <li>Unlimited zip code conditions (unlimited codes per condition)</li>
            <li>Unlimited distance conditions</li>
            <li>Unlimited cart conditions</li>
            <li>Advanced analytics and reporting</li>
            <li>Priority support</li>
          </ul>
          <p>All your existing conditions have been reactivated and are now available for shipping rate calculations.</p>
          <p>If you have any questions, our support team is here to help at support@indusenigma.net</p>
          <p>Best regards,<br>The Smart Ship Rates Team</p>
        </div>
      </div>
    `
  },

  planDowngraded: {
    subject: 'Smart Ship Rates Plan Change Notification',
    html: (data: { shopName: string }) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #637381; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Plan Change Notification</h1>
        </div>
        <div style="padding: 20px; background-color: #f9f9f9;">
          <p>Dear ${data.shopName},</p>
          <p>Your Smart Ship Rates subscription has been changed to the Free Plan. Here's what this means:</p>
          <ul>
            <li>You can use up to 3 conditions of each type (zip code, distance, cart)</li>
            <li>Each zip code condition is limited to 5 zip codes</li>
            <li>Any conditions beyond these limits are now inactive but preserved</li>
            <li>You can upgrade back to Pro anytime to reactivate all conditions</li>
          </ul>
          <p>Your shipping rates will continue to work with the active conditions. To reactivate all your conditions, simply upgrade to Pro again.</p>
          <p>If you have any questions, our support team is here to help at support@indusenigma.net</p>
          <p>Best regards,<br>The Smart Ship Rates Team</p>
        </div>
      </div>
    `
  }
}; 