import User from "../model/employeeDB.js";
import jwt from "jsonwebtoken";
import registrationHistory from "../model/RegistrationHistory.js";

export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const token = req.params.token;

    // check token validity
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log("token:", decoded);

    // check if user is already registered
    let employee = await User.findOne({ email });
    if (employee) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // save user to db
    employee = new User({
      username,
      email,
      password,
    });
    await employee.save();

    // change registration history status to submmited
    let registration = await registrationHistory.findOne({ email });
    if (registration) {
      registration.registrationStatus = "submitted";
      await registration.save(); // Save the updated document to the database
    }

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: `server error: ${err.message}` });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log("login request received");
    let employee = await User.findOne({ username: username });

    if (!employee) {
      return res.status(400).json({ message: "User not found" });
    }

    if (employee.password != password) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    const payload = {
      employee: {
        id: employee._id,
        username: employee.username,
        email: employee.email,
      },
    };

    const token = await jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });

    // Exclude the password field
    const { password: _, ...safeEmployee } = employee.toObject();

    res.status(200).json({
      token: token,
      user: safeEmployee, // Exclude the password field
      message: "login successfully",
    });
  } catch (err) {
    res.status(500).json({ message: `server error: ${err.message}` });
  }
};

export const refreshPage = (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ valid: false, message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    return res.status(200).json({ valid: true, user: decoded.employee });
  } catch (err) {
    return res.status(401).json({ valid: false, message: err });
  }
};
