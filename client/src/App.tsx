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
import { ProtectedRoute, PublicRoute, AuthInitializer } from "@/components/RouteGuards"

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: "/login",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: "/register",
    element: (
      <PublicRoute>
        <Register />
      </PublicRoute>
    ),
  },
  {
    path: "/otp",
    element: (
      <PublicRoute>
        <Otp />
      </PublicRoute>
    ),
  },
  {
    path: "/pin",
    element: (
      <PublicRoute>
        <Pin />
      </PublicRoute>
    ),
  },
  {
    path: "/password",
    element: (
      <PublicRoute>
        <Password />
      </PublicRoute>
    ),
  },
  {
    path: "/other-ways",
    element: (
      <PublicRoute>
        <OtherWays />
      </PublicRoute>
    ),
  },
  {
    path: "/send-code",
    element: (
      <PublicRoute>
        <SendCode />
      </PublicRoute>
    ),
  },
  {
    path: "/forgot-password",
    element: (
      <PublicRoute>
        <ForgotPassword />
      </PublicRoute>
    ),
  },
  {
    path: "/home",
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
  },
]);

function App() {
  return (
    <AuthInitializer>
      <TooltipProvider>
        <RouterProvider router={router} />
        <Toaster />
      </TooltipProvider>
    </AuthInitializer>
  )
}

export default App
