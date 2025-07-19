import { createBrowserRouter, RouterProvider } from 'react-router'
import Login from "@/pages/auth/Login"
import Register from "@/pages/auth/Register"
import Otp from "@/pages/auth/otp"
import Pin from "@/pages/auth/pin"
import Password from "@/pages/auth/password"
import OtherWays from "@/pages/auth/other-ways"
import SendCode from "@/pages/auth/send-code"
import ForgotPassword from "@/pages/auth/forgot-password"
import Home from "@/pages/Home"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/otp",
    element: <Otp />,
  },
  {
    path: "/pin",
    element: <Pin />,
  },
  {
    path: "/password",
    element: <Password />,
  },
  {
    path: "/other-ways",
    element: <OtherWays />,
  },
  {
    path: "/send-code",
    element: <SendCode />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/dashboard",
    element: <Home />,
  },
]);

function App() {
  return (
    <TooltipProvider>
      <RouterProvider router={router} />
      <Toaster />
    </TooltipProvider>
  )
}

export default App
