import React from 'react'
import { useForm } from "react-hook-form"
import { BACKEND_URL } from '../constants'
import toast, { Toaster } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const UpdateDetailsPage = () => {

  const navigate = useNavigate();

  const {
      register,
      handleSubmit,
      watch,
      reset,
      formState: { errors , isSubmitting},
    } = useForm()

    const onSubmit = async (data)=>{

      const formDataInJson = JSON.stringify({
        username:data.username,
        fullName:data.fullName,
        email:data.email
      })

      return fetch(`${BACKEND_URL}/update-details`,
        {
          method:"PATCH",
          credentials:"include",
          headers: {
            "Content-Type": "application/json",  // Important!
          },
          body:formDataInJson
        }
      )
      .then( (response) => response.json() )
      .then( (data) => {
        console.log(data);

        if(data.statusCode==200)
        {
          toast.success(data.message);
          navigate("/dashboard")
        }
        else
        {
          toast.error(data.message);
        }

      } )
      .catch( (error)=>{

        console.log(error);
        toast.error(error.message);

      }  )


    }

  return (
    <div className='min-h-screen bg-green-50 flex items-center justify-center p-4'>
      <Toaster/>
      <form onSubmit={handleSubmit(onSubmit)} className='bg-white p-8 rounded-lg shadow-lg max-w-md w-full space-y-6'>
        <h2 className='text-2xl font-bold text-green-700 text-center mb-6'>Update Profile Details</h2>

        <div className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Full Name</label>
            <input 
              type="text" 
              className='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500'
              {...register('fullName', {
                required: true,
                minLength: { value: 2, message: "Minimum length of should be 2" },
                maxLength: { value: 15, message: "Name should not exceed 15 letters" }
              })} 
            />
            {errors.fullName && <p className='text-red-500 text-sm mt-1'>{errors.fullName.message}</p>}
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Email</label>
            <input 
              type="text" 
              className='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500'
              {...register('email', {
                required: true,
                pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: "Email is not valid" }
              })} 
            />
            {errors.email && <p className='text-red-500 text-sm mt-1'>{errors.email.message}</p>}
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Username</label>
            <input 
              type="text" 
              className='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500'
              {...register('username', {
                required: true,
                pattern: { value: /^[a-z0-9._]{3,20}$/, message: "Username must be lowercase , minimum 3 characters and only . _ are allowed for speacial characters" }
              })} 
            />
            {errors.username && <p className='text-red-500 text-sm mt-1'>{errors.username.message}</p>}
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting} 
          className='w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:bg-green-300'
        >
          {isSubmitting ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  )
}

export default UpdateDetailsPage
