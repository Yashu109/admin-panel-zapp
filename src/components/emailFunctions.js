const functions = require('firebase-functions');
const admin = require('firebase-admin');
const sgMail = require('@sendgrid/mail');

// Initialize Firebase Admin SDK
admin.initializeApp();

// Initialize SendGrid with your API key
// You'll need to get an API key from SendGrid (https://sendgrid.com)
sgMail.setApiKey(functions.config().sendgrid.key);

/**
 * Cloud Function to send email notifications for merchant requests
 * Triggered via HTTP callable function
 */
exports.sendMerchantEmail = functions.https.onCall(async (data, context) => {
  try {
    // Check if all required data is provided
    if (!data.email || !data.status || !data.description) {
      throw new Error('Missing required email parameters');
    }

    // Create email content
    const msg = {
      to: data.email,
      from: 'noreply@zappcart.com', // Use your verified sender email in SendGrid
      subject: `Your ZappCart Merchant Request has been ${data.status}`,
      text: data.description,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #d32f2f;">ZappCart</h1>
          </div>
          <div style="margin-bottom: 20px;">
            <h2 style="color: ${data.status === 'approved' ? '#2e7d32' : '#c62828'};">
              Your merchant request has been ${data.status}
            </h2>
            <p style="font-size: 16px; line-height: 1.5; color: #333;">
              ${data.description}
            </p>
          </div>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 14px; color: #757575;">
            <p>If you have any questions, please contact our support team.</p>
            <p>© ${new Date().getFullYear()} ZappCart. All rights reserved.</p>
          </div>
        </div>
      `
    };

    // Send the email
    await sgMail.send(msg);
    
    // Log success for monitoring
    functions.logger.info('Email sent successfully', {
      email: data.email,
      status: data.status,
      timestamp: new Date().toISOString()
    });

    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    // Log error for debugging
    functions.logger.error('Error sending email', {
      error: error.message,
      stack: error.stack,
      data: data
    });

    // Return error information
    return { 
      success: false, 
      message: 'Failed to send email', 
      error: error.message 
    };
  }
});

/**
 * Alternatively, you can use a Firestore trigger to automatically send emails
 * when the status field changes in a document
 */
exports.sendMerchantStatusEmail = functions.firestore
  .document('merchantRequests/{requestId}')
  .onUpdate(async (change, context) => {
    const newData = change.after.data();
    const previousData = change.before.data();
    
    // Only proceed if status has changed
    if (newData.status === previousData.status) {
      return null;
    }
    
    // Only send for 'approved' or 'rejected' status
    if (newData.status !== 'approved' && newData.status !== 'rejected') {
      return null;
    }
    
    try {
      // Create email content
      const msg = {
        to: newData.email,
        from: 'noreply@zappcart.com',
        subject: `Your ZappCart Merchant Request has been ${newData.status}`,
        text: newData.adminResponse || `Your merchant request has been ${newData.status}.`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h1 style="color: #d32f2f;">ZappCart</h1>
            </div>
            <div style="margin-bottom: 20px;">
              <h2 style="color: ${newData.status === 'approved' ? '#2e7d32' : '#c62828'};">
                Your merchant request has been ${newData.status}
              </h2>
              <p style="font-size: 16px; line-height: 1.5; color: #333;">
                ${newData.adminResponse || `Your merchant collaboration request has been ${newData.status}.`}
              </p>
            </div>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 14px; color: #757575;">
              <p>If you have any questions, please contact our support team.</p>
              <p>© ${new Date().getFullYear()} ZappCart. All rights reserved.</p>
            </div>
          </div>
        `
      };

      // Send the email
      await sgMail.send(msg);
      
      // Log success
      functions.logger.info('Status change email sent', {
        requestId: context.params.requestId,
        email: newData.email,
        status: newData.status
      });
      
      return { success: true };
    } catch (error) {
      functions.logger.error('Error sending status change email', {
        error: error.message,
        requestId: context.params.requestId
      });
      
      return { success: false, error: error.message };
    }
  });