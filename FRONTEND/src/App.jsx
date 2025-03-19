import React from 'react'
import ButtonComponent from './components/ButtonComponent.jsx'
import { createBrowserRouter, RouterProvider } from "react-router"
import Home from './pages/Home.jsx'
import Dashboard from './pages/Dashboard.jsx'
import LogoutPage from './pages/LogoutPage.jsx'
import UpdatePage from './pages/UpdatePage.jsx'
import UpdateImagePage from './pages/UpdateImagePage.jsx'
import UpdateDetailsPage from './pages/UpdateDetailsPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import LoginPage from './pages/LoginPage.jsx'

const router = createBrowserRouter([

  {
    path: "/",
    element : <Home />
  },
  {
    path: "/dashboard",
    element : <Dashboard />
  },
  {
    path: "/register",
    element : <RegisterPage />
  },
  {
    path: "/login",
    element : <LoginPage />
  },
  {
    path: "/logout",
    element : <LogoutPage />
  },
  {
    path: "/update",
    element : <UpdatePage />
  },
  {
    path: "/update-image",
    element : <UpdateImagePage />
  },
  {
    path: "/update-details",
    element : <UpdateDetailsPage />
  }

])

const App = () => {
  return (
    <RouterProvider router={router}>
      <Home />
    </RouterProvider>
  )
}

export default App
