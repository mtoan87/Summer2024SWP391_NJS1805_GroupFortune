import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ForgotPasswordForm from "./ForgotForm";
import VerifyCodeForm from "./VerifyCodeForm";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/forgot-password" element={<ForgotPasswordForm />} />
        <Route path="/verify-code" element={<VerifyCodeForm />} />
      </Routes>
    </Router>
  );
};

export default App;
