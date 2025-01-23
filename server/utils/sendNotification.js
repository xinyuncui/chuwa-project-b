import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

export const sendNotificationEmail = async (email, message) => {
  if (!email || !message) {
    throw new Error("Email and message are required.");
  }

  const config = {
    service: "gmail",
    auth: {
      user: `${process.env.HOST_EMAIL}`,
      pass: `${process.env.HOST_PASS}`,
    },
  };

  const transporter = nodemailer.createTransport(config);

  const mailOptions = {
    from: `[HR Department] <${process.env.HOST_EMAIL}>`,
    // from: `[HR Department] <${testAccount.user}>`,
    to: email,
    subject: "[Notification] Next Step",
    text: `Hello,\n\nyour next step is to submit ${message}, please complete it as soon as possible.\n\n`,
    html: `
            <p>Hello,</p>
            <p>Your next step is to submit ${message}, please complete it as soon as possible.</p>
        `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Registration email sent to ${email}`);
    console.log("Message sent: %s", info.messageId);

    return {
      success: true,
      messageId: info.messageId,
    };

    // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (e) {
    console.log("email sent failed");
    console.log(e);
    throw new Error("Email sending failed");
  }
};
