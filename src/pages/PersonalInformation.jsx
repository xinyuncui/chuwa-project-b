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

  // Store validation errors for each field
  const [validationErrors, setValidationErrors] = useState({});

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

  // Validate mandatory fields and special logic for residency
  const validateFields = () => {
    const errors = {};

    // Mandatory fields: firstName, lastName, email
    if (!tempData?.name?.firstName?.trim()) {
      errors.firstName = "First Name is required.";
    }
    if (!tempData?.name?.lastName?.trim()) {
      errors.lastName = "Last Name is required.";
    }
    if (!tempData?.email?.trim()) {
      errors.email = "Email is required.";
    }

    // Residency logic
    const isResidentOrCitizen = tempData?.residency?.isPermanentResidentOrCitizen;
    const status = tempData?.residency?.status?.trim();
    const visaType = tempData?.residency?.workAuthorization?.visaType?.trim();
    const otherVisaTitle = tempData?.residency?.workAuthorization?.otherVisaTitle?.trim();
    const startDate = tempData?.residency?.workAuthorization?.startDate?.trim();
    const endDate = tempData?.residency?.workAuthorization?.endDate?.trim();
    const optReceipt = tempData?.residency?.workAuthorization?.optReceipt;

    if (isResidentOrCitizen) {
      // If user is permanent resident or citizen, status must be 'Green Card' or 'Citizen'
      if (!["Green Card", "Citizen"].includes(status)) {
        errors.status = "If you are a permanent resident or citizen, please select 'Green Card' or 'Citizen'.";
      }
    } else {
      // If user is not permanent resident or citizen, then visaType is mandatory
      if (!visaType) {
        errors.visaType = "Please choose your work authorization type.";
      }
      // If visaType is 'F1(CPT/OPT)', user must upload OPT Receipt
      if (visaType === "F1(CPT/OPT)") {
        // If optReceipt is null or undefined, add error
        if (!optReceipt) {
          errors.optReceipt = "You must upload your OPT receipt if you choose F1(CPT/OPT).";
        }
      }
      // If visaType is 'Other', otherVisaTitle is mandatory
      if (visaType === "Other" && !otherVisaTitle) {
        errors.otherVisaTitle = "Please specify your visa title if you choose 'Other'.";
      }
      // startDate and endDate are mandatory
      if (!startDate) {
        errors.startDate = "Please provide a start date.";
      }
      if (!endDate) {
        errors.endDate = "Please provide an end date.";
      }
    }

    setValidationErrors(errors);
    // Return true if no errors
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    // Validate fields before sending request
    if (!validateFields()) {
      setError("Please fill all required fields correctly.");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      await axios.put("http://localhost:3000/profileRoutes/profile", tempData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setPersonalInfo(tempData);
      setEditMode(false);
      // Clear errors when saved successfully
      setValidationErrors({});
      setError(null);
    } catch (err) {
      console.error("Failed to save personal information:", err);
      setError("Failed to save changes. Please try again.");
    }
  };

  const renderEditableSection = (label, value, keyPath) => {
    return (
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6">{label}</Typography>
        {editMode ? (
          // Handling special logic for residency; otherwise use a standard TextField
          keyPath === "residency.isPermanentResidentOrCitizen" ? (
            <>
              <Typography variant="body2">Select Yes or No</Typography>
              <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
                <Button
                  variant={tempData.residency.isPermanentResidentOrCitizen ? "contained" : "outlined"}
                  onClick={() =>
                    setTempData((prev) => ({
                      ...prev,
                      residency: {
                        ...prev.residency,
                        isPermanentResidentOrCitizen: true,
                      },
                    }))
                  }
                >
                  Yes
                </Button>
                <Button
                  variant={!tempData.residency.isPermanentResidentOrCitizen ? "contained" : "outlined"}
                  onClick={() =>
                    setTempData((prev) => ({
                      ...prev,
                      residency: {
                        ...prev.residency,
                        isPermanentResidentOrCitizen: false,
                        status: "",
                      },
                    }))
                  }
                >
                  No
                </Button>
              </Box>
            </>
          ) : keyPath === "residency.status" && tempData.residency.isPermanentResidentOrCitizen ? (
            <>
              <Typography variant="body2">Select your status</Typography>
              <Box sx={{ mt: 1 }}>
                <select
                  value={tempData.residency.status}
                  onChange={(e) =>
                    setTempData((prev) => ({
                      ...prev,
                      residency: {
                        ...prev.residency,
                        status: e.target.value,
                      },
                    }))
                  }
                  style={{ padding: "8px" }}
                >
                  <option value="">--Select--</option>
                  <option value="Green Card">Green Card</option>
                  <option value="Citizen">Citizen</option>
                </select>
              </Box>
            </>
          ) : keyPath === "residency.status" && !tempData.residency.isPermanentResidentOrCitizen ? (
            <>
              <TextField
                fullWidth
                disabled
                value={tempData.residency.status}
                onChange={() => {}}
                helperText="(Not applicable if not a permanent resident or citizen)"
              />
            </>
          ) : keyPath === "residency.workAuthorization.visaType" &&
            !tempData.residency.isPermanentResidentOrCitizen ? (
            <>
              <Typography variant="body2">Choose your work authorization</Typography>
              <Box sx={{ mt: 1 }}>
                <select
                  value={tempData.residency.workAuthorization.visaType}
                  onChange={(e) =>
                    setTempData((prev) => ({
                      ...prev,
                      residency: {
                        ...prev.residency,
                        workAuthorization: {
                          ...prev.residency.workAuthorization,
                          visaType: e.target.value,
                          // Reset other fields if changed to avoid leftover data
                          otherVisaTitle:
                            e.target.value === "Other" ? prev.residency.workAuthorization.otherVisaTitle : "",
                          optReceipt: e.target.value === "F1(CPT/OPT)" ? prev.residency.workAuthorization.optReceipt : null,
                        },
                      },
                    }))
                  }
                  style={{ padding: "8px" }}
                >
                  <option value="">--Select--</option>
                  <option value="H1-B">H1-B</option>
                  <option value="L2">L2</option>
                  <option value="F1(CPT/OPT)">F1(CPT/OPT)</option>
                  <option value="H4">H4</option>
                  <option value="Other">Other</option>
                </select>
              </Box>
            </>
          ) : keyPath === "residency.workAuthorization.visaType" &&
            tempData.residency.isPermanentResidentOrCitizen ? (
            <>
              <TextField
                fullWidth
                disabled
                value={tempData.residency.workAuthorization.visaType}
                onChange={() => {}}
                helperText="(Not applicable if permanent resident or citizen)"
              />
            </>
          ) : keyPath === "residency.workAuthorization.otherVisaTitle" ? (
            <>
              <TextField
                fullWidth
                disabled={tempData.residency.workAuthorization.visaType !== "Other"}
                value={value}
                onChange={(e) =>
                  setTempData((prev) => {
                    const updated = { ...prev };
                    updated.residency.workAuthorization.otherVisaTitle = e.target.value;
                    return updated;
                  })
                }
                error={!!validationErrors.otherVisaTitle}
                helperText={
                  tempData.residency.workAuthorization.visaType !== "Other"
                    ? "(Only applicable if 'Other' is selected above)"
                    : validationErrors.otherVisaTitle
                    ? validationErrors.otherVisaTitle
                    : ""
                }
              />
            </>
          ) : keyPath === "residency.workAuthorization.startDate" ||
            keyPath === "residency.workAuthorization.endDate" ? (
            <>
              <TextField
                type="date"
                fullWidth
                disabled={tempData.residency.isPermanentResidentOrCitizen}
                value={value || ""}
                onChange={(e) =>
                  setTempData((prev) => {
                    const updated = { ...prev };
                    const keys = keyPath.split(".");
                    keys.reduce((acc, key, i) => {
                      if (i === keys.length - 1) {
                        acc[key] = e.target.value;
                      } else {
                        return acc[key];
                      }
                      return null; // Just to avoid warnings
                    }, updated);
                    return updated;
                  })
                }
                error={
                  (keyPath.endsWith("startDate") && validationErrors.startDate) ||
                  (keyPath.endsWith("endDate") && validationErrors.endDate)
                    ? true
                    : false
                }
                helperText={
                  keyPath.endsWith("startDate") && validationErrors.startDate
                    ? validationErrors.startDate
                    : keyPath.endsWith("endDate") && validationErrors.endDate
                    ? validationErrors.endDate
                    : ""
                }
              />
            </>
          ) : (
            <TextField
              fullWidth
              value={value || ""}
              onChange={(e) =>
                setTempData((prev) => {
                  const updated = { ...prev };
                  const keys = keyPath.split(".");
                  keys.reduce((acc, key, i) => {
                    if (i === keys.length - 1) acc[key] = e.target.value;
                    else return acc[key];
                    return null;
                  }, updated);
                  return updated;
                })
              }
              error={
                (keyPath === "name.firstName" && validationErrors.firstName) ||
                (keyPath === "name.lastName" && validationErrors.lastName) ||
                (keyPath === "email" && validationErrors.email)
                  ? true
                  : false
              }
              helperText={
                keyPath === "name.firstName" && validationErrors.firstName
                  ? validationErrors.firstName
                  : keyPath === "name.lastName" && validationErrors.lastName
                  ? validationErrors.lastName
                  : keyPath === "email" && validationErrors.email
                  ? validationErrors.email
                  : ""
              }
            />
          )
        ) : (
          <Typography>{value || "N/A"}</Typography>
        )}

        {/* Inline error for certain fields if needed */}
        {editMode && keyPath === "residency.workAuthorization.visaType" && validationErrors.visaType && (
          <Typography color="error" variant="body2">
            {validationErrors.visaType}
          </Typography>
        )}
        {editMode && keyPath === "residency.status" && validationErrors.status && (
          <Typography color="error" variant="body2">
            {validationErrors.status}
          </Typography>
        )}
      </Box>
    );
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <CircularProgress />
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  // Original error handling when not in edit mode
  if (error && !editMode) {
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  // Show error in edit mode as well, but do not return; keep rendering the form
  return (
    <Box sx={{ maxWidth: "800px", margin: "auto", p: 3 }}>
      <Card>
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h4">Personal Information</Typography>
            <Box>
              {!editMode ? (
                <Button startIcon={<EditIcon />} variant="contained" onClick={toggleEditMode}>
                  Edit
                </Button>
              ) : (
                <>
                  <Button startIcon={<SaveIcon />} variant="contained" color="primary" onClick={handleSave}>
                    Save
                  </Button>
                  <Button startIcon={<CancelIcon />} variant="outlined" color="secondary" onClick={handleCancel}>
                    Cancel
                  </Button>
                </>
              )}
            </Box>
          </Box>

          {error && editMode && (
            <Box sx={{ mt: 2 }}>
              <Typography color="error">{error}</Typography>
            </Box>
          )}

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

          {/* Work Authorization if not permanent resident or citizen */}
          {!tempData.residency.isPermanentResidentOrCitizen && (
            <>
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

              {/* If visaType = F1(CPT/OPT), show upload button for OPT Receipt */}
              {editMode && tempData.residency.workAuthorization.visaType === "F1(CPT/OPT)" && (
                <Box sx={{ mt: 2, mb: 2 }}>
                  <Typography variant="body2">Upload your OPT receipt (required for F1(CPT/OPT))</Typography>
                  <Button variant="contained" component="label">
                    Upload OPT Receipt
                    <input
                      type="file"
                      hidden
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const formData = new FormData();
                          formData.append("document", file);
                          axios
                            .post("http://localhost:3000/profileRoutes/profile/uploadDocument", formData, {
                              headers: {
                                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                              },
                            })
                            .then((res) => {
                              // Suppose res.data._id is the newly uploaded document ID
                              setTempData((prev) => {
                                const updated = { ...prev };
                                updated.residency.workAuthorization.optReceipt = res.data._id;
                                return updated;
                              });
                            })
                            .catch((err) => {
                              console.error("Failed to upload OPT receipt:", err);
                            });
                        }
                      }}
                    />
                  </Button>
                  {validationErrors.optReceipt && (
                    <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                      {validationErrors.optReceipt}
                    </Typography>
                  )}
                </Box>
              )}
            </>
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

          {/* Reference section removed as requested */}

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
            <Button variant="contained" component="label">
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