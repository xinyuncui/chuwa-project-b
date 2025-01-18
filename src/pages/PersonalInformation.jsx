import React, { useState, useEffect } from "react";
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
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

const PersonalInformationPage = () => {
  const [personalInfo, setPersonalInfo] = useState(null);
  const [tempData, setTempData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [confirmDiscard, setConfirmDiscard] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPersonalInfo = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get("http://localhost:3000/profileRoutes/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPersonalInfo(response.data.profile);
        setTempData(response.data.profile);
      } catch (err) {
        setError("Failed to fetch personal information.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPersonalInfo();
  }, []);

  const toggleEditMode = () => {
    if (!editMode) {
      setTempData(personalInfo);
    }
    setEditMode(!editMode);
  };

  const handleCancel = () => {
    setConfirmDiscard(true);
  };

  const confirmDiscardChanges = (discard) => {
    if (discard) {
      setTempData(personalInfo);
    }
    setConfirmDiscard(false);
    setEditMode(false);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.put(
        "http://localhost:3000/profileRoutes/profile",
        tempData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setPersonalInfo(tempData);
      setEditMode(false);
    } catch (err) {
      console.error("Failed to save personal information:", err);
      setError("Failed to save changes. Please try again.");
    }
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
        <Typography>{value || "N/A"}</Typography>
      )}
    </Box>
  );

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <CircularProgress />
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

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
              src={personalInfo.avatar || "https://via.placeholder.com/150/0000FF/FFFFFF?text=Avatar"}
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

          {/* Residency Section */}
          <Typography variant="h6" sx={{ mt: 3 }}>
            Residency
          </Typography>
          {renderEditableSection(
            "Permanent Resident or Citizen",
            tempData.residency.isPermanentResidentOrCitizen ? "Yes" : "No",
            "residency.isPermanentResidentOrCitizen"
          )}
          {renderEditableSection("Residency Status", tempData.residency.status, "residency.status")}
          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            Work Authorization
          </Typography>
          {renderEditableSection(
            "Visa Type",
            tempData.residency.workAuthorization.visaType,
            "residency.workAuthorization.visaType"
          )}
          {renderEditableSection(
            "Other Visa Title",
            tempData.residency.workAuthorization.otherVisaTitle,
            "residency.workAuthorization.otherVisaTitle"
          )}
          {renderEditableSection(
            "Start Date",
            tempData.residency.workAuthorization.startDate,
            "residency.workAuthorization.startDate"
          )}
          {renderEditableSection(
            "End Date",
            tempData.residency.workAuthorization.endDate,
            "residency.workAuthorization.endDate"
          )}

          {/* Contact Info Section */}
          <Typography variant="h6" sx={{ mt: 3 }}>
            Contact Info
          </Typography>
          {renderEditableSection("Cell Phone", tempData.contactInfo.cellPhone, "contactInfo.cellPhone")}
          {renderEditableSection("Work Phone", tempData.contactInfo.workPhone, "contactInfo.workPhone")}

          {/* Emergency Contact Section */}
          <Typography variant="h6" sx={{ mt: 3 }}>
            Emergency Contact
          </Typography>
          {tempData.emergencyContacts.map((contact, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              {renderEditableSection("First Name", contact.name.firstName, `emergencyContacts.${index}.name.firstName`)}
              {renderEditableSection("Last Name", contact.name.lastName, `emergencyContacts.${index}.name.lastName`)}
              {renderEditableSection("Phone", contact.phone, `emergencyContacts.${index}.phone`)}
              {renderEditableSection("Email", contact.email, `emergencyContacts.${index}.email`)}
              {renderEditableSection("Relationship", contact.relationship, `emergencyContacts.${index}.relationship`)}
              {editMode && (
                <IconButton
                  onClick={() =>
                    setTempData((prev) => ({
                      ...prev,
                      emergencyContacts: prev.emergencyContacts.filter((_, idx) => idx !== index),
                    }))
                  }
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </Box>
          ))}
          {editMode && (
            <Button
              startIcon={<AddIcon />}
              variant="contained"
              onClick={() =>
                setTempData((prev) => ({
                  ...prev,
                  emergencyContacts: [
                    ...prev.emergencyContacts,
                    {
                      name: { firstName: "", lastName: "", middleName: "" },
                      phone: "",
                      email: "",
                      relationship: "",
                    },
                  ],
                }))
              }
            >
              Add Emergency Contact
            </Button>
          )}

          {/* Reference Section */}
          <Typography variant="h6" sx={{ mt: 3 }}>
            Reference
          </Typography>
          {renderEditableSection("First Name", tempData.reference.name.firstName, "reference.name.firstName")}
          {renderEditableSection("Last Name", tempData.reference.name.lastName, "reference.name.lastName")}
          {renderEditableSection("Middle Name", tempData.reference.name.middleName, "reference.name.middleName")}
          {renderEditableSection("Phone", tempData.reference.phone, "reference.phone")}
          {renderEditableSection("Email", tempData.reference.email, "reference.email")}
          {renderEditableSection("Relationship", tempData.reference.relationship, "reference.relationship")}

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
          {editMode && (
            <Button
              variant="contained"
              component="label"
            >
              Upload Document
              <input
                type="file"
                hidden
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const formData = new FormData();
                    formData.append("document", file);
                    axios
                      .post("http://localhost:3000/profileRoutes/uploadDocument", formData, {
                        headers: {
                          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                        },
                      })
                      .then((res) => {
                        setTempData((prev) => ({
                          ...prev,
                          documents: [...prev.documents, res.data],
                        }));
                      })
                      .catch((err) => {
                        console.error("Failed to upload document:", err);
                      });
                  }
                }}
              />
            </Button>
          )}

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