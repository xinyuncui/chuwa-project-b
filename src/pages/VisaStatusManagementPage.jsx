import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Divider,
  CircularProgress,
} from "@mui/material";

/**
 * A simplified "VisaStatusManagementPage" that:
 * 1) Fetches the user's onboarding application & documents from /profileRoutes/profile
 * 2) Checks visaType: if it's not OPT, shows a single status card. Otherwise, shows a 4-step process.
 * 3) Allows file uploads for each step, re-fetches data upon success.
 */
const VisaStatusManagementPage = () => {
  // Store the onboarding application (includes .status, .visaType, etc.)
  const [applicationData, setApplicationData] = useState(null);
  // Store all documents (each doc includes .step, .status, .feedback, etc.)
  const [documents, setDocuments] = useState([]);
  // UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Define the steps for F1(OPT)
  const steps = [
    { stepName: "OPTReceipt", displayName: "OPT Receipt" },
    { stepName: "OPTEAD", displayName: "OPT EAD" },
    { stepName: "I983", displayName: "I-983" },
    { stepName: "I20", displayName: "I-20" },
  ];

  // 1) Fetch data on mount
  useEffect(() => {
    const fetchVisaData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get token from localStorage (same as PersonalInformationPage)
        const token = localStorage.getItem("authToken");

        // Make GET request to retrieve user data
        // The backend should return something like:
        // {
        //   onboardingApplication: { visaType: "OPT", status: "Pending", ... },
        //   documents: [ { step: "OPTReceipt", status: "Pending", ... }, ... ]
        // }

        const response = await axios.get(
          "http://localhost:3000/profileRoutes/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Extract data from response
        // Adjust field names according to your backend response structure
        const { onboardingApplication, documents } = response.data;

        if (onboardingApplication) {
          setApplicationData(onboardingApplication);
        }
        if (Array.isArray(documents)) {
          setDocuments(documents);
        }
      } catch (err) {
        setError("Failed to fetch visa status data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchVisaData();
  }, []);

  // 2) Helper to find a document by step, e.g. "OPTReceipt"
  const findDocumentByStep = (stepName) => {
    return documents.find((doc) => doc.step === stepName) || null;
  };

  // 3) Handle upload for a specific step
  const handleUpload = async (stepName, file) => {
    try {
      const token = localStorage.getItem("authToken");
      const formData = new FormData();
      formData.append("document", file);
      formData.append("step", stepName); // Ensure stepName matches backend (e.g., "OPTReceipt")
  
      await axios.post(
        "http://localhost:3000/profileRoutes/profile/uploadDocument",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      // After upload success, re-fetch data to refresh the statuses
      const refetchRes = await axios.get(
        "http://localhost:3000/profileRoutes/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { onboardingApplication, documents: updatedDocs } = refetchRes.data;
      console.log("Refetched onboardingApplication:", onboardingApplication);
      console.log("Refetched documents:", updatedDocs);
  
      if (onboardingApplication) setApplicationData(onboardingApplication);
      if (Array.isArray(updatedDocs)) setDocuments(updatedDocs);
      
    } catch (err) {
      setError("Failed to upload document.");
      console.error(err);
    }
  };

  // --- Render UI ---
  if (loading) {
    return (
      <Box textAlign="center" mt={4}>
        <CircularProgress />
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  // If no application data is found
  if (!applicationData) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography>No Onboarding Application Data Found.</Typography>
      </Box>
    );
  }

  // Destructure needed fields from the application
  const { status, visaType } = applicationData;

  // 4) If not F1/OPT => single card with overall status
  if (visaType !== "F1(CPT/OPT)") {
    return (
      <Box maxWidth={600} mx="auto" mt={4}>
        <Card>
          <CardContent>
            <Typography variant="h5">Visa Status</Typography>
            <Divider sx={{ my: 2 }} />
            <Typography>
              Current Application Status: <b>{status}</b>
            </Typography>
            <Typography sx={{ mt: 1 }}>
              Since your visa type is not F1(OPT), there is no multi-step
              process required.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }

  // 5) If F1(OPT), show multi-step
  const renderStepCard = (step, index) => {
    // Find the doc for this step (OPTReceipt, OPTEAD, I983, I20)
    const doc = findDocumentByStep(step.stepName);
    const docStatus = doc ? doc.status : "NotUploaded";
    const feedback = doc ? doc.feedback : "";

    // Check if the previous step is approved
    let previousStepApproved = true;
    if (index > 0) {
      const prevDoc = findDocumentByStep(steps[index - 1].stepName);
      previousStepApproved = prevDoc && prevDoc.status === "Approved";
    }

    return (
      <Card key={step.stepName} sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6">{step.displayName}</Typography>
          <Typography>
            Status: <b>{docStatus}</b>
          </Typography>

          {/* If Rejected, display feedback */}
          {docStatus === "Rejected" && feedback && (
            <Typography color="error">Feedback: {feedback}</Typography>
          )}

          {/* If NotUploaded or Rejected => allow upload (if previous step is approved) */}
          {(docStatus === "NotUploaded" || docStatus === "Rejected") && (
            <Box sx={{ mt: 2 }}>
              {previousStepApproved ? (
                <Button variant="contained" component="label">
                  Upload {step.displayName}
                  <input
                    type="file"
                    hidden
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleUpload(step.stepName, e.target.files[0]);
                      }
                    }}
                  />
                </Button>
              ) : (
                <Typography color="text.secondary">
                  Please complete the previous step before uploading.
                </Typography>
              )}
            </Box>
          )}

          {/* If Pending => waiting for HR approval */}
          {docStatus === "Pending" && (
            <Typography color="text.secondary" sx={{ mt: 2 }}>
              Waiting for HR approval...
            </Typography>
          )}

          {/* If Approved => can proceed to next step */}
          {docStatus === "Approved" && (
            <Typography color="green" sx={{ mt: 2 }}>
              Approved! You may proceed to the next step.
            </Typography>
          )}
        </CardContent>
      </Card>
    );
  };

  // Render all 4 steps in order
  return (
    <Box maxWidth={600} mx="auto" mt={4}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Visa Status Management (F1/OPT)
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <Typography sx={{ mb: 2 }}>
        Overall Application Status: <b>{status}</b>
      </Typography>

      {steps.map((step, idx) => renderStepCard(step, idx))}
    </Box>
  );
};

export default VisaStatusManagementPage;
