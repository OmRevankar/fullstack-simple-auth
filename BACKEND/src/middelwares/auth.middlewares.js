import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"

const verifyJWT = asyncHandler( async (req,res,next) => {

    const accessToken = req.cookies?.accessToken || req.headers["authorization"]?.replace("Bearer","");

//     console.log(accessToken);

    if(!accessToken)
        return res.status(401).json(new ApiError(401, "Session Expired"));

   const decodedToken = jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET);

   const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

   if(!user)
        return res.status(401).json(new ApiError(401, "Invalid Access Token"));

   req.user = user;
   next();

} )

export {verifyJWT}