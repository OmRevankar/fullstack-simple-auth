import React, { useEffect, useState } from 'react'
import ButtonComponent from '../components/ButtonComponent'
import { BACKEND_URL } from '../constants'
import toast, { Toaster } from 'react-hot-toast';
import { Avatar } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

const Dashboard = (props) => {

  const [username, setUsername] = useState(null);
  const [fullName, setFullName] = useState(null);
  const [email, setEmail] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState(null);

  const [isLoading,setLoading] = useState(true)

  const navigate = useNavigate();

  useEffect(() => {

    fetchUser();

    return () => {

    }
  }, []);

  const fetchUser = async () => {

    // console.log()
    setLoading(true);


    fetch(`${BACKEND_URL}/fetch-user`, {
      method: "GET",
      credentials: "include",
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        if (data.statusCode == 401)
        {
          toast.error("Session expired , please Login again !");
          localStorage.setItem("userLoggedIn",false);
          window.location.href = './'
        }

        setEmail(data.data.email);
        setFullName(data.data.fullName);
        setUsername(data.data.username);
        setProfileImageUrl(data.data.profileImage)

        setLoading(false);

        console.log(props)

      })
      .catch((error) => {
        console.log(error)
        setLoading(false)
      })
      

  }


  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const [openUpdatetDialog, setOpenUpdateDialog] = useState(false);

  const handleClickLogoutDialogOpen = () => {
    setOpenLogoutDialog(true);
  };

  const handleClickUpdateDialogOpen = () => {
    setOpenUpdateDialog(true);
  };

  const handleCloseLogoutDialog = () => {
    setOpenLogoutDialog(false);
  };

  const handleCloseUpdateDialog = () => {
    setOpenUpdateDialog(false);
  };

  const handleLogout = async ()=>{

    fetch(`${BACKEND_URL}/logout`,{
      method:"POST",
      credentials:"include"
    })
    .then( (respose) => respose.json())
    .then( (data) => {
      console.log(data);

      if(data.statusCode==200)
      {
          localStorage.setItem("userLoggedIn",false); 
          toast.success(data.message);
          // navigate('/');
          window.location.href = './'
      }
      else
        toast.error(data.message);

    } )
    .catch( (error) => {
      console.log(error);
      toast.error(error.message);
    } )
    
  }

  const handleUpdateProfileImage = () =>{navigate("/update-image")}

  const handleUpdateUser = () => {navigate("/update-details")}

  return (
    <div className='min-h-screen bg-green-50 p-6'>
      <Toaster />
      {isLoading ? 
        <div className='flex justify-center items-center h-64'>
          <p className='text-green-700 text-lg font-semibold'>Loading . . .</p>
        </div>
        :
        <div className='bg-white rounded-lg shadow-lg p-6 mb-6'>
          <div className='flex items-center gap-4 mb-4'>
            <Avatar 
              alt={fullName} 
              src={profileImageUrl}
              sx={{ width: 64, height: 64 }}
            />
            <div>
              <h1 className='text-2xl font-bold text-green-700'>Hello {username}!</h1>
              <p className='text-gray-600'>Email: {email}</p>
              <p className='text-gray-600'>Full Name: {fullName}</p>
            </div>
          </div>
        </div>
      }

      <div className='flex flex-col sm:flex-row gap-4'>
        <ButtonComponent name="LOGOUT" handleClick={handleClickLogoutDialogOpen} />
        <ButtonComponent name="EDIT PROFILE" handleClick={handleClickUpdateDialogOpen}/>

        <Dialog
          open={openLogoutDialog}
          onClose={handleCloseLogoutDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Are you sure you want to logout ?"}
          </DialogTitle>

          <DialogActions>
            <Button onClick={handleCloseLogoutDialog}>Back</Button>
            <Button onClick={handleLogout} autoFocus>
              Logout
            </Button>
          </DialogActions>


        </Dialog>

        <Dialog
          open={openUpdatetDialog}
          onClose={handleCloseUpdateDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Update your Details !"}
          </DialogTitle>

          <DialogActions>
            <Button onClick={handleUpdateProfileImage}>Update Profile Image</Button>
            <Button onClick={handleUpdateUser} autoFocus>
              Update User Details
            </Button>
          </DialogActions>


        </Dialog>

      </div>

    </div>
  )
}

export default Dashboard
