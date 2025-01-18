import User from "../model/employeeDB.js";

export const getPersonalInfo = async (req, res) => {
  try {
    const userId = req.employee.id; // Extract user ID from the JWT payload added by the middleware
    const user = await User.findById(userId).select("profile"); // Fetch only the profile field

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ profile: user.profile });
  } catch (error) {
    res.status(500).json({ message: `Error fetching personal information: ${error.message}` });
  }
};

/**
 * Update personal information for the logged-in user
 */
export const updatePersonalInfo = async (req, res) => {
  try {
    const userId = req.employee.id; // Extract user ID from the JWT payload
    const updatedProfile = req.body; // Assume profile data is sent in the request body

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.profile = updatedProfile; // Update the profile field with new data
    await user.save(); // Save the updated user document

    res.status(200).json({ message: "Profile updated successfully", profile: user.profile });
  } catch (error) {
    res.status(500).json({ message: `Error updating personal information: ${error.message}` });
  }
};