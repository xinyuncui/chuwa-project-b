import OnboardingApplication from "../model/OnboardingApplication.js";
export const getALLApplicationStatus = async (req, res) => {
  try {
    const pendingApplications = await OnboardingApplication.find({
      status: "Pending",
    }).populate("user", "email profile.name");
    const approvedApplications = await OnboardingApplication.find({
      status: "Approved",
    }).populate("user", "email profile.name");
    const rejectedApplications = await OnboardingApplication.find({
      status: "Rejected",
    }).populate("user", "email profile.name");
    // const applicationStatus = await OnboardingApplication.find();
    res.status(200).json({
      pendingApplications: pendingApplications,
      approvedApplications: approvedApplications,
      rejectedApplications: rejectedApplications,
      //   applicationStatus: applicationStatus,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch applications",
      error: err,
    });
  }
};

export const ApproveApplication = async (req, res) => {
  try {
    const applicationId = req.params.id;
    console.log(`Approve application ${applicationId}`);
    const application = await OnboardingApplication.findById(applicationId);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }
    application.status = "Approved";
    await application.save();
    res.status(200).json({ message: "Application approved successfully" });
  } catch (err) {
    res.status(500).json({
      message: "Failed to approve application",
      error: err,
    });
  }
};

export const RejectApplication = async (req, res) => {
  try {
    const { feedback } = req.body;
    const applicationId = req.params.id;
    const application = await OnboardingApplication.findById(applicationId);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }
    application.status = "Rejected";
    application.feedback = feedback;
    await application.save();
    res.status(200).json({ message: "Application rejected successfully" });
  } catch (err) {
    res.status(500).json({
      message: "Failed to approve application",
      error: err,
    });
  }
};
