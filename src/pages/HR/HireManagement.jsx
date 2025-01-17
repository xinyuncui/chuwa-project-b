import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import axios from "axios";
import { baseUrl } from "../../utils/service";

const HireManagement = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [history, setHistory] = useState([]);

  //   const history = [
  //     {
  //       email: "john.doe@example.com",
  //       link: "http://example.",
  //       status: "unsubmitted",
  //     },
  //     {
  //       email: "jane.doe@example.com",
  //       link: "http://example.",
  //       status: "submitted",
  //     },
  //     {
  //       email: "jack.doe@example.com",
  //       link: "http://example.",
  //       status: "submitted",
  //     },
  //     {
  //       email: "john.doe@example.com",
  //       link: "http://example.",
  //       status: "unsubmitted",
  //     },
  //     {
  //       email: "jane.doe@example.com",
  //       link: "http://example.",
  //       status: "submitted",
  //     },
  //     {
  //       email: "jack.doe@example.com",
  //       link: "http://example.",
  //       status: "submitted",
  //     },
  //   ];

  // fetch backend api
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
      console.log(data.history);
      setHistory(data.history);
      console.log(history);
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
  }, []);

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
    </Box>
  );
};

export default HireManagement;
