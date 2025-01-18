import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "./service";
import { setUser, setAuthenticated, logout } from "../redux/authSlice";

const TokenValidator = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const checkLoginStatus = async () => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const response = await axios.post(
          `${baseUrl}/auth/refresh`,
          {}, // No request body
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = response.data;
        console.log("Token validation response:", data);

        if (data.valid) {
          // dispatch user data to redux
          dispatch(setUser({ user: data.user, token }));
          dispatch(setAuthenticated(true));
        } else {
          handleLogout();
        }
      } catch (err) {
        console.error("Error verifying token:", err);
        handleLogout();
      }
    } else {
      handleLogout();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    dispatch(logout());
    navigate("/login");
  };

  useEffect(() => {
    if (!isAuthenticated) {
      console.log("Running TokenValidator...");
      checkLoginStatus();
    }
  }, [isAuthenticated, dispatch]);

  return null; // This component doesn't render anything
};

export default TokenValidator;