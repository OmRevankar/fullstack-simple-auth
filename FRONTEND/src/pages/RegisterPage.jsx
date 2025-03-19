import React from 'react'

const RegisterPage = () => {

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors , isSubmitting},
  } = useForm()

  const onSubmit = async ()=>{



  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>

        <div>
          <label>Profile Image</label>
          <input type="file" />
        </div>

        <div>
          <label>Full Name</label>
          <input type="text" {...register('fullName',
            {
              required : true,
              minLength : {value : 2 , message : "Minimum length of should be 2"},
              maxLength : {value : 15 , message : "Name should not exceed 15 letters"}
            }
          )}/>

          {errors.fullName && <p className='border-red-900 bg-red-400 p-2' >{errors.fullName.message}</p>}
        </div>

        <br />

        <div>
          <label>Email</label>
          <input type="text" {...register('email',
          {
            required : true,
            pattern : {value : /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message : "Email is not valid"}
          })}/>
          {errors.email && <p className='border-red-900 bg-red-400 p-2' >{errors.email.message}</p>}
        </div>

        <br />

        <div>
          <label>Username</label>
          <input type="text" {...register('username',
            {
              required : true,
              pattern  : {value : /^[a-z0-9._]{3,20}$/ , message : "Username must be lowercase , minimum 3 characters and only . _ are allowed for speacial characters"}
            }
          )}/>
          {errors.username && <p className='border-red-900 bg-red-400 p-2' >{errors.username.message}</p>}
        </div>

        <br />

        <div>
          <label>Password</label>
          <input type="text" {...register('password',
            {
              required : true,
              pattern  : {value :/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/ , message : "Password doesnt satisfy criteria"}
            }
          )}/>
          {errors.password && <p className='border-red-900 bg-red-400 p-2' >{errors.password.message}</p>}
        </div>

        <br />

        <input type="submit" value={isSubmitting ? "Registering" : "Register"} disabled={isSubmitting}/>

      </form>
    </div>
  )
}

export default RegisterPage

