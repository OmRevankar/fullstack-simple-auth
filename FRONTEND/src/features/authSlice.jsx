import { createSlice } from "@reduxjs/toolkit"
import { BACKEND_URL } from "../constants";

const initialState = {
    value:0
}

export const authSlice = createSlice({

    name : 'auth',
    initialState,
    reducers : {

        fetchFullName : (state)=>{

            fetch(`${BACKEND_URL}/fetch-user`,{
                method:"GET"
            })
            .then( (response) => response.json() )
            .then( (data) => {
                console.log(data)
            } )
            .catch((error)=>{
                console.log(error)
            })

        }

    }

});

export const {  } = authSlice.actions

export default authSlice.reducer


// import { createSlice } from '@reduxjs/toolkit'

// const initialState = {
//   value: 0,
// }

// export const counterSlice = createSlice({
//   name: 'counter',
//   initialState,
//   reducers: {
//     increment: (state) => {
//       state.value += 1
//     },
//     reset: (state) => {
//       state.value = 0
//     },
//     decrement: (state) => {
//       state.value -= 1
//     },
//     incrementByAmount: (state, action) => {
//       state.value += Number(action.payload);
//     },
//   },
// })

// // Action creators are generated for each case reducer function
// export const { increment, decrement, incrementByAmount,reset } = counterSlice.actions

// export default counterSlice.reducer