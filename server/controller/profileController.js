import User from "../model/employeeDB.js";
import Document from "../model/Document.js";
import OnboardingApplication from "../model/OnboardingApplication.js";

// Get personal information for the logged-in user
export const getPersonalInfo = async (req, res) => {
  try {
    // 1) Extract userId from the JWT (here, it is req.employee.id)
    const userId = req.employee.id;

    // 2) Find the user's profile
    //    Select only user.profile here; you can modify this to include other fields as needed.
    const user = await User.findById(userId).select("profile");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 3) Find the user's corresponding OnboardingApplication
    //    - If the OnboardingApplication schema has a field `user: { type: ObjectId, ref: 'User' }`
    //      and you stored the userId while creating it, you can query like this.
    //    - `populate("documents")` is used to fetch detailed information of the referenced `Document` in the `documents` field.
    const onboardingApp = await OnboardingApplication.findOne({
      user: userId,
    }).populate("documents");

    //    - If needed, you can further populate fields within `documents` using .populate("documents.someField")

    // 4) Prepare the response data for the frontend
    //    - If no corresponding OnboardingApplication is found, it can be null or undefined.
    res.status(200).json({
      profile: user.profile,
      onboardingApplication: onboardingApp, // Could be null
      documents: onboardingApp ? onboardingApp.documents : [],
    });
  } catch (error) {
    console.error("Error in getPersonalInfo:", error);
    res.status(500).json({
      message: `Error fetching personal information: ${error.message}`,
    });
  }
};

// Get personal info for all employees (with pagination and search)
export const getAllPersonalInfo = async (req, res) => {
  try {
    // Pagination
    const { page = 1, limit = 10, search = "" } = req.query;

    // Build query for "EMPLOYEE" role and optional search
    const query = {
      role: "EMPLOYEE",
      $or: [
        { "profile.name.firstName": { $regex: search, $options: "i" } },
        { "profile.name.lastName": { $regex: search, $options: "i" } },
        { "profile.name.preferredName": { $regex: search, $options: "i" } },
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
      message: `Error fetching personal information: ${error.message}`,
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.params.id; // Extract user ID from url
    const user = await User.findById(userId).select("profile"); // Fetch only the profile field

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      profile: user.profile,
    });
  } catch (error) {
    res.status(500).json({
      message: `Error fetching personal profile: ${error.message}`,
    });
  }
};
// Update personal information for the logged-in user
export const updatePersonalInfo = async (req, res) => {
  try {
    const userId = req.employee.id; // Extract user ID from JWT
    const updatedProfile = req.body; // Profile data from request body

    // 1) Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2) Update user's profile
    user.profile = updatedProfile;
    await user.save();

    // 3) Create or update OnboardingApplication for this user, status always "Pending"
    let onboardingApp = await OnboardingApplication.findOne({ user: userId });
    if (!onboardingApp) {
      // If not found, create new
      onboardingApp = new OnboardingApplication({
        user: userId,
        // By default, status is "Pending" from your schema
        // We can explicitly set it too:
        status: "Pending",
      });
    } else {
      // If found, set status back to "Pending" if you want every update to reset the status
      onboardingApp.status = "Pending";
    }

    // Optional: If you want to set the visaType based on user.profile
    // For example, if your "visaType" is in user.profile.residency.workAuthorization.visaType
    const visaTypeFromProfile =
      updatedProfile?.residency?.workAuthorization?.visaType || "Other";
    onboardingApp.visaType = visaTypeFromProfile;

    // Save the onboarding application
    await onboardingApp.save();

    // Return response
    res.status(200).json({
      message: "Profile updated successfully, status set to Pending",
      profile: user.profile,
    });
  } catch (error) {
    res.status(500).json({
      message: `Error updating personal information: ${error.message}`,
    });
  }
};

// Upload document for the logged-in user
export const uploadDocument = async (req, res) => {
  try {
    const userId = req.employee.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!req.file) {
      return res
        .status(400)
        .json({ message: "No file uploaded or invalid file type." });
    }

    const docType = req.body.type || "OPT Receipt";
    const step = req.body.step || "OPT Receipt";

    let onboardingApp = await OnboardingApplication.findOne({ user: userId });
    if (!onboardingApp) {
      onboardingApp = new OnboardingApplication({
        user: userId,
        status: "Pending",
        visaType: "OPT",
      });
    } else {
      onboardingApp.status = "Pending";
    }

    await onboardingApp.save();

    let existingDoc = await Document.findOne({
      relatedTo: onboardingApp._id,
      step: step,
    });

    if (existingDoc) {
      existingDoc.type = docType;
      existingDoc.fileData = req.file.buffer;
      existingDoc.fileContentType = req.file.mimetype;
      existingDoc.status = "Pending";
      existingDoc.feedback = "";
      existingDoc.uploadDate = new Date();
      existingDoc.versionHistory.push({
        version: existingDoc.versionHistory.length + 1,
        status: "Pending",
        feedback: "",
        uploadDate: new Date(),
      });
      await existingDoc.save();
    } else {
      const newDoc = new Document({
        type: docType,
        uploadedBy: userId,
        relatedTo: onboardingApp._id,
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
        fileData: req.file.buffer,
        fileContentType: req.file.mimetype,
      });

      await newDoc.save();
      onboardingApp.documents.push(newDoc._id);
      await onboardingApp.save();
    }

    const updatedDocs = await Document.find({
      relatedTo: onboardingApp._id,
      step: step,
    });

    const latestDoc = updatedDocs[updatedDocs.length - 1];

    return res.status(200).json(latestDoc);
  } catch (error) {
    console.error("Error in uploadDocument:", error);
    return res.status(500).json({ message: error.message });
  }
};
