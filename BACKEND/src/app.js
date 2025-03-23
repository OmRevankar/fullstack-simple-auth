import express from "express"

import cookieParser from "cookie-parser";
import cors from "cors"
import multer from "multer";

const app = express();

//cors
//urlencoded
//json
//static
//cookie

app.use(express.json({limit:"16kb"}));

app.use(express.urlencoded({extended:true , limit:"16kb"}));

app.use(express.static('public'));

app.use(cors( {
    origin:process.env.CORS_ORIGIN,
    credentials : true,
} ))

app.use(cookieParser());
// app.use(upload.none());

import userRouter from "./routes/user.routes.js"
import { upload } from "./middelwares/multer.middlewares.js";

app.use("/api/v1/users",userRouter);

export default app