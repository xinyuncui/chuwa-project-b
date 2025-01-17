import React, { useState } from "react";
import { baseUrl } from "../utils/service";
import axios from "axios";
import { TextField, Button, Box, Typography } from "@mui/material";

const HRSendEmail = () => {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    setSuccess(false);
    try {
      await axios.post(`${baseUrl}/hr/send-registration-email`, {
        email,
      });
      setSuccess(true);
    } catch (error) {
      console.error(error);
      alert("Failed to send email");
    }
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        width: "100%",
        maxWidth: 400,
        margin: "auto",
        mt: 4,
      }}
    >
      <TextField
        label="Employee Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your HR email"
        fullWidth
        required
        variant="outlined"
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={!email}
      >
        Send Email
      </Button>
      {success && <Typography>Email sent successfully</Typography>}
    </Box>
  );
};

export default HRSendEmail;
