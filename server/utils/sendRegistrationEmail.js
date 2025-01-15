import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

export const sendRegistrationEmail = async (employeeEmail) => {
  const payload = { email: employeeEmail };

  const registrationToken = await jwt.sign(
    payload,
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "7d",
    }
  );

  const registrationLink = `http://localhost:3000/auth/signup/${registrationToken}`;

  //   // Create a test account (only for development/testing)
  //   const testAccount = await nodemailer.createTestAccount();

  //   // Create a transporter using the Ethereal account
  //   const transporter = nodemailer.createTransport({
  //     host: "smtp.ethereal.email",
  //     port: 587,
  //     secure: false, // Use TLS
  //     auth: {
  //       user: testAccount.user, // Generated test user
  //       pass: testAccount.pass, // Generated test password
  //     },
  //   });

  //   email configuration and content
  //   console.log(process.env.HOST_EMAIL);
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
    to: employeeEmail,
    subject: "Your Registration Link",
    text: `Hello,\n\nClick the link below to register:\n\n${registrationLink}\n\nNote: You must include your token in the headers when accessing the registration endpoint.`,
    html: `
            <p>Hello,</p>
            <p>Click the link below to register:</p>
            <p><a href="${registrationLink}">${registrationLink}</a></p>
        `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Registration email sent to ${employeeEmail}`);
    console.log("Message sent: %s", info.messageId);
    // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (e) {
    console.log("email sent failed");
    console.log(e);
  }
};
