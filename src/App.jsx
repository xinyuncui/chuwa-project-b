import { useSelector } from "react-redux";
import TokenValidator from "./utils/TokenValidator";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NavBar from "./components/NavBar";
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
          </Routes>
        </Container>
      </Router>
    </>
  );
}

export default App;
