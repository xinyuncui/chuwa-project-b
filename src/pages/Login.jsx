import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
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
import { setAuthenticated, setUser } from "../redux/authSlice";
import { baseUrl } from "../utils/service";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev); // Toggle password visibility
  };

  const handleSubmit = async (e, formData) => {
    e.preventDefault();
    setError(null);

    try {
      // Send login request to the backend
      const response = await axios.post(`${baseUrl}/auth/login`, {
        username,
        password,
      });

      const { token, user } = response.data; // Backend should return token and user info

      // Save the token to localStorage
      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Dispatch user info to Redux store
      dispatch(setUser(user));
      dispatch(setAuthenticated(true));
      console.log("login success");

      // if application status is approved, redirect to homepage, otherwise redirect to onboarding application page
      //   navigate('/onboardingApplication')
    } catch (err) {
      console.error("Login failed:", err);
      setError(
        err.response?.data?.message || "Failed to log in. Please try again."
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
          Sign In
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
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            variant="outlined"
            margin="normal"
            required
          />
          <TextField
            fullWidth
            type={showPassword ? "text" : "password"}
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
            Sign In
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default Login;
