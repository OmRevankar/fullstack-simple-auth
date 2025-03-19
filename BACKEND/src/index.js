import dotenv from 'dotenv'
import app from "./app"

dotenv.config({
    path : './.env'
})

connectDB()
.then(()=>{

    app.on("error" , (error)=>{
        console.log("ERROR :",error);
        throw error;
    } )

    app.listen(process.env.PORT || 8000 , ()=>{
        "Server is listening on PORT :",process.env.PORT
    })    

})
.catch((error)=>{

    console.log("Server not started : DB Connection error" , error);

})