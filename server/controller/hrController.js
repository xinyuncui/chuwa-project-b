import { sendRegistrationEmail } from "../utils/sendRegistrationEmail.js";

export const hrSendEmail = async (req, res) => {
  const { email } = req.body;
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return res
      .status(400)
      .json({ message: "Invalid or missing email address" });
  }
  try {
    const link = await sendRegistrationEmail(email);
    res.status(200).json({ message: "Email sent successfully" });
  } catch (e) {
    res.status(500).json("error", e.message);
  }
};
