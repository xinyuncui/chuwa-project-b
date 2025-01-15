import { useSelector } from "react-redux";
import TokenValidator from "./utils/TokenValidator";

function App() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  return (
    <>
      <TokenValidator />
    </>
  );
}

export default App;
