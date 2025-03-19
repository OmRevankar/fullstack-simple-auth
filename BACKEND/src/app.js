import express from "express"
import connectDB from "./db";
import cookieParser from "cookie-parser";

const app = express();

//cors
//urlencoded
//json
//static
//cookie

app.use(express.json({limit:"16kb"}))

app.use(express.urlencoded({extended:true , limit:"16kb"}));

app.use(express.static('public'));

app.use(cors( {
    origin:process.env.CORS_ORIGIN,
    credentials : true,
} ))

app.use(cookieParser());

import userRouter from "./routes/user.routes.js"

app.use("/api/v1",userRouter);

export default app