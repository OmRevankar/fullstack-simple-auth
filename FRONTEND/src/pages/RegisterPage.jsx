import React from 'react'
import { registerService } from '../services/auth.services.js';
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form"
import { BACKEND_URL } from '../constants.js';
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast';

const RegisterPage = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm()

  const onSubmit = async (data) => {

    const formData = new FormData();
    formData.append('fullName', data.fullName);
    formData.append('username', data.username);
    formData.append('email', data.email);
    formData.append('password', data.password);
    formData.append('profileImage', data.profileImage[0]);

    return fetch(`${BACKEND_URL}/register`, {
      method: "POST",
      body: formData
    })
      .then((response) => response.json())
      .then((data) => {

        console.log(data);

        if (data.statusCode == 200) {
          toast.success(data.message);
          navigate('/login');
        }
        else {
          toast.error(data.message);
        }

      })
      .catch((error) => {
        toast.error(error.message);
        console.log(error);
      })


    // try {
    //   const formData = new FormData();
    //   formData.append('fullName', data.fullName);
    //   formData.append('username', data.username);
    //   formData.append('email', data.email);
    //   formData.append('password', data.password);
    //   formData.append('profileImage', data.profileImage[0]);

    //   const response = await axios.post(`${BACKEND_URL}/register`, formData, {
    //     headers: { 
    //       "Content-Type": "multipart/form-data",
    //     }
    //   })
    //   .then( (response) => response.text() )
    //   .then( (data) => {
    //     console.log(data);
    //   } )
    //   .catch( (error) => {
    //     console.log(error);

    //   } )

    //   console.log(response);

    //   toast(response.data.message);
    //   navigate('/login');

    // } catch (error) {
    //   console.log(error)
    //   const errorMessage = error.response?.data?.message || "Registration failed";
    //   toast.error(errorMessage);
    // }
  }

  return (
    <div>
      <Toaster />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Profile Image</label>
          <input
            type="file"
            accept='image/*'
            {...register('profileImage', {
              required: { value: true, message: "Profile Image is Mandatory" }
            })}
          />

          {errors.profileImage &&
            <p className='border-red-900 bg-red-400 p-2'>{errors.profileImage.message}</p>
          }

        </div>

        <div>
          <label>Full Name</label>
          <input type="text" {...register('fullName',
            {
              required: true,
              minLength: { value: 2, message: "Minimum length of should be 2" },
              maxLength: { value: 15, message: "Name should not exceed 15 letters" }
            }
          )} />

          {errors.fullName && <p className='border-red-900 bg-red-400 p-2' >{errors.fullName.message}</p>}
        </div>

        <br />

        <div>
          <label>Email</label>
          <input type="text" {...register('email',
            {
              required: true,
              pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: "Email is not valid" }
            })} />
          {errors.email && <p className='border-red-900 bg-red-400 p-2' >{errors.email.message}</p>}
        </div>

        <br />

        <div>
          <label>Username</label>
          <input type="text" {...register('username',
            {
              required: true,
              pattern: { value: /^[a-z0-9._]{3,20}$/, message: "Username must be lowercase , minimum 3 characters and only . _ are allowed for speacial characters" }
            }
          )} />
          {errors.username && <p className='border-red-900 bg-red-400 p-2' >{errors.username.message}</p>}
        </div>

        <br />

        <div>
          <label>Password</label>
          <input type="text" {...register('password',
            {
              required: true,
              pattern: { value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/, message: "Password doesnt satisfy criteria" }
            }
          )} />
          {errors.password && <p className='border-red-900 bg-red-400 p-2' >{errors.password.message}</p>}
        </div>

        <br />

        <input type="submit" value={isSubmitting ? "Registering" : "Register"} disabled={isSubmitting} />

      </form>
    </div>
  )
}

export default RegisterPage

