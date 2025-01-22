import User from "../model/employeeDB.js";
import Document from "../model/Document.js";
import OnboardingApplication from "../model/OnboardingApplication.js";

export const getPersonalInfo = async (req, res) => {
  try {
    const userId = req.employee.id; // Extract user ID from the JWT payload added by the middleware
    const user = await User.findById(userId).select("profile"); // Fetch only the profile field

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ profile: user.profile });
  } catch (error) {
    res.status(500).json({
      message: `Error fetching personal information: ${error.message}`,
    });
  }
};

/**
 * Get all information for all users
 */
export const getAllPersonalInfo = async (req, res) => {
  try {
    // pagination
    const { page = 1, limit = 10, search = "" } = req.query;

    const query = {
      role: "EMPLOYEE",
      $or: [
        { "profile.name.firstName": { $regex: search, $options: "i" } }, // Search by first name
        { "profile.name.lastName": { $regex: search, $options: "i" } }, // Search by last name
        { "profile.name.preferredName": { $regex: search, $options: "i" } }, // Search by preferred
      ],
    };

    // Validate pagination inputs
    if (!Number(page) || !Number(limit)) {
      return res.status(400).json({ message: "Invalid pagination parameters" });
    }

    const users = await User.find(query, "-password")
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const totalUsers = await User.countDocuments(query);

    res.status(200).json({
      users,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    res.status(500).json({
      message: `Error fetching all personal information: ${error.message}`,
    });
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

    res
      .status(200)
      .json({ message: "Profile updated successfully", profile: user.profile });
  } catch (error) {
    res.status(500).json({
      message: `Error updating personal information: ${error.message}`,
    });
  }
};

export const uploadDocument = async (req, res) => {
  try {
    const userId = req.employee.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!req.file) {
      // If multer didn't receive any file or fileFilter blocked it
      return res
        .status(400)
        .json({ message: "No file uploaded or invalid file type." });
    }

    // Optional: get doc type, step from req.body or set defaults
    const docType = req.body.type || "OPT Receipt";
    const step = req.body.step || "OPT Receipt";

    // If you want to link to an existing OnboardingApplication,
    // you might pass an "applicationId" in req.body, or do "findOne({ user: userId })"
    // Below is an example approach:
    let onboardingApp = null;
    if (req.body.applicationId) {
      onboardingApp = await OnboardingApplication.findById(
        req.body.applicationId
      );
    } else {
      // or auto-create one for the user if none found
      onboardingApp = await OnboardingApplication.findOne({ user: userId });
      if (!onboardingApp) {
        onboardingApp = await OnboardingApplication.create({
          user: userId,
          visaType: "OPT", // or from req.body
        });
      }
    }

    // Create Document record
    const newDoc = new Document({
      type: docType,
      uploadedBy: userId,
      relatedTo: onboardingApp._id, // link it to that application
      status: "Pending",
      step,
      feedback: "",
      uploadDate: new Date(),
      versionHistory: [
        {
          version: 1,
          status: "Pending",
          feedback: "",
          uploadDate: new Date(),
        },
      ],
      // Store file data into DB as buffer
      fileData: req.file.buffer,
      fileContentType: req.file.mimetype,
    });

    await newDoc.save();

    // Also push this doc ref into OnboardingApplication
    onboardingApp.documents.push(newDoc._id);
    await onboardingApp.save();

    // Return the newly created doc record
    return res.status(200).json(newDoc);
  } catch (error) {
    console.error("Error in uploadDocument:", error);
    return res.status(500).json({ message: error.message });
  }
};
