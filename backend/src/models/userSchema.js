import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
      
    email : {
        type : String,
        required : true
    },
       
    password : {
        type : String,
        required : true
    },
    
    // isVerified : {
    //     type : Boolean,
    //     default: false
    // },
    
   isLoggedIN : {
        type : Boolean,
        default: false
    },
     
    token : {
        type : String,
        default : null
    }
       
})

export default mongoose.model("user",userSchema)