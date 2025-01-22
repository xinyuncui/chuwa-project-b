import React, { useState, useEffect } from "react";
import { Box, Typography, Avatar, Card, CardContent } from "@mui/material";
import axios from "axios";
// import { updateProfile } from "../redux/authSlice";
import { useParams } from "react-router-dom";
import { baseUrl } from "../../utils/service";

const EmployeeProfilePage = () => {
  const { id } = useParams();
  console.log(id);

  const [personalInfo, setPersonalInfo] = useState(null);

  useEffect(() => {
    const fetchPersonalInfo = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(
          `${baseUrl}/profileRoutes/profile/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPersonalInfo(response.data.profile);
        console.log(personalInfo);
        // setTempData(response.data.profile);
      } catch (err) {
        console.log("Failed to fetch personal information.");
        console.error(err);
      }
    };

    fetchPersonalInfo();
  }, [id]);

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
            Name
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
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Document
              </Typography>
            </Box>
          ))}
        </CardContent>
      </Card>
    </Box>
  );
};

export default EmployeeProfilePage;
