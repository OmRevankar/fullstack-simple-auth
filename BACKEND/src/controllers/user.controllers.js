
//register
//login
//logout
//update avatar
//update details
//refresh acess token

import { User } from "../models/user.models";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary";
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
        throw new ApiError(400,"All the fields are required");

    const existingUser = await User.findOne({
        $or : [{username} , {email}]
    });

    if(existingUser)
    {
        fs.unlinkSync(req.files?.path);

        throw new ApiError(400,"Username or Email already used");
    }

    const profileImageLocalPath = req.files?.path;

    if(!profileImageLocalPath)
        throw new ApiError(400,"Profile Image required")

    const profileImageUploadResponse = await uploadOnCloudinary(profileImageLocalPath);

    if(!profileImageLocalPath)
        throw new ApiError(400,"Profile Image cloudinary upload failed");

    const user = await User.create({
        fullName,
        email,
        password,
        username,
        profileImage : profileImageUploadResponse?.url
    });

    const isUserCreated = await User.findById(user?._id).select("-password -refreshToken");

    if(!isUserCreated)
        throw new ApiError(500,"Something went wrong during registering the user")

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

    if([username,email,password].some( (value) => !value || value.trim() === "" ))
        throw new ApiError(400,"All Fields are required");

    const user = await User.findOne({
        $or : [{username},{email}]
    }).select("-password -refreshToken");

    if(!user)
        throw new ApiError(400,"User does not exist");

    const passwordCheck = user.isPasswordCorrect(password);

    if(!passwordCheck)
        throw new ApiError(400,"Incorrect Password");

    const {refreshToken,accessToken} = await startNewSession(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly : true,
        secure : true
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

    const profileImage = req.files?.path;
    
    if(!profileImage)
        throw new ApiError(400,"New Profile Image Required");

    const uploadResponse = await uploadOnCloudinary(profileImage);

    if(!uploadResponse)
        throw new ApiError(400,"Upload on cloudinary Failed");        

    const deleteResponse = await deleteFromCloudinary(req.user?.profileImage);

    if(!deleteResponse)
        throw new ApiError(500,"Deletion from cloudinary Failed");

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set : {profileImage : uploadResponse?.url}
        },
        {
            new : true
        }
    ).select("-password refreshToken")

    return res
    .status(200)
    .json(
        new ApiResponse(200,user,"Successfull updation of Profile Image")
    );   
});

const updateUserDetails = asyncHandler( async (req,res) => {

    const {fullName , username , email} = req.body;

    if( [fullName , username , email].some( (value) => value.trim() === "" || !value ) )
        throw new ApiError(400,"All Details are required")
    
    const isUserPresent = await User.findOne({
        $or : [{username},{email}]
    })

    if(isUserPresent)
        throw new ApiError(400,"Username or email already exists");

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
        throw new ApiError(400,"NO refresh Token present");

    const decodedToken = jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id);

    if(!user)
        throw new ApiError(400,"Invalid Token");

    if(!(user.refreshToken === refreshToken))
        throw new ApiError(400,"Refresh token expired or used");

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
        throw new ApiError(400,"User does not exist")

    return res
    .status(200)
    .json(
        200,
        user,
        "USer fetched successfully"
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