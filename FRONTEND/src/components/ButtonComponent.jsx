import React from 'react'
import Button from '@mui/material/Button';

const ButtonComponent = (props) => {
  return (
    <Button variant="contained">{props.name}</Button>
  )
}

export default ButtonComponent
