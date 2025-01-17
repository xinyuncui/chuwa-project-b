import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "./service";
import { setUser, setAuthenticated, logout } from "../redux/authSlice";
// handle page refersh, token validation and sesseion management
const TokenValidator = () => {
  console.log("refersh");
  const dispatch = useDispatch();
  const navigate = useNavigate();
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

        if (data.valid) {
          // dispatch user data to redux
          dispatch(setUser(data.user));
          dispatch(setAuthenticated(true));
        } else {
          localStorage.removeItem("authToken");
          localStorage.removeItem("user");
          // dispatch, clear user in redux store
          dispatch(logout());
          navigate("/login"); // Redirect
        }
      } catch (err) {
        console.error("Error verifying token:", err);
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        navigate("/login"); // Redirect
        // dispatch, clear user in redux store
        //-----code----
      }
    } else {
      navigate("/login"); // Redirect
    }
  };

  useEffect(() => {
    checkLoginStatus();
  }, [dispatch]);

  //   if (loading) {
  //     return <div>Loading...</div>;
  //   }

  return null; // This component doesn't render anything once done
};

export default TokenValidator;
