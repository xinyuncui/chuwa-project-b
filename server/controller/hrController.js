import { sendRegistrationEmail } from "../utils/sendRegistrationEmail.js";
import registrationHistory from "../model/RegistrationHistory.js";
import User from "../model/employeeDB.js";

export const hrSendEmail = async (req, res) => {
  const { email } = req.body;
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return res
      .status(400)
      .json({ message: "Invalid or missing email address" });
  }

  try {
    // check if email already signed up
    let user = await User.findOne({ email: email });
    if (user) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // send email to employee
    const link = await sendRegistrationEmail(email);
    console.log("link:", link);

    // save email and link to db
    const registration = new registrationHistory({
      email,
      registrationLink: link,
    });
    await registration.save();
    res.status(200).json({ message: "Email sent successfully" });
  } catch (e) {
    res.status(500).json("error", e.message);
  }
};

export const getHistory = async (req, res) => {
  try {
    const history = await registrationHistory.find({});
    res
      .status(200)
      .json({ message: "fetch history successfully", history: history });
  } catch (e) {
    res.status(500).json("error", e.message);
  }
};
