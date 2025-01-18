import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Button,
  TextField,
  Typography,
  Box,
  Container,
  Alert,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import { baseUrl } from "../utils/service";

const SignUp = () => {
  const navigate = useNavigate();
  const { token } = useParams(); // extract token from frontend url
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
  });
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const { email, password, username } = formData;
      // Send registration request to the backend
      const response = await axios.post(`${baseUrl}/auth/signup/${token}`, {
        email,
        password,
        username,
      });

      if (response.status === 201) {
        console.log("Registration successful:", response.data);
        navigate("/login");
      }

      // Redirect or show success message
      // navigate('/dashboard')
    } catch (err) {
      console.error("Registration failed:", err);
      setError(
        err.response?.data?.message || "Failed to register. Please try again."
      );
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          padding: 3,
          border: "1px solid #ddd",
          borderRadius: "8px",
          boxShadow: 2,
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Sign Up
        </Typography>
        {error && (
          <Alert severity="error" sx={{ marginBottom: 2 }}>
            {error}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username"
            value={formData.username}
            name="username"
            onChange={handleChange}
            variant="outlined"
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={formData.email}
            name="email"
            onChange={handleChange}
            variant="outlined"
            margin="normal"
            required
          />
          <TextField
            fullWidth
            type={showPassword ? "text" : "password"}
            label="Password"
            value={formData.password}
            name="password"
            onChange={handleChange}
            variant="outlined"
            margin="normal"
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleTogglePassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ marginTop: 2 }}
          >
            Sign Up
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default SignUp;
