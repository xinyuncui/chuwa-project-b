import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Avatar,
  Card,
  CardContent,
  TextField,
  Button,
  Modal,
} from "@mui/material";
import axios from "axios";
// import { updateProfile } from "../redux/authSlice";
import { useParams, useLocation } from "react-router-dom";
import { baseUrl } from "../../utils/service";
import { useDispatch, useSelector } from "react-redux";
import {
  approveApplication,
  rejectApplication,
} from "../../redux/applicationStatusSlice";

const EmployeeProfilePage = ({ isApplication }) => {
  //   const { id } = useParams();
  //   console.log(id);
  const dispatch = useDispatch();
  const location = useLocation();

  const appStatus = useSelector((state) => state.applicationStatus);
  console.log("Redux state:", appStatus);

  // Parse query parameters
  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get("userId");
  const appId = queryParams.get("appId");
  console.log(`userId: ${userId}, appId: ${appId}`);
  const [personalInfo, setPersonalInfo] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [visibility, setVisibility] = useState(true);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);

  useEffect(() => {
    const fetchPersonalInfo = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(
          `${baseUrl}/profileRoutes/profile/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPersonalInfo(response.data.profile);
        console.log("personal info:", response.data.profile);
        // setTempData(response.data.profile);
      } catch (err) {
        console.log("Failed to fetch personal information.");
        console.error(err);
      }
    };

    fetchPersonalInfo();
  }, [userId]);

  // handle approved button
  const handleApprove = async () => {
    try {
      const token = localStorage.getItem("authToken");
      console.log("Approve token:", token);
      const response = await axios.post(
        `${baseUrl}/applications/approve/${appId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(approveApplication(appId));
      console.log("Employee approved successfully:", response.data);
      // the button should disappear
      setVisibility(false);
    } catch (err) {
      console.error("Failed to approve employee:", err);
    }
  };

  // handle reject button
  const handleReject = async () => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.post(
        `${baseUrl}/applications/reject/${appId}`,
        { feedback },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("reject application successfully");

      dispatch(rejectApplication(appId));
      // alert("Application rejected with feedback!");
      setVisibility(false);
      setRejectModalOpen(false); // Close modal after rejection
    } catch (err) {
      console.error("Failed to reject application.", err);
    }
  };
  // Render loading state until `personalInfo` is fetched
  if (!personalInfo) {
    return (
      <Box sx={{ textAlign: "center", marginTop: 5 }}>
        <Typography variant="h6">Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: "800px", margin: "auto", p: 3 }}>
      <Card>
        <CardContent>
          <Typography variant="h4">Personal Information</Typography>

          {/* Profile Picture */}
          <Box sx={{ textAlign: "center", mt: 3 }}>
            <Avatar
              src={
                personalInfo.avatar ||
                "https://via.placeholder.com/150/0000FF/FFFFFF?text=Avatar"
              }
              sx={{ width: 100, height: 100, margin: "auto" }}
            />
            <Typography variant="body1">Profile Picture</Typography>
          </Box>

          {/* Name Section */}
          <Typography variant="h6" sx={{ mt: 3 }}>
            Personal Information
          </Typography>
          <Typography>First Name: {personalInfo.name.firstName}</Typography>
          <Typography>Last Name: {personalInfo.name.lastName}</Typography>
          <Typography>
            Middle Name: {personalInfo.name.middleName || "N/A"}
          </Typography>
          <Typography>
            Preferred Name: {personalInfo.name.preferredName || "N/A"}
          </Typography>

          <Typography>Email: {personalInfo.email}</Typography>
          <Typography>SSN: {personalInfo.ssn}</Typography>
          <Typography>Birth Date: {personalInfo.birthDate}</Typography>
          <Typography>Gender: {personalInfo.gender}</Typography>

          {/* Address Section */}
          <Typography variant="h6" sx={{ mt: 3 }}>
            Address
          </Typography>
          <Typography>
            Building/Apt #: {personalInfo.address.building}
          </Typography>
          <Typography>Street: {personalInfo.address.street}</Typography>
          <Typography>City: {personalInfo.address.city}</Typography>
          <Typography>State: {personalInfo.address.state}</Typography>
          <Typography>ZIP: {personalInfo.address.zip}</Typography>

          {/* Residency Section */}
          <Typography variant="h6" sx={{ mt: 3 }}>
            Residency
          </Typography>
          <Typography>
            Permanent Resident or Citizen:{" "}
            {personalInfo.residency.isPermanentResidentOrCitizen ? "Yes" : "No"}
          </Typography>
          <Typography>
            Residency Status: {personalInfo.residency.status}
          </Typography>

          {/* Work Authorization if not permanent resident or citizen */}
          {!personalInfo.residency.isPermanentResidentOrCitizen && (
            <>
              <Typography variant="subtitle1" sx={{ mt: 2 }}>
                Work Authorization
              </Typography>
              <Typography>
                Visa Type: {personalInfo.residency.workAuthorization.visaType}
              </Typography>
              <Typography>
                Other Visa Title:{" "}
                {personalInfo.residency.workAuthorization.otherVisaTitle}
              </Typography>
              <Typography>
                Start Date: {personalInfo.residency.workAuthorization.startDate}
              </Typography>
              <Typography>
                End Date: {personalInfo.residency.workAuthorization.endDate}
              </Typography>
            </>
          )}

          {/* Contact Info Section */}
          <Typography variant="h6" sx={{ mt: 3 }}>
            Contact Info
          </Typography>
          <Typography>
            Cell Phone: {personalInfo.contactInfo.cellPhone}
          </Typography>
          <Typography>
            Work Phone: {personalInfo.contactInfo.workPhone || "N/A"}
          </Typography>

          {/* Emergency Contact Section */}
          <Typography variant="h6" sx={{ mt: 3 }}>
            Emergency Contact
          </Typography>
          {personalInfo.emergencyContacts.map((contact, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Typography>First Name: {contact.name.firstName}</Typography>
              <Typography>Last Name: {contact.name.lastName}</Typography>
              <Typography>Phone: {contact.phone}</Typography>
              <Typography>Email: {contact.email}</Typography>
              <Typography>Relationship: {contact.relationship}</Typography>
            </Box>
          ))}

          {/* Documents Section */}
          <Typography variant="h6" sx={{ mt: 3 }}>
            Documents
          </Typography>
          {personalInfo.documents.map((doc) => (
            <Box
              key={doc.id}
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography>{doc.name}</Typography>
              <Typography
                component="a"
                href={`${baseUrl}/document/preview/${doc._id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Document
              </Typography>
            </Box>
          ))}

          {/* Conditionally Render Buttons */}
          {isApplication && (
            <Box sx={{ mt: 3, textAlign: "center" }}>
              <Button
                variant="contained"
                color="success"
                onClick={handleApprove}
                sx={{ mr: 2 }}
                disabled={!visibility}
              >
                Approve
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => setRejectModalOpen(true)}
                disabled={!visibility}
              >
                Reject
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Reject Modal */}
      <Modal
        open={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        aria-labelledby="reject-modal-title"
        aria-describedby="reject-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography id="reject-modal-title" variant="h6">
            Provide Feedback for Rejection
          </Typography>
          <TextField
            id="feedback"
            label="Feedback"
            multiline
            rows={4}
            fullWidth
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            sx={{ mt: 2 }}
          />
          <Box sx={{ mt: 3, textAlign: "right" }}>
            <Button onClick={() => setRejectModalOpen(false)} sx={{ mr: 2 }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleReject}
              // disabled={!feedback.trim()}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default EmployeeProfilePage;
