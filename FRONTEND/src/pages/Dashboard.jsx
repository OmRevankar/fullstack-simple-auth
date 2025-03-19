import React from 'react'
import ButtonComponent from '../components/ButtonComponent'

const Dashboard = () => {
  return (
    <div className='flex flex-row'>
      <ButtonComponent name="LOGOUT" />
      <ButtonComponent name="EDIT PROFILE"/>
    </div>
  )
}

export default Dashboard
