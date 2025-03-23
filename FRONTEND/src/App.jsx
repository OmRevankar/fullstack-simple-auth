import React, { useState } from 'react'
import ButtonComponent from './components/ButtonComponent.jsx'
import { createBrowserRouter, BrowserRouter as Router , Navigate, Route, RouterProvider, Routes } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Dashboard from './pages/Dashboard.jsx'

import UpdateImagePage from './pages/UpdateImagePage.jsx'
import UpdateDetailsPage from './pages/UpdateDetailsPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import LoginPage from './pages/LoginPage.jsx'



const App = () => {

  const userLoggedIn = localStorage.getItem("userLoggedIn");
  console.log("Cookie",document.cookie)

  // if(document.cookie)

  // const [email,setEmail] = useState('');
  // const [fullName,setFullName] = useState(''); 
  // const [username,setUsername] = useState(''); 
  // const [profileImagePath,setProfileImagePath] = useState(''); 

  // const router = createBrowserRouter([

  //   {
  //     path: "/",
  //     element : <Home />
  //   },
  //   {
  //     path: "/dashboard",
  //     // element : <Dashboard email={email} fullName={fullName} username={username} profileImagePath={profileImagePath} setEmail={setEmail} setFullName={setFullName} setUsername={setUsername} setProfileImagePath={setProfileImagePath} />
  //     element : <Dashboard/>
  //   },
  //   {
  //     path: "/register",
  //     element : <RegisterPage />
  //   },
  //   {
  //     path: "/login",
  //     element : <LoginPage />
  //   },
  //   {
  //     path: "/update-image",
  //     element : <UpdateImagePage />
  //   },
  //   {
  //     path: "/update-details",
  //     element : <UpdateDetailsPage />
  //   },
  //   {
  //     path: "*",
  //     element : <div>404 Not Found</div>
  //   }
  
  // ])

  return (
    // <RouterProvider router={router}/>
    <Router>

    <Routes>

        {userLoggedIn==="true" ? (

          <>

            <Route path='/' element={<Navigate to='/dashboard'/>} />
            <Route path='/login' element={<Navigate to='/dashboard'/>} />
            <Route path='/register' element={<Navigate to='/dashboard'/>} />
            <Route path='/update-image' element={<UpdateImagePage/>} />
            <Route path='/dashboard' element={<Dashboard/>} />
            <Route path='/update-details' element={<UpdateDetailsPage/>} />
            <Route path='*' element={<Navigate to='/dashboard'/>} />

          </>

        ) : (

          <>
          
            <Route path='/' element={<Home/>} />
            <Route path='/login' element={<LoginPage/>} />
            <Route path='/register' element={<RegisterPage/>} />
            <Route path='/update-image' element={<Navigate to='/'/>} />
            <Route path='/dashboard' element={<Navigate to='/'/>} />
            <Route path='/update-details' element={<Navigate to='/'/>} />
            <Route path='*' element={<Navigate to='/'/>} />

          </>

        )
      
      }

    </Routes>

  </Router>
  )
}

export default App
