
import { configureStore } from "@reduxjs/toolkit"
import { authSlice } from "../features/authSlice"

export const store = configureStore({

    reducer:{
        auth : authSlice
    }

})



// import { configureStore } from '@reduxjs/toolkit'
// import counterReducer from '../features/counter/counterSlice'

// export const store = configureStore({
//   reducer: {

//     counter : counterReducer,

//   },
// })