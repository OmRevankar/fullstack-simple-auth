import axios from 'axios'
import { BACKEND_URL } from '../constants'
import toast, { Toaster } from 'react-hot-toast';

const registerService = async ({profileImagePath,fullName,email,username,password})=>{

    const response = await axios.post(`${BACKEND_URL}/register` , {
        fullName,
        username,
        email,
        password,
        profileImage:profileImagePath
    } )
    .then( (response) => {

        console.log(response);
        console.log("USer Registered successfully ");
        toast.success("User Registered Successfully !");


    } )
    .catch( (error) => {

        console.log("Error Encountered while registering user : ",error);
        toast.error(error.message);

    } )

}

export {
    registerService
}