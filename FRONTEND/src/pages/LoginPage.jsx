import React from 'react'
import { useForm } from "react-hook-form"
import { BACKEND_URL } from '../constants'
import toast, { Toaster } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const loginPage = () => {

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors , isSubmitting},
  } = useForm()


  const onSubmit = async (data) =>{

    // const formData = new FormData();
    // formData.append("email",data.email);
    // formData.append("username",data.username);
    // formData.append("password",data.password);

    const formDataInJson = JSON.stringify({
      username:data.username,
      email:data.email,
      password:data.password
    })

    return fetch(`${BACKEND_URL}/login`,{
      method : "POST",
      credentials:"include",
      headers: {
        "Content-Type": "application/json",  // Important!
      },
      body:formDataInJson
    })
    .then( (response) => response.json() )
    .then( (data) => {

      console.log(data)
      if(data.statusCode == 200)
      {
        localStorage.setItem("userLoggedIn",true);
        toast.success(data.message);
        // navigate('/dashboard');
        window.location.href = './dashboard'
      }
      else
        toast.error(data.message)

    } )
    .catch((error) => {
      toast.error(error.message);
      console.log(error);
    })

  }

  return (
    <div className='min-h-screen bg-green-50 flex items-center justify-center p-4'>
      <Toaster />
      <form onSubmit={handleSubmit(onSubmit)} className='bg-white p-8 rounded-lg shadow-lg max-w-md w-full'>

        <div className='space-y-4 mb-6'>

          <label className='block text-sm font-medium text-gray-700 mb-1'>Email</label> <br />
          <input type="text" {...register("email",{
            pattern:{value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: "Email is not valid"}
          })} className='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500'/>

          {errors.email && <p className='text-red-500 text-sm mt-1'>{errors.email.message}</p>}

        </div>

        <br /><br />

        <div className='space-y-4 mb-6'>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Username</label> <br />
          <input type="text" {...register('username',
            {
              required: true,
              pattern: { value: /^[a-z0-9._]{3,20}$/, message: "Username must be lowercase , minimum 3 characters and only . _ are allowed for speacial characters" }
            }
          )} className='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500'/>
          {errors.username && <p className='text-red-500 text-sm mt-1'>{errors.username.message}</p>}
        </div>

        <br /><br />

        <div className='space-y-4 mb-6'>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Password</label> <br />
          <input type="text" {...register('password',
            {
              required: true,
              pattern: { value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/, message: "Password doesnt satisfy criteria" }
            }
          )} className='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500'/>
          {errors.password && <p className='text-red-500 text-sm mt-1'>{errors.password.message}</p>}
        </div>

        <br /><br />

        <input type="submit" disabled={isSubmitting} value={isSubmitting?"Login in Process":"Login"} className='w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:bg-green-300'/>

      </form>
    </div>
  )
}

export default loginPage
