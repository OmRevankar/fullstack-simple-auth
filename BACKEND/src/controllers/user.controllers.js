//register
//login
//logout
//update avatar
//update details
//refresh acess token

import sendMail from "../helper/sendMail.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import fs from "fs"
import jwt from "jsonwebtoken"

const startNewSession = async function (user_id){

    try {

        const user = await User.findById(user_id);

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        user.save({validateBeforeSave: false});

        return {refreshToken,accessToken};

    } catch (error) {
        throw new ApiError(500,"Couldn't start new session")
    }
}

const userRegister = asyncHandler( async (req,res) => {

    //get details from frontend
    //validate
    //if username / email already exists
    //check for profileImage file
    //upload on cloudinary
    //start session
    //create db user
    //check for user creation

    const {fullName,username,email,password} = req.body;

    if( [fullName,username,email,password].some( (value) => !value || value.trim() === "" ) )
        return res.status(400).json(new ApiError(400,"All the fields are required"));

    const existingUser = await User.findOne({
        $or : [{username} , {email}]
    });

    if(existingUser)
    {
        fs.unlinkSync(req.file?.path);

        return res
        .status(400)
        .json( 
            new ApiError(400,"Username or Email already used") 
        )
        // throw new ApiError(400,"Username or Email already used");
    }

    const profileImageLocalPath = req.file?.path;

    if(!profileImageLocalPath)
        return res.status(400).json(new ApiError(400,"Profile Image required"));

    const profileImageUploadResponse = await uploadOnCloudinary(profileImageLocalPath);

    if(!profileImageLocalPath)
        return res.status(400).json(new ApiError(400,"Profile Image cloudinary upload failed"));

    const user = await User.create({
        fullName,
        email,
        password,
        username,
        profileImage : profileImageUploadResponse?.url
    });

    const isUserCreated = await User.findById(user?._id).select("-password -refreshToken");

    if(!isUserCreated)
        return res.status(500).json(new ApiError(500,"Something went wrong during registering the user"));

    await sendMail(isUserCreated.email,isUserCreated.fullName);

    return res
    .status(200)
    .json(
        new ApiResponse(200,isUserCreated,"User registered Successfully")
    );
} );

const userLogin = asyncHandler( async (req,res) => {

    //details from frontend
    //validation
    //check for user in db
    //start session and set cookies
    //res

    const {username,email,password} = req.body;

    // console.log(req.body);

    if(!username?.trim() || !email?.trim() || !password?.trim())
        return res.status(400).json(new ApiError(400,"All Fields are required"));

    const user = await User.findOne({
        $or : [{username},{email}]
    }).select("-refreshToken");

    if(!user)
        return res.status(400).json(new ApiError(400,"User does not exist"));

    const passwordCheck = await user.isPasswordCorrect(password);

    if(!passwordCheck)
        return res.status(400).json(new ApiError(400,"Incorrect Password"));

    const {refreshToken,accessToken} = await startNewSession(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly : true,
        secure : true,
    };

    return res
    .status(200)
    .cookie("refreshToken",refreshToken,options)
    .cookie("accessToken",accessToken,options)
    .json(
        new ApiResponse(200,loggedInUser,"User Logged in successfully")
    )

} );

const userLogout = asyncHandler( async (req,res) => {

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set : {refreshToken:undefined}
        }
    );

    const options = {
        httpOnly : true,
        secure : true
    };

    return res
    .status(200)
    .clearCookie("refreshToken")
    .clearCookie("accessToken")
    .json(
        new ApiResponse(200,{},"User llogged out successfully")
    );
} );

const updateUserProfileImage = asyncHandler( async (req,res) => {

    const profileImage = req.file?.path;
    
    if(!profileImage)
        return res.status(400).json(new ApiError(400,"New Profile Image Required"));

    const uploadResponse = await uploadOnCloudinary(profileImage);

    if(!uploadResponse)
        return res.status(400).json(new ApiError(400,"Upload on cloudinary Failed"));        

    const deleteResponse = await deleteFromCloudinary(req.user?.profileImage);

    if(!deleteResponse)
        return res.status(500).json(new ApiError(500,"Deletion from cloudinary Failed"));

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set : {profileImage : uploadResponse?.url}
        },
        {
            new : true
        }
    ).select("-password -refreshToken")

    return res
    .status(200)
    .json(
        new ApiResponse(200,user,"Successfull updation of Profile Image")
    );   
});

const updateUserDetails = asyncHandler( async (req,res) => {

    const {fullName , username , email} = req.body;

    // console.log(req.body)

    if( [fullName , username , email].some( (value) =>  !value || value.trim() === "" ) )
        return res.status(400).json(new ApiError(400,"All Details are required"));
    
    const isUserPresent = await User.findOne({
        $or : [{username},{email}]
    })

    if(isUserPresent)
        return res.status(400).json(new ApiError(400,"Username or email already exists"));

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set : {
                fullName,
                email,
                username
            }
        },
        {
            new : true
        }
    ).select("-password -refreshToken");

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            user,
            "Details updated Sucessfully"
        )
    );
} );

const refreshAccessToken = asyncHandler( async (req,res) => {

    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken

    if(!refreshToken)
        return res.status(400).json(new ApiError(400,"NO refresh Token present"));

    const decodedToken = jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id);

    if(!user)
        return res.status(400).json(new ApiError(400,"Invalid Token"));

    if(!(user.refreshToken === refreshToken))
        return res.status(400).json(new ApiError(400,"Refresh token expired or used"));

    const {newRefreshToken,newAccessToken} = await startNewSession(user?._id);

    const options = {
        httpOnly : true,
        secure : true
    };

    return res
    .status(200)
    .cookie("refreshToken",newRefreshToken,options)
    .cookie("accessToken",newAccessToken,options)
    .json(
        200,
        {},
        "Successfully started new Session"
    )


} );

const fetchUserDetails = asyncHandler( async (req,res) => {

    const user = await User.findById(req.user?._id).select("-password -refreshToken");

    if(!user)
        return res.status(400).json(new ApiError(400,"User does not exist"));

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            user,
            "User fetched successfully"
        )
    )
} );

export {
    userRegister,
    userLogin,
    userLogout,
    updateUserProfileImage,
    updateUserDetails,
    refreshAccessToken,
    fetchUserDetails
}