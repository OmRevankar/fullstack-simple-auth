import { User } from "../models/user.models";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken"

const verifyJWT = asyncHandler( async (req,_,next) => {

    const accessToken = req.cookies?.accessToken || req.headers["authorization"]?.replace("Bearer","");

    if(!accessToken)
        throw new ApiError(400,"Session Expired");

   const decodedToken = jwt.verify(accessToken);

   const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

   if(!user)
        throw new ApiError(400,"Invalid Access Token");

   req.user = user;
   next();

} )

export {verifyJWT}