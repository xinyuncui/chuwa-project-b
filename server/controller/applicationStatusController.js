import OnboardingApplication from "../model/OnboardingApplication.js";
export const getALLApplicationStatus = async (req, res) => {
  try {
    const applications = await OnboardingApplication.find()
      .populate("user")
      .populate("documents");
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
      allApplications: applications,
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
    const { step } = req.body; 

    console.log(`Approve application ${applicationId} for step ${step}`);

    const application = await OnboardingApplication.findById(applicationId).populate("documents");
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    const document = application.documents.find(doc => doc.step === step);
    if (!document) {
      return res.status(404).json({ message: `Document for step ${step} not found` });
    }

    document.status = "Approved";
    await document.save();

    if (step === "I20") {
      application.status = "Approved";
      await application.save();
    }

    res.status(200).json({ message: "Application and document approved successfully" });
  } catch (err) {
    console.error("Error in ApproveApplication:", err);
    res.status(500).json({
      message: "Failed to approve application",
      error: err.message,
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
