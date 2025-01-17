import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Avatar,
  Card,
  CardContent,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import VisibilityIcon from "@mui/icons-material/Visibility";

const PersonalInformationPage = () => {
  const initialData = {
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
        middleName: "",
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
  };

  const [personalInfo, setPersonalInfo] = useState(initialData);
  const [tempData, setTempData] = useState(initialData);
  const [editMode, setEditMode] = useState(false);
  const [confirmDiscard, setConfirmDiscard] = useState(false);

  const toggleEditMode = () => {
    if (!editMode) {
      setTempData(personalInfo); // Save current state to temp
    }
    setEditMode(!editMode);
  };

  const handleCancel = () => {
    setConfirmDiscard(true); // Open confirmation dialog
  };

  const confirmDiscardChanges = (discard) => {
    if (discard) {
      setPersonalInfo(tempData); // Revert changes
    }
    setConfirmDiscard(false);
    setEditMode(false);
  };

  const handleSave = () => {
    setPersonalInfo(tempData); // Save changes to main state
    setEditMode(false);
  };

  const renderEditableSection = (label, value, keyPath) => (
    <Box sx={{ mb: 2 }}>
      <Typography variant="h6">{label}</Typography>
      {editMode ? (
        <TextField
          fullWidth
          value={value}
          onChange={(e) =>
            setTempData((prev) => {
              const updated = { ...prev };
              const keys = keyPath.split(".");
              keys.reduce((acc, key, i) => {
                if (i === keys.length - 1) acc[key] = e.target.value;
                else return acc[key];
              }, updated);
              return updated;
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

          {/* Profile Picture */}
          <Box sx={{ textAlign: "center", mt: 3 }}>
            <Avatar
              src={personalInfo.avatar}
              sx={{ width: 100, height: 100, margin: "auto" }}
            />
            <Typography variant="body1">Profile Picture</Typography>
          </Box>

          {/* Name Section */}
          {renderEditableSection("First Name", tempData.name.firstName, "name.firstName")}
          {renderEditableSection("Last Name", tempData.name.lastName, "name.lastName")}
          {renderEditableSection("Middle Name", tempData.name.middleName, "name.middleName")}
          {renderEditableSection("Preferred Name", tempData.name.preferredName, "name.preferredName")}
          {renderEditableSection("Email", tempData.email, "email")}
          {renderEditableSection("SSN", tempData.ssn, "ssn")}
          {renderEditableSection("Birth Date", tempData.birthDate, "birthDate")}
          {renderEditableSection("Gender", tempData.gender, "gender")}

          {/* Address Section */}
          <Typography variant="h6" sx={{ mt: 3 }}>
            Address
          </Typography>
          {renderEditableSection("Building/Apt #", tempData.address.building, "address.building")}
          {renderEditableSection("Street", tempData.address.street, "address.street")}
          {renderEditableSection("City", tempData.address.city, "address.city")}
          {renderEditableSection("State", tempData.address.state, "address.state")}
          {renderEditableSection("ZIP", tempData.address.zip, "address.zip")}

          {/* Contact Info Section */}
          <Typography variant="h6" sx={{ mt: 3 }}>
            Contact Info
          </Typography>
          {renderEditableSection("Cell Phone", tempData.contactInfo.cellPhone, "contactInfo.cellPhone")}
          {renderEditableSection("Work Phone", tempData.contactInfo.workPhone, "contactInfo.workPhone")}

          {/* Employment Section */}
          <Typography variant="h6" sx={{ mt: 3 }}>
            Employment
          </Typography>
          {renderEditableSection("Visa Title", tempData.employment.visaTitle, "employment.visaTitle")}
          {renderEditableSection("Start Date", tempData.employment.startDate, "employment.startDate")}
          {renderEditableSection("End Date", tempData.employment.endDate, "employment.endDate")}

          {/* Emergency Contact Section */}
          <Typography variant="h6" sx={{ mt: 3 }}>
            Emergency Contact
          </Typography>
          {tempData.emergencyContacts.map((contact, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              {renderEditableSection("First Name", contact.firstName, `emergencyContacts.${index}.firstName`)}
              {renderEditableSection("Last Name", contact.lastName, `emergencyContacts.${index}.lastName`)}
              {renderEditableSection("Phone", contact.phone, `emergencyContacts.${index}.phone`)}
              {renderEditableSection("Email", contact.email, `emergencyContacts.${index}.email`)}
              {renderEditableSection("Relationship", contact.relationship, `emergencyContacts.${index}.relationship`)}
            </Box>
          ))}

          {/* Documents Section */}
          <Typography variant="h6" sx={{ mt: 3 }}>
            Documents
          </Typography>
          {tempData.documents.map((doc) => (
            <Box key={doc.id} sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography>{doc.name}</Typography>
              <Box>
                <IconButton onClick={() => window.open(doc.url)}>
                  <VisibilityIcon />
                </IconButton>
                <IconButton onClick={() => alert(`Downloading ${doc.name}`)}>
                  <FileDownloadIcon />
                </IconButton>
              </Box>
            </Box>
          ))}

          {/* Confirmation Dialog */}
          <Dialog open={confirmDiscard} onClose={() => setConfirmDiscard(false)}>
            <DialogTitle>Discard Changes?</DialogTitle>
            <DialogContent>
              <Typography>Are you sure you want to discard all changes?</Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => confirmDiscardChanges(false)}>No</Button>
              <Button onClick={() => confirmDiscardChanges(true)}>Yes</Button>
            </DialogActions>
          </Dialog>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PersonalInformationPage;