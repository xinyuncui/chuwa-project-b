import { useSelector } from "react-redux";
import TokenValidator from "./utils/TokenValidator";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NavBar from "./components/NavBar";
import HRSendEmail from "./pages/HRSendEmail";
import PersonalInformationPage from "./pages/PersonalInformation";
import HireManagement from "./pages/HR/HireManagement";
import ErrorPage from "./pages/ErrorPage";
import ProtectedRoute from "./components/ProtectedRoute";
function App() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <>
      <Router>
        {isAuthenticated && <TokenValidator />}
        <NavBar isLoggedIn={isAuthenticated} />
        <Container>
          <Routes>
            {/* <Route path="/" element={} /> */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup/:token" element={<Signup />} />

            {/* Protected Route for Employee */}
            <Route
              path="/personal-information"
              element={
                <ProtectedRoute allowedRole={"EMPLOYEE"}>
                  <PersonalInformationPage />
                </ProtectedRoute>
              }
            />

            {/* Protected Route for HR */}
            <Route
              path="/hiring-management"
              element={
                <ProtectedRoute allowedRole={"HR"}>
                  <HireManagement />
                </ProtectedRoute>
              }
            />

            <Route path="/error" element={<ErrorPage />} />
          </Routes>
        </Container>
      </Router>
    </>
  );
}

export default App;
