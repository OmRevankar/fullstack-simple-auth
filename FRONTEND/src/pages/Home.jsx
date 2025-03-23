import React from 'react'
import ButtonComponent from '../components/ButtonComponent.jsx'
import { NavLink } from 'react-router-dom'

const Home = () => {
  return (
    <div className='min-h-screen bg-green-50 flex flex-col items-center justify-center'>
      <div className='bg-white p-8 rounded-lg shadow-lg'>
        <h1 className='text-3xl font-bold text-green-700 mb-8 text-center'>Welcome</h1>
        <div className='flex flex-col sm:flex-row gap-4'>
          <NavLink to='/register'>
            <ButtonComponent name="REGISTER" />
          </NavLink>
          <NavLink to='/login'>
            <ButtonComponent name="LOGIN" />
          </NavLink>
        </div>
      </div>
    </div>
  )
}

export default Home
