import mongoose , {Schema} from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new Schema(
    {
        fullName :{
            type : String,
            required : true,
            index : true
        },
        email : {
            type : String,
            required : true,
            lowercase : true,
            unique : true,
            index : true
        },
        username : {
            type : String,
            required : true,
            lowercase : true,
            unique : true,
            index : true
        },
        password : {
            type : String,
            required : true,
        },
        avatar : {
            type : String,
            required : true,
        },
        refreshToken : {
            type : String
        }
    }
    ,{timestamps:true});

userSchema.pre("save",async(next)=>{

    if (!this.isModified("password")) {return next()}

    this.password = await bcrypt.hash(this.password,10);
    next();
});

userSchema.methods.generateRefreshToken = function(){

    return jwt.sign(
        {
            _id : this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY
        }
    )

}

userSchema.methods.generateAccessToken = function(){

    return jwt.sign(
        {
            _id: this._id,
            username : this.username,
            email : this.email,
            fullName : this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY
        }
    )
};

userSchema.methods.isPasswordCorrect = async function(inputPassword){

    const output = await bcrypt.compare(inputPassword,this.password);
    return output;

}

export const User = mongoose.model("User" , userSchema);