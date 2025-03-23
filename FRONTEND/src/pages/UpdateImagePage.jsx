import { Avatar } from '@mui/material'
import React, { useState } from 'react'
import { useForm } from "react-hook-form"
import { BACKEND_URL } from '../constants'
import toast, { Toaster } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const UpdateImagePage = () => {

  const[previewImg,setPreviewImg] = useState();

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors , isSubmitting},
  } = useForm()

  const onSubmit = async (data)=>{

    const formData = new FormData();
    
    formData.append("profileImage",data.profileImage[0]);

    return fetch(`${BACKEND_URL}/update-profile-image`,{
      method:"PATCH",
      credentials:"include",
      body:formData
    })
    .then( (response) => response.json() )
    .then( (data) => {

      console.log(data);

      if(data.statusCode == 200)
      {
        toast.success(data.message);
        navigate("/dashboard");
      }
      else
      {
        toast.error(data.message);
      }

    } )
    .catch( (error) => {
      console.log(error);
      toast.error(error.message);
    })

  }

  const handleImageChange = (e)=>{

    const file = e.target.files[0];

    if(file)
      setPreviewImg(URL.createObjectURL(file));

  }

  return (
    <div className='min-h-screen bg-green-50 flex items-center justify-center p-4'>
      <Toaster/>
      <form onSubmit={handleSubmit(onSubmit)} className='bg-white p-8 rounded-lg shadow-lg max-w-md w-full'>
        <h2 className='text-2xl font-bold text-green-700 text-center mb-6'>Update Profile Picture</h2>
        
        <div className='space-y-4'>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Choose Profile Image</label>
          <input 
            type="file" 
            accept='image/*' 
            className='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100'
            {...register('profileImage', {required:{value:true , message:"New Image is Required"}})} 
            onChange={handleImageChange} 
          />
          {errors.profileImage && <p className='text-red-500 text-sm mt-1'>{errors.profileImage.message}</p>}
          
          {previewImg && 
            <div className='mt-4 flex justify-center'>
              <Avatar src={previewImg} sx={{ width: 100, height: 100 }}/>
            </div>
          }
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting} 
          className='w-full mt-6 bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:bg-green-300'
        >
          {isSubmitting ? "Updating..." : "Update Profile Picture"}
        </button>
      </form>
    </div>
  )
}

export default UpdateImagePage
