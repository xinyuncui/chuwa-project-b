import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
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
} from "@mui/material";
import axios from "axios";
import { baseUrl } from "../../utils/service";
import { fetchApplications } from "../../redux/applicationStatusSlice";
// import { fetchHistory } from "../../redux/registrationHistorySlice";

const HireManagement = () => {
  const dispatch = useDispatch();
  // const navigate = useNavigate();

  const { all, pending, rejected, approved, isloading, error } = useSelector(
    (state) => state.applicationStatus
  );
  // console.log("redux store:", pending, rejected, approved);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [history, setHistory] = useState([]);

  const fetchHistory = async () => {
    setFetching(true);
    console.log("start to fetch");
    try {
      const response = await axios.get(
        `${baseUrl}/hr/get-registration-history`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      const data = response.data;
      console.log("history:", data.history);
      setHistory(data.history);
    } catch (e) {
      console.error(e);
      alert("Failed to fetch history:", e.message);
    } finally {
      setFetching(false);
    }
  };

  // fetch history on component mount
  useEffect(() => {
    fetchHistory();
    // fetchApplication();
  }, []);

  useEffect(() => {
    dispatch(fetchApplications());
    // dispatch(fetchHistory());
  }, [dispatch]);

  // handle send email link
  const handleSubmit = async () => {
    setLoading(true);
    try {
      await axios.post(`${baseUrl}/hr/send-registration-email`, {
        email,
      });
      fetchHistory();
      setEmail("");
    } catch (error) {
      console.error(error);
      alert("Failed to send email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: "600px", margin: "auto" }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Registration Link
      </Typography>

      {/* Email Input Section */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <TextField
          label="Enter email address"
          variant="outlined"
          size="small"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={loading}
          sx={{ whiteSpace: "nowrap" }}
        >
          {loading ? <CircularProgress size={24} /> : "Generate Link"}
        </Button>
      </Box>

      {/* History Table */}
      <TableContainer
        component={Paper}
        sx={{
          maxHeight: 300, // Fixed height for scrollable area
          overflowY: "auto",
          mb: 3,
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>Link</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fetching ? (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  <CircularProgress size={24} />
                </TableCell>
              </TableRow>
            ) : history.length > 0 ? (
              history.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>
                    <a
                      href={row.registrationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        wordBreak: "break-word", // Break long words
                        whiteSpace: "normal", // Allow wrapping
                      }}
                    >
                      {row.registrationLink}
                    </a>
                  </TableCell>
                  <TableCell>{row.registrationStatus}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No history available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pending Applications */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        Pending Applications
      </Typography>
      <TableContainer
        component={Paper}
        sx={{ maxHeight: 300, overflowY: "auto", mb: 3 }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: "33%" }}>Full Name</TableCell>
              <TableCell sx={{ width: "33%" }}>Email</TableCell>
              <TableCell sx={{ width: "34%" }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isloading ? (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  <CircularProgress size={24} />
                </TableCell>
              </TableRow>
            ) : pending.length > 0 ? (
              pending.map((app) => (
                <TableRow key={app._id}>
                  <TableCell sx={{ width: "33%" }}>
                    {app.user.profile.name.firstName +
                      app.user.profile.name.lastName}
                  </TableCell>
                  <TableCell sx={{ width: "33%" }}>{app.user.email}</TableCell>
                  <TableCell sx={{ width: "34%" }}>
                    <Button
                      variant="contained"
                      onClick={() =>
                        window.open(
                          `/view-application/?userId=${app.user._id}&appId=${app._id}`,
                          "_blank",
                          "noopener,noreferrer"
                        )
                      }
                    >
                      View Application
                    </Button>
                    {/* <Button onClick={() => handleApprove(app.id)}>Approve</Button>
                    <Button onClick={() => handleOpenFeedbackDialog(app)}>
                      Reject
                    </Button> */}
                  </TableCell>
                </TableRow>
              ))
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

      {/* Approved Applications */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        Approved Applications
      </Typography>
      <TableContainer
        component={Paper}
        sx={{ maxHeight: 300, overflowY: "auto", mb: 3 }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: "33%" }}>Full Name</TableCell>
              <TableCell sx={{ width: "33%" }}>Email</TableCell>
              <TableCell sx={{ width: "33%" }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {approved.length > 0 ? (
              approved.map((app) => (
                <TableRow key={app._id}>
                  <TableCell sx={{ width: "33%" }}>
                    {app.user.profile.name.firstName +
                      app.user.profile.name.lastName}
                  </TableCell>
                  <TableCell sx={{ width: "33%" }}>{app.user.email}</TableCell>
                  <TableCell sx={{ width: "34%" }}>
                    <Button variant="contained" disabled>
                      View Application
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No approved applications
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Rejected Applications */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        Rejected Applications
      </Typography>
      <TableContainer
        component={Paper}
        sx={{ maxHeight: 300, overflowY: "auto", mb: 3 }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: "33%" }}>Full Name</TableCell>
              <TableCell sx={{ width: "33%" }}>Email</TableCell>
              <TableCell sx={{ width: "34%" }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rejected.length > 0 ? (
              rejected.map((app) => (
                <TableRow key={app._id}>
                  <TableCell sx={{ width: "33%" }}>
                    {app.user.profile.name.firstName +
                      app.user.profile.name.lastName}
                  </TableCell>
                  <TableCell sx={{ width: "33%" }}>{app.user.email}</TableCell>
                  <TableCell sx={{ width: "34%" }}>
                    <Button variant="contained" disabled>
                      View Application
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No rejected applications
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Feedback Dialog */}
      {/* <Dialog open={openFeedbackDialog} onClose={handleCloseFeedbackDialog}>
        <DialogTitle>Provide Feedback</DialogTitle>
        <DialogContent>
          <TextareaAutosize
            minRows={3}
            placeholder="Provide feedback"
            style={{ width: "100%" }}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseFeedbackDialog}>Cancel</Button>
          <Button
            onClick={() => handleReject(selectedApplication.id)}
            color="secondary"
            disabled={!feedback}
          >
            Reject
          </Button>
        </DialogActions>
      </Dialog> */}
    </Box>
  );
};

export default HireManagement;
