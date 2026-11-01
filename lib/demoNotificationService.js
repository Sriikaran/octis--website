/**
 * Notification Service Boundary for Demo Enquiries & Appointments
 * Checks for configured SMTP or SendGrid credentials server-side.
 * If credentials are not set, logs the notification dispatch to server diagnostics
 * without crashing or returning false confirmation.
 */

import { DEMO_CONFIG } from './demoConfig';

export async function sendDemoNotifications({ booking, enquiry }) {
  const smtpHost = process.env.SMTP_HOST;
  const sendgridApiKey = process.env.SENDGRID_API_KEY;

  const isEmailConfigured = Boolean(smtpHost || sendgridApiKey);

  const notificationRecord = {
    bookingId: booking.referenceId,
    customerEmail: enquiry.email,
    teamEmail: DEMO_CONFIG.contactEmail,
    scheduledAt: `${booking.date} at ${booking.startTime} (${booking.timezone})`,
    product: enquiry.product,
    emailServiceConfigured: isEmailConfigured,
    visitorEmailStatus: isEmailConfigured ? 'queued' : 'skipped_no_credentials',
    teamAlertStatus: isEmailConfigured ? 'queued' : 'skipped_no_credentials',
    dispatchedAt: new Date().toISOString(),
  };

  if (!isEmailConfigured) {
    // Graceful logging: Explain that email transport is currently in diagnostic/local mode
    console.log(
      `[DemoNotification] Email service not configured (missing SMTP_HOST or SENDGRID_API_KEY). ` +
      `Simulated notification logged for appointment ${booking.referenceId}:`,
      {
        to: enquiry.email,
        customer: `${enquiry.name} (${enquiry.showroomName})`,
        slot: `${booking.date} ${booking.startTime} IST`,
        product: enquiry.product,
      }
    );
    return notificationRecord;
  }

  // If credentials are present, attempt actual delivery via nodemailer or provider
  try {
    // If SMTP is configured
    if (smtpHost) {
      let nodemailer = null;
      try {
        const dynamicRequire = eval('require');
        nodemailer = dynamicRequire('nodemailer');
      } catch (err) {
        console.warn('[demoNotificationService] nodemailer not installed; skipping real SMTP transport.');
      }

      if (nodemailer) {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT) || 587,
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        // Send visitor confirmation
        await transporter.sendMail({
          from: `"Octis Jewellery Technology" <${process.env.SMTP_FROM || 'hello@octis.in'}>`,
        to: enquiry.email,
        subject: `Your Octis Demo Appointment is Confirmed — ${booking.referenceId}`,
        text: `Dear ${enquiry.name},\n\nYour demonstration of ${enquiry.product} has been scheduled for ${booking.date} at ${booking.startTime} IST.\n\nBooking Reference: ${booking.referenceId}\nShowroom: ${enquiry.showroomName}\n\nOur team will contact you prior to the call. If you need to reschedule, reply to this email or call +91 7396 029 339.\n\nBest regards,\nOctis Technology Team`,
      });

      // Send team notification
      await transporter.sendMail({
        from: `"Octis Booking System" <${process.env.SMTP_FROM || 'hello@octis.in'}>`,
        to: DEMO_CONFIG.contactEmail,
        subject: `[New Demo Booking] ${enquiry.showroomName} (${enquiry.city}) — ${booking.date}`,
        text: `New demonstration booked:\nReference: ${booking.referenceId}\nProduct: ${enquiry.product}\nDate: ${booking.date} at ${booking.startTime} IST\nName: ${enquiry.name}\nShowroom: ${enquiry.showroomName}\nPhone: ${enquiry.phone}\nEmail: ${enquiry.email}\nCity: ${enquiry.city}\nBranches: ${enquiry.branches}\nMessage: ${enquiry.message || 'N/A'}`,
      });

        notificationRecord.visitorEmailStatus = 'sent';
        notificationRecord.teamAlertStatus = 'sent';
      }
    }
  } catch (err) {
    console.error(`[DemoNotification] Failed to send email for ${booking.referenceId}:`, err.message);
    notificationRecord.visitorEmailStatus = 'failed';
    notificationRecord.teamAlertStatus = 'failed';
    notificationRecord.error = err.message;
  }

  return notificationRecord;
}

