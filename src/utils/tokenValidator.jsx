import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { baseUrl } from "./service";
// handle page refersh, token validation and sesseion management
const TokenValidator = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const checkLoginStatus = async () => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const response = await axios.post(
          `${baseUrl}/auth/verifyToken`,
          {}, // No request body
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (data.valid) {
          // dispatch user data to redux
          //-----code----
        } else {
          localStorage.removeItem("authToken");
          // dispatch, clear user in redux store
          //-----code----
          window.location.href = "/login"; // Redirect if invalid token
        }
      } catch (err) {
        console.error("Error verifying token:", err);
        window.location.href = "/login";
        // dispatch, clear user in redux store
        //-----code----
      }
    } else {
      // dispatch, clear user in redux store
      //-----code----
      window.location.href = "/login"; // Redirect if no token
    }
    setLoading(false);
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return null; // This component doesn't render anything once done
};

export default TokenValidator;
