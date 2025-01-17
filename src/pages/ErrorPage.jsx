import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
const ErrorPage = () => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        // margin: "64 145px",
        padding: "24px",
        // border: "1px solid black",
        height: "400px",
        width: "800px",
        backgroundColor: "white",
        borderRadius: "16px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Typography variant="h6">
        Oops! Something went wrong. You are not allowed to visit
      </Typography>
      <Box sx={{ margin: "24px 0" }}>
        <Button variant="contained" onClick={() => navigate("/")}>
          Go Back Home
        </Button>
      </Box>
    </Box>
  );
};

export default ErrorPage;
