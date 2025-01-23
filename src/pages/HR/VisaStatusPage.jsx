import {
  Box,
  TextField,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputLabel,
  Link,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchApplications } from "../../redux/applicationStatusSlice";
import axios from "axios";
import { baseUrl } from "../../utils/service";
const HRVisaStatusManagementPage = () => {
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false); // Dialog open state
  const [feedback, setFeedback] = useState(""); // Feedback input state
  const [searchQuery, setSearchQuery] = useState("");
  const { all, loading } = useSelector((state) => state.applicationStatus);
  console.log("all:", all);
  const currentDate = new Date();

  // Open feedback dialog
  const handleOpen = () => {
    setOpen(true);
  };

  // Close feedback dialog
  const handleClose = () => {
    setOpen(false);
    setFeedback(""); // Reset feedback when closing
  };

  useEffect(() => {
    dispatch(fetchApplications());
    // dispatch(fetchHistory());
  }, [dispatch]);

  //   const pending = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  const nextStep = {
    OPTReceipt: "upload OPT EAD",
    OPTEAD: "upload I-983",
    I983: "upload I-20",
    I20: "all set",
  };

  const handleApprove = async (docId) => {
    try {
      const response = await axios.put(
        `${baseUrl}/document/approve/${docId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      console.log("Document approved successfully:", response.data);
      dispatch(fetchApplications());
    } catch (e) {
      console.log("Failed to approve doc.");
      console.error(e);
    }
  };

  const handleReject = async (docId) => {
    try {
      const response = await axios.put(
        `${baseUrl}/document/reject/${docId}`,
        { feedback },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      console.log("Document reject successfully:", response.data);
      dispatch(fetchApplications());
    } catch (e) {
      console.log("Failed to reject doc.");
      console.error(e);
    } finally {
      setFeedback("");
      setOpen(false);
    }
  };

  const handleSendNotification = async (email, message) => {
    try {
      await axios.post(`${baseUrl}/hr/send-notification-email`, {
        email,
        message,
      });
      console.log("Notification sent successfully.");
    } catch (e) {
      console.log("Failed to send notification.");
      console.error(e);
    }
  };

  const filteredApplications = all.filter((app) => {
    const fullName =
      app.user.profile.name.firstName.toLowerCase() +
      " " +
      app.user.profile.name.lastName.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  return (
    <Box sx={{ p: 3, maxWidth: "900px", margin: "auto" }}>
      {/* Pending Applications */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        In Progress
      </Typography>
      <TableContainer
        component={Paper}
        sx={{ maxHeight: 300, overflowY: "auto", mb: 3 }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: "20%" }}>Full Name</TableCell>
              <TableCell sx={{ width: "15%" }}>VisaTitle</TableCell>
              <TableCell sx={{ width: "25%" }}>Start/End Date</TableCell>
              <TableCell sx={{ width: "15%" }}>Remaining Days</TableCell>
              <TableCell sx={{ width: "25%" }}>Next Step</TableCell>
              <TableCell sx={{ width: "20%" }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  <CircularProgress size={24} />
                </TableCell>
              </TableRow>
            ) : all.length > 0 ? (
              all.map((app, i) =>
                app.visaType === "OPT" ? (
                  <TableRow key={i}>
                    <TableCell sx={{ width: "20%" }}>
                      {app.user.profile.name.firstName +
                        " " +
                        app.user.profile.name.lastName}
                    </TableCell>
                    <TableCell sx={{ width: "15%" }}>{app.visaType}</TableCell>
                    <TableCell sx={{ width: "25%" }}>
                      {app.user.profile.residency.workAuthorization.startDate} -{" "}
                      {app.user.profile.residency.workAuthorization.endDate}
                    </TableCell>
                    <TableCell sx={{ width: "10%" }}>
                      {Math.ceil(
                        (new Date(
                          app.user.profile.residency.workAuthorization.endDate
                        ) -
                          currentDate) /
                          (1000 * 60 * 60 * 24)
                      )}
                    </TableCell>
                    <TableCell sx={{ width: "30%" }}>
                      {app.documents && app.documents.length > 0
                        ? (() => {
                            const lastDoc =
                              app.documents[app.documents.length - 1];
                            // console.log(lastDoc.status);
                            switch (lastDoc.status) {
                              case "Pending":
                                return "waiting for HR approval";
                              case "Approved":
                                // console.log("current file is" + lastDoc.step);
                                // console.log(
                                //   "next file is" + nextStep[lastDoc.step]
                                // );
                                return nextStep[lastDoc.step] || "All Set";
                              case "Rejected":
                                return "re-upload " + lastDoc.step;
                              default:
                                return "Unknown status";
                            }
                          })()
                        : "upload OPT Receipt"}
                    </TableCell>
                    {/* action column */}
                    <TableCell sx={{ width: "20%" }}>
                      {app.documents && app.documents.length > 0 ? (
                        (() => {
                          const lastDoc =
                            app.documents[app.documents.length - 1];
                          switch (lastDoc.status) {
                            case "Pending":
                              return (
                                <>
                                  <Button
                                    variant="outlined"
                                    size="small"
                                    sx={{ marginBottom: 1 }}
                                    component="a"
                                    href={
                                      baseUrl +
                                      "/document/preview/" +
                                      lastDoc._id
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    Preview
                                  </Button>

                                  {/* Bottom section: Approve/Reject */}
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                    }}
                                  >
                                    <Button
                                      variant="contained"
                                      color="success"
                                      size="small"
                                      onClick={() => handleApprove(lastDoc._id)}
                                    >
                                      Approve
                                    </Button>
                                    <Button
                                      variant="contained"
                                      color="error"
                                      size="small"
                                      onClick={handleOpen}
                                    >
                                      Reject
                                    </Button>
                                  </div>
                                  {/* Feedback Dialog */}
                                  <Dialog open={open} onClose={handleClose}>
                                    <DialogTitle>Reject Document</DialogTitle>
                                    <DialogContent>
                                      <DialogContentText>
                                        Please provide feedback for rejecting
                                        this document.
                                      </DialogContentText>
                                      <TextField
                                        autoFocus
                                        margin="dense"
                                        label="Feedback"
                                        fullWidth
                                        multiline
                                        rows={4}
                                        variant="outlined"
                                        value={feedback}
                                        onChange={(e) =>
                                          setFeedback(e.target.value)
                                        }
                                      />
                                    </DialogContent>
                                    <DialogActions>
                                      <Button
                                        onClick={handleClose}
                                        color="secondary"
                                      >
                                        Cancel
                                      </Button>
                                      <Button
                                        onClick={() =>
                                          handleReject(lastDoc._id)
                                        }
                                        variant="contained"
                                        color="error"
                                        disabled={!feedback.trim()} // Disable if feedback is empty
                                      >
                                        Submit
                                      </Button>
                                    </DialogActions>
                                  </Dialog>
                                </>
                              );
                            case "Approved":
                              return (
                                <Button
                                  variant="contained"
                                  color="primary"
                                  size="small"
                                  onClick={() =>
                                    handleSendNotification(
                                      app.user.email,
                                      nextStep[lastDoc.type]
                                    )
                                  }
                                >
                                  Send Notification
                                </Button>
                              );
                            default:
                              return null;
                          }
                        })()
                      ) : (
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() =>
                            handleSendNotification(
                              app.user.email,
                              "OPT Receipt"
                            )
                          }
                        >
                          Send Notification
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ) : null
              )
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No pending applications
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* all emplyee status */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        Visa Status
      </Typography>
      {/* Search Bar */}
      <TextField
        label="Search by Name"
        variant="outlined"
        fullWidth
        sx={{ mb: 3 }}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <TableContainer
        component={Paper}
        sx={{ maxHeight: 300, overflowY: "auto", mb: 3 }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: "20%" }}>Full Name</TableCell>
              <TableCell sx={{ width: "15%" }}>VisaTitle</TableCell>
              <TableCell sx={{ width: "25%" }}>Start/End Date</TableCell>
              <TableCell sx={{ width: "15%" }}>Remaining Days</TableCell>
              <TableCell sx={{ width: "20%" }}>Next Step</TableCell>
              <TableCell sx={{ width: "30%" }}>Documents</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  <CircularProgress size={24} />
                </TableCell>
              </TableRow>
            ) : filteredApplications.length > 0 ? (
              filteredApplications.map((app, i) => (
                <TableRow key={i}>
                  <TableCell sx={{ width: "20%" }}>
                    {app.user.profile.name.firstName +
                      " " +
                      app.user.profile.name.lastName}
                  </TableCell>
                  <TableCell sx={{ width: "15%" }}>{app.visaType}</TableCell>
                  <TableCell sx={{ width: "25%" }}>
                    {app.user.profile.residency.workAuthorization.startDate} -{" "}
                    {app.user.profile.residency.workAuthorization.endDate}
                  </TableCell>
                  <TableCell sx={{ width: "10%" }}>
                    {Math.ceil(
                      (new Date(
                        app.user.profile.residency.workAuthorization.endDate
                      ) -
                        currentDate) /
                        (1000 * 60 * 60 * 24)
                    )}
                  </TableCell>
                  {/* next step */}
                  <TableCell sx={{ width: "20%" }}>
                    {app.visaType === "OPT" &&
                    app.documents &&
                    app.documents.length > 0
                      ? (() => {
                          const lastDoc =
                            app.documents[app.documents.length - 1];
                          // console.log(lastDoc.status);
                          switch (lastDoc.status) {
                            case "Pending":
                              return "waiting for HR approval";
                            case "Approved":
                              // console.log(
                              //   "Approved for next step",
                              //   nextStep[lastDoc.step]
                              // );
                              return nextStep[lastDoc.step] || "All Set";
                            case "Rejected":
                              return "re-upload " + lastDoc.step;
                            default:
                              return "Unknown status";
                          }
                        })()
                      : app.visaType === "OPT"
                      ? "upload OPT Receipt"
                      : null}
                  </TableCell>

                  {/* document column */}

                  <TableCell sx={{ width: "30%" }}>
                    {app.documents && app.documents.length > 0
                      ? app.documents
                          .filter((doc) => doc.status === "Approved")
                          .map((doc, index) => (
                            <div
                              key={index}
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                gap: "15px",
                              }}
                            >
                              {/* preview link */}
                              <Link
                                href={`${baseUrl}/document/preview/${doc._id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {doc.step}
                              </Link>
                              {/* download */}
                              <Link
                                href={`${baseUrl}/document/download/${doc._id}`}
                                download={doc.step}
                                style={{
                                  textDecoration: "none",
                                  color: "#007BFF",
                                }}
                              >
                                <DownloadIcon />
                              </Link>
                            </div>
                          ))
                      : null}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No records found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
export default HRVisaStatusManagementPage;
