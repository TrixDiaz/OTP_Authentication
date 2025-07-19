import {Route, Routes} from "react-router-dom";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import Otp from "@/pages/auth/otp";
import Pin from "@/pages/auth/pin";
import Password from "@/pages/auth/password";
import OtherWays from "@/pages/auth/other-ways";
import SendCode from "@/pages/auth/send-code";
import ForgotPassword from "./pages/auth/forgot-password";


function App() {

  return (
    <>
      <Routes>
      <Route
            path="/"
            element={<Login/>}
          />
        <Route
            path="/login"
            element={<Login/>}
          />
            <Route
              path="/register"
              element={<Register/>}
            />
            <Route
              path="/otp"
              element={<Otp/>}
            />
            <Route
              path="/pin"
              element={<Pin/>}
            />
            <Route
              path="/password"
              element={<Password/>}
            />
            <Route
              path="/other-ways"
              element={<OtherWays/>}
            />
            <Route
              path="/send-code"
              element={<SendCode/>}
            />
            <Route
              path="/forgot-password"
              element={<ForgotPassword/>}
            />
      </Routes>
    </>
  )
}

export default App
