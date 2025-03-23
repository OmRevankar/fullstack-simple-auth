import React from 'react'
import Button from '@mui/material/Button';

const ButtonComponent = (props) => {
  return (
    <Button 
      variant="contained" 
      onClick={props.handleClick}
      sx={{
        bgcolor: 'rgb(22 163 74)',
        '&:hover': { bgcolor: 'rgb(21 128 61)' },
        m: 1,
        px: 4,
        py: 1,
        borderRadius: '8px',
        textTransform: 'none',
        fontWeight: '600'
      }}
    >
      {props.name}
    </Button>
  )
}

export default ButtonComponent
