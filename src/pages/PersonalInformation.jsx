import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  Avatar,
  Card,
  CardContent,
  IconButton,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import VisibilityIcon from "@mui/icons-material/Visibility";

const PersonalInformationPage = () => {
  // State management for edit mode and personal data
  const [editMode, setEditMode] = useState(false);
  const [personalInfo, setPersonalInfo] = useState({
    name: {
      firstName: "John",
      lastName: "Doe",
      middleName: "M",
      preferredName: "Johnny",
    },
    avatar: "https://via.placeholder.com/150",
    email: "johndoe@example.com",
    ssn: "123-45-6789",
    birthDate: "1990-01-01",
    gender: "Male",
    address: {
      building: "123",
      street: "Main St",
      city: "San Francisco",
      state: "CA",
      zip: "94101",
    },
    contactInfo: {
      cellPhone: "123-456-7890",
      workPhone: "098-765-4321",
    },
    employment: {
      visaTitle: "H1-B",
      startDate: "2023-01-01",
      endDate: "2026-01-01",
    },
    emergencyContacts: [
      {
        firstName: "Jane",
        lastName: "Doe",
        phone: "123-456-7890",
        email: "janedoe@example.com",
        relationship: "Spouse",
      },
    ],
    documents: [
      {
        id: "1",
        name: "Driver's License",
        url: "/path/to/license.pdf",
      },
      {
        id: "2",
        name: "Work Authorization",
        url: "/path/to/work-authorization.pdf",
      },
    ],
  });

  // Handle edit toggle
  const toggleEditMode = () => setEditMode(!editMode);

  // Handle cancel changes
  const handleCancel = () => {
    setEditMode(false);
  };

  // Handle save changes
  const handleSave = () => {
    setEditMode(false);
    // Implement save logic here
  };

  // Render section
  const renderEditableSection = (label, value, fieldName) => (
    <Box sx={{ mb: 2 }}>
      <Typography variant="h6">{label}</Typography>
      {editMode ? (
        <TextField
          fullWidth
          value={value}
          onChange={(e) =>
            setPersonalInfo({
              ...personalInfo,
              [fieldName]: e.target.value,
            })
          }
        />
      ) : (
        <Typography>{value}</Typography>
      )}
    </Box>
  );

  return (
    <Box sx={{ maxWidth: "800px", margin: "auto", p: 3 }}>
      <Card>
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h4">Personal Information</Typography>
            <Box>
              {!editMode ? (
                <Button
                  startIcon={<EditIcon />}
                  variant="contained"
                  onClick={toggleEditMode}
                >
                  Edit
                </Button>
              ) : (
                <>
                  <Button
                    startIcon={<SaveIcon />}
                    variant="contained"
                    color="primary"
                    onClick={handleSave}
                  >
                    Save
                  </Button>
                  <Button
                    startIcon={<CancelIcon />}
                    variant="outlined"
                    color="secondary"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                </>
              )}
            </Box>
          </Box>

          {/* Avatar Section */}
          <Box sx={{ textAlign: "center", mt: 3 }}>
            <Avatar
              src={personalInfo.avatar}
              sx={{ width: 100, height: 100, margin: "auto" }}
            />
            <Typography variant="body1" sx={{ mt: 1 }}>
              Profile Picture
            </Typography>
          </Box>

          {/* Name Section */}
          {renderEditableSection("First Name", personalInfo.name.firstName, "firstName")}
          {renderEditableSection("Last Name", personalInfo.name.lastName, "lastName")}
          {renderEditableSection("Preferred Name", personalInfo.name.preferredName, "preferredName")}
          {renderEditableSection("Email", personalInfo.email, "email")}
          {renderEditableSection("SSN", personalInfo.ssn, "ssn")}
          {renderEditableSection("Birth Date", personalInfo.birthDate, "birthDate")}

          {/* Address Section */}
          <Typography variant="h6" sx={{ mt: 3 }}>
            Address
          </Typography>
          {renderEditableSection(
            "Building/Apt #",
            personalInfo.address.building,
            "building"
          )}
          {renderEditableSection("Street", personalInfo.address.street, "street")}
          {renderEditableSection("City", personalInfo.address.city, "city")}
          {renderEditableSection("State", personalInfo.address.state, "state")}
          {renderEditableSection("ZIP", personalInfo.address.zip, "zip")}

          {/* Documents Section */}
          <Typography variant="h6" sx={{ mt: 3 }}>
            Documents
          </Typography>
          {personalInfo.documents.map((doc) => (
            <Box
              key={doc.id}
              sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}
            >
              <Typography>{doc.name}</Typography>
              <Box>
                <IconButton onClick={() => window.open(doc.url)}>
                  <VisibilityIcon />
                </IconButton>
                <IconButton onClick={() => alert(`Download ${doc.name}`)}>
                  <FileDownloadIcon />
                </IconButton>
              </Box>
            </Box>
          ))}
        </CardContent>
      </Card>
    </Box>
  );
};

export default PersonalInformationPage;